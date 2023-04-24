var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require('../send');
var documentClient = new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const COURSE_TABLE_NAME = process.env.COURSE_TABLE_NAME;

module.exports.data = async (event, context, cntxt) => {
  let course_name = event.pathParameters.course_name;
  try {
    const params = {
      TableName: COURSE_TABLE_NAME,
      Key: {
        'course_name': course_name
      },
      // ConditionExpression: 'attribute_exists(Id)'
    };
    await documentClient.delete(params).promise();
    cntxt(null, send.statement(200, course_name));

  }
  catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
}
