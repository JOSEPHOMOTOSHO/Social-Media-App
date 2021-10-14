import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import User from "../src/user/Users";

const Mainrouter = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={User} />
      </Switch>
    </div>
  );
};

export default Mainrouter;
