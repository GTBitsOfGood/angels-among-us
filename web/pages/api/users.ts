import mongoose from "mongoose";
import { env } from "process";
import { consts } from "../../utils/consts";
import dbConnect from "../../db/dbConnect";
import User from "../../db/models/User";

export default async function handler(req: Request, res: Response) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const providerData = req.body.providerData[0];
      const userData = {
        uid: providerData.uid,
        name: providerData.displayName,
        email: providerData.email,
      };
      const user = await User.create(userData);
      return res.status(201).json({ success: true, data: user });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }
}
