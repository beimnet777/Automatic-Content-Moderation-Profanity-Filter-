import SingleComment from "./SingleComment";

export default function CommmentList({ comments, title }: any) {
  return (
    <div className="ml-10 min-w-full">
      {comments.map((comment: any) => (
        <SingleComment comment={comment} title={title} key={comment.id} />
      ))}
    </div>
  );
}
