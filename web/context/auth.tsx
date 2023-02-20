import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";
import nookies from "nookies";
import { auth } from "../utils/firebase/firebaseClient";
import { trpc } from "../utils/trpc";
import { IUser } from "../utils/types/user";
import { HydratedDocument } from "mongoose";

const AuthContext = createContext<{
  user: typeof auth.currentUser;
  loading: boolean;
  userData: HydratedDocument<IUser> | null;
}>({
  user: null,
  loading: true,
  userData: null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<typeof auth.currentUser>(null);
  const [loading, setLoading] = useState(true);

  const userData = trpc.user.get.useQuery({ uid: user?.uid ?? null })
    .data as HydratedDocument<IUser> | null;

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
        setLoading(false);
        return;
      }

      console.log(`updating token...`);
      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: "/" });
      setLoading(false);
    });
  }, []);

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
    <AuthContext.Provider value={{ user, loading, userData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
