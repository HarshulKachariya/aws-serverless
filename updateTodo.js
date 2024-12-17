const Response = require("./response");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-east-1",
});

const ddbClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TODO_TABLE;

module.exports.handler = async (event) => {
  try {
    if (!event.pathParameters || !event.pathParameters.id) {
      return Response._400({ message: "id is required to update todo" });
    }

    const ID = event.pathParameters.id;
    const data = JSON.parse(event.body);

    // Dynamically build update expression and attributes
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Map of allowed update fields
    const updateFields = {
      title: "#title",
      descrition: "#descrition",
      priority: "#priority",
      completed: "#completed",
    };

    Object.keys(data).forEach((key) => {
      if (updateFields[key]) {
        updateExpression.push(`${updateFields[key]} = :${key}`);
        expressionAttributeNames[updateFields[key]] = key;
        expressionAttributeValues[`:${key}`] = data[key];
      }
    });

    // Add updated_at timestamp
    updateExpression.push("#updated_at = :updated_at");
    expressionAttributeNames["#updated_at"] = "updated_at";
    expressionAttributeValues[":updated_at"] = new Date().toISOString();

    // If no valid fields to update
    if (updateExpression.length === 0) {
      return Response._400({ message: "No valid fields to update" });
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: ID,
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: "attribute_exists(id)",
      ReturnValues: "ALL_NEW", // Return the updated item
    };

    const result = await ddbClient.send(new UpdateCommand(params));

    if (result) {
      return Response._200({
        message: `Todo updated successfully with id=${ID}`,
        data: result.Attributes, // Use Attributes instead of Item for UpdateCommand
      });
    }

    return Response._400({ message: "todo not found!" });
  } catch (error) {
    console.error("Error occurred:", error);
    return Response._400({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
