import ContentLoader from "react-content-loader";

function PostLoading() {
  return (
    <ContentLoader
      speed={2}
      viewBox="0 0 400 160"
      backgroundColor="white"
      foregroundColor="gray"
      className="px-6 py-2"
    >
      <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
      <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
      <rect x="0" y="56" rx="3" ry="3" width="410" height="10" />
      <rect x="0" y="72" rx="3" ry="3" width="380" height="10" />
      <rect x="0" y="88" rx="3" ry="3" width="178" height="10" />
      <circle cx="20" cy="20" r="20" />
      <rect x="0" y="110" rx="5" ry="5" width="540" height="450" />
    </ContentLoader>
  );
}

export default PostLoading;
