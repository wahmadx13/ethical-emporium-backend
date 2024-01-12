import mongoose from "mongoose";

const database = async () => {
  try {
    const mongodbURL = process.env.MONGODB_URL;
    if (!mongodbURL) throw new Error("MongoDB connection is not defined");

    const connect = await mongoose.connect(mongodbURL);
    console.log("Database connected successfully");
    mongoose.connection.on("connect", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      throw new Error(`MongoDb COnnection error: ${err}`);
    });
  } catch (err) {
    throw new Error(`MongoDb Connection error: ${err}`);
  }
};

export default database;
