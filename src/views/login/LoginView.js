import React, { Component } from 'react';

import  Login  from '../../components/login/Login';
// import '../styles/Login';


export default class LoginView extends Component{
  
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
          <Login isLogged={this.handleLogged}></Login>
        </div>
      </div>
    );
  }
}
