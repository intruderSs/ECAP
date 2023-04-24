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
      UpdateExpression: 'set #first_name= :first_name, #last_name= :last_name, #allocation_sbu= :allocation_sbu, #service_sl= :service_sl',
      ExpressionAttributeNames: {
        '#first_name': 'first_name',
        '#last_name': 'last_name',
        '#allocation_sbu': 'allocation_sbu',
        '#service_sl': 'service_sl'
      },
      ExpressionAttributeValues: {
        ':first_name': data.first_name,
        ':last_name': data.last_name,
        ':allocation_sbu': data.allocation_sbu,
        ':service_sl': data.service_sl
      },
      ConditionExpression: `attribute_exists(email_id)`
    };
    await documentClient.update(params).promise();
    cntxt(null, send.statement(200, data));

  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};