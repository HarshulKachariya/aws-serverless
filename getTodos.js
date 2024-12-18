const Response = require("./response");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-east-1",
});

const ddbClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TODO_TABLE;

module.exports.handler = async (event) => {
  console.log("event", event);
  try {
    const params = {
      TableName: TABLE_NAME,
      Limit: 5,
    };

    let lastEvaluatedKey = null;
    let allData = [];
    do {
      const result = await ddbClient.send(new ScanCommand(params));
      lastEvaluatedKey = result.LastEvaluatedKey;
      allData = allData.concat(result.Items);
    } while (lastEvaluatedKey);

    if (allData.length) {
      return Response._200({
        message: `ToDo's found`,
        data: allData,
      });
    }

    return Response._400({ message: "ToDo's not found!" });
  } catch (error) {
    console.error("Error occurred:", error);
    return Response._400({ message: "Internal Server Error", error });
  }
};
