import React from "react";

const SidebarBanner = () => {
  return (
    <div className="d-flex justify-content-center my-4 p-2 bg-light rounded shadow-sm border text-center">
      <a
        href="https://s.click.aliexpress.com/e/_c3J6SjU?bz=120*600"
        target="_blank"
        rel="noopener noreferrer"
        className="d-block"
      >
        <img
          src="https://ae-pic-a1.aliexpress-media.com/kf/S83e86e19b20f4e718d244f1c7a288fbdn.png"
          alt="AliExpress Score Big Sale"
          width="120"
          height="600"
          className="img-fluid rounded"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
      </a>
    </div>
  );
};

export default SidebarBanner;
