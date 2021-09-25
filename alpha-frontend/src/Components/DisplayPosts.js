import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import PostCard from "./PostCard";
import UploadPosts from "./UploadPosts";
import { useAuthState } from "react-firebase-hooks/auth";
import "../App.css";
import axios from "../axios";
import { Link, useParams } from "react-router-dom";
import { Home } from "@material-ui/icons";
import Button from "@mui/material/Button";
import Pusher from "pusher-js";
import "../Styles/DisplayPosts.css";

const DisplayPosts = () => {
  const { server } = useParams();
  const [user] = useAuthState(auth);

  const [postsFire, setPostsFire] = useState([]);
  const [postsMern, setPostsMern] = useState([]);

  const fetchPostsMern = async () => {
    await axios.get("/sync").then((response) => {
      setPostsMern(response.data);
    });
  };

  const fetchPostsFire = () => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPostsFire(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        )
      );
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("posts");
    channel.bind("inserted", function (data) {
      fetchPostsMern();
    });
    channel.bind("deleted", function (data) {
      fetchPostsMern();
    });
    channel.bind("updated", function (data) {
      fetchPostsMern();
    });
  }, []);

  useEffect(() => {
    const loadPosts = () => {
      if (server === "befire") {
        fetchPostsFire();
      } else if (server === "bemern") {
        fetchPostsMern();
      }
    };
    loadPosts();
  }, [server]);

  return (
    <div className="display">
      <div className="display__header">
        <Link to="/">
          <Button
            className="display__header--Button"
            variant="contained"
            size="large"
          >
            <Home />
          </Button>
        </Link>

        {user?.displayName && (
          <>
            <UploadPosts username={user.displayName} />
          </>
        )}
      </div>

      <div className="display__posts">
        {postsMern.map((post) => (
          <PostCard
            key={post._id}
            postId={post._id}
            username={post.username}
            caption={post.caption}
            image={post.image}
          />
        ))}
      </div>
      <div className="display__posts">
        {postsFire.map(({ id, post }) => (
          <PostCard
            key={id}
            postId={id}
            username={post.username}
            caption={post.caption}
            image={post.image}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayPosts;
