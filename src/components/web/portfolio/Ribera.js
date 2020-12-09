import React, { Component } from 'react';

import { Navbar, Image, Nav, Container, Form, Modal, Card, Row, Col, CardDeck, InputGroup, Carousel } from 'react-bootstrap';

import portfolio1 from '../../../images/sections/bannerribera.png'
import ribera1 from '../../../images/products/ribera1.png';
import ribera2 from '../../../images/products/ribera2.png';
import ribera3 from '../../../images/products/ribera3.png';
import ribera4 from '../../../images/products/ribera4.png';

import ItemsCarousel from 'react-items-carousel';

import icon1 from '../../../images/products/icon1.png';
import icon2 from '../../../images/products/icon2.png';
import icon3 from '../../../images/products/icon3.png';
import icon4 from '../../../images/products/icon4.png';

import { RightCircleTwoTone, LeftCircleTwoTone } from '@ant-design/icons';
import { DoubleRightOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../../views/styles/RiberaStyle.css';


export default class Ribera extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            activeItemIndex: 0,
            chevronWidth: 500,
        };
    }
   

    render() {
        const fn = function () {
            /* do your action */
        }

        return (
            <div style={{ background: "white" }}>
                {/* <section id="intro-ribera">
                </section> */}

                <Card >
                    <Card.Img src={portfolio1} alt="ribera" />
                </Card>

                <section id="step">
                    <div className="container">
                        <div className="row">
                            
                            <div className="col-lg-12 content">
                                <ul>
                                    <li className="left">¿Haz invertido en algún ACTIVO IMMOBILIARIO?</li>
                                    <li>¿Y si es ainversión no solo genera RENTABILIDAD? Sino que también otras ganacias y un mejor estilo de vida para ti y tu familia.</li>
                                    <li className="right">¡Disfruta y genere ingresos a la vez!</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>
                
                <section id="carousel">
                    <ItemsCarousel
                            infiniteLoop={true}
                            gutter={12}
                            activePosition={'center'}
                            chevronWidth={60}
                            disableSwipe={false}
                            alwaysShowChevrons={false}
                            numberOfCards={4}
                            slidesToScroll={4}
                            outsideChevron={false}
                            showSlither={false}
                            firstAndLastGutter={true}
                            activeItemIndex={this.state.activeItemIndex}
                            requestToChangeActive={value => this.setState({ activeItemIndex: value })}
                            rightChevron={

                                <RightCircleTwoTone style={{ fontSize: '35px', color: '#908E8E' }} />

                            }
                            leftChevron={

                                <LeftCircleTwoTone style={{ fontSize: '35px', color: '#908E8E' }} />

                            }
                        >
                            <div style={{width: "200"}}>
                                <Image src={ribera1} rounded ></Image>
                            </div>
                            <div>
                                <Image src={ribera2} rounded></Image>
                            </div>
                            <div >
                                <Image src={ribera3} rounded></Image>
                            </div>
                            <div >
                                <Image src={ribera4} rounded ></Image>
                            </div>



                        </ItemsCarousel>
                </section>

                <section id="oportunities">
                    <div className="container">
                        <div className="section-header">
                            <h2>Beneficios para ti</h2>
                            <p>InResorts te brinda la oportunidad de ser socio y accionista de una cadena de Clubes Resorts a nivel nacional y en los próximos años a nivel internacional. Genera valor mientras disfrutas de beneficios y a la vez ten la oportunidad de referir nuestro programa, generar ingresos y ser parte de la expansión de la compañía.</p>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="box wow ribera">
                                    {/* <div className="icon"><i className="fa fa-bar-chart"></i></div> */}
                                    <img src={icon1}></img>
                                    <h4>SER CO-PROPIETARIO</h4>
                                    <p>Ser coopropietario parte dueño del hotel, gracias a lo cual también será partícipe de las ganancias del hotel.</p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="box wow ribera">
                                    {/* <div className="icon"><i className="fa fa-bar-chart"></i></div> */}
                                    <img src={icon2}></img>
                                    <h4>Y TODO ESTO COMO SI FUERA SOLO SU CLUB</h4>
                                    <p>Ingreso Libre para el Socio y sus Beneficiarios los 365 días del año.INVITADOS. También tendrá la posibilidad de llevar invitados de manera mensual.</p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="box wow ribera">
                                    {/* <div className="icon"><i className="fa fa-bar-chart"></i></div> */}
                                    <img src={icon3}></img>
                                    <h4>DISFRUTAR DE ALOJAMIENTO GRATUITO</h4>
                                    <p>Lo que le permite disfrutar de alojamiento para usted y su familia TOTALMENTE GRATIS en nuestro Hotel y Bungalows.</p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="box wow ribera">
                                    {/* <div className="icon"><i className="fa fa-bar-chart"></i></div> */}
                                    <img src={icon4}></img>
                                    <h4>Y TENER LOS MEJORES DESCUENTOS</h4>
                                    <p>En Restaurante, Servicios de Sauna, Spa, Salones de cumpleaños infantiles y más.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div >

        );
    }
}
