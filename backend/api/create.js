var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('./send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const CERTIFICATE_TABLE_NAME = process.env.CERTIFICATE_TABLE_NAME;

module.exports.certificate= async(event,context,cntxt)=>{
    let data= JSON.parse(event.body);
    try{
        const params={
            TableName: CERTIFICATE_TABLE_NAME,
            Item:{
                certification_id: data.certification_id,
                userName: data.userName,
                name: data.name,
                certification_name: data.certification_name,
                CSP: data.CSP,
                certification_level: data.certification_level,
                date_of_certification: data.date_of_certification,
                date_of_expiry: data.date_of_expiry,
                validity: data.validity,
                deleteflag: data.deleteflag,
            },
            ConditionExpression: 'attribute_not_exists(certification_id)',
            
        };
        // console.log(certificateId)
        await documentClient.put(params).promise();
        cntxt(null, send.statement(201, data));
    } catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};