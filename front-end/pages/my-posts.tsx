import Head from "next/head";
import Feed from "../components/Feed";
import SideBar from "../components/SideBar";
import RightSideBar from "../components/RightSideBar";
import { getSession } from "next-auth/react";

export default function MyPosts() {
  return (
    <div className="">
      <Head>
        <title>No Hate Speech</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <SideBar />
        <Feed title="My Posts" />
        <RightSideBar />
      </main>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
