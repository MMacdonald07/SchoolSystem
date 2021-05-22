import React, { Component } from "react";

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
                <ul>
                    {this.state.content.map((student, index) => (
                        <li key={index}>
                            <strong>{student.username}</strong>: {student.grade}%
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
