import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./style.module.css";

export const Header = () => {
  const match = useLocation();
  const history = useHistory();
  console.log(match);
  return (
    <div className={styles.navbar}>
      <a
        onClick={() => history.push("/home")}
        style={{ fontWeight: match.pathname === "/home" ? "900" : "400" }}
      >
        Home
      </a>

      <a
        onClick={() => history.push("/tool")}
        style={{ fontWeight: match.pathname === "/tool" ? "900" : "400" }}
      >
        Tool
      </a>

      <a
        onClick={() => history.push("/about")}
        style={{ fontWeight: match.pathname === "/about" ? "900" : "400" }}
      >
        About
      </a>

      <a
        onClick={() => history.push("/contact")}
        style={{ fontWeight: match.pathname === "/contact" ? "900" : "400" }}
      >
        Contact
      </a>
    </div>
  );
};
