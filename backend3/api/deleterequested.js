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

module.exports.certificate= async (event, context, cntxt)=>{
  let deleteflag= event['queryStringParameters']["deleteflag"]
    try{
        if(deleteflag){
          deleteflag = deleteflag;
        }else{
          deleteflag = send.getDeleteFlag(event.headers);
        }
        const params={
            TableName: CERTIFICATE_TABLE_NAME,
            FilterExpression: 'deleteflag = :deleteflag',
            ExpressionAttributeValues: {':deleteflag': deleteflag}
        };
        let data = await documentClient.scan(params).promise();
        cntxt(null, send.statement(200, data));
    }catch(err){
        cntxt(null, send.statement(500, err.message));
    }
}