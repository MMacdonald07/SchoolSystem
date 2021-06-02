import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import authHeader from "../services/auth-header";
import axios from "axios";

const API_URL = "http://localhost:8080/api/test/";
const currentUser = AuthService.getCurrentUser();

export default class BoardAdmin extends Component {
    constructor(props) {
        super(props);

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.state = {
            content: [],
            showModal: false,
            id: null
        };
    }

    componentDidMount() {
        UserService.getAdminBoard().then(
            (res) => {
                this.setState({
                    content: res.data
                });
            },
            (err) => {
                this.setState({
                    content:
                        (err.response &&
                            err.response.data &&
                            err.response.data.message) ||
                        err.message ||
                        err.toString()
                });
            }
        );
    }

    handleOpen(id) {
        this.setState({
            showModal: true,
            id
        });
    }

    handleClose() {
        this.setState({
            showModal: false,
            id: null
        });
    }

    handleDelete() {
        axios.delete(API_URL + `admin/deleteuser/${this.state.id}`, {
            headers: authHeader()
        });

        window.location.reload();
    }

    render() {
        return (
            <div className="container">
                <header className="jumbotron mb-3">
                    <h3>All users:</h3>
                </header>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Grade</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.content.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {user.id}
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.subject ? user.subject : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {user.grade ? user.grade : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {user.id === currentUser.id ? null : (
                                            <button
                                                className="btn btn-primary btn-block"
                                                onClick={() =>
                                                    this.handleOpen(user.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Body>Are you sure?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            No
                        </Button>
                        <Button variant="primary" onClick={this.handleDelete}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <button className="btn btn-secondary btn-block mt-3">
                    <Link
                        to="/admin/adduser"
                        style={{ textDecoration: "none", color: "#fff" }}
                    >
                        Add User
                    </Link>
                </button>
            </div>
        );
    }
}
