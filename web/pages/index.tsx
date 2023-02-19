import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import Head from "next/head";
import { auth } from "../utils/firebase/firebaseClient";
import { trpc } from "../utils/trpc";
import { useAuth } from "../context/auth";
import { mongo } from "mongoose";

export default function Home() {
  async function handleLogin() {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // console.log("result", result);
    const user = result.user;
    // console.log("user", user);

    fetch("/api/users", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(user), // body data type must match "Content-Type" header
    });

    // await signInWithPopup(auth, provider).then(async (result) => {
    //   console.log("result", result);
    //   const user = new User(result.user);
    //   console.log("user", user);
    //   const credential = FacebookAuthProvider.credentialFromResult(result);
    //   const accessToken = credential?.accessToken;

    //   const duplicate = await User.findOne({
    //     uid: user.uid
    //   });
    // });
  }

  const { user } = useAuth();
  console.log("useAuth", user);

  // const listPosts = trpc.post.list.useQuery();
  // console.log(listPosts.data);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <button onClick={handleLogin}>Login</button>
        </div>
      </main>
    </>
  );
}
