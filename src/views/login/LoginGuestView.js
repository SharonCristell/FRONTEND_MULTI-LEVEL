import React, { Component } from 'react';

import  Login  from '../../components/login/Login';
import LoginGuest from '../../components/login/LoginGuest';
// import '../styles/Login';


export default class LoginGuestView extends Component{
  
  handleLogged = (isLogged) => {
    //console.log("login view", isLogged);
    if(this.props.isLogged){
        this.props.isLogged(isLogged);   
    } 
  }
  render(){
    return(
      <div className="auth-wrapper">
        <div className="auth-inner">
          <LoginGuest isLogged={this.handleLogged}></LoginGuest>
        </div>
      </div>
    );
  }
}
