const { connect } = require("http2");
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event, context, callback) => {
  const { request } = event;

  //Handle pre sign up event
  if (request.userAttributes) {
    const { sub, email, phone_number, name } = request.userAttributes;
    console.log("user Attributes", request.userAttributes);
    try {
      //Connect to mongodb
      await client.connect();
      const db = client.db(process.env.MONGODB_NAME);
      const userCollection = db.collection("users");

      console.log("%%% userCollection", userCollection);

      // Check if user already exists in Mongodb
      const existingUser = await userCollection.findOne({ email });
      console.log("existing", existingUser);
      // User does not exist; insert one into mongodb
      if (!existingUser) {
        console.log("Adding User");

        await userCollection.insertOne({
          _id: new ObjectId(sub),
          cognitoUserId: sub,
          name,
          email,
          phoneNumber: phone_number,
        });
        console.log("User created");
      }
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
  context.callbackWaitsForEmptyEventLoop = false;
};
