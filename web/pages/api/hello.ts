// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import apiWrapper from "../../utils/apiWrapper";

const getHello = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({
    name: "joe",
  });
};

export default apiWrapper({
  GET: {
    handler: getHello,
  },
});
