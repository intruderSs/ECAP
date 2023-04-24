var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('./send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const CERTIFICATE_TABLE_NAME = "certificateTablenew";

module.exports.certificate= async(event, context, cntxt)=>{
   
    try{
        let data= JSON.parse(event.body); 
        let certification_id= event.pathParameters.certification_id;
        const params = {
            TableName: CERTIFICATE_TABLE_NAME,
            Key: { certification_id },
            UpdateExpression: 'set #deleteflag = :deleteflag',
            ExpressionAttributeNames:{
              '#deleteflag' : 'deleteflag',
            },
            ExpressionAttributeValues:{
              ':deleteflag' : data.deleteflag,
            },
            ConditionExpression: 'attribute_exists(certification_id)'
          };
        await documentClient.update(params).promise();
       cntxt(null, send.statement(200, data));

    }catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};