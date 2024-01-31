"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = __importDefault(require("./config/database"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const awsAmplifyUserConfig_1 = __importDefault(require("./config/awsAmplifyUserConfig"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const blogCategoryRoutes_1 = __importDefault(require("./routes/blogCategoryRoutes"));
const brandRoutes_1 = __importDefault(require("./routes/brandRoutes"));
const productCategoryRoutes_1 = __importDefault(require("./routes/productCategoryRoutes"));
const colorRoutes_1 = __importDefault(require("./routes/colorRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const enquiryRoutes_1 = __importDefault(require("./routes/enquiryRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
//initialize express
const app = (0, express_1.default)();
//middlewares
dotenv_1.default.config();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
//AWS Amplify configuration
(0, awsAmplifyUserConfig_1.default)();
//connect DB
(0, database_1.default)();
//Port
const PORT = process.env.PORT || 4000;
//routes
app.use("/api/user", authRoutes_1.default);
app.use("/api/product", productRoutes_1.default);
app.use("/api/blog", blogRoutes_1.default);
app.use("/api/blog-category", blogCategoryRoutes_1.default);
app.use("/api/brand", brandRoutes_1.default);
app.use("/api/product-category", productCategoryRoutes_1.default);
app.use("/api/color", colorRoutes_1.default);
app.use("/api/coupon", couponRoutes_1.default);
app.use("/api/enquiry", enquiryRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
//error handlers
app.use(notFound_1.default);
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
