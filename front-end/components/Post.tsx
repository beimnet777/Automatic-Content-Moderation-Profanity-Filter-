import {
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  TrashIcon,
  MicrophoneIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { feedState, hatefulPostsState } from "../atoms/social_media_atom";
import { API_BASE_URL, getHeaders } from "../utils/constants";
import Comment from "./Comment";

function Post({ id, post, postPage, title }: any) {
  const { data: session }: any = useSession();
  const [commentVisible, setCommentVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [feed, setFeed] = useRecoilState(feedState);
  const [hateful, setHateFulPosts] = useRecoilState(hatefulPostsState);
  const router = useRouter();

  const handleLike = async () => {
    const formData = new FormData();
    let status = -1;
    if (post.is_liked === true) {
      const response = await fetch(`${API_BASE_URL}/likes/${post.id}/`, {
        method: "DELETE",
        mode: "cors",
        headers: getHeaders(session.user.accessToken),
        body: formData,
      });

      status = response.status;
    } else {
      const response = await fetch(`${API_BASE_URL}/likes/${post.id}/`, {
        method: "POST",
        mode: "cors",
        headers: getHeaders(session.user.accessToken),
        body: formData,
      });

      status = response.status;
    }

    if (status === 200 || status === 201) {
      const feed = await fetch(
        `${API_BASE_URL}/${title === "My Posts" ? "posts/my/" : "posts"}`,
        {
          headers: getHeaders(session?.user?.accessToken),
        }
      ).then((res) => {
        return res.json();
      });

      setFeed(feed);
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`${API_BASE_URL}/posts/${post.id}/`, {
      method: "DELETE",
      headers: getHeaders(session?.user?.accessToken),
    });

    if (response.status === 200) {
      if (session.user.role === "ADMIN") {
        const hatefuls = await fetch(`${API_BASE_URL}/posts/admin/hateful/`, {
          headers: getHeaders(session?.user?.accessToken),
        }).then((res) => {
          return res.json();
        });

        setHateFulPosts(hatefuls);
      } else {
        const feed = await fetch(
          `${API_BASE_URL}/${title === "My Posts" ? "posts/my/" : "posts"}`,
          {
            headers: getHeaders(session?.user?.accessToken),
          }
        ).then((res) => {
          return res.json();
        });
        setFeed(feed);
      }
    }
  };

  return (
    <div>
      <div
        className=" p-3 flex border-b border-gray-700"
        // onClick={() => router.push(`/${id}`)}
      >
        {!postPage && (
          <img
            src={`${API_BASE_URL}/${post?.user?.image}`}
            alt=""
            className="h-11 w-11 rounded-full mr-4"
          />
        )}
        <div className="flex flex-col space-y-2 w-full">
          <div className={`flex ${!postPage && "justify-between"}`}>
            {postPage && (
              <img
                src={post?.image}
                alt="Profile Pic"
                className="h-11 w-11 rounded-full mr-4"
              />
            )}
            <div className="text-[#6e767d]">
              <div className="inline-block group">
                <h4
                  className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                    !postPage && "inline-block"
                  }`}
                >
                  {post.user?.username}
                </h4>
              </div>
              <span className="hover:underline text-sm sm:text-[15px]">
                (<Moment fromNow>{post.created}</Moment>)
              </span>
              {!postPage && (
                <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                  {post?.content}
                </p>
              )}
            </div>
            <div className="icon group flex-shrink-0 ml-auto">
              <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
            </div>
          </div>
          {postPage && (
            <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.text}</p>
          )}
          {post?.image && (
            <img
              src={`${post?.image}`}
              alt=""
              className="rounded-2xl max-h-[700px] object-cover mr-2"
            />
          )}
          {post?.audio && (
            <audio controls className="w-full mt-2">
              <source src={`${post?.audio}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <div
            className={`text-[#6e767d] flex justify-between w-10/12 ${
              postPage && "mx-auto"
            }`}
          >
            {session.user.role !== "ADMIN" && (
              <div
                className="flex items-center space-x-1 group"
                onClick={(e) => {
                  e.stopPropagation();
                  setCommentVisible(!commentVisible);
                }}
              >
                <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                  <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
                </div>
                {comments.length > 0 && (
                  <span className="group-hover:text-[#1d9bf0] text-sm">
                    {comments.length}
                  </span>
                )}
              </div>
            )}

            {session.user.username === post.user?.username && (
              <div
                className="flex items-center space-x-1 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <div className="icon group-hover:bg-red-600/10">
                  <TrashIcon className="h-5 group-hover:text-red-600" />
                </div>
              </div>
            )}

            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              {session.user.role !== "ADMIN" && (
                <div className="icon group-hover:bg-pink-600/10">
                  {post.is_liked ? (
                    <HeartIconFilled className="h-5 text-pink-600" />
                  ) : (
                    <HeartIcon className="h-5 group-hover:text-pink-600" />
                  )}
                </div>
              )}
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  post.is_liked && "text-pink-600"
                }`}
              ></span>
            </div>
          </div>
        </div>
      </div>
      {commentVisible && <Comment postId={post.id} />}
    </div>
  );
}

export default Post;
