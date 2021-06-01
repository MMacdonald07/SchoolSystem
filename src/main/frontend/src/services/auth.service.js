import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "auth/login", {
                username,
                password
            })
            .then((res) => {
                if (res.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(res.data));
                }

                return res.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        return axios.post(
            API_URL + "test/admin/adduser",
            {
                username,
                email,
                password
            },
            {
                headers: authHeader()
            }
        );
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();
