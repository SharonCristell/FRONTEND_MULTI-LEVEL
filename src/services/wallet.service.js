import authHeader from './auth-header';
import AuthService from './auth.service';

const proxyurl = "https://cors-anywhere.herokuapp.com/";
// const proxyurl = "";

// // Production
// const  API_URL = proxyurl + 'https://api.inresorts.club/api/';

// Test
const API_URL = proxyurl + 'http://45.66.156.160:60/api/';



class WalletService {


    // TODO withourt services
     async registerTransfer(data) {

        let url= API_URL + "";
        return await fetch(url, {
          method:'POST',
          body: JSON.stringify(data),
          headers:{
              'Content-Type':'application/json'
          }
          })
          .then(function(response) {
              return response.json();
          })
          .then(function(dataJson) {

              return dataJson;
          })
          .catch(function(err) {
              console.error(err);
              return undefined;
          });
    }

    // Get wallet
    async getWalletInformation(id) {

        let url= API_URL + "wallet/user/" + id;
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

    async getWalletRegisters(data, token) {
        
        const currentUser =   AuthService.getCurrentUser();

        let url= API_URL + "walletTransaction/list";
        return await fetch(url, {
          method:'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${currentUser.access_Token}` 
            }
          })
          .then(function(response) {
              return response.json();
          })
          .then(function(dataJson) {

              return dataJson;
          })
          .catch(function(err) {
              console.error(err);
              return undefined;
          });
    }

    // Validate transaction
    async validateTransaccion(data) {

        let url= API_URL + "wallet/transaction/validate";
        return await fetch(url, {
          method:'POST',
          body: JSON.stringify(data),
          headers:{
              'Content-Type':'application/json'
          }
          })
          .then(function(response) {
              return response.json();
          })
          .then(function(dataJson) {

              return dataJson;
          })
          .catch(function(err) {
              console.error(err);
              return undefined;
          });
    }

    // Get token
    async getToken(idUser) {
        let url= API_URL + "wallet/token/create/" + idUser;
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

    // Verify token
    async verifyToken(idUser, data) {

        let url= API_URL + "wallet/token/validate/" + idUser;
        return await fetch(url, {
          method:'POST',
          body: JSON.stringify(data),
          headers:{
              'Content-Type':'application/json'
          }
          })
          .then(function(response) {
              return response.json();
          })
          .then(function(dataJson) {

              return dataJson;
          })
          .catch(function(err) {
              console.error(err);
              return undefined;
          });
    }

    // Process transaction
    async registerTransaction(data, user){
        let url= API_URL + "walletTransaction/transfer";

        return await fetch(url, {
          method:'POST',
          body: JSON.stringify(data),
          headers:{
              'Content-Type':'application/json',
              'Authorization': `Bearer ${user.access_Token}`
          }
          })
          .then(function(response) {
              return response.json();
          })
          .then(function(dataJson) {

              return dataJson;
          })
          .catch(function(err) {
              console.error(err);
              return undefined;
          });
    }

}

export default new WalletService();