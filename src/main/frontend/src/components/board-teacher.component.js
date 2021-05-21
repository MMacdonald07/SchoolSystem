import React, { Component } from "react";

import UserService from "../services/user.service";

export default class BoardTeacher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "",
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
                    <h3>{this.state.content}</h3>
                    <p>Students in your {this.state.subject} class</p>
                </header>
            </div>
        );
    }
}
