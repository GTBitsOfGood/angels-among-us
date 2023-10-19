declare var global: any;

import mongoose, { ConnectOptions } from "mongoose";
import { searchUsers, SearchUsersParams } from "../../../db/actions/User";
import { randomUsers } from "../../../db/actions/__mocks__/User";
import User from "../../../db/models/User";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Size,
  Status,
  Temperament,
  Medical,
} from "../../../utils/types/post";
import { Role } from "../../../utils/types/account";

/**
 * Tests db actions. Uses an in-memory database to mimic real db.
 *
 * @group db/User
 * @group db
 * @group unit
 */
describe("[DB] User - Unit Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true } as ConnectOptions,
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.insertMany(randomUsers);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("searchUsers", () => {
    test("happy", async () => {
      const searchParams: SearchUsersParams = {
        type: [FosterType.OwnerSurrender],
        size: [Size.M],
      };
      const data = await searchUsers(searchParams);

      const expected = randomUsers
        .filter(
          (user) =>
            user.type?.includes(FosterType.OwnerSurrender) &&
            user.size?.includes(Size.M)
        )
        .map(({ _id, ...user }) => user);

      expect(data!.length).toBe(expected.length);
      expect(data).toMatchObject(expected);
    });
    test("empty array", async () => {
      const searchParams: SearchUsersParams = {
        type: [FosterType.Return],
        size: [],
      };
      const data = await searchUsers(searchParams);

      const expected = randomUsers
        .filter((user) => user.type?.includes(FosterType.Return))
        .map(({ _id, ...user }) => user);

      expect(data!.length).toBe(expected.length);
      expect(data).toMatchObject(expected);
    });
  });
});
