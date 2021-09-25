import React, { useState } from "react";
import firebase from "firebase";
import { storage, db } from "../firebase";
import { Input, Button, Modal } from "@material-ui/core";
import { getModalStyle, useStyles } from "./Modalpop";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "../Styles/UploadPosts.css";
import axios from "../axios";
import { useParams } from "react-router";

const UploadPosts = ({ username }) => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const { server } = useParams();
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [openUpload, setOpenUpload] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUploadFire = () => {
    const uploadTask = storage
      .ref(`images/${server}/${username}/${image.name}`)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        storage
          .ref(`images/${server}/${username}`)
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            if (server === "befire") {
              db.collection("posts").add({
                image: url,
                caption: caption,
                username: username,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            } else if (server === "bemern") {
              axios.post("/upload", {
                caption: caption,
                username: username,
                image: url,
              });
            }

            setProgress(0);
            setCaption("");
            setImage(null);
            setOpenUpload(false);
          });
      }
    );
  };

  return (
    <div className="imageupload">
      <Button size="large" onClick={() => setOpenUpload(true)}>
        <AddCircleIcon sx={{ fontSize: 48 }} />
      </Button>
      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        <div style={modalStyle} className={classes.paper}>
          <progress
            className="imageupload__progress"
            value={progress}
            max="100"
          />
          <Input
            placeholder="Enter a caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div>
            <input type="file" onChange={handleChange} />
            <Button
              className="imageupload__button"
              disabled={!(caption && image)}
              onClick={handleUploadFire}
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadPosts;
