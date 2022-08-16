import type { GetServerSideProps, NextPage } from "next";
import {
  Session,
  unstable_getServerSession as getServerSession,
} from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

interface CreatePollProps {
  session?: Session | null;
}

const CreatePoll: NextPage<CreatePollProps> = () => {
  return <div>Create poll</div>;
};

export const getServerSideProps: GetServerSideProps<CreatePollProps> = async ({
  req,
  res,
}) => {
  const session = await getServerSession(req, res, authOptions);
  return { props: { session } };
};

export default CreatePoll;
