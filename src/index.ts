import express from "express";
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
import blogRouter from "./routes/blogRoutes";
import blogCategoryRouter from "./routes/blogCategoryRoutes";
import brandRouter from "./routes/brandRoutes";
import productCategoryRouter from "./routes/productCategoryRoutes";
import colorRouter from "./routes/colorRoutes";
import couponRouter from "./routes/couponRoutes";
import enquiryRouter from "./routes/enquiryRoutes";
import userRouter from "./routes/userRoutes";

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
app.use("/api/blog", blogRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product-category", productCategoryRouter);
app.use("/api/color", colorRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/user", userRouter);

//error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, (): void => {
  console.log(`Server is running at port ${PORT}`);
});
