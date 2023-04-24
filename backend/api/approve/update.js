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

  try {
    let data = JSON.parse(event.body);
    let approve_id = data.approve_id;
    const params = {
      TableName: APPROVE_TABLE_NAME,
      Key: {
        'approve_id':approve_id
      },
      UpdateExpression: 'set #approval_status= :approval_status, #approved_= :approved_, #approved_by= :approved_by, #date= :date, #cluster= :cluster',
      ExpressionAttributeNames: {
        '#approval_status': 'approval_status',
        '#approved_': 'approved_',
        '#approved_by': 'approved_by',
        '#date': 'date',
        '#cluster': 'cluster'
      },
      ExpressionAttributeValues: {
        ':approval_status': data.approval_status,
        ':approved_': data.approved_,
        ':approved_by': data.approved_by,
        ':date': data.date,
        ':cluster': data.cluster
      },
      ConditionExpression: `attribute_exists(approve_id)`
    };
    await documentClient.update(params).promise();
    cntxt(null, send.statement(200, data));

  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};