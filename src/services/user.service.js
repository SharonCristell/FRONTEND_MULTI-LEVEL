import authHeader from './auth-header';
import AuthService from './auth.service';

const proxyurl = "https://cors-anywhere.herokuapp.com/";
// const proxyurl = "";

// // Production
// const  API_URL = proxyurl + 'https://api.inresorts.club/api/';
// const API_USR = proxyurl + 'https://api.inresorts.club/api/User';

// Test
const API_URL = proxyurl + 'http://45.66.156.160:60/api/';
const API_USR = proxyurl + 'http://45.66.156.160:60/api/User'



class UserService {

    async updateInfo(id, data) {
        let url_update = API_USR + "/" + "edituserprofile/" + id;
        let user = AuthService.getCurrentUser();

        return await fetch(url_update, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_Token}`
            }
        })
            .then(res => res.json())
            .then(response => {
                //console.log(response);
                if (response.access_Token !== null) {
                    let idUser = AuthService.getCurrentIdUser();
                    AuthService.getUserInformation(idUser);
                }
                return response;

            })
            .catch(error => {
                //console.log(error);
                return undefined;
            });
    }

    // TODO change id 
    async getResidualTree() {
        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "tree/residual/" + id;
        let user = AuthService.getCurrentUser();

        // {
        //     method:'GET',
        //     headers:{
        //         'Content-Type':'application/json',
        //         'Authorization': `Bearer ${user.access_Token}` 
        //     }
        // }
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

    // TODO profilePicture

    async updateProfilePicture(data) {
        console.log(data)
        let url_verifydoc = API_USR + "/update/profilePicture";

        return await fetch(url_verifydoc, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }
    // Get sponsor by iduser
    async getSponsorbyUser() {
        let id = AuthService.getCurrentIdUser();
        let url = API_USR + "/sponsor/" + id;
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

    async getInfobyUser() {
        
        let id = AuthService.getCurrentIdUser();
        console.log(id)
        let url = API_URL + "coaffiliate/usercoaffiliate/" + id;
        console.log(url)
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
    // Update user Info
    async updateAffiliateInfo(data) {
        console.log(data)
        let url_verifydoc = API_URL + "coaffiliate/updateusercoaffiliate";

        return await fetch(url_verifydoc, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }
    async registerCoafiliate(data) {
    
        let url_verifydoc = API_URL + "coaffiliate/insert";
        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(dataJson) {
            
            //return state true or false in objmodel
            console.log(dataJson)
            return dataJson;
        })
        .catch(function(err) {
            console.error(err);
            return undefined;
        });
    }


    // get profile picture
    async getProfilePicture(idUser) {

        let url = API_USR + "/profilePicture/" + idUser;

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

    // TODO
    async getPatrocinioTree() {
        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "tree/Affiliate/" + id;
        // let url = API_URL + 'tree/residual/12858';
        let user = AuthService.getCurrentUser();

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

    // Get suscription
    async getSuscription() {
        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "suscription/user/" + id;
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
    async getSuscriptionv2() {
        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "suscription/payment/" + id;
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

    // Get suscription upgrade
    async getUpgradePackages() {
        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "suscription/upgrade/" + id;
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
    // Get suscription by ID suscripcion
    async getSuscriptionById(id) {

        let url = API_URL + "suscription/" + id;
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

    // Get Schedule - first inmplement
    async getSchedule(idSuscription) {
        //console.log("schedule");
        let url = API_URL + "membershipPayDetail/schedules/" + idSuscription;
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

    // Get schedule with tickets
    async getScheduleTickets(idSuscription) {
        //console.log("schedule");
        let url = API_URL + "affilliatependingcronogram/affiliatependingcronogramlist/" + idSuscription;
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

    // Get Schedule with ticket as image 
    async getScheduleWithImages(idSuscription) {
        //console.log("schedule");
        let url = API_URL + "affilliatependingcronogram/affiliateCronogramBySuscription/" + idSuscription;
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

    // Get Schedule with ticket as image 
    async getScheduleByIdSus(idSuscription) {
        //console.log("schedule");
        let url = API_URL + "membershipPayDetail/schedule/" + idSuscription;
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

    // Get register for placemen t: user that are not positions
    async getRegPlacement() {
        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "tree/placement/upliners/" + id;
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

    async getUpLiner(id) {

        let url = API_URL + "tree/placement/upliners/" + id;
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

    // Get sponsors
    async getSponsors() {
        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "coaffiliate/sponsoredList/" + id;
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

    // Get sponsors using a parameter
    async getSponsorsSearch(parameter) {
        parameter.IdSocio = Number(AuthService.getCurrentIdUser());
        // console.log(parameter)
        let url = API_URL + "affiliate/listPartners/search";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(parameter),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                //return state true or false in objmodel
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // Get number of branch
    async getNumberBranch() {

        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "affiliate/listPartners/numberBranch/" + id;
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
    // TODO 
    async getActivations() {
        let id = AuthService.getCurrentIdUser();
        let url = API_URL + "suscription/user/" + id;
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

    // Service to dashboard
    // TODO
    async getDashBoard(id) {
        //console.log("er");
        let url = API_URL + "dashboard/profile/" + id;
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

    async getInfoState(id){
        
        let url = API_URL + "dashboard/partnerState/" + id;
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

    async getInfoScore(id){
        let url = API_URL + "dashboard/score/" + id;
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

    async getInfoResidual(id){
      
        let url = API_URL + "dashboard/score/residual/" + id;
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

    async getInfoCompuesto(id){
        let url = API_URL + "dashboard/score/compuesto/" + id;
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

    async getInfoRange(id){
     
        let url = API_URL + "dashboard/rangesection/" + id;
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
    // End dashboard


    getInformationAccount() {
        let url_account = API_URL + "account";
        let ac = {
            accountSoles: "2323 1234 1234",
            accountInterSoles: "2314 5678 3214",
            accountDolars: "4321 3576 1234",
            accountInterDolars: "3254 7678 4509",
        };
        return ac;
        // return await fetch(url_account
        // })
        // .then(res => res.json())
        // .then(response => {
        //     //console.log(response);
        //     if(response.access_Token !== null) {
        //         sessionStorage.setItem("user",  JSON.stringify(response));
        //         sessionStorage.setItem("islogged", true);
        //     }
        //     return response;

        // })
        // .catch(error => {
        //     //console.log(error);
        //     return undefined;
        // });
    }

    async isDocumentRegistered(data) {
        //console.log(data)
        let url_verifydoc = API_USR + "/verifydocument";
        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                //return state true or false in objmodel
                return dataJson.objModel;
            })
            .catch(function (err) {
                console.error(err);
                return false;
            });
    }

    async isEmailRegistered(data) {
      
        let url_verifydoc = API_USR + "/verifyemail";
        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                let flag = false;
                if (dataJson.objModel == 1) {
                    flag = true;
                }

                return flag
            })
            .catch(function (err) {
                console.error(err);
                return false;
            });
    }

    async isNumberAccountRegistered(data) {
     
        let url_verifydoc = API_URL + "AccountBank/CheckExistence/accountNumber";
        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                let flag = false;
                if (dataJson.objModel == 1) {
                    flag = true;
                }

                return flag
            })
            .catch(function (err) {
                console.error(err);
                return false;
            });
    }
    async isNumberCciRegistered(data) {

        let url_verifydoc = API_URL + "AccountBank/CheckExistence/cci";
        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                let flag = false;
                if (dataJson.objModel == 1) {
                    flag = true;
                }

                return flag
            })
            .catch(function (err) {
                console.error(err);
                return false;
            });
    }
    async isNumberAccountUpdateRegistered(data) {

        let url_verifydoc = API_URL + "AccountBank/CheckExistence/update/accountNumbe";
        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                let flag = false;
                if (dataJson.objModel == 1) {
                    flag = true;
                }

                return flag
            })
            .catch(function (err) {
                console.error(err);
                return false;
            });
    }
    async isNumberCciUpdateRegistered(data) {
       
        let url_verifydoc = API_URL + "AccountBank/CheckExistence/update/cci";
        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                let flag = false;
                if (dataJson.objModel == 1) {
                    flag = true;
                }

                return flag
            })
            .catch(function (err) {
                console.error(err);
                return false;
            });
    }

    //recover password
    async recoverPassword(data) {
        let url_verifydoc = API_USR + "/ExecuteRecovery";
        return await fetch(url_verifydoc, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // Register user
    async registerUser(data) {

        let url = API_URL + "register/insert";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // Register user v2
    async registerUserv2(data) {

        let url = API_URL + "register/registrar";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // Register vouchers from after payment
    async registerVouhers(data) {

        let url = API_URL + "Voucher/loadVoucherPaymentLater";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }
    // Register vouchers from after payment V2
    async registerVouhersV2(data) {

        let url = API_URL + "membershipPayDetail/pay/later";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    /**
     * To update sucription after pay with paypal
     * @param {*} idSuscription 
     */
    async registerPaypal(idSuscription) {

        let url = API_URL + "suscription/update/" + idSuscription;
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

    /**
     * To update sucription after pay with paypal and add code of ppaypal
     * @param {*} idSuscription 
     * @param {*} code 
     */
    async registerPaymentPayPal(idSuscription, code, mount) {

        let url = API_URL + "suscription/update/" + idSuscription + "?nroOperation=" + code + "&amount=" + mount;
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




    //Start recovery pasword 
    async startRecovery(data) {

        let url_verifydoc = API_USR + "/StarRecovery";

        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // Recovery password
    async recoveryPassword(data) {
        //console.log(data)
        let url_verifydoc = API_USR + "/Recovery";

        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // List users for admin
    async getListUserForAdmin(data) {

        let url = API_URL + "User/getListUsersOfAdmin";

        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // get list user with filters
    async getListUserSearchAdmin(data) {

        let url = API_URL + "User/getListUsersOfAdmin/search";

        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    //Get suscripciotns  for admin
    async getSuscriptionByUserAdmin(idUser) {

        let url = API_URL + "suscription/admin/user/" + idUser;
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

    // Get user information by id
    async getUserById(id) {

        let url = API_URL + "User/" + id;
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





    // Get User Accounts


    async getUserAccounts(idUser) {

        let url = API_URL + "AccountBank/" + idUser;
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

    // Get Info Account by Id Account


    async getInfoAccount(idAccountBank) {

        let url = API_URL + "AccountBank/id/" + idAccountBank;
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
    // Get Info Bank by Id AccountBank


    async getInfoBank(idBank) {

        let url = API_URL + "bank/" + idBank;
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

    // Register Bank Account
    async registerBankAccount(data) {
        //console.log(data)
        let url_verifydoc = API_URL + "AccountBank/register";

        return await fetch(url_verifydoc, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

     // Update Bank Account
     async updateBankAccount(data) {

        let url_verifydoc = API_URL + "AccountBank/update";

        return await fetch(url_verifydoc, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // Delete Bank Account
    async deleteBankAccount(idBankAccount) {
        //console.log(data)
        let url_verifydoc = API_URL + "AccountBank/delete/" + idBankAccount;

        return await fetch(url_verifydoc, {
            method: 'DELETE',


        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });


    }


    // Save upliner register
    async saveUpliner(data) {

        let url = API_URL + "tree/placement/upliners/insert";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }
    /** Managament  */
    // Send message
    async sendWelcomeMsg(data) {

        let url = API_URL + "User/sendemail/welcome";

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


    async sendAlertPayment(data) {

        let url = API_URL + "User/sendemail/UploadPayment";

        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // TODO update path
    async managementAffiliate(data) {

        // let url = API_URL + "suscription/affiliates/direct";
        let url = API_URL + "tree/affiliate/direct"
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // detail payment schedule
  
    async getScheduleDatail(idSuscription){
    let url = API_URL + "suscription/detailpay/" + idSuscription;
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

    // Gestion de activacion
    // async managementAffiliatebyUser(data) {

    //     let url = API_URL + "tree/affiliate/direct";

    //     return await fetch(url, {
    //         method: 'POST',
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (dataJson) {

    //             return dataJson;
    //         })
    //         .catch(function (err) {
    //             console.error(err);
    //             return undefined;
    //         });
    // }

    async managementAffiliateFilter(data) {

        let url = API_URL + "suscription/affiliates/direct/search";

        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    async managementResidual(data) {

        // let url = API_URL + "suscription/residual";
        let url = API_URL + "tree/residual/list";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    async managementResidualFilter(data) {

        let url = API_URL + "suscription/residual/search";

        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }


    // Service to modify last schedule
    async getLastSchedule(iduser) {

        let url = API_URL + "membershipPayDetail/schedules/" + iduser;

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

    async modifySchedule(iduser, data) {

        let url = API_URL + "suscription/join/schedule/";// + iduser;

        return await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }
    //Get FamilyPackage ByPackageId
    async getFamilyPackagebyId(id) {

        let url = API_URL + "familyPackage/" + id;
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


    async saveOperation(data) {

        // console.log(parameter)
        let url = API_URL + "membershipPayDetail/insertoperation";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                //return state true or false in objmodel
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    /**
     * Save  payment of quote by paypal
     */
    async registerPaymentQuotePayPal(data) {

        let url = API_URL + "membershipPayDetail/schedule/payQuote";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    /**
     * Save  payment of quote by Quote
     */
    async registerPaymentQuoteVouhers(data) {

        let url = API_URL + "membershipPayDetail/schedule/payQuote/vouchers";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    /**
     * Save  payment of quote by Quote
     */
    async registerPaymentQuoteVouhersv2(data) {

        let url = API_URL + "membershipPayDetail/schedule/quote/pay";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

     /**
     * Save  payment of quote by Quote
     */
    async registerPaymentQuoteVouhersWallet(data) {

        let url = API_URL + "membershipPayDetail/schedule/quote/pay";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    async getInfoQuotePayment(token) {

        let url = API_URL + "tokenPayment/access?token=" + token;
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

    
    async registerPaymentQuoteWallet(data) {

        let url = API_URL + "membershipPayDetail/schedule/payQuote/wallet";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

    // Period
   
    async getPeriodByUser(data) {

        let url = API_URL + "period/user";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }
    // End period

    // Update user
    async updateUser(data){
        let url_verifydoc = API_URL + "/User/gestor/update/contacdetail";

        return await fetch(url_verifydoc, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {
                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }


    // Get comisiones
    async getComisiones(data){
       
        let url = API_URL + "bonus";
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dataJson) {

                return dataJson;
            })
            .catch(function (err) {
                console.error(err);
                return undefined;
            });
    }

}

export default new UserService();