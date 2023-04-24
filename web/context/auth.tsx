import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import nookies from "nookies";
import { auth } from "../utils/firebase/firebaseClient";
import { trpc } from "../utils/trpc";
import { IUser } from "../utils/types/user";
import { HydratedDocument } from "mongoose";
import { signOut } from "firebase/auth";
import { UseQueryResult } from "@tanstack/react-query/build/lib/types";

const AuthContext = createContext<{
  authorized: boolean;
  user: typeof auth.currentUser;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>> | null;
  userData: HydratedDocument<IUser> | null;
}>({
  authorized: false,
  user: null,
  loading: true,
  setLoading: null,
  userData: null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<typeof auth.currentUser>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
    refetch: refetchUser,
  } = trpc.user.get.useQuery({
    uid: user?.uid ?? null,
  }) as {
    data: HydratedDocument<IUser> | null;
    isLoading: boolean;
    isError: boolean;
    refetch: (options?: {
      throwOnError: boolean;
      cancelRefetch: boolean;
    }) => Promise<UseQueryResult>;
  };

  const {
    data: accountData,
    isLoading: accountIsLoading,
    isError: accountIsError,
  } = trpc.account.get.useQuery({
    email: user?.email ?? null,
  });

  const createUserMutation = trpc.user.add.useMutation({
    onSuccess: () => refetchUser(),
  });
  const disableStatusMutation = trpc.user.disableStatus.useMutation({
    onSuccess: () => refetchUser(),
  });
  const roleStatusMutation = trpc.user.modifyRoleEnableStatus.useMutation({
    onSuccess: () => refetchUser(),
  });

  useEffect(() => {
    setLoading(true);
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies;
    }
    return auth.onIdTokenChanged(async (user) => {
      console.log(`token changed!`);
      if (!user) {
        console.log(`no token found...`);
        setUser(null);
        nookies.destroy(null, "token");
        nookies.set(null, "token", "", { path: "/" });
        setAuthorized(false);
        setLoading(false);
        return;
      }

      console.log(`updating token...`);
      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: "/" });
    });
  }, []);

  useEffect(() => {
    if (accountIsLoading || userIsLoading) return;
    if (accountIsError || userIsError) {
      signOut(auth);
      return;
    }
    if (userData !== null) {
      if (accountData.role !== null) {
        // Subsequent signin, authorized account
        roleStatusMutation.mutate({
          uid: user!.uid,
          role: accountData.role,
        });
        setAuthorized(true);
      } else {
        // Subsequent signin, unauthorized account
        disableStatusMutation.mutate({
          uid: user!.uid,
        });
      }
    } else if (accountData.role !== null) {
      // First-time signin, authorized account
      createUserMutation.mutate({
        email: user!.email!,
        uid: user!.uid,
        name: user!.displayName!,
        role: accountData.role,
      });
      setAuthorized(true);
    } else {
      // First-time signin, unauthorized account, do nothing
      signOut(auth);
    }
    setLoading(false);
  }, [accountData, userData]);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      setLoading(true);
      console.log(`refreshing token...`);
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
      setLoading(false);
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setLoading, authorized, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
