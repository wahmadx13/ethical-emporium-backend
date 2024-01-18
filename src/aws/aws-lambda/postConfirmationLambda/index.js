const { MongoClient, ObjectId } = require("mongodb");
const { createHash } = require("crypto");

const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event, context, callback) => {
  const { request } = event;

  // Handle pre sign up event
  if (request.userAttributes) {
    const { sub, email, phone_number, name } = request.userAttributes;
    console.log("user Attributes", request.userAttributes);
    const hashedId = createHash("sha256")
      .update(sub)
      .digest("hex")
      .substring(0, 24);
    try {
      //Connect to mongodb
      await client.connect();
      const db = client.db(process.env.MONGODB_NAME);
      const userCollection = db.collection("users");

      await userCollection.insertOne({
        _id: new ObjectId(hashedId),
        cognitoUserId: sub,
        name,
        email,
        phoneNumber: phone_number,
        role: "user",
        cart: [],
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      callback(null, event);
    } catch (err) {
      // Log detailed error message for troubleshooting
      console.error("Error during database operation:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal Server Error",
          message: err.message,
        }),
      };
    } finally {
      //Closing the client
      await client.close();
    }
  }
  // Setting context callbackWaitsForEmptyEventLoop to false for better performance
  context.callbackWaitsForEmptyEventLoop = false;
};
