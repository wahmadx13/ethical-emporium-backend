// imports
import express from "express";
import database from "./config/database";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import dotenv from "dotenv";

//initialize express
const app = express();

//middlewares
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

//connect DB
database();

//Port
const PORT = process.env.PORT || 4000;

//error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
