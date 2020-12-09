

const proxyurl = "https://cors-anywhere.herokuapp.com/";
// const proxyurl = "";

// // Production
// const  API_URL = proxyurl + 'https://api.inresorts.club/api/';

// Test
const API_URL = proxyurl + 'http://45.66.156.160:60/api/';



class ShopService {

    // Process buy new suscription
    async registerNewSuscription(data){
        let url= API_URL + "store/buy";

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

    // Process buy new suscription
    async registerUpgradeSuscription(data){
        let url= API_URL + "store/upgrade";

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

export default new ShopService();