import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import User from "../src/user/Users";
import Signup from "../src/user/Signup";
import Signin from "./auth/Signin";
import Profile from "./user/Profile";

const Mainrouter = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={User} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/user/:userId" component={Profile} />
      </Switch>
    </div>
  );
};

export default Mainrouter;
