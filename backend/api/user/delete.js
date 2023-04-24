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
  let email_id = event.pathParameters.email_id;
  try {
    const params = {
      TableName: USER_TABLE_NAME,
      Key: {
        'email_id': email_id
      },
      // ConditionExpression: 'attribute_exists(Id)'
    };
    await documentClient.delete(params).promise();
    console.log(email_id);
    cntxt(null, send.statement(200, email_id));

  }
  catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
}
