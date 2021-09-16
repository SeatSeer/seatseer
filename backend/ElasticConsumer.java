import org.apache.http.HttpHost;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

public class ElasticConsumer {
    private static String TOPIC_NAME = "SensorUpdates";
    private static String GROUP_ID = "SensorUpdateES";
    private static String BOOTSTRAP_SERVERS = "52.200.114.141:9092";
    private static BulkRequest request;

    public static void main(String[] args) {
        // Kafka Consumer Setup
        Properties configs = new Properties();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP_ID);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
        configs.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, 1000);
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configs);
        consumer.subscribe(Arrays.asList(TOPIC_NAME));
        System.out.println("Successful Kafka Consumer Set Up");
        // receive the message from Kafka
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(60000);
            System.out.println("Received " + records.count() + " records");
            request = new BulkRequest();
            for (ConsumerRecord<String, String> record : records) {
                String message = record.value();
                try {
                    JSONObject carpark = (JSONObject) new JSONParser().parse(message);
                    String ID = (String) carpark.get("ID");
                    int vacant = ((Long) carpark.get("vacant")).intValue();
                    String jsonString = String.format("{\"vacant\":\"%d\"}", vacant);
                    // for bulk update for es
                    request.add(new UpdateRequest("seats", "seat", ID).doc(jsonString, XContentType.JSON));
                    System.out.println("Send to ElasticSearch | data : { ID: " + ID + ", vacant: " + vacant + " }");
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
            // send post to ES
            try {
                int status;
                do {
                    status = post();
                } while (status == 400);
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.out.println("next polling coming in 60 sec");
        }
    }

    private static int post() throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("44.194.92.99", 9200, null)));

        int status = 200;
        if (request.numberOfActions() > 0) {
            BulkResponse bulkresp = client.bulk(request);
            if (bulkresp.hasFailures()) {
                for (BulkItemResponse bulkItemResponse : bulkresp) {
                    if (bulkItemResponse.isFailed()) {
                        BulkItemResponse.Failure failure = bulkItemResponse.getFailure();
                        System.out.println("Error " + failure.toString());
                    }
                }
            }
            status = bulkresp.status().getStatus();
            if (status == 200) System.out.println("All successfully sent to ElasticSearch");
            else System.out.println("Resending");
        }
        client.close();
        return status;
    }
}
