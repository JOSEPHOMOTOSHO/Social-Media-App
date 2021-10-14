import { getAllUsers } from "./api-user";
import { useEffect, useState } from "react";
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
import ArrowForward from "@material-ui/icons/ArrowForward";
import Person from "@material-ui/icons/Person";
import { Link } from "react-router-dom";
import { Icon } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
}));
const User = () => {
  const classes = useStyles();
  const [users, setUser] = useState([]);

  useEffect(() => {
    const abortcontroller = new AbortController();
    //a property that lets us abort dom request
    const signal = abortcontroller.signal;
    getAllUsers(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUser(data);
      }
    });
    console.log(users, "users from component");
    //cleanup function to abort fetch call when the component unmounts
    return function cleanUp() {
      abortcontroller.abort();
    };
  }, []);

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        All Users
      </Typography>
      <List dense>
        {users.map((item) => {
          return (
            <Link to={`/api/users/${item._id}`} key={item._id}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <ArrowForward />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Paper>
  );
};

export default User;
