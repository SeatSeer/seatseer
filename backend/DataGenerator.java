import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

class DataGenerator {

    private static HashMap<String, int[]> carparkList;

    public static void main(String[] args) {
        carparkList = new HashMap<>();
        try {
            dataGen();
        } catch (ParseException | IOException e) {
            e.printStackTrace();
        }
        /*
        String[] names = {"Central Library Level 3", "Northpoint City", "MacRitchie Reservoir Park",
                "Changi Airport Starbucks", "SAFTI Military Institute"};
        String[] ids = {"Q2VudHJhbCBMaWJyYXJ5IExldmVsIDM", "Tm9ydGhwb2ludCBDaXR5", "TWFjUml0Y2hpZSBSZXNlcnZvaXIgUGFyaw",
                "Q2hhbmdpIEFpcnBvcnQ", "U0FGVEkgTWlsaXRhcnkgSW5zdGl0dXRl"};
        int[] seats = {53, 74, 10, 23, 106};
        Random rand = new Random();

        while(true) {
            int sleep_time = rand.nextInt(6) * 1000;
            int id = rand.nextInt(5);
            int vacant = rand.nextInt(seats[id]);
            int chopped = rand.nextInt(Math.abs(seats[id]-vacant)/3 + 1);
            try {
                post(ids[id], "vacant", vacant);
                post(ids[id], "chopped", chopped);
                System.out.println(String.format("%s : vacant(%d), chopped(%d)", names[id], vacant, chopped));
                System.out.println(String.format("sleeping: %d", sleep_time));
                Thread.sleep(sleep_time);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
         */
    }

    private static void dataGen() throws ParseException, IOException {
        // first, store real-time data into carpark list
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.data.gov.sg/v1/transport/carpark-availability"))
                .header("Accept", "application/json")
                .build();
        String text = client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .join();

        Object obj = new JSONParser().parse(text);
        JSONArray xs = (JSONArray)((JSONObject)((JSONArray)((JSONObject)obj).get("items")).get(0)).get("carpark_data");
        Iterator itr = xs.iterator();
        while (itr.hasNext()) {
            JSONObject carpark = (JSONObject) itr.next();
            String ID = (String) carpark.get("carpark_number");
            int total = Integer.parseInt((String)((JSONObject)((JSONArray)carpark.get("carpark_info")).get(0)).get("total_lots"));
            int vacant = Integer.parseInt((String)((JSONObject)((JSONArray)carpark.get("carpark_info")).get(0)).get("lots_available"));
            int[] tmp = {-1, total, vacant};
            DataGenerator.carparkList.put(ID, tmp);
            //System.out.println(ID + " : " + vacant);
        }
        // then, store the index of each ID

        text = Files.readString(Path.of("ID"));
        obj = new JSONParser().parse(text);
        xs = (JSONArray) obj;
        int index = 0;
        itr = xs.iterator();
        while (itr.hasNext()) {
            String ID = (String) itr.next();
            if (DataGenerator.carparkList.containsKey(ID)) {
                int[] tmp = DataGenerator.carparkList.get(ID);
                tmp[0] = index;
                DataGenerator.carparkList.put(ID, tmp);
            }
            index++;
        }
        // lastly, generate the whole JSON
        JSONArray result = new JSONArray();
        JSONArray address = (JSONArray) new JSONParser().parse(Files.readString(Path.of("address")));
        JSONArray LLcoord = (JSONArray) new JSONParser().parse(Files.readString(Path.of("LLcoord")));
        for (String ID : carparkList.keySet()) {
            int[] tmp = carparkList.get(ID);
            if (tmp[0] != -1) {
                JSONObject divider = new JSONObject();
                Map id = new LinkedHashMap();
                id.put("_id", ID);
                divider.put("index", id);
                result.add(divider);
                Map carpark = new LinkedHashMap();
                carpark.put("ID", ID);
                carpark.put("name", address.get(tmp[0]));
                carpark.put("total", String.valueOf(tmp[1]));
                carpark.put("vacant", String.valueOf(tmp[2]));
                Map location = new LinkedHashMap();
                location.put("lat", String.valueOf(LLcoord.get(2 * tmp[0])));
                location.put("lon", String.valueOf(LLcoord.get(2 * tmp[0] + 1)));
                carpark.put("location", location);
                Random rand = new Random();
                JSONArray features = new JSONArray();
                for (int i = 0; i < 9; i++) {
                    if (rand.nextInt(2) == 1) {
                        features.add(String.valueOf((char)(i+65)));
                    }
                }
                carpark.put("features", features);
                carpark.put("seatingSize", String.valueOf(rand.nextInt(6) + 1));
                JSONArray ratingInfo = new JSONArray();
                double overall = rand.nextInt(501)/100.0;
                int users = rand.nextInt(501);
                int sum = (int) (overall * users);
                ratingInfo.add(String.valueOf(users));
                ratingInfo.add(String.valueOf(sum));
                carpark.put("ratingInfo", ratingInfo);
                carpark.put("rating", String.valueOf(overall));
                carpark.put("comments", new JSONArray());
                result.add(carpark);
            }
        }
        PrintWriter pw = new PrintWriter("RawData");
        pw.write(result.toJSONString());
        pw.flush();
        pw.close();
    }
}
