const Response = require("./response");

module.exports.handler = async (event) => {
  try {
    if (!event.pathParameters || !event.pathParameters.id) {
      return Response._400({ message: "id is required" });
    }

    const ID = Number(event.pathParameters.id);
    if (data[ID]) {
      return Response._200({
        message: "User found",
        data: data[ID],
      });
    }

    return Response._400({ message: "user not found!" });
  } catch (error) {
    console.error("Error occurred:", error);
    return Response._400({ message: "Internal Server Error", error });
  }
};

const data = {
  1: { id: 1, name: "John" },
  2: { id: 2, name: "Jane" },
  3: { id: 3, name: "Bob" },
};
