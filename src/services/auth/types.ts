
export interface IForgotPasswordUserInfo {
    email: string;
}

export interface IVerifyOTPInfo {
    email: string;
    otp: string;
}

export interface IResetPasswordInfo {

    email: string;
    password: string;
    password2: string;
    token: string
}

export interface IUserInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    password2: string;
    userType: string;
}




export class RefreshToken {
    refresh: string | undefined;

    constructor(refresh: string | undefined) {
        this.refresh = refresh;
    }
    
}


  
export interface IUser {
    email: string | undefined;
    role: string | undefined;
    id: string | undefined;
    accessToken: string | undefined;
    refreshToken: string | undefined;
}

class User implements IUser {
    
    email: string | undefined;
    role: string | undefined;
    id: string | undefined;
    accessToken: string | undefined;
    refreshToken: string | undefined;

    constructor(email: string, role: string, id: string, accessToken: string, refreshToken: string) {
        this.email = email; 
        this.role = role
        this.id = id
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        
    }

}

export default User
