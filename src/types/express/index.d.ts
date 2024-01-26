import express from "express";
import { DocumentType } from "@typegoose/typegoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel, User } from "../../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: DocumentType<UserModel>;
    }
  }
  interface DecodedToken extends JwtPayload {
    id: string;
  }
}
