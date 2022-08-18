import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { TailSpin } from "react-loading-icons";
import { trpc } from "../../utils/trpc";

interface DisplayPollResultsProps {
  query?: string;
}

const DisplayResultPoll: NextPage<DisplayPollResultsProps> = () => {
  const router = useRouter();
  const { pollId } = router.query;
  let pId = typeof pollId === "string" ? pollId : "";
  const {
    data: poll,
    error,
    refetch,
  } = trpc.useQuery([
    "poll.get-poll",
    {
      id: pId,
    },
  ]);

  const expired = poll && poll?.expires.valueOf() < Date.now();
  const [pollingIntervalId, setPollingIntervalId] =
    useState<ReturnType<typeof setInterval>>();

  if (!expired && !pollingIntervalId) {
    setPollingIntervalId(
      setInterval(() => {
        refetch({
          queryKey: ["poll.get-poll"],
        });
      }, 5000)
    );
  }
  if (expired && pollingIntervalId) {
    clearInterval(pollingIntervalId);
    setPollingIntervalId(undefined);
  }
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
          <div>
            <div className="flex flex-row justify-center items-center w-full">
              {poll.choices.map((choice) => (
                <div key={choice.id} className={`w-1/2 h-36 flex-grow `}>
                  {choice.text}. Votes: {poll.responses[choice.id]}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <TailSpin fill="black" />
      )}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<
  DisplayPollResultsProps
> = async ({ req }) => {
  return { props: {} };
};

export default DisplayResultPoll;
