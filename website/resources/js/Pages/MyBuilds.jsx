import React from "react";
import axios from "axios";

const MyBuilds = ({ builds }) => {
  const handleDelete = async (id) => {
    await axios.delete(`/api/builds/${id}`);
    router.reload();
  };

  return (
    <div>
      <div className=""></div>
    </div>
  );
};

export default MyBuilds;
