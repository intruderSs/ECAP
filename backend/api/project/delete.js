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
  let project_id = event.pathParameters.project_id;
  try {
    const params = {
      TableName: PROJECT_TABLE_NAME,
      Key: {
        'project_id': project_id
      },
      // ConditionExpression: 'attribute_exists(Id)'
    };
    await documentClient.delete(params).promise();
    cntxt(null, send.statement(200, project_id));

  }
  catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
}
