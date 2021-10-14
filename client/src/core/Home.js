import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import unicornbike from "../images/unicornbike.jpg";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.primary,
  },
  media: {
    minHeight: 400,
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.card}>
        <Typography variant="h6" className={classes.title}>
          Home Page
        </Typography>
        <CardMedia
          className={classes.media}
          image={unicornbike}
          title="Unicorn Bicycle"
        />
        <CardContent>
          <Typography variant="body2" component="p">
            Welcome to the MERN Skeleton home page
          </Typography>
        </CardContent>
      </Card>
      <Link to="/users">Users</Link>
    </>
  );
};

export default Home;
