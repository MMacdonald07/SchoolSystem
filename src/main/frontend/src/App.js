import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

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
                                <Link to="/teacher" className="nav-link">
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
                        {currentUser && (
                            <li className="nav-item">
                                <Link to="/student" className="nav-link">
                                    Student Page
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
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">
                                    Register
                                </Link>
                            </li>
                        </div>
                    )}
                </nav>

                <div className="container mt-3">
                    <Switch>
                        <Route exact path={["/", "/home"]} component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/profile" component={Profile} />
                        <Route path="/student" component={BoardStudent} />
                        <Route path="/teacher" component={BoardTeacher} />
                        <Route path="/admin" component={BoardAdmin} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
