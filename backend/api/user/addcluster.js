var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require('../send');
var documentClient = new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const USER_TABLE_NAME = process.env.USER_TABLE_NAME;

module.exports.user = async (event, context, cntxt) => {

  try {
    let data = JSON.parse(event.body);
    let Id = data.email_id;
    const params = {
      TableName: USER_TABLE_NAME,
      Key: {
        'email_id':Id
      },
      UpdateExpression: 'set #skill_cluster= :skill_cluster',
      ExpressionAttributeNames: {
        '#skill_cluster': 'skill_cluster'
      },
      ExpressionAttributeValues: {
        ':skill_cluster': data.skill_cluster,
      },
      ConditionExpression: `attribute_exists(email_id)`
    };
    await documentClient.update(params).promise();
    cntxt(null, send.statement(200, data));

  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};