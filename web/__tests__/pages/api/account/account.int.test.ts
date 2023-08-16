// import { createContextInner } from "../../../server/context";
import Account from "../../../../db/models/Account";
import { createContextInner } from "../../../../server/context";
import { appRouter } from "../../../../server/routers/_app";

// jest.mock("../../../server/context");
// jest.mock("../../../server/routers/_app");

// const mockSession = jest.fn().mockReturnValue();

/**
 * Tests account API endpoints and integration with db. DB actions hit an
 * in-memory MongoDB database.
 *
 * @group api/account
 * @group api
 * @group unit
 */
describe("[API] Account - Integration Test", async () => {
  const context = await createContextInner();
  const caller = appRouter.createCaller(context);

  test("account.getAll", async () => {});
});
