var AWS =  require('aws-sdk');
const send= require('./send');

const ses = new AWS.SES({region: 'ap-south-1'});

module.exports.mail= async(event, context, cntxt)=>{
    let email= event.pathParameters.email;
    try{
        const params = {
            EmailAddress: email,
          };
        await ses.verifyEmailAddress(params).promise();
       cntxt(null, send.statement(200, data));
    }catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};