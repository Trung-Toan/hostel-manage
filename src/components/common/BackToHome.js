import React, { memo } from "react";
import { Link } from "react-router-dom";

const BackToHome = () => {
  return (
    <>
      <Link to={"/"} className="btn btn-warning text-light">
        Back to home
      </Link>
    </>
  );
};

export default memo(BackToHome);
