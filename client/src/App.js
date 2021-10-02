// import './App.css';
import { hot } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import Mainrouter from "./Mainrouter";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Mainrouter />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default hot(module)(App);
