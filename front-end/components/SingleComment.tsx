import { TrashIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { feedState } from "../atoms/social_media_atom";
import { API_BASE_URL, getHeaders } from "../utils/constants";

export default function SingleComment({ comment, title }: any) {
  const { data: session }: any = useSession();
  const [feed, setFeed]: any = useRecoilState(feedState);

  const deleteComment = async () => {
    const response = await fetch(`${API_BASE_URL}/comments/${comment.id}/`, {
      method: "DELETE",
      mode: "cors",
      headers: getHeaders(session.user.accessToken),
    });

    if (response.status === 200) {
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

  return (
    <div className="pt-6">
      <div className="media text-white flex pb-4 flex-wrap">
        <a className="mr-4" href="#">
          <img
            className="rounded-full max-w-none w-12 h-12"
            src={`${API_BASE_URL}/${comment.user.image}`}
          />
        </a>
        <div className="media-body">
          <div>
            <a className="inline-block text-white font-bold mr-2">
              @{comment.user.username}
            </a>
            <span className="text-white dark:text-slate-300">
              (<Moment fromNow>{comment.created}</Moment>)
            </span>
          </div>
          <p>{comment.content}</p>
        </div>
        {comment.user.username === session.user.username && (
          <TrashIcon
            onClick={deleteComment}
            className="text-red-600 w-[22px] h-[22px] mx-auto cursor-pointer"
          />
        )}
      </div>

      {/* <div className="w-full">
      <a
        href="#"
        className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75"
      >
        Show more comments
      </a>
    </div> */}
    </div>
  );
}
