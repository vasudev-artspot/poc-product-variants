
import User from "./types"


interface Token {
    exp: string;
    iat: string;
    jti: string;  
  
}

class TokenService {
 
  static isTokenValid() : boolean  { return false }
    
  static fetchUserFromToken(token : string): User {
      
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

      const parsed_token = JSON.parse(jsonPayload);

      const user_email = parsed_token['user_email'];
      const user_id = parsed_token['user_id'];
      const user_role = parsed_token['user_role'];
        
      //User Object from Token
      const user = new User(user_email, user_id, user_role, token, "");
      return user;
      
  }
  
}

export default TokenService