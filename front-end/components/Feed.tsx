import { SparklesIcon } from "@heroicons/react/outline";
import Input from "./Input";
import Post from "./Post";
import { useSession } from "next-auth/react";
import { API_BASE_URL, getHeaders } from "../utils/constants";
import { useRecoilState } from "recoil";
import { feedState } from "../atoms/social_media_atom";
import { useEffect, useState } from "react";
import PostLoading from "./PostLoading";
function Feed({ title }: any) {
  const { data: session } = useSession();
  const [posts, setFeed] = useRecoilState(feedState);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) {
      return;
    }
    const fetchFeed = async () => {
      const feed = await fetch(
        `${API_BASE_URL}/${title === "My Posts" ? "posts/my/" : "posts/"}`,
        {
          headers: getHeaders(session?.user?.accessToken),
        }
      ).then((res) => {
        return res.json();
      });
      setFeed(feed);
      setLoading(false);
    };

    const timing = setTimeout(() => fetchFeed(), 2000);
    return () => clearTimeout(timing);
  }, []);
  console.log(posts);
  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold"> {title}</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>

      <Input />
      <div className="pb-72">
        {!loading &&
          posts.map((post: any) => (
            <Post
              key={post.id}
              id={post.id}
              post={post}
              postPage={undefined}
              title={title}
            />
          ))}
        {loading &&
          Array(5)
            .fill(0)
            .map((item, index) => <PostLoading key={index} />)}
      </div>
    </div>
  );
}
export default Feed;
