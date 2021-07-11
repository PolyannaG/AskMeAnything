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

### Deployment instructions
The current project has been deployed on Heroku. To deploy this project on Heroku yourself:

Each subfolder of the main "Microservices" directory and each subfolder of the main "SOA" directory should
be deployed on a different dyno/app on Heroku. This can be achieved through git:

1) Go into the subdirectory of "Microservices" or "SOA" directory. 
2) Type in a shell:
git init
heroku create
git remote rename heroku app_name    (where: app_name the name of the current app, for example: createquestionms)

3) You will then need to add a remote database for each of services/microservices that uses one: Databases need to be added for the apps:
answer-question, create-question, msanage-users, statistics, view-answer, view-question,  for the Microservices architecture, and for
the apps: data-layer-users, data-layer,  for the SOA architecture. The database can be added using Heroku's graphical interface on your
browser by clicking on "Resources" and adding the Heroku Postgres Add-on. Altrenatively you can add the database using the terminal. Type:
heroku addons:create heroku-postgresql:hobby-dev
After you add the database, you will be provided with the database's credentials. Go to the ormconfig.json file in the service you are deploying and change the host, username, password and database with the ones given for your new databases.

4) Our services use a Redis server so you will have to configure that too: Through the graphical interface of Heroku for the apps of:
choreographer (Microservices Architecture)  and enterprise-service-bus (SOA Architecture) , click on Resources and add the Redis To Go
Add-on. You will be provided with a specific URL for the server you just added. Replace the URL in the app.module file given for the 
var named "rtg" with your new url. 
You will have to use the choreographer's URL for the Microservices architecture for the apps:
answer-question, choreographer, create-question, manage-users, statistics, view-answer, view-question.
For the SOA architecture you will have to use the enterprise-service-bus's URL for the apps:
manage-users, statistics, user-interaction.

5) In order for the backend to be able to receive and answer requests from the app's frontend, CORS needs to bee enabled. For this 
reason, in the "main.ts" file inside the src directory in the subdirectory of each microservice/service, find the app.enableCors command and
replace the URL given as origin with the URL of the frontend you are deploying, for each architecture.

6) Since app URLS are uninque in Heroku, the URLS of the microservices and service (in SOA) you are deploying will be different from the ones
we have used. For this reason, all fetch requests in the frontend and backend will have to be adapted, in order for the requests to be sent
to the apps you are deploying. The URLS we are using are very staightforward: For example the manage-users microservice has a URL: 
https://manageusersmsapp.herokuapp.com and the manage-users soa service has a URL: https://manageuserssoaapp.herokuapp.com, so you will have no problem 
understanding which app you will have to call each time.

7) For the frontend only: Our frontend has been developed using ReactJS. Heroku allows you to deploy React apps but you will have to add the appropriate
buildpack to do so: Using Heroku's graphical interface, go to the settings of the frontend app and click "Add buildpack". When asked to 
provide a URL for the buildpack use the URL: https://buildpack-registry.s3.amazonaws.com/buildpacks/mars/create-react-app.tgz

8) After all these changes are performed you are ready to deploy your apps. On a shell type for each app:
git add .
git commit -m "your message"
git push heroku master

After you have done this for all your apps, the project should be deployed!

