import { profile } from "console";
import { getSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { API_BASE_URL, getHeaders } from "../../utils/constants";

function Login() {
  const [username, setUsername]: any = useState("");
  const [password, setPassword]: any = useState("");

  const router = useRouter();

  const login = async () => {
    const response = await fetch(`${API_BASE_URL}/api/token/`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const resJson: any = await response.json();

    if (response.status !== 200) {
      router.query.error = "invalid-credential";
      router.push(router);
      return;
    }

    console.log(resJson, "fjsdklfjdskl");

    const profile_response = await fetch(`${API_BASE_URL}/profile/`, {
      method: "GET",
      mode: "cors",
      headers: getHeaders(resJson.access),
    });

    const profile: any = await profile_response.json();

    console.log(profile);

    const res = await signIn("credentials", {
      username: profile.username,
      email: profile.email,
      image: profile.image,
      accessToken: resJson.access,
      role: profile.role,
      redirect: false,
    });
    if (res?.status == 200) {
      const session = await getSession();
      console.log(session);
      const user = session?.user;
      console.log(user, "user");
      if (user!.role === "ADMIN") {
        await router.push("/manage");
      } else {
        await router.push("/");
      }
      setUsername("");
      setPassword("");
    } else {
      router.query.error = "invalid-credential";
      router.push(router);
    }
  };

  return (
    <div className="flex flex-col items-center pt-48">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-3xl font-semibold mb-2 text-center">Sign in</h1>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              value={username}
              type="text"
              placeholder="Username"
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            {/* <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p> */}
            {router.query.error !== undefined && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative"
                role="alert"
              >
                <span className="block">Invalid username or password</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={login}
            >
              Sign In
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-600"
              href={"/auth/signup"}
            >
              Signup?
            </Link>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2023 All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    if (session?.user?.role !== "ADMIN") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/manage",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}
