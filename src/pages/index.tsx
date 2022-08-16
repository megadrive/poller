import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data } = trpc.useQuery(["session.get-session"]);
  return (
    <div>
      <Head>
        <title>Poller</title>
      </Head>
      <div>
        <Link href="/create"><a>Create a poll</a></Link>
      </div>
      {!data ? (
        <Link href="/api/auth/signin">
          <button>Log in yo</button>
        </Link>
      ) : (
        <button onClick={() => signOut()}>Log out yo</button>
      )}
    </div>
  );
};

export default Home;
