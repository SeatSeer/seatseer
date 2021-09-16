import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.net.*;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

public class NotificationManager {

    private static HashMap<String, Room> roomList;
    private static HashMap<String, User> userList;

    private static PriorityQueue<Registry> expiryList;

    private static final String TOPIC_SENSOR = "SensorUpdates";
    private static final String TOPIC_NOTIF = "UserNotifications";
    private static final String GROUP_ID = "NotifManager";
    private static final String BOOTSTRAP_SERVERS = "52.200.114.141:9092";

    private static JSONArray notifList;

    public static void main(String[] args) {
        //BackendUI window = new BackendUI("Notification Manager");
        // initialize data
        roomList = new HashMap<>();
        userList = new HashMap<>();
        expiryList = new PriorityQueue<>();
        notifList = new JSONArray();
        try {
            retrieveRooms(); // retrieve info about Rooms from ElasticSearch
            retrieveUsers(); // retrieve info about Users from Firebase
            sendNotification();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // Kafka Consumer Setup
        Properties configs = new Properties();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP_ID);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
        configs.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, 1000);
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configs);
        consumer.subscribe(Arrays.asList(TOPIC_SENSOR, TOPIC_NOTIF));
        System.out.println("Successful Kafka Consumer Set Up");
        // receive the message from Kafka
        while (true) {
            try {
                notifList = new JSONArray();
                while(!expiryList.isEmpty() && expiryList.peek().expiry.isBefore(DateTime.now(DateTimeZone.UTC))) {
                    expiryCheck();
                }
                ConsumerRecords<String, String> records = consumer.poll(30000);
                System.out.println("Received " + records.count() + " records");
                for (ConsumerRecord<String, String> record : records) {
                    String message = record.value();
                    if (record.topic().equals(TOPIC_SENSOR)) {
                        JSONObject carpark = (JSONObject) new JSONParser().parse(message);
                        String ID = (String) carpark.get("ID");
                        int vacant = ((Long) carpark.get("vacant")).intValue();
                        Room room = roomList.get(ID);
                        room.sensorUpdate(vacant);
                    } else { //if (record.topic().equals(TOPIC_NOTIF))
                        JSONObject activity = (JSONObject) new JSONParser().parse(message);
                        // { userID, expoPushToken, queryType: add/delete, roomID }
                        // { userID, expoPushToken, queryType: change, thresholdVacancy, groupedSeats, timeLimitHours, timeLimitMinutes }
                        String queryType = (String) activity.get("queryType");
                        String userID = (String) activity.get("userID");
                        User user = userList.get(userID);
                        switch (queryType) {
                            case "add" -> {
                                String roomID = (String) activity.get("roomID");
                                Room room = roomList.get(roomID);
                                user.addRoom(room);
                            }
                            case "delete" -> {
                                String roomID = (String) activity.get("roomID");
                                Room room = roomList.get(roomID);
                                user.deleteRoom(room);
                            }
                            case "change" -> {
                                String expoPushToken = (String) activity.get("expoPushToken");
                                int thresholdVacancy = ((Long) activity.get("thresholdVacancy")).intValue();
                                boolean groupedSeats = (Boolean) activity.get("groupedSeats");
                                int timeLimitHours = ((Long) activity.get("timeLimitHours")).intValue();
                                int timeLimitMinutes = ((Long) activity.get("timeLimitMinutes")).intValue();
                                //System.out.println(user.expoPushToken+","+user.thresholdVacancy+","+user.groupedSeats+","+user.timeLimitHours+","+user.timeLimitMinutes);
                                //System.out.println(expoPushToken+","+thresholdVacancy+","+groupedSeats+","+timeLimitHours+","+timeLimitMinutes);
                                if (user == null) {
                                    System.out.println(String.format("creating new user : %s", userID));
                                    user = new User(userID, expoPushToken, thresholdVacancy, groupedSeats, timeLimitHours, timeLimitMinutes);
                                    userList.put(userID, user);
                                } else {
                                    if (Objects.equals(user.expoPushToken, "")) {
                                        user.updateToken((String) activity.get("expoPushToken"));
                                    }
                                    System.out.println("changing settings");
                                    if (user.groupedSeats != groupedSeats || user.thresholdVacancy != thresholdVacancy) {
                                        user.changeCond(thresholdVacancy, groupedSeats);
                                    }
                                    if (user.timeLimitHours != timeLimitHours || user.timeLimitMinutes != timeLimitMinutes) {
                                        user.changePref(timeLimitHours, timeLimitMinutes);
                                    }
                                }
                            }
                            default -> System.out.println("other query type : " + queryType);
                        }
                    }
                }
                // consumer makes http request to exp.host with the token
                sendNotification();
                System.out.println("next polling coming in 30 sec");
            } catch (ParseException | IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static void retrieveRooms() throws ParseException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://44.194.92.99:9200/seats/_search?size=1873"))
                .header("Accept", "application/json")
                .build();
        String response = client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .join();
        JSONArray rooms = (JSONArray)((JSONObject)((JSONObject)new JSONParser().parse(response)).get("hits")).get("hits");
        for (Object r : rooms) {
            JSONObject rm = (JSONObject)((JSONObject)r).get("_source");
            String roomID = (String)rm.get("ID");
            int vacant = Integer.parseInt((String)rm.get("vacant"));
            int maxGrp = Integer.parseInt((String)rm.get("seatingSize"));
            Room room = new Room(roomID, vacant, maxGrp);
            roomList.put(roomID, room);
            //System.out.println(String.format("room %s : vacant %d, maxGrp %d", roomID, vacant, maxGrp));
        }
        System.out.println("Successfully received info from ElasticSearch");
    }

    private static void retrieveUsers() throws ParseException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://seatseer-d5e3e-default-rtdb.asia-southeast1.firebasedatabase.app/notifications.json"))
                .header("Accept", "application/json")
                .build();
        String response = client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .join();
        JSONObject info = (JSONObject) new JSONParser().parse(response);
        for (Object u : info.keySet()) {
            String userID = (String) u;
            String expoPushToken = (String) ((JSONObject) ((JSONObject) info.get(userID))
                    .get("notificationsSettings")).get("expoPushToken");
            int thresholdVacancy = ((Long) ((JSONObject) ((JSONObject) info.get(userID))
                    .get("notificationsSettings")).get("thresholdVacancy")).intValue();
            boolean groupedSeats = (boolean) ((JSONObject) ((JSONObject) info.get(userID))
                    .get("notificationsSettings")).get("groupedSeats");
            int timeLimitHours = ((Long) ((JSONObject) ((JSONObject) info.get(userID))
                    .get("notificationsSettings")).get("timeLimitHours")).intValue();
            int timeLimitMinutes = ((Long) ((JSONObject) ((JSONObject) info.get(userID))
                    .get("notificationsSettings")).get("timeLimitMinutes")).intValue();
            User user = new User(userID, expoPushToken, thresholdVacancy, groupedSeats, timeLimitHours, timeLimitMinutes);
            System.out.println(String.format("user %s : thresholdVacancy %d, groupedSeats %b", userID, thresholdVacancy, groupedSeats));
            System.out.println(String.format("    timeLimitHours %d, timeLimitMinutes %d", timeLimitHours, timeLimitMinutes));
            userList.put(userID, user);
            JSONObject locations = (JSONObject) ((JSONObject) info.get(userID)).get("locations");
            if (locations != null) {
                for (Object r : locations.keySet()) {
                    String roomID = (String) r;
                    String time = (String)locations.get(roomID);
                    int year = Integer.parseInt(time.substring(0, 4)); int month = Integer.parseInt(time.substring(5, 7));
                    int day = Integer.parseInt(time.substring(8, 10)); int hour = Integer.parseInt(time.substring(11, 13));
                    int min = Integer.parseInt(time.substring(14, 16)); int sec = Integer.parseInt(time.substring(17, 19));
                    DateTime updated = new DateTime(year, month, day, hour, min, sec);
                    Room room = roomList.get(roomID);
                    if(room != null) {
                        if (DateTime.now(DateTimeZone.UTC).isBefore(updated)) {
                            user.addRoom(room);
                            System.out.println(String.format("    has room : %s", roomID));
                            expiryList.add(new Registry(user, room, updated));
                        } else {
                            // alert the user for deactivation
                            Map notif = new LinkedHashMap();
                            notif.put("to", user.expoPushToken);
                            notif.put("body", String.format("The room %s is no longer available", roomID));
                            notif.put("data", String.format("{\"OFF\":\"%s\"}", roomID));
                            notifList.add(new JSONObject(notif));
                            System.out.println(String.format("deactivating %s : %s", user, room));
                        }
                    }
                }
            }
        }
        System.out.println("Successfully received info from Firebase");
    }

    private static void expiryCheck() throws IOException {
        Registry expired = expiryList.poll();
        assert expired != null;
        User user = expired.user;
        Room room = expired.room;
        if (user.list.containsKey(room)) {
            // DELETE request to firebase
            URL url = new URL(String.format(
                    "https://seatseer-d5e3e-default-rtdb.asia-southeast1.firebasedatabase.app/notifications/%s/locations/%s.json",
                    user.userID,room.roomID));
            HttpURLConnection http = (HttpURLConnection) url.openConnection();
            http.setRequestMethod("DELETE");
            http.setDoOutput(true);
            System.out.println("Delete request to Firebase : "+http.getResponseCode()+" "+http.getResponseMessage());
            http.disconnect();
            // unlist the room from user's list
            user.list.remove(room);
            // unlist the user from the room's list
            room.list.remove(user);
            Map notif = new LinkedHashMap();
            notif.put("to", user.expoPushToken);
            notif.put("body", String.format("The room %s is now expired", room.roomID));
            notif.put("data", String.format("{\"type\":\"EXPIRED\",\"roomID\":\"%s\"}", room.roomID));
            notifList.add(new JSONObject(notif));
            System.out.println(String.format("expiring %s : %s", user, room));
        }
    }

    private static void sendNotification() {
        if (!notifList.isEmpty()) {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(String.format("https://exp.host/--/api/v2/push/send"))) // need project ID
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(notifList.toJSONString()))
                    .build();
            String response = client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(HttpResponse::body)
                    .join();
            System.out.println("expo response : " + response);
        }
    }
/*
    public static void gracefulShutdown() throws IOException {
        URL url = new URL("https://seatseer-d5e3e-default-rtdb.asia-southeast1.firebasedatabase.app/notifications.json");
        Map list = new LinkedHashMap();
        for (User u : userList.values()) {
            Map user = new LinkedHashMap();
            user.put("expoPushToken", u.expoPushToken);
            Map locations = new LinkedHashMap();
            for (Room room : u.list.keySet()) {
                locations.put(room.roomID, room.roomID);
            }
            user.put("locations", new JSONObject(locations));
            Map notificationsSettings = new LinkedHashMap();
            notificationsSettings.put("groupedSeats", u.groupedSeats);
            notificationsSettings.put("thresholdVacancy", u.thresholdVacancy);
            notificationsSettings.put("timeLimitHours", u.timeLimitHours);
            notificationsSettings.put("timeLimitMinutes", u.timeLimitMinutes);
            user.put("notificactionsSettings", new JSONObject(notificationsSettings));
            list.put(u.userID, new JSONObject(user));
        }
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("POST");
        http.setRequestProperty("X-HTTP-Method-Override", "PATCH");
        http.setDoOutput(true);
        http.setRequestProperty("Accept", "application/json");
        http.setRequestProperty("Content-Type", "application/json");
        String data = new JSONObject(list).toJSONString();
        byte[] out = data.getBytes(StandardCharsets.UTF_8);
        OutputStream stream = http.getOutputStream();
        stream.write(out);
        System.out.println(http.getResponseCode() + " " + http.getResponseMessage());
        http.disconnect();
    }
 */
    /*
    // send JSON to firebase
        JSONObject test = new JSONObject(); test.put("fruit", "banana"); String requestBody = test.toJSONString();
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://seatseer-d5e3e-default-rtdb.asia-southeast1.firebasedatabase.app/test.json"))
                .header("Content-Type", "application/json") // x-ndjson
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        int status = client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::statusCode)
                .join();
        System.out.println(status);
     */

    private static class Room {
        private final String roomID;
        private int vacant;
        private final int maxGrp;
        private HashMap<User, Boolean> list;
        private Room(String roomID, int vacant, int maxGrp) {
            this.roomID = roomID;
            this.vacant = vacant;
            this.maxGrp = maxGrp;
            this.list = new HashMap<>();
        }
        private void sensorUpdate(int vacant) {
            // update the vacancy
            this.vacant = vacant;
            // check if need to send notification
            for (User user : list.keySet()) {
                // If user doesn't want group, vacant just need be more than thresholdVacancy
                // If user wants group, both vacant and grpSize need be more than thresholdVacancy
                if (vacant >= user.thresholdVacancy && (!user.groupedSeats || maxGrp >= user.thresholdVacancy)) { // go activate
                    if (!list.get(user)) { // if right now deactivated
                        list.put(user, true);
                        user.list.put(this, true);
                        // alert the user for activation
                        Map notif = new LinkedHashMap();
                        notif.put("to", user.expoPushToken);
                        notif.put("body", String.format("The room %s is now available!", this.roomID));
                        notif.put("data", String.format("{\"type\":\"ON\",\"roomID\":\"%s\"}", this.roomID));
                        notifList.add(new JSONObject(notif));
                        System.out.println(String.format("activating %s : %s",user, this));
                    }
                } else { // go deactivate
                    if (list.get(user)) { // if right now activated
                        list.put(user, false);
                        user.list.put(this, false);
                        // alert the user for deactivation
                        Map notif = new LinkedHashMap();
                        notif.put("to", user.expoPushToken);
                        notif.put("body", String.format("The room %s is no longer available", this.roomID));
                        notif.put("data", String.format("{\"type\":\"OFF\",\"roomID\":\"%s\"}", this.roomID));
                        notifList.add(new JSONObject(notif));
                        System.out.println(String.format("deactivating %s : %s", user, this));
                    }
                }
            }
        }
        @Override
        public int hashCode() {
            return roomID.hashCode();
        }
        @Override
        public boolean equals(Object obj) {
            return hashCode() == obj.hashCode();
        }
        @Override
        public String toString() {
            return roomID;
        }
    }

    private static class User {
        private final String userID;
        private String expoPushToken;
        private int thresholdVacancy;
        private boolean groupedSeats;
        private HashMap<Room, Boolean> list;
        private int timeLimitHours;
        private int timeLimitMinutes;
        private User(String userID, String expoPushToken, int thresholdVacancy, boolean groupedSeats, int timeLimitHours, int timeLimitMinutes) {
            this.userID = userID;
            this.expoPushToken = expoPushToken;
            this.thresholdVacancy = thresholdVacancy;
            this.groupedSeats = groupedSeats;
            this.list = new HashMap<>();
            this.timeLimitHours = timeLimitHours;
            this.timeLimitMinutes = timeLimitMinutes;
        }
        private void updateToken(String token) {
            this.expoPushToken = token;
        }
        private void changeCond(int thresholdVacancy, boolean groupedSeats){
            // update the user preferences
            this.thresholdVacancy = thresholdVacancy;
            this.groupedSeats = groupedSeats;
            System.out.println(String.format("user %s settings changed: thresholdVacancy: %d, groupdSeats: %b", userID, thresholdVacancy, groupedSeats));
            // check if need to send notification
            for (Room room : list.keySet()) {
                // If user doesn't want group, vacant just need be more than thresholdVacancy
                // If user wants group, both vacant and grpSize need be more than thresholdVacancy
                if (room.vacant >= thresholdVacancy && (!groupedSeats || room.maxGrp >= thresholdVacancy)) { // go activate
                    if (!list.get(room)) { // if currently deactivated
                        list.put(room, true);
                        room.list.put(this, true);
                        // alert the user for activation
                        Map notif = new LinkedHashMap();
                        notif.put("to", expoPushToken);
                        notif.put("body", String.format("The room %s is now available!", room.roomID));
                        notif.put("data", String.format("{\"type\":\"ON\",\"roomID\":\"%s\"}", room.roomID));
                        notifList.add(new JSONObject(notif));
                        System.out.println(String.format("activating %s : %s", this, room));
                    }
                } else { // go deactivate
                    if (list.get(room)) { // if currently activated
                        list.put(room, false);
                        room.list.put(this, false);
                        // alert the user for deactivation
                        Map notif = new LinkedHashMap();
                        notif.put("to", expoPushToken);
                        notif.put("body", String.format("The room %s is no longer available", room.roomID));
                        notif.put("data", String.format("{\"type\":\"OFF\",\"roomID\":\"%s\"}", room.roomID));
                        notifList.add(new JSONObject(notif));
                        System.out.println(String.format("deactivating %s : %s", this, room));
                    }
                }
            }
        }
        private void addRoom(Room room){
            // check if activation condition fulfilled
            boolean activate = room.vacant >= thresholdVacancy && (!groupedSeats || room.maxGrp >= thresholdVacancy);
            // send out notification
            if (activate) {
                // alert the user for activation
                Map notif = new LinkedHashMap();
                notif.put("to", expoPushToken);
                notif.put("body", String.format("The room %s is now available!", room.roomID));
                notif.put("data", String.format("{\"type\":\"ON\",\"roomID\":\"%s\"}", room.roomID));
                notifList.add(new JSONObject(notif));
                System.out.println(String.format("activating %s : %s", this, room));
            }
            System.out.println(String.format("adding %s : %s", this, room));
            // list the room from user's list
            list.put(room, activate);
            // list the user from the room's list
            room.list.put(this, activate);
            // add expiry time to the expiryList
            expiryList.add(new Registry(this, room));
        }
        private void deleteRoom(Room room){
            /*
            // check if need to send notification
            if (list.get(room)) { // if currently activated
                // alert the user for deactivation
                Map notif = new LinkedHashMap();
                notif.put("to", expoPushToken);
                notif.put("body", String.format("The room %s is no longer available", room.roomID));
                notif.put("data", String.format("{"type":"OFF","roomID":"%s"}", room.roomID));
                notifList.add(new JSONObject(notif));
                System.out.println(String.format("deactivating %s : %s", this, room));
            }
             */
            System.out.println(String.format("deleting %s : %s", this, room));
            // unlist the room from user's list
            list.remove(room);
            // unlist the user from the room's list
            room.list.remove(this);
        }
        private void changePref(int timeLimitHours, int timeLimitMinutes){
            this.timeLimitHours = timeLimitHours;
            this.timeLimitMinutes = timeLimitMinutes;
            System.out.println(String.format("user %s settings changed: Hours %d, Minutes %d", userID, timeLimitHours, timeLimitMinutes));
        }
        @Override
        public int hashCode() {
            return expoPushToken.hashCode();
        }
        @Override
        public boolean equals(Object obj) {
            return hashCode() == obj.hashCode();
        }
        @Override
        public String toString() {
            return expoPushToken;
        }
    }

    private static class Registry implements Comparable<Registry> {
        private User user;
        private Room room;
        private DateTime expiry;
        private Registry(User user, Room room, DateTime expiry) {
            this.user = user;
            this.room = room;
            this.expiry = expiry;
        }
        private Registry(User user, Room room) {
            this(user, room, DateTime.now(DateTimeZone.UTC).plusHours(user.timeLimitHours).plusMinutes(user.timeLimitMinutes));
        }
        @Override
        public int compareTo(Registry o) {
            if (expiry.isBefore(o.expiry)) {
                return -1;
            } else {
                return 1;
            }
        }
    }
}