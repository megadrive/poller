import type { GetServerSideProps, NextPage } from "next";
import {
  Session,
  unstable_getServerSession as getServerSession,
} from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

interface DisplayPollProps {
  session?: Session | null;
}
const DisplayPoll: NextPage<DisplayPollProps> = () => {
  return <>Poll!</>;
};

export const getServerSideProps: GetServerSideProps<DisplayPollProps> = async ({
  req,
  res,
}) => {
  const session = await getServerSession(req, res, authOptions);
  return { props: { session } };
};

export default DisplayPoll;
