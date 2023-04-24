var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('../send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const TRAINING_TABLE_NAME = process.env.TRAINING_TABLE_NAME;

module.exports.registration= async(event,context,cntxt)=>{
    let data= JSON.parse(event.body);
    try{
        const params={
            TableName: TRAINING_TABLE_NAME,
            Item:{
                first_name: data.first_name,
                last_name: data.last_name,
                email_id: data.email_id,
                username: data.username,
                usecert: data.usecert,
                csp: data.csp,
                certificate_name: data.certificate_name,
                allocation_sbu: data.allocation_sbu,
                service_sl: data.service_sl,
                applied_on: data.applied_on,
                end_date: data.end_date,
                request: data.request,
                rejected: data.rejected,
            },
            ConditionExpression: 'attribute_not_exists(usecert)',       
        };
        // console.log(certificateId)
        await documentClient.put(params).promise();
        cntxt(null, send.statement(201, data));
    } catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};