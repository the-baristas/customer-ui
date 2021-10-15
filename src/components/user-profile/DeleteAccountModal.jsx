import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import { useSelector, useDispatch } from "react-redux";
import "./DeleteAccountModal.css";
import { removeToken } from "../../utils/Login";
import { logout } from "../../redux/userStatus/UserStatusActions";
import { useHistory } from "react-router-dom";
import { deleteUserAccount } from "../../api/UsersService";
import { Form } from "react-bootstrap";
import { userLogin } from "../../api/LoginService";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid red",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    }
}));

const DeleteAccountModal = (props) => {
    const userStatus = useSelector((state) => state.userStatus);
    const dispatch = useDispatch();
    const history = useHistory();

    const classes = useStyles();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");

    const [password, setPassword] = useState("");

    const handleDelete = () => {
        setIsPending(true);
        userLogin(userStatus.username, password)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        throw Error("Password is incorrect.");
                    } else if (response.status === 403) {
                        throw Error(
                            "This account is locked. If you haven't yet, please verify your account."
                        );
                    } else {
                        throw Error(
                            "There was a problem while trying to communicate with our server. Please try again later."
                        );
                    }
                } else {
                    setError("");
                    deleteUserAccount(userStatus.username)
                        .then((response) => {
                            setIsPending(false);
                            if (response.ok) {
                                removeToken();
                                dispatch(logout());
                                history.push("/");
                            } else {
                                throw Error(
                                    "There was a problem while trying to communicate with our server. Please try again later."
                                );
                            }
                        })
                        .catch((error) => {
                            setIsPending(false);
                            if (error.name === "TypeError") {
                                setError(
                                    "There was a problem while trying to communicate with our server. Please try again later."
                                );
                            } else {
                                setError(error.message);
                            }
                        });
                }
            })
            .catch((error) => {
                setIsPending(false);
                if (error.name === "TypeError") {
                    setError(
                        "There was a problem while trying to communicate with our server. Please try again later."
                    );
                } else {
                    setError(error.message);
                }
            });
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.open}
                onClose={props.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={props.open}>
                    <div className={classes.paper}>
                        <div
                            data-testid="divError"
                            style={{ backgroundColor: "red", color: "white" }}
                        >
                            {error}
                        </div>
                        <h2 id="transition-modal-title">Warning</h2>
                        <p id="transition-modal-description">
                            This would delete all of your information. This{" "}
                            <b>cannot be undone.</b> All of your flight history
                            and loyalty points will also be deleted.{" "}
                        </p>

                        {isPending && <h3 data-testid="loading">Loading...</h3>}
                        {!isPending && (
                            <div>
                                <div>
                                    <Form.Control
                                        className="inputPassword"
                                        data-testid="inputPassword"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(input) =>
                                            setPassword(input.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <Button
                                    className="cancelButton"
                                    data-testid="cancelButton"
                                    variant="contained"
                                    color="primary"
                                    onClick={props.handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="deleteButton"
                                    data-testid="deleteButton"
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleDelete}
                                    disabled={password.length < 1}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        )}
                    </div>
                </Fade>
            </Modal>
        </div>
    );
};

export default DeleteAccountModal;
