const queueURL = "https://sqs.us-east-1.amazonaws.com/282054988091/BlockchainInData"
// Set the region 
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
AWS.config.update({
    "accessKeyId": '*******',
    "secretAccessKey": '***********'
});
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "can not be empty"
        });
    }
    var params = {
        DelaySeconds: 10,
        MessageAttributes: {
            "Name": {
                DataType: "String",
                StringValue: req.body.name
            },
            "Address": {
                DataType: "String",
                StringValue: req.body.address
            },
            "MobileNumber": {
                DataType: "Number",
                StringValue: req.body.mobileNumber
            }
        },
        MessageBody: req.body.details,
        // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
        // MessageGroupId: "Group1",  // Required for FIFO queues
        QueueUrl: queueURL
    };

    sqs.sendMessage(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
            res.send({ 'statusCode': 200, 'message': 'success', 'Id': data.MessageId })
        }
    });

}

exports.retrive = (req, res) => {
    var params = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: queueURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0
    };

    sqs.receiveMessage(params, function (err, data) {
        if (err) {
            console.log("Receive Error", err);
        } else if (data.Messages) {
            console.log('sqs receive message:', data.Messages)
            var deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: data.Messages[0].ReceiptHandle
            };
            sqs.deleteMessage(deleteParams, function (err, data) {
                if (err) {
                    console.log("Delete Error", err);
                } else {
                    console.log("Message Deleted", data);
                    res.send({ 'statusCode': 200, 'message': 'success', 'Id': data })
                }
            });

            res.send({ 'statusCode': 200, 'message': 'success', 'Id': data })
        }
    });
}