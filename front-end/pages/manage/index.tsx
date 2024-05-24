import { getSession } from "next-auth/react";
import Dashboard from "../../components/dashboard/Dashboard";
import Layout from "../../components/layout/Layout";

export default function Index() {
  return (
    <Layout title="Manage Platform">
      <Dashboard />
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
