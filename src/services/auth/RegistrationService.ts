import { REGISTER_ROUTE, CONTRIBUTOR } from "../constants";
import AxiosAuthClient from "./AuthAxiosClient"
import { IUserInfo } from "./types";

class RegistrationService {

    // The function below invokes the login api on backend to validate user credentials 
    // and fetch the access token 
    async registerUser(userData: IUserInfo): Promise<boolean | undefined> {
        try {
            userData.userType = CONTRIBUTOR
            const response = await AxiosAuthClient.getInstance().post(REGISTER_ROUTE, userData)
            console.log(response.status);
            
            if (response.status === 201) {
                return true
            } else {
                //User registration not successful
                return false;
            }
        } catch (error) {
            throw error;
        }
    }
}

export default RegistrationService