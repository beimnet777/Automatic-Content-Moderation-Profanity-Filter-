import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
  CollectionIcon,
  DuplicateIcon,
  FilmIcon,
} from "@heroicons/react/solid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";

const Nav = ({ sidebarOutsideClick }: any) => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [subMenuToggleStatus, setSubMenuToggleStatus] = useState(false);

  const router = useRouter();

  const sidebarClose = () => {
    setSidebarStatus(false);
  };

  const sidebarOpen = () => {
    setSidebarStatus(true);
  };

  const subMenuToggle = () => {
    setSubMenuToggleStatus(!subMenuToggleStatus);
  };

  //if menu has chile menu then  use seperate array
  const childMenu = [
    {
      subMenuTitle: "child One",
      linkHref: "/",
    },
    {
      subMenuTitle: "child Two",
      linkHref: "/",
    },
    {
      subMenuTitle: "child Three",
      linkHref: "/",
    },
  ];

  useEffect(() => {
    if (sidebarOutsideClick) {
      setSidebarStatus(false);
    }
  }, [sidebarOutsideClick]);
  //console.log("sidebar Nav", sidebarOutsideClick)
  return (
    <>
      <nav className="flex flex-col mx-4 my-6 space-y-4">
        <div className="inline-flex items-center justify-center ">
          {sidebarStatus ? (
            <ArrowNarrowLeftIcon
              className="inline-block h-12 cursor-pointer"
              onClick={sidebarClose}
            />
          ) : (
            <ArrowNarrowRightIcon
              className="inline-block h-12 cursor-pointer"
              onClick={sidebarOpen}
            />
          )}
        </div>

        <NavItem
          hrefLink={"/manage/users"}
          sidebarStatus={sidebarStatus}
          menuTitle="Manage Users"
          subMenu={false}
          subMenuArray={null}
        >
          <CollectionIcon className="h-10" />
        </NavItem>

        <NavItem
          hrefLink={"/manage/posts"}
          sidebarStatus={sidebarStatus}
          menuTitle="Manage Posts"
          subMenu={false}
          subMenuArray={null}
        >
          <DuplicateIcon className="h-10" />
        </NavItem>
      </nav>
    </>
  );
};

export default Nav;