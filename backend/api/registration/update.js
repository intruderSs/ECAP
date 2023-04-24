var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require('../send');
var documentClient = new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const TRAINING_TABLE_NAME = process.env.TRAINING_TABLE_NAME;

module.exports.registration = async (event, context, cntxt) => {

  try {
    let data = JSON.parse(event.body);
    let usecert = data.usecert;
    const params = {
      TableName: TRAINING_TABLE_NAME,
      Key: {
        'usecert':usecert
      },
      UpdateExpression: 'set #request= :request, #rejected= :rejected, #end_date= :end_date',
      ExpressionAttributeNames: {
        '#request': 'request',
        '#rejected': 'rejected',
        '#end_date': 'end_date'
      },
      ExpressionAttributeValues: {
        ':request': data.request,
        ':rejected': data.rejected,
        ':end_date': data.end_date,
      },
      ConditionExpression: `attribute_exists(usecert)`
    };
    await documentClient.update(params).promise();
    cntxt(null, send.statement(200, data));

  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};