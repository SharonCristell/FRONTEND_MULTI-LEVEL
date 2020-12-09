import React, { Component } from 'react';

import  Portfolio from '../../components/web/portfolio/Portfolio';
import FooterBanner from '../../components/web/FooterBanner';
import FooterMenu from '../../components/web/FooterMenu';
import Footer from '../../components/web/Footer';
// import '../styles/Login';


export default class PortfolioView extends Component{
 
  render(){
    return(
      <div>
        <div>
          <Portfolio></Portfolio>
          <main id="main">
             <FooterBanner></FooterBanner>
             <FooterMenu></FooterMenu>
          </main>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}
