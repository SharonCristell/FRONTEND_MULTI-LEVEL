import React, { Component } from 'react';

import  Ribera from '../../components/web/portfolio/Ribera';
import Footer from '../../components/web/Footer';
import FooterMenu from '../../components/web/FooterMenu';
import FooterBanner from '../../components/web/FooterBanner';
// import '../styles/Login';


export default class RiberaView extends Component{
 
  render(){
    return(
      <div>
        <div>
          <Ribera></Ribera>
          <main>
              <FooterBanner></FooterBanner>
              <FooterMenu></FooterMenu>
          </main>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}
