import jwt from 'jsonwebtoken';

const proxyurl = "https://cors-anywhere.herokuapp.com/";
// const proxyurl = "";

// // Production
// const API_URL = proxyurl + 'https://api.inresorts.club/api';
// const API_USR = proxyurl + 'https://api.inresorts.club/api/User';

// Test
const API_URL = proxyurl + 'http://45.66.156.160:60/api';
const API_USR = proxyurl + 'http://45.66.156.160:60/api/User';



class AuthService {

  // Login
  async login(data) {
    
    let url = API_URL + "/token";
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        // headers: headers
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(response => {
        //console.log(response);
        if (response.access_Token !== null) {
          // //console.log("login");
          // Decoder token information
          let jwt = require("jsonwebtoken");
          let decode =  jwt.decode(response.access_Token);
          // console.log(decode);
          let idUser = decode.primarysid;
          // Saveinformation
          sessionStorage.setItem("id", idUser);
          sessionStorage.setItem("user",  JSON.stringify(response));
          sessionStorage.setItem("islogged", true);
          sessionStorage.setItem("key",  data.password);
          sessionStorage.setItem("name", decode.unique_name)
          let userInfo = this.getUserInformation(idUser);
          //let pictureInfo = this.getProfilePicture(idUser);

          let url = API_USR + "/profilePicture/" + idUser;

          return fetch(url)
            .then(res => res.json())
            .then(response => {
              if (response.status === 1) {

                let picture = "data:image/png;base64," + response.objModel;

                sessionStorage.setItem("pictureProfile", picture);
              }
          
                return response;          
            })
            .catch(error => {
                //console.log(error);
                return undefined;
            });
        }
        return response;

      })
      .catch(error => {
        //console.log(error);
        return undefined;
      });
      }

  // Login for admin see others profile
  async loginAdmin(data) {
    
    let url = API_URL + "/token/admin";
    return await fetch(url, {
        method:'POST',
        body: JSON.stringify(data),
        // headers: headers
        headers:{
            'Content-Type':'application/json',
        }
    })
    .then(res => res.json())
    .then(response => {
        //console.log(response);
        if(response.access_Token !== null) {
          // //console.log("login");
          // Decoder token information
          let jwt = require("jsonwebtoken");
          let decode =  jwt.decode(response.access_Token);
          response.idUser = decode.primarysid;
          
        }
        return response;
       
    })
    .catch(error => {
        //console.log(error);
        return undefined;
    });
  }

  
  async updatePassword(objUser) {
    let url_update = API_USR + "/" + "modifypassword";
    let currentUser = this.getCurrentUser();
    let currentInfo = this.getCurrentUserInfo();
    let data = {};
    let user = {};
    user.username = currentInfo.username;
    user.password = objUser.password;
    data.User= user;
    data.newPassword = objUser.newpassword;
    let u ={}
    u.p = "f";
    u.user =  undefined;
    //console.log(JSON.stringify(u));

    return await fetch(url_update, {
        method:'PUT',
        body: JSON.stringify(data),
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${currentUser.access_Token}` 
        }
    })
    .then(res => res.json())
    .then(response => {
      if(response.status === 1) {
        sessionStorage.setItem("key",  data.newPassword);
      }
        return response;
       
    })
    .catch(error => {
        //console.log(error);
        return undefined;
    });
  }

  async getProfilePicture(idUser) {

    let url = API_USR + "/profilePicture/" + idUser;

    return await fetch(url)
      .then(res => res.json())
      .then(response => {
        if (response.status === 1) {

          let picture = "data:image/png;base64," + response.objModel;

          sessionStorage.setItem("pictureProfile", picture);
          
        }


        return response;
      })
      .catch(error => {
        //console.log(error);
        return undefined;
      });
  }

  getUserInformation(idUser) {
    // console.log("info user")
    let user = JSON.parse(sessionStorage.getItem('user'));
    if( user !== null && user !==  undefined){
      
      let url_info = API_USR + "/" + idUser; 
      return fetch(url_info)
        .then(res => res.json())
        .then(response => {
          sessionStorage.setItem("info", JSON.stringify(response));
          return response;
        })
        .catch(error => {
            //console.log(error);
            sessionStorage.setItem("info", "");
            return undefined;
        });
    } else {
      sessionStorage.setItem("info", "");
      return undefined;
    }
    
  }

  async getUserInformationAsync(idUser) {
  
      let url_info = API_USR + "/" + idUser; 
      return await fetch(url_info)
        .then(res => res.json())
        .then(response => {
          sessionStorage.setItem("info", JSON.stringify(response));
          sessionStorage.setItem("id", idUser);
          return response;
        })
        .catch(error => {
            //console.log(error);
            sessionStorage.setItem("info", "");
            return undefined;
        });
    
    
  }

  async executeRecoveryPass(token) {
    let url = API_URL + "/User/ExecuteRecovery/?token=" + token;
    
    return await fetch(url)
    .then(res => res.json())
    .then(response => {
        return response;
    })
    .catch(error => {
        //console.log(error);
        return undefined;
    });

  }

  logout() {
    sessionStorage.clear();
  }

  getCurrentKey() {
    return sessionStorage.getItem("key");
  }

  getCurrentIdUser() {
    return sessionStorage.getItem("id");
  }

  getCurrentUserInfo() {
    if(sessionStorage.length > 0 && sessionStorage.getItem('info') !== null) {
      if(sessionStorage.getItem('info').length > 0){
        return JSON.parse(sessionStorage.getItem('info'));
      } else {
        return undefined;
      }
    }else{
      return undefined;
    }
    
  }

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  getName() {
      return sessionStorage.getItem('name');
  }

  getPicture() {
    
    return sessionStorage.getItem('pictureProfile');
  }

  getIsLogged() {
    if(sessionStorage.getItem('user')) {
        return true;
    }
    return false;
}

}

export default new AuthService();