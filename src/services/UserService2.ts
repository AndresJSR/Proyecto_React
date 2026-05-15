import axios from "axios";
import {User} from "../models/User"
const API_URL = '/api/users/';

class UserService2{
    async getUsers():Promise<User[]>{
        try {
            const response = await axios.get<User[]>(API_URL);
            console.log(response.data.data)
            return response.data.data
        } catch (error) {
            console.error()
            return []
        }
    }
}
//export const userService = new UserService2();