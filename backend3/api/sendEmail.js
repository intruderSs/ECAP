var AWS =  require('aws-sdk');
const send= require('./send');

const ses = new AWS.SES({region: 'ap-south-1'});

module.exports.mail= async(event, context, cntxt)=>{
   
    try{
        let data= JSON.parse(event.body); 
        const params = {
            Source: data.sendEmail,
            Destination: {
                ToAddresses: [data.receiveEmail],
            },
            Message: {
                Body: {
                    Text: {
                        Data: data.content
                    }
                },
                Subject: {
                    Data: data.subject
                }
            },
          };
        await ses.sendEmail(params).promise();
       cntxt(null, send.statement(200, data));
    }catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};