This project has 4 modules

one is front end and other 3 are backends.

The front end is developed using ReactJs, Bootstrap.

The backend is developed using Nodejs and Serverless-Framework.

after downloading the zipped file these steps needs to be followed :-

1. inside the front end folder install the node modules // command "npm install" >> all of the dependencies and packages used in this project will be installed.
2. for the backends, I have created 3 files (It can be merged into one, but while development I did like this only).
   Node modules needs to be installed in each one of them using the same command as mentioned above.

3. To configure serverless framework into your local system please follow these steps:
   1- npm install -g serverless (use this command to install the serverless framework globally into your local systems)
   2- To check the installation is successful or not write >> serverless --version
   3-Next step is to configure the AWS Credentials for that use the following command >>

   serverless config credentials \
   --provider aws
   --key AKIAIOSFODNN7EXAMPLE
   --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

   4- To deploy the application write >> serverless deploy or sls deploy

4. dependencies used with versions:
   "amazon-cognito-identity-js": "^5.2.12",
   "bootstrap": "^5.2.3",
   "dateformat": "^5.0.3",
   "framer-motion": "^9.0.2",
   "react": "^18.2.0",
   "react-bootstrap": "^2.7.2",
   "react-csv": "^2.2.2",
   "react-dom": "^18.2.0",
   "react-papaparse": "^3.18.2",
   "react-router-dom": "^6.8.0",
   "react-scripts": "^5.0.1",
   "react-table": "^7.8.0",
   "react-toastify": "^9.1.1",
   "web-vitals": "^2.1.4"
   serverless framework version: 
                     Framework Core: 3.25.1
                      Plugin: 6.2.2
                      SDK: 4.3.2


5. to start the local server write >>  npm start
6. to create a build file wrote >> npm run build