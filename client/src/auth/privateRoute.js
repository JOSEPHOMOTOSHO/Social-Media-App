import { authenticate } from "./auth-helper";
import { Route, Redirect } from "react-router-dom";

const privateRoute = ({ component: Component, ...rest }) => {
  <Route
    {...rest}
    render={(props) =>
      authenticate() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />;
};

export default privateRoute;
