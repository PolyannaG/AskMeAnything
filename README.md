# AskMeAnything
This is a project that was created for Saas course of Electrical Engineering and Computer Science department of NTUA during the year of 2020-2021. The goal of this project was to develop a full stack implementation of a Q&A application running on cloud, using different architectures like a microservice based architecture and a Service Oriented Architecture (SOA). 

## Team Saas-48 Members:
* Γκότση Πολυτίμη-Άννα el17201 (github : https://github.com/PolyannaG)
* Λιάγκα Αικατερίνη el17208 (github : https://github.com/LiagkaAikaterini)

## Architectures
* Microservices (with choreography)
* Service Oriented Architecture (SOA)

## Technologies we used
### Frontend
* ReactJS
* React Bootstrap
### Backend
* NodeJS
* NestJS
* Express
* Redis (for communication between services and data synchronization)
* JSON Web Tokens (JWT), bcrypt (for authentication)
### Databases
* PostgreSQL
### Data Generation
* Python

## Deployment
The project has been deployed using Heroku for both architectures. You can use the following links to access the user interface:
* for Microservices : https://askmeanythingmsapp.herokuapp.com/
* for SOA : https://askmeanythingsoaapp.herokuapp.com/

Note :
When accessing the user interface for the deployed projects you will notice that you may need to wait a little in order for the data to be fetched or for the services to be provided (when signing in or submiting a question or answer). Do not be alarmed, this is because the apps on Heroku, when using the free version of dynos, go into idle state when they have not been used for 30 minutes. They become active again when a service is requested from them, but it takes some time for them to wake up and answer to the first request. So be patient! :)
