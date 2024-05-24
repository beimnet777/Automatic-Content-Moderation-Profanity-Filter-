import assert from "assert";
import { Chart, ArcElement } from "chart.js/auto";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
import ContentLoader from "react-content-loader";
import { API_BASE_URL, getHeaders } from "../../utils/constants";

Chart.register(ArcElement);

const Dashboard = () => {
  const [data, setData]: any = useState([]);
  const [stat, setStat]: any = useState({
    total_posts: 0,
    average_posts_per_day: 0,
    total_posts_with_hate: 0,
    proportion_of_hatespeeches: 0,
    average_posts_per_user: 0,
    average_follower_per_user: 0,
  });

  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timing = setTimeout(async () => {
      const res = await fetch(`${API_BASE_URL}/admin-stat/`, {
        headers: getHeaders(session?.user?.accessToken),
      }).then((res) => {
        return res.json();
      });

      setStat(res);

      setData([
        {
          label: "Hateless Speech",
          count: stat.total_posts - stat.total_posts_with_hate,
        },
        {
          label: "Hateful Speech",
          count: stat.total_posts_with_hate,
        },
      ]);

      console.log(data);

      setLoading(false);
    }, 4000);
    return () => clearTimeout(timing);
  }, [data]);

  const dataForChart = {
    labels: data.map((item: any) => item.label),
    datasets: [
      {
        label: "Posts",
        data: data.map((item: any) => item.count),
      },
    ],
  };

  return (
    <>
      <main className="p-6 sm:p-10 space-y-6">
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
          <div className="mr-6">
            <h1 className="text-4xl font-semibold mb-2 text-white">
              Dashboard
            </h1>
            <h2 className="text-white ml-0.5">General Stats</h2>
          </div>
          <div className="flex flex-wrap items-start justify-end -mb-3">
            {/* <button className="inline-flex px-5 py-3 text-purple-600 hover:text-purple-700 focus:text-purple-700 hover:bg-purple-100 focus:bg-purple-100 border border-purple-600 rounded-md mb-3">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Manage dashboard
            </button>
            <button className="inline-flex px-5 py-3 text-white bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 rounded-md ml-6 mb-3">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create new dashboard
            </button> */}
          </div>
        </div>
        {!loading && (
          <>
            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="flex items-center p-8 bg-white shadow rounded-lg">
                <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-2xl font-bold">
                    {stat.total_posts}
                  </span>
                  <span className="block text-gray-500">Posts</span>
                </div>
              </div>
              <div className="flex items-center p-8 bg-white shadow rounded-lg">
                <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-2xl font-bold">
                    {(stat.average_posts_per_day as number).toFixed(2)}
                  </span>
                  <span className="block text-gray-500">Posts per day</span>
                </div>
              </div>
              <div className="flex items-center p-8 bg-white shadow rounded-lg">
                <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                </div>
                <div>
                  <span className="inline-block text-2xl font-bold">
                    {stat.total_posts - stat.total_posts_with_hate}
                  </span>
                  <span className="inline-block text-xl text-gray-500 font-semibold">
                    (
                    {(
                      (100 - stat.proportion_of_hatespeeches * 100) as number
                    ).toFixed(2)}
                    %)
                  </span>
                  <span className="block text-gray-500">
                    Posts without hate speech
                  </span>
                </div>
              </div>
              <div className="flex items-center p-8 bg-white shadow rounded-lg">
                <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-2xl font-bold">
                    {(stat.proportion_of_hatespeeches * 100).toFixed(2)}%
                  </span>
                  <span className="block text-gray-500">Hateful posts</span>
                </div>
              </div>
            </section>
            <section className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6">
              <div className="max-h-[500px] flex flex-col md:col-span-8 md:row-span-2 bg-white shadow rounded-lg">
                <div className="px-6 py-5 font-semibold border-b border-gray-100">
                  Number of Hateful Posts vs Hateless
                </div>
                <div className="p-4 flex-grow">
                  <div className="flex items-center justify-center h-full px-4 py-16 text-gray-400 text-3xl font-semibold bg-gray-100 border-2 border-gray-200 border-dashed rounded-md">
                    <Pie
                      className="max-h-[280px] max-w-[280px]"
                      data={dataForChart}
                    ></Pie>
                  </div>
                </div>
              </div>

              <div className="row-span-2 bg-white shadow rounded-lg box-content">
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path
                        fill="#fff"
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold">
                      {(stat.average_posts_per_user as number).toFixed(2)}
                    </span>
                    <span className="block text-gray-500">
                      Average Posts per User
                    </span>
                  </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-teal-600 bg-teal-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold">
                      {stat.average_follower_per_user.toFixed(2)}
                    </span>
                    <span className="block text-gray-500">
                      Average Followers per user
                    </span>
                  </div>
                </div>
                <div className="flex flex-grow h-[50px]"></div>
                <div className="flex justify-center items-center p-8 bg-white shadow rounded-lg">
                  <p> &copy; 2023, All rights reserved</p>
                </div>
              </div>
            </section>
          </>
        )}

        {loading && (
          <ContentLoader viewBox="0 0 820 450">
            <rect x="10" y="10" rx="5" ry="5" width="200" height="110" />
            <rect x="225" y="10" rx="5" ry="5" width="200" height="110" />
            <rect x="440" y="10" rx="5" ry="5" width="200" height="110" />
            <rect x="660" y="10" rx="5" ry="5" width="200" height="110" />
            <rect x="10" y="135" rx="5" ry="5" width="540" height="400" />
            <rect x="570" y="135" rx="5" ry="5" width="300" height="400" />
          </ContentLoader>
        )}
      </main>
    </>
  );
};

export default Dashboard;
