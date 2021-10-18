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
  const [user, setUser] = useState({});
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);
  console.log(user);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const jwt = isAuthenticated();
    getSingleUser(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignIn(true);
      } else {
        setUser(data);
        console.log("i am user data", data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  if (redirectToSignIn) {
    <Redirect to="/signin" />;
  }

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {isAuthenticated().user && isAuthenticated().user._id == user._id && (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>

              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={"Joined: " + new Date(user.createdAt).toDateString()}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Profile;
