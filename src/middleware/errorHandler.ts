import { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const statusCode = response.statusCode === 200 ? 500 : response.statusCode;
  response.status(statusCode);
  response.json({
    message: error?.message,
    stack: error?.stack,
  });
};

export default errorHandler;
