import Account from "../db/models/Account";

async function standardizeEmails() {
  try {
    const result = await Account.updateMany({}, [
      {
        $set: {
          standardizedEmail: { $toLower: "$email" },
        },
      },
    ]);
  } catch (e) {
    console.error(e);
  }
}

export default standardizeEmails;
