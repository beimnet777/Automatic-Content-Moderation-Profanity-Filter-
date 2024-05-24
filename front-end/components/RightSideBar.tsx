import { SearchIcon } from "@heroicons/react/outline";
import { UserIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import { useRecoilState } from "recoil";
import { followResultsState } from "../atoms/social_media_atom";
import { API_BASE_URL, getHeaders } from "../utils/constants";

export default function RightSideBar() {
  const [loading, setLoading] = useState(true);
  const [expand, setExpand] = useState(false);
  const [followResults, setFollowResults] = useRecoilState(followResultsState);
  const { data: session } = useSession();

  // useEffect(() => {
  //   const timing = setTimeout(async () => {
  //     const res = await fetch(`${API_BASE_URL}/users/all`, {
  //       headers: getHeaders(session?.user?.accessToken),
  //     }).then((res) => {
  //       return res.json();
  //     });
  //     setFollowResults(res);
  //     console.log(followResults, "follleorjsfdk");
  //     setLoading(false);
  //   }, 2000);
  //   return () => clearInterval(timing);
  // });

  const followUser = async (id: any) => {
    const res = await fetch(`${API_BASE_URL}/users/follow/${id}/`, {
      method: "POST",
      headers: getHeaders(session?.user?.accessToken),
    });

    if (res.status !== 201) {
      return;
    }

    const res1 = await fetch(`${API_BASE_URL}/users/all`, {
      headers: getHeaders(session?.user?.accessToken),
    }).then((res) => {
      return res.json();
    });
    setFollowResults(res1);
  };

  const unFollowUser = async (id: any) => {
    const res = await fetch(`${API_BASE_URL}/users/follow/${id}/`, {
      method: "DELETE",
      headers: getHeaders(session?.user?.accessToken),
    });

    if (res.status !== 200) {
      return;
    }

    const res1 = await fetch(`${API_BASE_URL}/users/all`, {
      headers: getHeaders(session?.user?.accessToken),
    }).then((res) => {
      return res.json();
    });
    setFollowResults(res1);
  };

  return (
    <div className="hidden lg:inline ml-8 xl:min-w-[350px] py-1 space-y-5">
      <div className="sticky top-0 py-1.5 bg-black z-50 w-11/12 xl:w-9/12">
        <div className="flex items-center bg-[#202327] p-3 rounded-full relative">
          <SearchIcon className="text-gray-500 h-5 z-50" />
          <input
            type="text"
            className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 pl-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
            placeholder="Search Posts"
          />
        </div>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        {!loading &&
          (expand ? followResults : followResults.slice(0, 3)).map(
            (result: any, index: any) => (
              <div
                className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center"
                key={index}
              >
                {result.image !== null && result.image !== undefined && (
                  <img
                    src={`${API_BASE_URL}${result.image}/`}
                    width={50}
                    height={50}
                    className="rounded-full"
                    alt={""}
                  />
                )}
                {(result.image === null || result.image === undefined) && (
                  <UserIcon width={25} height={25} />
                )}
                <div className="ml-4 leading-5 group">
                  <h4 className="font-bold group-hover:underline">
                    {result.username}
                  </h4>
                  <h5 className="text-gray-500 text-[15px]">{result.tag}</h5>
                </div>
                <button
                  onClick={() => {
                    if (result.is_followed) {
                      return unFollowUser(result.id);
                    }
                    return followUser(result.id);
                  }}
                  className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5"
                >
                  {!result.is_followed && "Follow"}
                  {result.is_followed && "Unfollow"}
                </button>
              </div>
            )
          )}

        {loading &&
          Array(3)
            .fill(0)
            .map(() => (
              <ContentLoader viewBox="0 0 462 50">
                <rect x="30" y="16" rx="10" ry="10" width="80" height="60" />
                <rect x="135" y="16" rx="5" ry="5" width="190" height="20" />
                <rect x="135" y="40" rx="5" ry="5" width="40" height="20" />
                <rect x="350" y="16" rx="5" ry="5" width="80" height="60" />
              </ContentLoader>
            ))}
        {followResults.length > 3 && !expand && (
          <button
            onClick={() => setExpand(true)}
            className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light"
          >
            Show more
          </button>
        )}
        {!loading && expand && (
          <button
            onClick={() => setExpand(false)}
            className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light"
          >
            Collapse
          </button>
        )}
      </div>
    </div>
  );
}
