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

module.exports.certificate= async(event, context, cntxt)=>{
   
    try{
        let data= JSON.parse(event.body); 
        let certification_id= event.pathParameters.certification_id;
        const params = {
            TableName: CERTIFICATE_TABLE_NAME,
            Key: { certification_id },
            UpdateExpression: 'set #certification_name= :certification_name, #CSP= :CSP, #certification_level= :certification_level, #date_of_certification= :date_of_certification, #userName= :userName ,#date_of_expiry= :date_of_expiry, #validity= :validity, #deleteflag= :deleteflag',
            ExpressionAttributeNames:{
              '#certification_name' : 'certification_name',
              '#CSP' : 'CSP',
              '#certification_level' : 'certification_level',
              '#date_of_certification' : 'date_of_certification',
              '#date_of_expiry' : 'date_of_expiry',
              '#userName': 'userName',
              '#validity': 'validity',
              '#deleteflag': 'deleteflag'
            },
            ExpressionAttributeValues:{
              ':certification_name' : data.certification_name,
              ':CSP' : data.CSP,
              ':certification_level' : data.certification_level,
              ':date_of_certification': data.date_of_certification,
              ':userName': data.userName,
              ':date_of_expiry': data.date_of_expiry,
              ':validity': data.validity,
              ':deleteflag': data.deleteflag
            },
            ConditionExpression: 'attribute_exists(certification_id)'
          };
        await documentClient.update(params).promise();
       cntxt(null, send.statement(200, data));

    }catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};