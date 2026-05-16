import { memo } from "react";

const Loader = () => {
  return (
    <div className="ellipsis-loader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default memo(Loader);
