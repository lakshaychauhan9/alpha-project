import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "Pusher";
import dbModelPosts from "./dbModelPosts.js";
import dotenv from "dotenv";
dotenv.config();

// appp configf
const app = express();
const port = process.env.PORT || 8080;

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap2",
  useTLS: true,
});

// middlewares
app.use(express.json());
app.use(cors());

// DB config
const connection_url = process.env.MONGO_DB_CONNECTION_URL;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  const changeStream = mongoose.connection.collection("posts").watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const postDetails = change.fullDocument;
      pusher.trigger("posts", "inserted", {
        user: postDetails.user,
        caption: postDetails.caption,
        image: postDetails.image,
      });
    } else if (change.operationType === "delete") {
      pusher.trigger("posts", "deleted", change.documentKey._id);
    } else if (change.operationType === "update") {
      pusher.trigger("posts", "updated", {
        caption: change.documentKey._id,
      });
    } else {
      console.log("Error");
    }
  });
});

// api routes
app.get("/", (req, res) =>
  res
    .status(200)
    .send(
      "<h1 style='color:purple; font-size:96px' >Easter<span style='color:blue'> Egg</span><span style='color:red'> !</span></h1>"
    )
);

app.post("/upload", (req, res) => {
  const body = req.body;

  dbModelPosts.create(body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/sync", (req, res) => {
  dbModelPosts
    .find()
    .sort({ createdAt: -1 })
    .exec((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
});

app.delete("/delete/:id", (req, res) => {
  const _id = req.params.id;
  dbModelPosts.findByIdAndDelete(_id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.put("/update/:id", (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  dbModelPosts.findByIdAndUpdate(_id, body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// listener
app.listen(port, () => console.log(`listening on ${port}`));
