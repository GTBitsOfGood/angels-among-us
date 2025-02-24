require("dotenv").config({ path: "../.env.local" });

import mongoose from "mongoose";
import dbConnect from "../db/dbConnect";
import UserModel from "../db/models/User";

(async () => {
    await dbConnect();
    try {
        console.log("Adding verifiedByAdmin field to users...");
        const result = await UserModel.updateMany(
            { verifiedByAdmin: { $exists: false } },
            {
                $set: { verifiedByAdmin: true },
            }
        );
        console.log("Done!", result.modifiedCount, "users updated.");
    } catch (e) {
        console.error("Migration failed: ", e);
    } finally {
        mongoose.connection.close();
    }
})();
