var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('../send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const USER_TABLE_NAME = process.env.USER_TABLE_NAME;

module.exports.user= async(event,context,cntxt)=>{
    let data= JSON.parse(event.body);
    try{
        const params={
            TableName: USER_TABLE_NAME,
            Item:{
                first_name: data.first_name,
                last_name: data.last_name,
                email_id: data.email_id,
                username: data.username,
                allocation_sbu: data.allocation_sbu,
                service_sl: data.service_sl,
                skill_set: data.skill_set,
                skill_cluster: data.skill_cluster
            },
            ConditionExpression: 'attribute_not_exists(username)',       
        };
        // console.log(certificateId)
        await documentClient.put(params).promise();
        cntxt(null, send.statement(201, data));
    } catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};