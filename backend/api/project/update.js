var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require('../send');
var documentClient = new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const PROJECT_TABLE_NAME = process.env.PROJECT_TABLE_NAME;

module.exports.data = async (event, context, cntxt) => {

  try {
    let data = JSON.parse(event.body);
    let project_id = data.project_id;
    const params = {
      TableName: PROJECT_TABLE_NAME,
      Key: {
        'project_id':project_id
      },
      UpdateExpression: 'set #team= :team',
      ExpressionAttributeNames: {
        '#team': 'team'
      },
      ExpressionAttributeValues: {
        ':team': data.team
      },
      ConditionExpression: `attribute_exists(project_id)`
    };
    await documentClient.update(params).promise();
    cntxt(null, send.statement(200, data));

  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};