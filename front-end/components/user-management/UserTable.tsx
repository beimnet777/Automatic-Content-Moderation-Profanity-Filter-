import { TrashIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import Table from "rc-table";
import React, { Fragment, useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import { useRecoilState } from "recoil";
import { usersState } from "../../atoms/social_media_atom";
import { API_BASE_URL, getHeaders } from "../../utils/constants";
import UserTableLoading from "./UserTableLoading";

const UserTable = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useRecoilState(usersState);
  const { data: session } = useSession();
  useEffect(() => {
    const timing = setTimeout(async () => {
      const res = await fetch(`${API_BASE_URL}/admin-user-stat/`, {
        headers: getHeaders(session?.user?.accessToken),
      }).then((res) => {
        return res.json();
      });
      setUsers(res);
      setLoading(false);
    }, 4000);
  }, []);

  const deleteUser = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(session?.user?.accessToken),
    });

    if (response.status === 200) {
      const res = await fetch(`${API_BASE_URL}/admin-user-stat`, {
        headers: getHeaders(session?.user?.accessToken),
      }).then((res) => {
        return res.json();
      });
      setUsers(res);
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 400,
      className: "text-white bg-gray-800 p-2 border-r-2 border-b-2",
      rowClassName: "bg-black-ripon",
    },
    {
      title: "Total Posts",
      dataIndex: "post_count",
      key: "post_count",
      width: 400,
      className: "text-white bg-gray-600 p-2 border-r-2 border-b-2",
    },
    {
      title: "Total Post with Hate Speech",
      dataIndex: "hateful_post_count",
      key: "hateful_post_count",
      width: 400,
      className: "text-white bg-gray-800 p-2 border-r-2 border-b-2",
    },
    {
      title: "Operations",
      dataIndex: "",
      key: "operations",
      className: "bg-gray-600 p-2 border-b-2",
      render: (res: any) => (
        <>
          <div
            className="icon group-hover:bg-red-600"
            onClick={() => {
              deleteUser(res.id);
            }}
          >
            <TrashIcon className="h-5 red group-hover:bg-red-600 cursor-pointer" />
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      {!loading && (
        <Table
          columns={columns}
          data={users}
          rowKey="id"
          className="bg-purple-700 w-full text-center rc-table-custom font-semibold "
        />
      )}
      {loading && <UserTableLoading rowHeight={60} rows={5} />}
    </div>
  );
};

export default UserTable;
