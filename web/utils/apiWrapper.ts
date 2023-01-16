import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

type Methods = "GET" | "PUT" | "PATCH" | "POST" | "DELETE";

type RouteOptions = {
  config?: {};
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
};

type RouteMethods = {
  GET?: RouteOptions;
  PUT?: RouteOptions;
  PATCH?: RouteOptions;
  POST?: RouteOptions;
  DELETE?: RouteOptions;
};

// const corsWrapper = (methods: Methods) => {
//   return Cors({ methods, origin: "*" });
// };

// const runMiddleware = (
//   req: NextApiRequest,
//   res: NextApiResponse,
//   fn: Function
// ) => {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: any) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// };

const apiWrapper = (routeMethods: RouteMethods) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    const route = routeMethods[method as Methods];

    if (!method || !route) {
      return res.status(400).json({
        success: false,
        message: method ? "Not a specified route." : "Missing request method.",
      });
    }

    const { config, handler } = route;

    return await handler(req, res);
    // await runMiddleware(
    //   req,
    //   res,
    //   corsWrapper(Object.keys(routeConfig) as Methods)
    // );
  };
};

export default apiWrapper;
