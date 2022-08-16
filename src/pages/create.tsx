import type { GetServerSideProps, NextPage } from "next";
import {
  Session,
  unstable_getServerSession as getServerSession,
} from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";

interface CreatePollProps {
  session?: Session | null;
}

interface FormValues {
  title: string;
  choice1: string;
  choice2: string;
}

const FormSchema = z
  .object({
    title: z.string().min(3, "Must be at least 3 characters"),
    choice1: z.string().min(1, "Enter something."),
    choice2: z.string().min(1, "Enter something."),
  })
  .required();

const textInputStyle =
  "border-gray-300 border rounded-xl text-lg px-2 py-1 active:border-gray-700 my-2";

const CreatePoll: NextPage<CreatePollProps> = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const createPoll = trpc.useMutation(["poll.create-poll"]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // create the pooll bro
    await createPoll.mutateAsync({
      title: data.title,
      choice1: data.choice1,
      choice2: data.choice2,
    });
  };

  return (
    <main className="container mx-auto min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-extrabold font-sans white">
        Create a poll!
      </h1>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="text-xl text-right">Title of poll</div>
            <div>
              <div className="text-red-500">{errors.title?.message ?? ""}</div>
              <input className={textInputStyle} {...register("title")} />
            </div>
          </div>
          <div>
            <div className="text-xl text-right">Choices</div>
            <div>
              <div className="text-red-500">
                {errors.choice1?.message ?? ""}
              </div>
              <input className={textInputStyle} {...register("choice1")} />
            </div>
            <div>
              <div className="text-red-500">
                {errors.choice2?.message ?? ""}
              </div>
              <input className={textInputStyle} {...register("choice2")} />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={createPoll.isLoading}
              className="rounded-full bg-blue-300 font-boldest w-full h-12"
            >
              {!createPoll.isLoading ? "Create poll" : "Creating.."}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<CreatePollProps> = async ({
  req,
  res,
}) => {
  const session = await getServerSession(req, res, authOptions);
  return { props: { session } };
};

export default CreatePoll;
