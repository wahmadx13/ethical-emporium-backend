// imports
import express from "express";
import { Amplify } from "aws-amplify";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import database from "./config/database";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import userAmplifyConfiguration from "./config/awsAmplifyUserConfig";

import authRouter from "./routes/authRoutes";
import productRouter from "./routes/productRoutes";

//initialize express
const app = express();

//middlewares
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

//AWS Amplify configuration
userAmplifyConfiguration();

//connect DB
database();

//Port
const PORT = process.env.PORT || 4000;

//routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);

//error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
