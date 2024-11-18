import { Request, Response } from "express";
import User, { IUser } from "~/models/User";

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
      res.status(404).json({ message: "Unauthorized" });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).send({ error: "Server error" });
  }
};

export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { bio, link, avatar } = req.body;

  try {
    const user: IUser | null = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ message: "Unauthorized" });
      return;
    }

    if (bio !== undefined) user.bio = bio;
    if (link !== undefined) user.link = link;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};
