import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { clearJwt, isAuthenticated } from "../auth/auth-helper";

const isActive = (history, path) => {
  if (history.location.pathname == path) {
    return { color: "#ff4081" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        MongoReactNodeExpressApp
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon />
        </IconButton>
      </Link>
      <Link to="/users">
        <Button style={isActive(history, "/users")}>Users</Button>
      </Link>
      {!isAuthenticated() && (
        <span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign Up</Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In</Button>
          </Link>
        </span>
      )}
      {isAuthenticated() && (
        <span>
          <Link to={"/users/" + isAuthenticated().user._id}>
            <Button
              style={isActive(history, "/user/" + isAuthenticated().user._id)}
            >
              My Profile
            </Button>
          </Link>
          <Button
            color="inherit"
            onClick={() => {
              clearJwt(() => history.push("/"));
            }}
          >
            Sign Out
          </Button>
        </span>
      )}
    </Toolbar>
  </AppBar>
));

export default Menu;
