var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('../send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});

const TEST_TABLE_NAME = process.env.TEST_TABLE_NAME;

module.exports.data= async (event, context, cntxt)=>{
  let course_name= event['queryStringParameters']["course_name"];
    try{
        const params={
            TableName: TEST_TABLE_NAME,
            FilterExpression: 'course_name = :course_name',
            ExpressionAttributeValues: {':course_name': course_name}
        };
        let data = await documentClient.scan(params).promise();
        cntxt(null, send.statement(200, data));
    }catch(err){
        cntxt(null, send.statement(500, err.message));
    }
}