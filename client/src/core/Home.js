import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import unicornbike from "../images/unicornbike.jpg";
import { isAuthenticated } from "../auth/auth-helper";
import Grid from "@material-ui/core/Grid";
import FindPeople from "../user/FindPeople";
import NewsFeed from "../post/NewsFeed";
import React, { useState, useEffect } from "react";

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
  const [defaultPage, setDefaultPage] = useState(false);

  useEffect(() => {
    setDefaultPage(isAuthenticated());
  }, []);
  return (
    <>
      {!defaultPage && (
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
      )}
      {defaultPage && (
        <Grid container spacing={8}>
          <Grid item xs={8} sm={7}>
            <NewsFeed />
          </Grid>
          <Grid item xs={6} sm={5}>
            <FindPeople />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Home;
