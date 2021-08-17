import React, { useState } from "react";
import Particles from "react-particles-js";

export const ParticleBg = ({ component }) => {
  return (
    <div
      style={{
        paddingTop: "100px",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {component}
    </div>
  );
};
