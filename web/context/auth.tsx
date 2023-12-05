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
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { Pages } from "../utils/consts";
import { QueryObserverResult } from "@tanstack/react-query";
import { IUser } from "../utils/types/user";

const AuthContext = createContext<{
  authorized: boolean;
  user: typeof auth.currentUser;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>> | null;
  authError: string | null;
  userData: IUser | null;
  refetchUserData: (() => Promise<QueryObserverResult<any>>) | null;
}>({
  authorized: false,
  user: null,
  loading: true,
  setLoading: null,
  authError: null,
  userData: null,
  refetchUserData: null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<typeof auth.currentUser>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data, refetch, error, isInitialLoading } = trpc.auth.signIn.useQuery(
    undefined,
    {
      enabled: !!user,
      retry: 1,
    }
  );

  useEffect(() => {
    if (error?.data?.code === "UNAUTHORIZED") {
      // Refreshing token
      const user = auth.currentUser;
      if (user) {
        user.getIdToken(true);
      }
    }
  }, [error]);

  useEffect(() => {
    setLoading(true);
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies;
    }
    return auth.onIdTokenChanged(async (user) => {
      // Token changed
      if (!user) {
        // No token found
        setUser(null);
        nookies.destroy(null, "token");
        nookies.set(null, "token", "", { path: "/" });
        setLoading(false);
        return;
      }

      // Updating token
      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: "/" });

      const newSignIn = await refetch();
      if (newSignIn.isError) {
        // Not authorized
        await signOut(auth);
      } else if (!newSignIn.data!.hasCompletedOnboarding) {
        router.replace(Pages.ONBOARDING);
      }
      setLoading(false);
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      // Refreshing token
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || isInitialLoading,
        setLoading,
        authError: error?.message ?? null,
        authorized: !!user && (data?.authorized ?? false),
        userData: user ? data?.user ?? null : null,
        refetchUserData: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
