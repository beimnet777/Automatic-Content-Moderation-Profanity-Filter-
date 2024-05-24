import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { feedState } from "../atoms/social_media_atom";
import { API_BASE_URL, getHeaders } from "../utils/constants";
import CommmentList from "./CommentList";

export default function Comment({ postId, title }: any) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [feed, getFeed] = useRecoilState(feedState);
  const { data: session }: any = useSession();

  const commentToPost = async () => {
    if (commentInput === "") {
      return;
    }

    const formData = new FormData();
    formData.append("content", commentInput);
    const response = await fetch(`${API_BASE_URL}/posts/comments/${postId}/`, {
      method: "POST",
      mode: "cors",
      headers: getHeaders(session.user.accessToken),
      body: formData,
    });

    if (response.status === 201) {
      fetch(`${API_BASE_URL}/posts/comments/${postId}/`, {
        headers: getHeaders(session?.user?.accessToken),
      })
        .then((res) => res.json())
        .then((data) => {
          setComments(data);
        });
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/posts/comments/${postId}/`, {
      headers: getHeaders(session?.user?.accessToken),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        console.log(data, "comments");
      });
  }, [feed]);

  return (
    <div className="p-5 border-b w-full border-gray-700">
      <div>
        <div className="flex justify-between w-full">
          <textarea
            id="message"
            value={commentInput}
            onChange={(e: any) => setCommentInput(e.target.value)}
            rows={2}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-blue-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-11 h-11 my-auto ml-2 text-blue-600 cursor-pointer"
            onClick={commentToPost}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </div>
        <CommmentList comments={comments} title={title} />
      </div>
    </div>
  );
}
