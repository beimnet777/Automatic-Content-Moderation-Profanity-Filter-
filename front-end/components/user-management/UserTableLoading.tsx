import { Fragment } from "react";
import ContentLoader from "react-content-loader";

export default function UserTableLoading({ rowHeight, rows }: any) {
  return (
    <ContentLoader
      backgroundColor="white"
      foregroundColor="gray"
      viewBox={`0 0 1500 ${rowHeight * rows}`}
    >
      {new Array(rows).fill(" ").map((el, index) => {
        const contentVerticalPosition = (contentHeight: any) =>
          rows > 1 ? contentHeight + rowHeight * index : contentHeight;
        return (
          <Fragment key={index}>
            <rect
              x="20"
              y={`${contentVerticalPosition(20)}`}
              rx="4"
              ry="4"
              width="40"
              height="20"
            />
            <rect
              x="100"
              y={`${contentVerticalPosition(20)}`}
              rx="10"
              ry="4"
              width="600"
              height="20"
            />
            <rect
              x="750"
              y={`${contentVerticalPosition(20)}`}
              rx="10"
              ry="4"
              width="600"
              height="20"
            />
            <rect
              x="1450"
              y={`${contentVerticalPosition(20)}`}
              rx="4"
              ry="4"
              width="20"
              height="20"
            />
            <rect
              y={`${contentVerticalPosition(59)}`}
              x="10"
              ry="10"
              width="1500"
              height="1"
            />
          </Fragment>
        );
      })}
    </ContentLoader>
  );
}
