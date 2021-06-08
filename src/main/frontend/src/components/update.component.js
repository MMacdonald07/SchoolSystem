import React, { Component } from "react";
import axios from "axios";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { isEmail } from "validator";

import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";

const API_URL = "http://localhost:8080/api/test/";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const vemail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                Invalid email.
            </div>
        );
    }
};

const vusername = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                Username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                Password must be between 6 and 40 characters.
            </div>
        );
    }
};

const vgrade = (value) => {
    if (value < 0 || value > 100) {
        return (
            <div className="alert alert-danger" role="alert">
                Grade must be between 0 and 100.
            </div>
        );
    }
};

export default class Update extends Component {
    constructor(props) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeSubject = this.onChangeSubject.bind(this);
        this.onChangeGrade = this.onChangeGrade.bind(this);

        this.state = {
            username: "",
            email: "",
            password: "*****",
            subject: "",
            grade: null,
            success: false,
            message: ""
        };
    }

    componentDidMount() {
        axios.get(API_URL + `admin/getuser/${this.props.match.params.userId}`, {
            headers: authHeader()
        }).then(({ data }) => {
            this.setState({
                username: data.username,
                email: data.email,
                subject: data.subject,
                grade: data.grade
            })
        }, (err) => {
            this.setState({
                content:
                    (err.response &&
                        err.response.data &&
                        err.response.data.message) ||
                    err.message ||
                    err.toString()
            });
        })
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeSubject(e) {
        this.setState({
            subject: e.target.value
        });
    }

    onChangeGrade(e) {
        this.setState({
            grade: e.target.value
        });
    }

    handleUpdate(e) {
        e.preventDefault();

        this.setState({
            success: false,
            message: ""
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.update(
                this.props.match.params.userId,
                this.state.username,
                this.state.email,
                this.state.password,
                this.state.subject,
                this.state.grade
            ).then(
                (res) => {
                    this.setState({
                        success: true,
                        message: res.data.message
                    });
                },
                (error) => {
                    const message =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        success: false,
                        message
                    });
                }
            );
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Form
                        onSubmit={this.handleUpdate}
                        ref={(c) => {
                            this.form = c;
                        }}
                    >
                        {!this.state.success && (
                            <div>
                                <div className="form-group">
                                    <p><strong>Leave blank if no changes made to section</strong></p>
                                    <label htmlFor="username">Username</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        validation={[required, vusername]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validation={[required, vemail]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validation={[required, vpassword]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="subject"
                                        value={this.state.subject}
                                        onChange={this.onChangeSubject}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="grade">Grade</label>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="grade"
                                        value={this.state.grade}
                                        onChange={this.onChangeGrade}
                                        validation={[vgrade]}
                                    />
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary btn-block mt-3">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {this.state.message && (
                            <div className="form-group">
                                <div
                                    className={
                                        this.state.success
                                            ? "alert alert-succes"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )}

                        <CheckButton
                            style={{ display: "none" }}
                            ref={(c) => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}
