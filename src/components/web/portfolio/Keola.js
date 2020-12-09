import React, { Component } from 'react';
import { Navbar, Image, Nav, Button, Container, Form, Modal, Card, CardDeck, InputGroup, Carousel } from 'react-bootstrap';

import banner1 from '../../../images/sections/banner2.png';
import cel from '../../../images/products/cel.png';

import discount from '../../../images/products/discount.png';
import ecommerce from '../../../images/products/ecommerce.png';
import money from '../../../images/products/monetization.png';

import alliance from '../../../images/products/alliance.png';
import socialnetwork from '../../../images/products/socialnetwork.png';
import partner from '../../../images/products/socio.png';

import 'bootstrap/dist/css/bootstrap.min.css';

import { FaEyeSlash, FaEye } from 'react-icons/fa';

export default class Keola extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }
   

    render() {
        const fn = function () {
            /* do your action */
        }

        return (
            <div style={{ background: "white" }}>

                <Card>
                    <Card.Img src={banner1} alt="Card image" />
                    <Card.ImgOverlay>


                    </Card.ImgOverlay>
                </Card>
                
                <main id="main">
                    <section id="info-keola">
                        <div className="container">
                            <h2>¿Qué es KeOla?</h2>
                            <p>KeOla es una plataforma de network marketing que está rompiendo récords a nivel mundial KeOla avanza a velocidad de crucero, ya no basta con ser solo distribuidos ahora puedes ser CO DUEÑO! Genera retención del 80% vs retenciones de 20 o 15%.</p>
                        </div>
                    </section>
                    <hr className="line-divider"></hr>
                    <section id="benefits">
                        <div className="container">
                            <div className="header">
                                <h2>Formas de Ganar con KeOla</h2>
                                <p>Y tú ¿cuántas maneras de ganar ya estás disfrutando?</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-5">
                                <div class="benefits-item wow fadeInUp">
                                    <img src={discount} alt=""/>
                                    <div class="benefits-overlay">
                                    <div class="benefits-title">
                                        <h2 class="wow fadeInUp">Descuentos y promociones</h2>
                                    </div>
                                    <div class="benefits-info">
                                        <p class="wow fadeInUp">Ganas por tus ahorros generados en la Zona de Descuentos.</p></div>
                                    </div>
                                </div>

                                <div class="benefits-item wow fadeInUp">
                                    <img src={ecommerce} alt=""/>
                                    <div class="benefits-overlay">
                                    <div class="benefits-title">
                                        <h2 class="wow fadeInUp">COMERCIO ELECTRÓNICO</h2>
                                    </div>
                                    <div class="benefits-info">
                                        <p class="wow fadeInUp">Tiendas, prodcutos, servicios, contenido, clasificados y empleos...+</p></div>
                                    </div>
                                </div>

                                <div class="benefits-item wow fadeInUp">
                                    <img src={money} alt=""/>
                                    <div class="benefits-overlay">
                                        <div class="benefits-title">
                                            <h2 class="wow fadeInUp">FIDELIZACIÓN, PUNTOS Y MONETIZACIÓN</h2>
                                        </div>
                                        <div class="benefits-info">
                                            <p class="wow fadeInUp">Acumulas puntos... Luego canjealos por productos y servicios, gracias al Monedero.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="col-lg-4 col-md-2">
                                    <div className="center">
                                        <img src={cel}></img>
                                    </div>
                            </div>
                            <div className="col-lg-4 col-md-5">
                                <div class="benefits-item wow fadeInUp">
                                    <img src={discount} alt=""/>
                                    <div class="benefits-overlay">
                                    <div class="benefits-title">
                                        <h2 class="wow fadeInUp">AGENTES COMERCIALES</h2>
                                    </div>
                                    <div class="benefits-info">
                                        <p class="wow fadeInUp">Agente de Promoción, Delivery y Compras.</p></div>
                                    </div>
                                </div>

                                <div class="benefits-item wow fadeInUp">
                                    <img src={ecommerce} alt=""/>
                                    <div class="benefits-overlay">
                                    <div class="benefits-title">
                                        <h2 class="wow fadeInUp">REDES SOCIALES</h2>
                                    </div>
                                    <div class="benefits-info">
                                        <p class="wow fadeInUp">Fotos, videos y mensajería.</p></div>
                                    </div>
                                </div>

                                <div class="benefits-item wow fadeInUp">
                                    <img src={money} alt=""/>
                                    <div class="benefits-overlay">
                                        <div class="benefits-title">
                                            <h2 class="wow fadeInUp">ZONA DE SOCIOS</h2>
                                        </div>
                                        <div class="benefits-info">
                                            <p class="wow fadeInUp">Ganas convirtiendote en Asociado (Copropietario). Ganas haciendo Marketing de Recomendación.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>
            </div >

        );
    }
}