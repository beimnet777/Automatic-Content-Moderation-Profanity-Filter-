import { getSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import ManageUsers from "../../components/user-management/ManageUsers";

export default function manageUserPage() {
  return (
    <Layout title="Manage Users">
      <ManageUsers />
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
