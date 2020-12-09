import React, { Component } from 'react';

import  RegisterIn from '../../components/register/RegisterIn';
import FooterMenu from '../../components/web/FooterMenu';
import Footer from '../../components/web/Footer';
// import '../styles/Login';


export default class RegisterInView extends Component{
 
  render(){
    return(
      <div>
        <div>
          <RegisterIn></RegisterIn>
          <FooterMenu></FooterMenu>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}
