import React, { Component } from "react";

import UserService from "../services/user.service";

export default class BoardAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: []
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

    render() {
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>All users:</h3>
                </header>
                <ul>
                    {this.state.content.map((user, index) => (
                        <li key={index}>
                            <p>User {user.id}:</p>
                            <p>{user.username}</p>
                            <p>{user.email}</p>
                            {user.roles[0].name === "ROLE_STUDENT" ||
                            user.roles[0].name === "ROLE_TEACHER" ? (
                                <p>{user.subject}</p>
                            ) : null}
                            {user.roles[0].name === "ROLE_STUDENT" ? (
                                <p>{user.grade}</p>
                            ) : null}
                            <p>{user.roles[0].name}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
