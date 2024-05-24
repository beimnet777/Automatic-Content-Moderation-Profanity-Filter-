import { getSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import PostMgt from "../../components/layout/post-management/PostMgt";

export default function managePostsPage() {
  return (
    <Layout title="Manage Posts">
      <PostMgt />
    </Layout>
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
  } else if (session?.user?.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
