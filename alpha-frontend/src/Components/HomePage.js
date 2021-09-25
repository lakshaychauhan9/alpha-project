import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import "../Styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <h2>
        Welcome to Project Alpha! Alpha is a basic SM app where a user can
        Create, Update and Delete their posts. Front end of this app is built
        using ReactJS and this app is simultaneously connected to two (but
        seperately functioning) backends ,
        <ul>
          <li>
            Firebase/Firestore which is a Backend As A Service (BaaS) real time
            database.
          </li>
          <li>
            Express NodeJS server with MongoDB atlas as database, which is made
            real time using Pusher.
          </li>
        </ul>
        Firebase Auth is used for authentication of User. Front end is hosted on
        Firebase and backend on heroku. Refer to developer's blog to understand
        the idea behind connecting two backends and working of this app.
      </h2>
      <p>Tip : Hold 'Shift + Scroll' to scroll horizontally.</p>
      <p>
        Note : If anything is broken or changes are not updating real time,
        please inform me @ contacts given below. Meanwhile, try refreshing the
        page.
      </p>
      <div className="homepage__buttons">
        <div className="homepage__buttons--Left">
          <Button size="large">
            <Link
              style={{ color: "inherit", textDecoration: "inherit" }}
              to="/befire"
            >
              Enter Firebase
            </Link>
          </Button>
        </div>
        <div className="homepage__buttons--Right">
          <Button size="large">
            <Link
              style={{ color: "inherit", textDecoration: "inherit" }}
              to="/bemern"
            >
              Enter MongoDb
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
