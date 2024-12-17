const Response = require("./response");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-east-1",
});

const ddbClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TODO_TABLE;

module.exports.handler = async (event) => {
  try {
    if (!event.pathParameters || !event.pathParameters.id) {
      return Response._400({ message: "id is required" });
    }

    const ID = event.pathParameters.id;

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: ID,
      },
    };

    const result = await ddbClient.send({
      Command: new DeleteCommand(params),
      ConditionExpression: "attribute_exists(id)",
    });

    if (result) {
      return Response._200({
        message: `Todo deleted successfully with id=${ID}`,
        data: [],
      });
    }

    return Response._400({ message: "todo not found!" });
  } catch (error) {
    console.error("Error occurred:", error);
    return Response._400({ message: "Internal Server Error", error });
  }
};
