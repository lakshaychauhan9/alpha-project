import React, { useState, forwardRef } from "react";
import "../Styles/PostCard.css";
import Avatar from "@material-ui/core/Avatar";
import { db, auth } from "../firebase";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Modal, Input } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import axios from "../axios";
import { getModalStyle, useStyles } from "./Modalpop";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const PostCard = forwardRef(({ username, postId, image, caption }, ref) => {
  const { server } = useParams();
  const [user] = useAuthState(auth);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [updateCaption, setUpdateCaption] = useState(caption);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const funcCaptionUpdate = (e) => {
    e.preventDefault();
    if (server === "befire") {
      db.collection("posts").doc(postId).update({
        caption: updateCaption,
      });
    } else if (server === "bemern") {
      axios.put(`/update/${postId}`, {
        caption: updateCaption,
      });
    }
    setOpenEditModal(false);
  };

  const funcPostDelete = (e) => {
    e.preventDefault();
    if (server === "befire") {
      db.collection("posts").doc(postId).delete();
    } else if (server === "bemern") {
      axios.delete(`/delete/${postId}`);
    }
    setOpenDeleteModal(false);
  };

  return (
    <div className="post" ref={ref}>
      <div className="post__header">
        <Avatar
          className="post__header--Avatar"
          alt={username}
          src="brokenLink/Onpurpose"
        />
        <h1 className="post__header--Username">{username}</h1>

        {user?.displayName === username && (
          <div>
            <Button type="submit" onClick={() => setOpenDeleteModal(true)}>
              <DeleteIcon />
            </Button>
            <Button type="submit" onClick={() => setOpenEditModal(true)}>
              <EditIcon />
            </Button>
            <Modal
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
            >
              <div style={modalStyle} className={classes.paper}>
                <Button
                  className="imageupload__button"
                  color="error"
                  onClick={funcPostDelete}
                  startIcon={<DeleteIcon />}
                >
                  Confirm Delete
                </Button>
              </div>
            </Modal>

            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
              <div style={modalStyle} className={classes.paper}>
                <Input
                  value={updateCaption}
                  onChange={(e) => setUpdateCaption(e.target.value)}
                />
                <Button
                  className="imageupload__button"
                  onClick={funcCaptionUpdate}
                >
                  Save
                </Button>
              </div>
            </Modal>
          </div>
        )}
        <h3>{server}</h3>
      </div>

      <img className="post__image" src={image} alt="post" />
      <h4 className="post__footer">
        {username} <span className="post__footer--Caption">{caption}</span>
      </h4>
    </div>
  );
});

export default PostCard;
