import User from "../models/User";

async function updateUserAccess(email: string, admin: boolean) {
  return await User.updateOne(
    { email: email },
    { $set: { admin: admin, disabled: false } }
  );
}

export { updateUserAccess };
