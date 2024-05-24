import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { hatefulPostsState } from "../../../atoms/social_media_atom";
import { API_BASE_URL, getHeaders } from "../../../utils/constants";
import PageComponentTitle from "../../common/PageComponentTitle";
import Post from "../../Post";
import PostLoading from "../../PostLoading";

const PostMgt = () => {
  const [hatefulPost, setHateFulPosts] = useRecoilState(hatefulPostsState);
  const { data: session } = useSession();
  const [filter, setPostFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timing = setTimeout(async () => {
      const hatefuls = await fetch(
        `${API_BASE_URL}/posts/admin/hateful/${filter}`,
        {
          headers: getHeaders(session?.user?.accessToken),
        }
      ).then((res) => {
        return res.json();
      });

      setHateFulPosts(hatefuls);
      console.log(hatefuls);

      setLoading(false);
    }, 4000);
    return () => clearTimeout(timing);
  });

  return (
    <main className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <PageComponentTitle
          title="Posts"
          titleDescription="Manage hateful posts"
          buttonTitle="Create new Category"
          filter={filter}
          setPostFilter={setPostFilter}
          setLoading={setLoading}
        />
      </div>

      <section className="grid md:grid-cols-1 xl:grid-cols-1 gap-6">
        <div className="pb-72 max-w-[700px]">
          {!loading &&
            hatefulPost.map((post: any) => (
              <Post
                key={post.id}
                id={post.id}
                post={post}
                postPage={undefined}
              />
            ))}

          {loading &&
            Array(8)
              .fill(0)
              .map((item, index) => <PostLoading key={index} />)}
        </div>
      </section>
    </main>
  );
};

export default PostMgt;
