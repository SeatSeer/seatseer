# SeatSeer
## Mobile App Built for Orbital 2021

- [1. Introduction](#introduction)
- [2. User Stories](#user-stories)
- [3. Components](#components)
   - [3.1 Features](#features)
   - [3.2 Future](#future)
- [4. Architecture](#architecture)
   - [4.1 Site Map](#site-map)
   - [4.2 Activity Diagram](#activity)
   - [4.3 Program Flowchart](#program-flowchart)
   - [4.4 Data Management](#data-management)
- [5. System Testing](#system-testing)
   - [5.1 Quality Assurance](#quality-assurance)
   - [5.2 User Testing](#user-testing)
- [6. Acknowledgements](#acknowledgements)


## <a name="introduction"></a>1. Introduction
### Deployed Mobile Application

![Poster](https://github.com/SeatSeer/seatseer/blob/master/images/Poster.png)

Link to our mobile application: [https://exp.host/@seatseer/seatseer](https://exp.host/@seatseer/seatseer)

Please try our application on **Android**, as iOS does not allow deployment unless an explicit approval is given by Apple. We have performed our demo locally on iOS to show how it might look on the platform.

(**NOTE**: Please contact us via [email](seatseerorbital2021@gmail.com) prior to testing our app. Our application is currently deployed on AWS using an “educate account”, which shuts down services every 4 hours.)

### Motivation

Do you feel **frustrated** walking around an area **looking for seats** to study or chill, only to realise that there is **no free space**? Many students in NUS experience this problem when wanting to study at the relatively more popular areas on campus such as **U-Town** or **Central Library**.

Not only does this waste precious time spent on searching and transportation, it also poses a potential problem for **crowd control** in certain areas in the university as there will be more people than seats able to accommodate them. This issue is even more important to address in this day and age due to the **COVID-19** pandemic, where everyone has to play their part in practicing **social distancing** and limiting the density of people in an area to prevent the spread of the virus.

### Vision

We aim to make the seat-finding process in NUS **quick** and **efficient** through a mobile app and pressure sensors.


### Value Proposition

**Seek. Select. Sit.**

Inspired by the SAF medical corps motto, “To seek, To save, To serve”, SeatSeer is devoted to the **mission of saving people** from the trouble of finding a seat. We do not merely provide occupancy information like Carpark Availability services. SeatSeer goes one step further; we give the user a **bird’s eye** view of seats everywhere. Want to know the **hottest seats** in demand? Or how about a **seat forecast**? All this data is within your grasp with SeatSeer. **Interact** with your public spaces by writing comments and giving ratings. SeatSeer will provide you with the best **sitting** experience.

## <a name="user-stories"></a>2. User Stories

**High priority \> Must Have: \* \* \***

**Medium priority \> Should Have: \* \***

**Low priority \> Good to Have: \***

**Our target audience is NUS students who is interested in finding a seat**

As a student in NUS, ...

| **Priority** | **I want to be able to ...** | **So that I can ...** |
| --- | --- | --- |
| \* \* \* | Have a **comprehensive** view of the whole school in terms of crowdedness level | Easily decide on where to go to **avoid a crowd** |
| \* \* \* | **Know the school better** by finding conducive places for study, as a **freshman** who missed out on a physical orientation due to COVID-19 situation | Better make use of school facilities and **feel at home** at NUS |
| \* \* | Be able to **predict** which part of the school at what time will be crowded, as a person who **lives far** from school | Know where and when is the **best time to reach school** and do not waste my trip |
| \* \* | Know which among the list of **favorite** places for study has **vacancies** | Quickly make an **informed** choice |
| \* \* | Receive good **recommendations** on other places to visit, as a person **tired** of the same old venues of study | **Expand** my list of favorite places of study |
| \* \* \* | Have a list of recommended seats closest to my **GPS location** | Find out which among the **nearby seats** to choose |
| \* \* | Identify all seats that pass my **criteria of suitability**, such as the availability of electric plugs, the presence of air-conditioning, and a degree of quietness | Avoid the **hassle of trial and error** and find the most **conducive** studying environment |
| \* \* | Be **notified immediately** for a vacancy for a certain place where I love to study at but cannot find an available seat | Do not have to **physically check** for vacancies every now and then |
| \* | **Interact** with the public space by reading and writing **comments** and ratings about it | **Share** and **communicate** with people the perks and inconveniences of the venue |

_Note: all the low priority features (features that we deem non vital for normal use of the application), will be mentioned in the section [3.2 Possible Future Implementations](#future)

## <a name="components"></a>3. Components
### <a name="features"></a>3.1 Features
The frontend of our mobile application is made up of these main components:

- Home tab
- Search tab
- Notification tab
- Settings

#### **Home tab**

Below is the mock-up of our home tab.

![Home tab](https://github.com/SeatSeer/seatseer/blob/master/images/Home_Tab.png)

#### **Search tab**

Below shows search results by your current location.

![Location search](https://github.com/SeatSeer/seatseer/blob/master/images/Location_Search.png)

Below shows in-depth information about each room.

![Panel information](https://github.com/SeatSeer/seatseer/blob/master/images/Panel_Information.png)

Below shows rooms registered as Favorites.

![Favorites tab](https://github.com/SeatSeer/seatseer/blob/master/images/Favorites_Tab.png)

Below shows search results by text and filter queries.

![Text search](https://github.com/SeatSeer/seatseer/blob/master/images/Text_Search.png)

#### **Notification tab**

Below shows our Notification tab.

![Notification tab](https://github.com/SeatSeer/seatseer/blob/master/images/Notification_Tab.png)

#### **Settings**

Below shows our Settings.

![Settings](https://github.com/SeatSeer/seatseer/blob/master/images/Settings.png)

Our app allows for dark mode as well.

![Dark mode](https://github.com/SeatSeer/seatseer/blob/master/images/Dark_Mode.png)

We have created 'feedback' and 'Report a fault' forms for our users.

![Feedback](https://github.com/SeatSeer/seatseer/blob/master/images/Feedback.png)

![Report a fault](https://github.com/SeatSeer/seatseer/blob/master/images/Report_Fault.png)

There are account control features like update email, and delete account as well.

![Update email](https://github.com/SeatSeer/seatseer/blob/master/images/Update_Email.png)

![Delete account](https://github.com/SeatSeer/seatseer/blob/master/images/Delete_Account.png)

### <a name="future"></a>3.2 Possible Future Implementations

#### **Sensor**

For the hardware design of the sensors, we referred to 2 papers that have explored the topic of detecting seat vacancy.

To address the possibility of students removing the sensors, we refer to a [project done by 5 undergraduates at University College London (UCL)](https://www.element14.com/community/community/stem-academy/stem-projects/blog/2017/06/08/study-hunt-library-seat-availability-live-monitoring-system). This project focused on using infrared sensors **attached to ceilings** instead of the standard pressure plates on chairs. Such a solution also has other benefits such as protecting user **privacy** as it acts as an alternative to using surveillance cameras.

![Sensor hardware](https://github.com/SeatSeer/seatseer/blob/master/images/Sensor_Hardware.png)

![Sensor diagram](https://github.com/SeatSeer/seatseer/blob/master/images/Sensor_Diagram.png)

Signals were sent over WiFi to a cloud server via a RESTful API. However, a downside to this is that it cannot be applied to **open areas** without ceilings.

To address the issue of detecting “**choped**” seats, we refer to a [study done by researchers at Singapore Management University (SMU)](https://ink.library.smu.edu.sg/cgi/viewcontent.cgi?article=4118&context=sis_research). They explored utilised **capacitive sensors** attached to the underside of a table to detect seat hogging.

![Capacitive sensors](https://github.com/SeatSeer/seatseer/blob/master/images/Capacitive_Sensors.png)

A person occupying a seat has capacitance that overlaps with that of a book and a laptop’s capacitance range. The higher **variance** in signal for a person occupying a seat as compared to an object allows human occupancy to be differentiated.

![Performance graph](https://github.com/SeatSeer/seatseer/blob/master/images/Performance_Graph.png)

This could be applied to our project where if someone leaves a seat unoccupied with their items still at their seat, the sensor could update **every 1 minute** to check the seat’s status.

## <a name="architecture"></a>4. Architecture
### <a name="site-map"></a>4.1 Site Map

The diagram below shows the various screens in the app, and how a user might go about **navigating** from one to another.

![User logged out](https://github.com/SeatSeer/seatseer/blob/master/images/Logged_Out.png)

![User logged in](https://github.com/SeatSeer/seatseer/blob/master/images/Logged_In.png)

### <a name="activity-diagram"></a>4.2 Activity Diagram

The diagram below shows how a SeatSeer user might **interact** with the app’s features and interface.

![Activity Diagram](https://github.com/SeatSeer/seatseer/blob/master/images/Activity_Diagram.png)

### <a name="program-flowchart"></a>4.3 Program Flowchart

![Program flowchart](https://github.com/SeatSeer/seatseer/blob/master/images/Program_Flowchart.png)

#### **Tech Stack**
- React Native
- Java
- Firebase
- Expo
- AWS EC2
- MongoDB Atlas
- Apache Zookeeper
- Apache Kafka
- ElasticSearch
- Kibana
- Monstache

#### **Expo**

Expo-CLI with managed workflow was used with yarn as the package manager. To run the app locally while developing, we ran the ‘expo start’ command in the root of the project directory. The **Expo Go app** was used to run the app, allowing quick and easy testing to view how changes in code affect UI appearance and functionality.

#### **Firebase**

We used Firebase as a data store for all **user-related information**, such as authentication, account information, and preferences like notifications, favorites, and dark mode.

A Firebase project and web application was created. **Configuration** of the web application is obtained and the app is initialized in the project. All configuration details are stored as secrets using a .env file inside the project directory. Firebase contains a suite of services that are useful to our app such as **authentication and realtime database**.

#### **ElasticSearch**

ElasticSearch is an excellent **search engine** tool which can efficiently sieve out relevant results from a pool of data. Thus, it handles all queries from the **Search tab**.

To run an ElasticSearch cluster, we created 2 instances of EC2 in AWS. Since ElasticSearch is a very **heavy** application, many settings had to be adjusted for it to run in t2.micro instance, such as increasing **maximum file descriptor, heap size, virtual memory, and disabling swapping**. Configuration file and network settings were also set for the proper cluster to form up.

#### **Kibana**

To **visualize** data input into ElasticSearch, we downloaded Kibana into another EC2 instance. We mainly used the **Developer Tools** in Kibana to monitor ElasticSearch activities.

#### **MongoDB**
We used MongoDB as a **primary data store** for all seat-related information. This is because when Elasticsearch finds itself splitting and reforming the cluster, writes can get lost and thus it is not a good pick as a main database.

We used MongoDB Atlas, which is a free cloud database. Upon creation of a database, the Saas Atlas service will automatically create **3 nodes** as a server. We have **white-listed** the IP addresses of some EC2 instances we created, so that they can gain access to our MongoDB.

It was crucial that seat-related information remain in sync between ElasticSearch and MongoDB. Thus, we used **Monstache** as a tool to handle real-time data synchronization between these two databases.

#### **Apache Kafka**

Kafka is an **open-source event streaming platform**. It is the backbone of our application, as it is an excellent tool for storing and relaying information from one party to another, acting like an **expressway** connecting almost all APIs.

To run a Kafka cluster, we created 3 instances of EC2 in AWS, in which we downloaded Apache Kafka, as well as **Apache Zookeeper**. First, configurations and network settings must be set for Zookeeper such that each EC2 instance will act as a node in the cluster. Then, configurations such as **heap size** for Kafka must be adjusted in order for it to successfully operate in the **t2.micro** instance, which is the only available free-tier virtual machine for AWS. Once Zookeepers are successfully running, Kafka can be run.

Kafka stores streams of data as separate **topics**, which are useful ways of categorizing information. It follows a **pub-sub model**, whereby some APIs will publish event messages to topics and others will subscribe to those topics.

#### **Search service API**

This program handles all **search queries** made to **ElasticSearch**. These queries can be geo-search, text search, filter search, or simply bulk searches by IDs. When handling requests by the user to display or change their own list of favorites, it liaises with the **User service API**.

We used **Query DSL** format to communicate user queries into ElasticSearch. For example, location search will make use of the **geo-point** data in individual rooms to retrieve the most relevant data.

#### **Notifications manager API**

This is a **Java program** that manages all notifications to be sent to users. It subscribes to 2 topics in Kafka: **vacancy updates** made by Sensor service API and **notifications updates** made by Notifications service API.

The program stores information about users and seats using **Object-Oriented Programming**. Any state change will check whether notification conditions are met or unmet. It also inserts notifications in the priority queue to keep track of the **expiry time**.

It will round up all notifications in a JSON array to be sent to the **Expo host** in bulk. The Expo token for users will be stored in individual JSON objects inside the array, which will be used by the Expo host to send the notification to the correct person.

#### **Future development plans**

We regretfully have yet to implement the **Home tab** feature, along with the back-end to support it. These will involve **Apache Spark** to mount Machine Learning algorithms and batch process data streaming from Kafka, and Cassandra to handle recommendations generated.

### <a name="data-management"></a>4.4 Data Management

The diagrams below show how SeatSeer manages **user and seat data** in JSON format.

![Data Management](https://github.com/SeatSeer/seatseer/blob/master/images/Data_Management.png)

## <a name="system-testing"></a>5. System Testing
### <a name="quality-assurance"></a>5.1 Quality Assurance

#### **Frontend Testing**

![Frontend Testing](https://github.com/SeatSeer/seatseer/blob/master/images/Frontend_Testing.png)

We ran automated test cases on an Android device using **TestProject**. We created a detailed list of test cases for Regression Testing and selected a few major cases that will become the backbone of our app functionality to be part of Smoke Testing. 

TestProject was ideal for running **automated test cases**. It records user activities as a list of commands, which can be replicated as a test case sequence to be conducted in an automated fashion. It can also produce test cases involving finger movements on the screen like scrolling and shifting, which is crucial for mobile app UI testing. Finally, it allows test cases to be run under certain specified conditions by reading screen components.

#### **Backend Testing**

![Backend Testing](https://github.com/SeatSeer/seatseer/blob/master/images/Backend_Testing.png)

We ran automated test cases for back-end endpoints by sending HTTP requests using **Postman**. There are three notable endpoints, which are ElasticSearch, Firebase, and Kafka Rest API.

For **ElasticSearch**, the requests are made to “http://<elasticsearchIP>:9200/seats/”. Port number is 9200. We can specify an index which is “seats”, and type which is “seat”. We can also specify meta fields like “_search” and “_update”.

For **Firebase**, the requests are made to “http://<projectID>.firebasedatabase.app/”. This directs us to the JSON file. Path can be further specified by adding keys to the URL. Notable keys are “favorites” and “notifications”, as well as encrypted user IDs that were generated by Firebase when the user set up an account.

For **Kafka Rest API**, the requests are made to “http://<KafkaRestIP>:8082/topics/”. Port number is 8082. “topics” allow us to gain access to all existing topics in the Kafka cluster. We specified the header as "Content-Type: application/vnd.kafka.json.v2+json" in our POST request.

### <a name="user-testing"></a>5.2 User Testing

We had the privilege of having **9 experienced developers** giving us two rounds of feedback. We sincerely appreciate their help which has been instrumental in strengthening our product.

In this section, we will give a **summary of the feedback** received, and how we incorporated them in our application.

#### **Search Tab**
1. Comments on **bug-related** issues include...
   - When the “report a faulty seat” button is pressed from the seat information page
   - Seat rating should not show long float value
   - Some parts are not displayed properly in Dark Mode
2. Comments on the **UI** include...
   - Font size of seat reviews is too small
   - Minimum seat rating slider should allow decimal value
   - Display the list of features of each seat under seat information so that users can know what location has what features associated with it
   - Have more variety of features like individual seating, group seating, nature view, city view, and near to MRT

#### **Settings**
1. Comments on **bug-related** issues include...
   - Empty form submission should not be allowed
2. Comments on the **UI** include...
   - Forms can be in-app, rather than a web page
   - Hint tests are not clear for Update Email page what each input field is meant to be
   - There is a typo for the invalid password error alert
   - Titles of the few pages are not displayed nicely
   - A loading screen/notification box needed to inform users of the loading after confirming updating email

#### **System Testing**
1. Scale up the dataset and check if the system is able to handle the large dataset.
2. Deal with loopholes such as non-existent location, non-local location, or empty review. Decide on how to handle and display such cases.

We also scaled up our dataset size from **1873**, and were happy to observe that our system could handle these data with ease. For now, if the registered room has a non-existent location (i.e. the latitude and longitude values are absent or invalid), we will not display the location on the map. Non-local locations will be displayed nonetheless. Empty reviews are not possible as it is mandatory to fill up at least a rating before submitting a review.

## <a name="acknowledgements"></a>6. Acknowledgements

We would like to first thank our mentor, [Grant Lee](https://www.linkedin.com/in/grantleeyx/), for his guidance throughout our project.

We would also like to thank 8 of our peers for giving us good quality feedback and areas to improve on our product.
- [Chetwin Low](https://github.com/chetwinlow)
- [Benjamin Tay](https://github.com/Btaykb)
- [Jessica Jacelyn](https://github.com/jessicajacelyn)
- [Zheng ZiKang](https://github.com/zzkzzzz)
- [Bernardus Krishna](https://github.com/bernarduskrishna)
- [Xu Jiheng](https://github.com/JeffZincatz)
- Chong Jun Wei
- Yu Shufan
