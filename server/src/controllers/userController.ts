import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    res.send(req.user);
  } catch (error: any) {
    res.status(500).send({ error: "Server error" });
  }
};
