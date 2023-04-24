var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('../send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const PROJECT_TABLE_NAME = process.env.PROJECT_TABLE_NAME;

module.exports.data= async(event,context,cntxt)=>{
    let data= JSON.parse(event.body);
    try{
        const params={
            TableName: PROJECT_TABLE_NAME,
            Item:{
                project_id: data.project_id,
                project_name: data.project_name,
                description: data.description,
                satrting_date: data.satrting_date,
                ending_date: data.ending_date,
                skills_required: data.skills_required,
                team: data.team
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