"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, request, response, next) => {
    const statusCode = response.statusCode === 200 ? 500 : response.statusCode;
    response.status(statusCode);
    response.json({
        message: error === null || error === void 0 ? void 0 : error.message,
        stack: error === null || error === void 0 ? void 0 : error.stack,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map