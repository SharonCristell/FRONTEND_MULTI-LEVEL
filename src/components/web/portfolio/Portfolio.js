import React, { Component } from 'react';
import { Navbar, Image, Nav, Button, Container, Form, Modal, Card, CardDeck, InputGroup, Carousel } from 'react-bootstrap';

import portfolio1 from '../../../images/sections/portfolio1.png';
import inresorts1 from '../../../images/sections/inresorts1.png';
import keola1 from '../../../images/sections/keola1.png';
import proxProyec from '../../../images/sections/proxProyec.png';
import InTech from '../../../images/sections/LogoIntech.png';
import Logo from '../../../images/sections/LogoInresorts.png';

import 'bootstrap/dist/css/bootstrap.min.css';

import history from '../../../views/navigation/history';

export default class Portfolio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    OnClicked = (e, path) => {
        history.push(path);
    }
  

    render() {
        const fn = function () {
            /* do your action */
        }

        return (
            <div style={{ background: "white" }}>

                <Card >
                    <Card.Img src={portfolio1} alt="Card image" />
                </Card>
                <section id="sectors">
                     <h2>Tenemos los mejores rubros de inversión para ti...</h2>
                  
                    
                    <div className="container-fuild">
                        <div className="row">
                            <div className="col-lg-4 col-md-4">
                                <div class="sectors-item wow fadeInUp">
                                    {/* <a href="" class="portfolio-popup"> */}
                                        <img src={InTech} alt=""/>
                                        <div class="sectors-overlay">
                                        <div class="sectors-info"><h2 class="wow fadeInUp">Sector tecnológico</h2></div>
                                        </div>
                                    {/* </a> */}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div class="sectors-item wow fadeInUp">
                                    {/* <a href="" class="portfolio-popup"> */}
                                        <img src={Logo} alt=""/>
                                        <div class="sectors-overlay">
                                        <div class="sectors-info"><h2 class="wow fadeInUp">Sector immobiliario</h2></div>
                                        </div>
                                    {/* </a> */}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div class="sectors-item wow fadeInUp">
                                    {/* <a href="img/portfolio/1.jpg" class="portfolio-popup"> */}
                                        <img src={proxProyec} alt=""/>
                                        <div class="sectors-overlay">
                                        <div class="sectors-info"><h2 class="wow fadeInUp">Próximos proyectos</h2></div>
                                        </div>
                                    {/* </a> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <section id="sectors">
                    <h2>Actuales proyectos de inversión</h2>
                    <div className="container-fuild">
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="sectors-item wow fadeInUp">
                                    <img src={keola1} alt=""/>
                                    <div class="sectors-button">
                                        <div className="sector-info">
                                            <a className="btn-register btn-plus" onClick={e => {this.OnClicked(e, "/keola")}}>Ver más</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="sectors-item wow fadeInUp">
                                    {/* <a href="img/portfolio/1.jpg" class="portfolio-popup"> */}
                                        <img src={inresorts1} alt=""/>
                                        <div class="sectors-button">
                                        <div className="sector-info">
                                            <a className="btn-register btn-plus" onClick={e =>  {this.OnClicked(e, "/ribera")}}>Ver más</a>
                                        </div>
                                    </div>
                                    {/* </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
               
            </div >

        );
    }
}