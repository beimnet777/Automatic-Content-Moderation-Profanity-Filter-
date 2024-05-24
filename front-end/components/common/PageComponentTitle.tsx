import React, { useState } from "react";

const PageComponentTitle = ({
  title,
  titleDescription,
  buttonTitle,
  filter,
  setPostFilter,
  setLoading,
}: any) => {
  const [modal, setModal] = useState(false);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    setPostFilter(event.target.value);
  };

  return (
    <>
      <div className="mr-6">
        <h1 className="text-4xl text-white font-semibold mb-2">{title}</h1>
        <h2 className="text-white ml-0.5">{titleDescription}</h2>
      </div>
      {filter && (
        <div className="ml-6 mt-4">
          <label htmlFor="filter" className="text-white mr-2">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="p-2 rounded bg-gray-800 text-white"
          >
            <option value="all">All</option>
            <option value="audio">Audio Hateful</option>
            <option value="text">Text Hateful</option>
          </select>
        </div>
      )}
    </>
  );
};

export default PageComponentTitle;
