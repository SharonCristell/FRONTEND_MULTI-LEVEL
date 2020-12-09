export default function authHeader() {
    const user = sessionStorage.getItem('user');

    if(user && user.access_Token) {
        return { Authorization: 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
}
