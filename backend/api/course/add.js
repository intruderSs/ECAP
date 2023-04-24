var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('../send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const COURSE_TABLE_NAME = process.env.COURSE_TABLE_NAME;

module.exports.data= async(event,context,cntxt)=>{
    let data= JSON.parse(event.body);
    try{
        const params={
            TableName: COURSE_TABLE_NAME,
            Item:{
                course_name: data.course_name,
                skill_set: data.skill_set
            },
            ConditionExpression: 'attribute_not_exists(course_name)',       
        };
        // console.log(certificateId)
        await documentClient.put(params).promise();
        cntxt(null, send.statement(201, data));
    } catch(err){
        cntxt(null, send.statement(500, err.message));
    }
};