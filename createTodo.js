const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const Response = require("./response");
const { v4 } = require("uuid");

const client = new DynamoDBClient({ region: "us-east-1" });
const ddbClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TODO_TABLE;

module.exports.handler = async (event) => {
  console.log("event", event);
  const data = JSON.parse(event.body);
  console.log("data", data);

  try {
    const res = await ddbClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: v4(),
          title: data.title,
          descrition: data.descrition,
          priority: data.priority,
          completed: false,
          username: data.username,
        },
        ConditionExpression: "attribute_not_exists(id)",
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
