import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__icons">
        <h3>Source Code : </h3>
        <a
          href="https://twitter.com/Lakshaychauhan0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
      </div>
      <a
        href="https://lakshaychauhan9.hashnode.dev/project-alpha"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2>BLOG</h2>
      </a>

      <div className="footer__icons">
        <h3>Developers Contact : </h3>
        <a
          href="https://twitter.com/Lakshaychauhan0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/lakshay-chauhan-1b338917a/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </a>
      </div>
    </div>
  );
};

export default Footer;
