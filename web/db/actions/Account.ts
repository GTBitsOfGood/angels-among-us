import { ClientSession, HydratedDocument, UpdateQuery } from "mongoose";
import Account from "../models/Account";
import { IAccount } from "../../utils/types/account";

/**
 * Finds account document by unique email.
 *
 * @param email account email used for indexing
 * @param session MongoDB session used for transactions
 * @returns pruned document (without _id, __v) if successful, null otherwise
 */
async function findAccount(
  email: string,
  session?: ClientSession
): Promise<HydratedDocument<IAccount> | null> {
  try {
    return await Account.findOne(
      { email },
      { _id: 0, __v: 0 },
      { session: session }
    );
  } catch (e) {
    return null;
  }
}

/**
 * Deletes account documents matching an array of emails.
 *
 * @param emails array of emails
 * @param session MongoDB session used for transactions
 * @returns object with key `deletedCount` containing the number of documents deleted
 */
async function removeAllAccounts(emails: string[], session?: ClientSession) {
  return await Account.deleteMany(
    { email: { $in: emails } },
    { session: session }
  );
}

/**
 * Updates account document according to provided model fields.
 *
 * @param email account email used for indexing
 * @param update updated model fields
 * @param session MongoDB session used for transactions
 * @returns pruned document (without _id, __v) before update was applied
 */
async function updateAccount(
  email: string,
  update: UpdateQuery<IAccount>,
  session?: ClientSession
) {
  return await Account.findOneAndUpdate({ email }, update, {
    session: session,
    returnDocument: "before",
    projection: {
      _id: 0,
      __v: 0,
    },
  });
}

/**
 * Adds account according to provided model fields.
 *
 * @param inputData model fields
 * @param session MongoDB session used for transactions
 * @returns added document (pruned without _id, __v) or null if creation fails
 */
async function addAccount(
  inputData: IAccount,
  session?: ClientSession
): Promise<IAccount | null> {
  try {
    const document = new Account(inputData);
    const {
      _doc: { _id, __v, ...accountDoc },
    } = await document.save({ session: session });
    return accountDoc;
  } catch (e) {
    return null;
  }
}

/**
 * Retrieves all account documents.
 *
 * @param session MongoDB session used for transactions
 * @returns all account documents, pruned (no _id, __v) or empty array [] on failure
 */
async function findAll(
  session?: ClientSession
): Promise<HydratedDocument<IAccount>[]> {
  try {
    return await Account.find({}, { _id: 0, __v: 0 });
  } catch (e) {
    return [];
  }
}

/**
 * Finds account by search term using regex
 *
 * @param searchSubject string in regex
 * @param session MongoDB session used for transactions
 * @returns all account documents, pruned (no _id, __v) or empty array [] on failure
 */
async function searchAccounts(
  searchSubject: string,
  session?: ClientSession
): Promise<Array<HydratedDocument<IAccount>>> {
  try {
    const regexTerm = new RegExp(`.*${searchSubject}.*`, "i");
    const accounts = await Account.find(
      { email: regexTerm },
      { _id: 0, __v: 0 },
      { session: session }
    );
    return accounts ?? [];
  } catch (e) {
    return [];
  }
}

export {
  findAccount,
  addAccount,
  removeAllAccounts,
  updateAccount,
  findAll,
  searchAccounts,
};
