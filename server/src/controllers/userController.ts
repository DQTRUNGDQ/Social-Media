import { Request, Response } from "express";
import User from "~/models/User";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).send({ error: "Server error" });
  }
};
