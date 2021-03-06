import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Home from "./components/home.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import BoardTeacher from "./components/board-teacher.component";
import BoardAdmin from "./components/board-admin.component";
import Update from "./components/update.component";

class App extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);

        this.state = {
            showTeacherBoard: false,
            showAdminBoard: false,
            currentUser: undefined
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showTeacherBoard: user.roles.includes("ROLE_TEACHER"),
                showAdminBoard: user.roles.includes("ROLE_ADMIN")
            });
        }
    }

    logout() {
        AuthService.logout();
    }

    render() {
        const { currentUser, showTeacherBoard, showAdminBoard } = this.state;

        return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to="/" className="navbar-brand">
                        School
                    </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/home" className="nav-link">
                                Home
                            </Link>
                        </li>
                        {showTeacherBoard && (
                            <li className="nav-item">
                                <Link to={`/teacher/${currentUser.subject}`} className="nav-link">
                                    Teacher Board
                                </Link>
                            </li>
                        )}
                        {showAdminBoard && (
                            <li className="nav-item">
                                <Link to="/admin" className="nav-link">
                                    Admin Board
                                </Link>
                            </li>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">
                                    {currentUser.username}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a
                                    href="/login"
                                    className="nav-link"
                                    onClick={this.logout}
                                >
                                    Logout
                                </a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/register" className="nav-link">
                                    Register
                                </Link>
                            </li> */}
                        </div>
                    )}
                </nav>

                <div className="container mt-3">
                    <Switch>
                        <Route exact path={["/", "/home"]} component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/profile" component={Profile} />
                        <Route path="/teacher/:subject" component={BoardTeacher} />
                        <Route exact path="/admin" component={BoardAdmin} />
                        <Route exact path="/admin/adduser" component={Register} />
                        <Route path="/admin/updateuser/:userId" component={Update} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
