# Microservices Architecture

## The project is divided in microservices
Each microservice is independent, it has a specific small-range service and its own database. These microservices are listed and explained briefly bellow:
  * **Answer Question :** creates a new answer for specific question.
  * **Create Question :** creates a new question and possibly attaches keywords to it.
  * **Manage Users :** manages all users' data and personal information, it provides authentication and authorization to other microservices and implements sign-in, sign-out and sign-up. 
  * **Statistics :** fetches question, keywords or answer data only for statistic reasons (eg. in order to be displayed in the app's graphs).
  * **View Answer :** fetches only question and keywords data with various filter combinations (eg. dates, dates and requested keywords, most popular questions etc).
  * **View Question :** fetches only answers data for specific question or user.

## For microsevices communication and data synchronization 
A **choreographer** service is implemented with the publisher-subscriber logic. Ιn more detail, each microservice adds itself in the wanted subscribers' channel and for each message a publisher sends to this channel, the choreographer makes sure that all the channel subscribers will receive it. The choreographer mediates between all microservices' communications, which in this particular app is requests for access token validation (to verify that the access token that is provided with a request that needs authenticated access is valid) and user ids (to return the user id encoded into a valid access token), which both are implmented in manage_users. In addition it manages the data synchronization, in order for all the different databases to be up to date and have consistent data, which is achieved by using a **Redis Server** to store the data-sync messages. The choreographer is implemented in a way that no messages are lost, even if the subscriber or/and choreographer services are not connected or if a service subscribes after messages have been sent in the subscriber's-channel. In these situations the messages will be stored and sent asynchronously.  

## For a more detailed explanation look at the project documentation
In https://github.com/PolyannaG/AskMeAnything/tree/main/Documentation the documentation vpp file can be found and downloaded, in which you should look at the following diagrams:
* Component Diagram : Microservices
* Sequence Diagram : Microservices (Choreographer)
* Deployment Diagram : Microservices
