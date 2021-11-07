import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { authenticate, isAuthenticated } from "../auth/auth-helper";
import { getSingleUser } from "./api-user";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";
import Person from "@material-ui/icons/Person";
import Divider from "@material-ui/core/Divider";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import FollowGrid from "./FollowGrid";
import { postsByUser } from "../post/api-post";
import ProfileTabs from "./ProfileTabs";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
}));

const Profile = ({ match }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    viewedUser: {},
    redirectToSignIn: false,
    following: false,
  });

  const [posts, setPosts] = useState([]);

  const jwt = isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getSingleUser(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, redirectToSignIn: true });
      } else {
        let following = checkfollow(data);
        setValues({ ...values, viewedUser: data, following: following });
        loadPost(data._id);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  function checkfollow(user) {
    let match = user.followers.some((follower) => {
      return follower._id == jwt.user._id;
    });
    return match;
  }

  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      values.viewedUser._id
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          viewedUser: data,
          following: !values.following,
        });
        console.log(values);
      }
    });
  };

  const loadPost = (user) => {
    postsByUser({ userId: user }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };

  const removePosts = (post) => {
    const allPost = [...posts];
    const indexOfPost = allPost.indexOf(post);
    allPost.splice(indexOfPost, 1);
    setPosts(allPost);
  };

  if (values.redirectToSignIn) {
    <Redirect to="/signin" />;
  }
  const photoUrl = values.viewedUser._id
    ? `/api/users/photo/${values.viewedUser._id}?${new Date().getTime()}`
    : "/api/users/defaultphoto";

  return (
    <>
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={photoUrl}>
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={values.viewedUser.name}
              secondary={values.viewedUser.email}
            />
            {isAuthenticated().user &&
            isAuthenticated().user._id == values.viewedUser._id ? (
              <ListItemSecondaryAction>
                <Link to={"/user/edit/" + values.viewedUser._id}>
                  <IconButton aria-label="Edit" color="primary">
                    <Edit />
                  </IconButton>
                </Link>

                <DeleteUser userId={values.viewedUser._id} />
              </ListItemSecondaryAction>
            ) : (
              <FollowProfileButton
                following={values.following}
                onButtonClick={clickFollowButton}
              />
            )}
          </ListItem>
          <ListItem>
            <ListItemText primary={values.viewedUser.about} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary={
                "Joined: " +
                new Date(values.viewedUser.createdAt).toDateString()
              }
            />
          </ListItem>
        </List>
      </Paper>
      <ProfileTabs
        user={values.viewedUser}
        posts={posts}
        removePostUpdate={removePosts}
      />
    </>
  );
};

export default Profile;
