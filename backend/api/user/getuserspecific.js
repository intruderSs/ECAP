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

module.exports.user= async (event, context, cntxt)=>{
  let email_id= event['queryStringParameters']["email_id"];
    try{
        if(email_id){
          email_id = email_id;
        }else{
          email_id = send.getEmailId(event.headers);
        }
        const params={
            TableName: USER_TABLE_NAME,
            FilterExpression: 'email_id = :email_id',
            ExpressionAttributeValues: {':email_id': email_id}
        };
        let data = await documentClient.scan(params).promise();
        cntxt(null, send.statement(200, data));
    }catch(err){
        cntxt(null, send.statement(500, err.message));
    }
}