import React from "react";
import { trpc } from "../utils/trpc";
import { useAuth } from "../context/auth";

export default function Test() {
  const { user } = useAuth();
  const userRole = trpc.user.getRole.useQuery({ uid: user?.uid ?? null });

  console.log(userRole.data);

  return <div>Test</div>;
}
