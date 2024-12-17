const {
  DynamoDBClient,
  ConditionalOperator,
} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const Response = require("./response");
const { v4 } = require("uuid");

const client = new DynamoDBClient({ region: "us-east-1" });
const ddbClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.USER_TABLE;

module.exports.handler = async (event) => {
  console.log("event", event);
  const data = JSON.parse(event.body);
  console.log("data", data);

  try {
    const res = await ddbClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          userID: v4(),
          userName: data.userName,
          email: data.email,
          mobile: data.mobile,
        },
        ConditionExpression: "attribute_not_exists(userID)",
      })
    );

    if (res) {
      return Response._201({ message: "User create Successfull!", data: res });
    }

    return Response._400({ message: "unable to create user!" });
  } catch (error) {
    console.error("Error occurred:", error);
    return Response._400({ message: "Internal Server Error", error });
  }
};
