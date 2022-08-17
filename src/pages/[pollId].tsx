import type { GetServerSideProps, NextPage } from "next";
import {
  Session,
  unstable_getServerSession as getServerSession,
} from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

interface DisplayPollProps {
  session?: Session | null;
  query?: string;
}
const DisplayPoll: NextPage<DisplayPollProps> = () => {
  const router = useRouter();
  let { pollId } = router.query;
  if (Array.isArray(pollId)) {
    pollId = pollId[0];
  }
  if (!pollId) {
    router.push("/");
    return <>Redirecting..</>;
  }
  const { data: poll, error } = trpc.useQuery([
    "poll.get-poll",
    {
      id: pollId,
    },
  ]);
  const setVote = trpc.useMutation(["poll.set-vote"]);
  if (error && error.data) {
    switch (error.data?.code) {
      case "NOT_FOUND":
        router.push("/");
        break;
      default:
        router.push("/");
    }
  }

  const [userVote, setUserVote] = useState<string>();
  return (
    <main className="container mx-auto min-h-screen flex flex-col justify-center items-center">
      <Head>
        <title>{poll?.title ?? "Loading poll.."}</title>
      </Head>
      {poll ? (
        <>
          <h1 className="text-5xl font-extrabold font-sans white">
            {poll.title}
          </h1>
          <div className="w-1/3">
            <div className="flex justify-center items-center">
              {poll.choices.map((choice) => (
                <div
                  key={choice.id}
                  onClick={() => setUserVote(choice.id)}
                  className="w-1/2 h-36"
                >
                  {choice.text}. Votes: {poll.responses[choice.id]}
                </div>
              ))}
            </div>
            {/* <div>
              <button
                type="submit"
                disabled={setVote.isLoading}
                className="rounded-full bg-blue-300 font-boldest w-full h-12"
              >
                {!setVote.isLoading ? "Vote!" : "Voting.."}
              </button>
            </div> */}
          </div>
        </>
      ) : (
        "test"
      )}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<DisplayPollProps> = async ({
  req,
  res,
}) => {
  const session = await getServerSession(req, res, authOptions);
  return { props: { session, query: req.url } };
};

export default DisplayPoll;
