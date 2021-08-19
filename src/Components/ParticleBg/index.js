import ParticlesBg from "particles-bg";
import React, { useState } from "react";
import Particles from "react-particles-js";

export const ParticleBg = ({ component }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        // position: "absolute",
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0,
      }}
    >
      <ParticlesBg />
    </div>
  );
};
