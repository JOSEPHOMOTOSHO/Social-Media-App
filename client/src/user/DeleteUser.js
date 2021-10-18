import { useState } from "react";
import { isAuthenticated } from "../auth/auth-helper";
import { deleteUser } from "./api-user";
import { clearJwt } from "../auth/auth-helper";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// import Delete from "@material-ui/icons/Delete";
const DeleteUser = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const deleteAccount = () => {
    const jwt = isAuthenticated();
    deleteUser(
      {
        userId,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        clearJwt(() => console.log("user has been deleted"));
        setRedirect(true);
      }
    });
  };
  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <span>
      <IconButton aria-label="Delete" onClick={handleClick} color="seccondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export default DeleteUser;
