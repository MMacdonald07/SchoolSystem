import axios from "axios";
import authHeader from "./auth-header";
import AuthService from "./auth.service";

const API_URL = "http://localhost:8080/api/test/";

const currentUser = AuthService.getCurrentUser();

class UserService {
    getPublicContent() {
        return axios.get(API_URL + "all");
    }

    getTeacherBoard() {
        return axios.get(API_URL + `teacher/${currentUser.subject}`, {
            headers: authHeader()
        });
    }

    getAdminBoard() {
        return axios.get(API_URL + "admin", { headers: authHeader() });
    }
}

export default new UserService();
