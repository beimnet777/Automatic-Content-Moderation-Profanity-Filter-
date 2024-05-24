import { PhotographIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { API_BASE_URL } from "../../utils/constants";

function Signup() {
  const profilePictureRef: any = useRef(null);
  const [selectedPicture, setSelectedPicture]: any = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername]: any = useState("");
  const [password, setPassword]: any = useState("");
  const [email, setEmail]: any = useState("");
  const router = useRouter();

  const addImageToForm = (e: any) => {
    // const reader = new FileReader();
    setSelectedPicture(e.target.files[0]);
  };

  const signup = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", selectedPicture);
    formData.append("email", email);

    setLoading(true);

    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: "POST",
      mode: "cors",
      body: formData,
    });

    setLoading(false);

    if (response.status === 201) {
      return await router.push("/auth/login");
    }

    setEmail("");
    setUsername("");
    setPassword("");
    setSelectedPicture(null);
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="text-3xl font-semibold mb-2 text-center">Sign up</h1>
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="username"
            placeholder="username"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />

          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          {/* <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirm_password"
            placeholder="Confirm Password"
          /> */}

          <div className="flex justify-start">
            <p className="w-full py-4 px-2 text-ellipsis rounded mb-4">
              {" "}
              Profile Picture :{" "}
              {`${!selectedPicture ? "Not Choosen" : selectedPicture.name}`}
            </p>

            <div
              className="icon mt-2"
              onClick={() => profilePictureRef.current.click()}
            >
              <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
              <input
                type="file"
                ref={profilePictureRef}
                hidden
                onChange={addImageToForm}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-center py-3 rounded hover:bg-blue-700 font-bold  bg-blue-500 text-white focus:outline-none my-1"
            onClick={signup}
            disabled={loading}
          >
            Create Account
          </button>

          <div className="text-center text-sm text-grey-dark mt-4">
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href={"/auth/login"}
            >
              Already have account, Login?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
