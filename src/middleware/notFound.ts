import { Request, Response, NextFunction } from "express";

const notFound = (request: Request, response: Response, next: NextFunction) => {
  const error = new Error(`Not Found: ${request.originalUrl}`);
  response.status(404);
  next(error);
};

export default notFound;
