import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import PostList from "./PostList";
import { listNewsFeed } from "./api-post.js";
import NewPost from "./NewPost";
import { isAuthenticated } from "../auth/auth-helper";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "auto",
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    fontSize: "1em",
  },
  media: {
    minHeight: 330,
  },
}));

function NewsFeed() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);

  const jwt = isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listNewsFeed({ userId: jwt.user._id }, { t: jwt.token }, signal).then(
      (data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setPosts(data);
        }
      }
    );
    return function cleanUp() {
      abortController.abort();
    };
  }, []);

  function addPost(post) {
    const allPost = [...posts];
    allPost.unshift(post);
    setPosts(allPost);
  }

  function removePost(post) {
    const allPost = [...posts];
    const postIndex = allPost.indexOf(post);
    allPost.splice(postIndex, 1);
    setPosts(allPost);
  }
  // console.log("i believe i am posts", posts);

  return (
    <Card>
      <Typography type="title">News Feed</Typography>
      <Divider />
      <NewPost addUpdate={addPost} />
      <Divider />
      <PostList removeUpdate={removePost} posts={posts} />
    </Card>
  );
}

export default NewsFeed;