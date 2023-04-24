var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require('../send');
var documentClient = new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const APPROVE_TABLE_NAME = process.env.APPROVE_TABLE_NAME;

module.exports.data = async (event, context, cntxt) => {
  let approve_id = event.pathParameters.approve_id;
  try {
    const params = {
      TableName: APPROVE_TABLE_NAME,
      Key: {
        'approve_id': approve_id
      },
      // ConditionExpression: 'attribute_exists(Id)'
    };
    await documentClient.delete(params).promise();
    console.log(approve_id);
    cntxt(null, send.statement(200, approve_id));

  }
  catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
}
