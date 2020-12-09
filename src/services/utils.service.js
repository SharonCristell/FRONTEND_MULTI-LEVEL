import jwt from 'jsonwebtoken';

const proxyurl = "https://cors-anywhere.herokuapp.com/";
// const proxyurl = "";

// // Production
// const API_URL = proxyurl + 'https://api.inresorts.club/api';

// Test
const API_URL = proxyurl + 'http://45.66.156.160:60/api';

class UtilService {

    async getResidences() {
        let url = API_URL + "/country/countrieslist";
        
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

    async getTypeDocByNat(idNationality) {
        let url = API_URL + "/DocumentType/" + idNationality;
        
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

    async getTypeDocDefault() {
        let url = API_URL + "/DocumentType/foreign";
        
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

    async getPackages() {
        let url = API_URL + "/familyPackage";
        
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

    async getExchanges() {
        let url = API_URL + "/TipoCambio/getexchange";
        
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

    async getTypeBank() {
        let url = API_URL + "/TipoPago/listTipoPago";
        
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


    async getPackageById(id) {
        let url = API_URL + "/package/" + id ;
        
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

    // Verify code promotion
    async verifyCode(code) {

        let data = {};
        data.codPromotion = code;
        let url = API_URL + "/promotion/search";
        
        return await fetch(url, {
            method:'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            return response;
        })
        .catch(error => {
            //console.log(error);
            return undefined;
        });
    }

    ///Get BankNameBy Nationality
    async getBankNameByNat(idNationality) {
        let url = API_URL + "/bank/country/" + idNationality;
        
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

    // To get range by username
    async getRangeByUsername(username) {

        let data = {};
        data.username = username;
        let url = API_URL + "/range/byusername";
        
        return await fetch(url, {
            method:'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            return response;
        })
        .catch(error => {
            //console.log(error);
            return undefined;
        });
    }

}

export default new UtilService();