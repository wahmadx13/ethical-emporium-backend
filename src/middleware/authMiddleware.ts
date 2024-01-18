import { Request, Response } from "express";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import expressAsyncHandler from "express-async-handler";

//Get current Authenticated User
export const currentAuthenticatedUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { username, userId, signInDetails } = await getCurrentUser();
    response.json({ username, userId, signInDetails });
  }
);

//Retrieve A User Session
export const currentUserSession = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const { accessToken, idToken } = (await fetchAuthSession())?.tokens ?? {};
    response.json({ accessToken, idToken });
  }
);

//Refreshing Sessions
export const refreshSession = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const { tokens } = await fetchAuthSession({ forceRefresh: true });
    response.json({ tokens });
  }
);
