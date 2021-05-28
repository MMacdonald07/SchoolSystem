import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import UserService from "../services/user.service";

export default class BoardTeacher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: [],
            subject: props.match.params.subject
        };
    }

    componentDidMount() {
        UserService.getTeacherBoard().then(
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

    render() {
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>
                        {this.state.subject.charAt(0).toUpperCase() +
                            this.state.subject.slice(1)}{" "}
                        Students
                    </h3>
                </header>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Grade</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.content.map((student, index) => (
                                <TableRow key={index}>
                                    <TableCell>{student.username}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}
