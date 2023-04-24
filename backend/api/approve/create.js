var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('../send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const APPROVE_TABLE_NAME = process.env.APPROVE_TABLE_NAME;

module.exports.data= async(event,context,cntxt)=>{
    let data= JSON.parse(event.body);
    try{
        const params={
            TableName: APPROVE_TABLE_NAME,
            Item:{
                approve_id: data.approve_id,
                email_id: data.email_id,
                name: data.name,
                skills: data.skills,
                approval_status: data.approval_status,
                approved_: data.approved_,
                approved_by: data.approved_by,
                date: data.date,
                cluster: data.cluster,
            },
            ConditionExpression: 'attribute_not_exists(approve_id)',       
        };
        // console.log(certificateId)
        await documentClient.put(params).promise();
        cntxt(null, send.statement(201, data));
    } catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};