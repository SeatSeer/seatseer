import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.joda.time.DateTime;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

public class SensorProducer {

    private static final String NAME = "Sensor Producer : ";

    private static HashMap<String, Integer> vacancy;
    private static HashMap<String, DateTime> updateTime;
    private static JSONArray store;
    private static String TOPIC_NAME = "SensorUpdates";
    private static String BOOTSTRAP_SERVERS = "52.200.114.141:9092";

    public static void main(String[] args) {
        // Graceful shutdown set sup
        Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() {
                try {
                    gracefulShutdown();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }
            }
        });
        // store the current vacancy info
        store = new JSONArray();
        vacancy = new HashMap<>();
        updateTime = new HashMap<>();
        try {
            initialize();
        } catch (IOException | ParseException e){
            e.printStackTrace();
        }
        // Kafka Producer Setup
        Properties configs = new Properties();
        configs.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        configs.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        configs.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        KafkaProducer<String, String> producer = new KafkaProducer<>(configs);
        System.out.println("Successful Kafka Producer Set Up");
        // Running producer
        while (true) {
            try {
                checkForUpdate();
                Iterator itr = store.iterator();
                while (itr.hasNext()) {
                    String msg = new JSONObject((Map)itr.next()).toString();
                    ProducerRecord<String, String> record = new ProducerRecord<>(TOPIC_NAME, msg);
                    producer.send(record);
                    System.out.println("Send to " + TOPIC_NAME + " | data : " + msg);
                }
                System.out.println("sleeping for 60 sec!");
                Thread.sleep(60000);
            } catch (ParseException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private static void initialize() throws IOException, ParseException {
        String content = Files.readString(Path.of("CurrentVacancy"));
        store = (JSONArray) new JSONParser().parse(content);
        Iterator itr = store.iterator();
        while (itr.hasNext()) {
            JSONObject carpark = (JSONObject) itr.next();
            String ID = (String)carpark.get("ID");
            int vacant = ((Long)carpark.get("vacant")).intValue();
            String time = (String)carpark.get("update_datetime");
            int year = Integer.parseInt(time.substring(0, 4)); int month = Integer.parseInt(time.substring(5, 7));
            int day = Integer.parseInt(time.substring(8, 10)); int hour = Integer.parseInt(time.substring(11, 13));
            int min = Integer.parseInt(time.substring(14, 16)); int sec = Integer.parseInt(time.substring(17, 19));
            DateTime updated = new DateTime(year, month, day, hour, min, sec);
            vacancy.put(ID, vacant);
            updateTime.put(ID, updated);
        }
        System.out.println("Successful initialization");
    }

    private static void checkForUpdate() throws ParseException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.data.gov.sg/v1/transport/carpark-availability"))
                .header("Accept", "application/json")
                .build();
        String info = client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .join();
        Object obj = new JSONParser().parse(info);
        if ((JSONArray)((JSONObject)obj).get("items") != null) {
            JSONArray incoming = (JSONArray)((JSONObject)((JSONArray)((JSONObject)obj).get("items")).get(0)).get("carpark_data");
            Iterator itr = incoming.iterator();
            store = new JSONArray();
            while (itr.hasNext()) {
                JSONObject carpark = (JSONObject) itr.next();
                String ID = (String) carpark.get("carpark_number");
                int vacant = Integer.parseInt((String) ((JSONObject) ((JSONArray) carpark.get("carpark_info")).get(0)).get("lots_available"));
                String time = (String)carpark.get("update_datetime");
                int year = Integer.parseInt(time.substring(0, 4)); int month = Integer.parseInt(time.substring(5, 7));
                int day = Integer.parseInt(time.substring(8, 10)); int hour = Integer.parseInt(time.substring(11, 13));
                int min = Integer.parseInt(time.substring(14, 16)); int sec = Integer.parseInt(time.substring(17, 19));
                DateTime updated = new DateTime(year, month, day, hour, min, sec);
                if (vacancy.containsKey(ID) && vacancy.get(ID) != vacant && updateTime.get(ID).isBefore(updated)) {
                    vacancy.put(ID, vacant);
                    updateTime.put(ID, updated);
                    // send a message to kafka topic
                    Map message = new LinkedHashMap();
                    message.put("ID", ID);
                    message.put("vacant", vacant);
                    message.put("updateTime", time);
                    store.add(message);
                }
            }
            System.out.println("Successful check for updates");
        } else {
            System.out.println("!Unsuccessful check for updates");
        }
    }

    public static void gracefulShutdown() throws FileNotFoundException {
        store = new JSONArray();
        for (String ID : vacancy.keySet()) {
            Map carpark = new LinkedHashMap();
            carpark.put("ID", ID);
            carpark.put("vacant", vacancy.get(ID));
            carpark.put("update_datetime", updateTime.get(ID).toString());
            store.add(carpark);
        }
        String filename = "CurrentVacancy";
        System.out.println("writing data into "+filename);
        PrintWriter pw = new PrintWriter(filename);
        pw.write(store.toJSONString());
        pw.flush();
        pw.close();
        System.out.println("Graceful shutdown successful");
    }
}
