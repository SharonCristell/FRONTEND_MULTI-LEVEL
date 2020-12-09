import React, { Component } from 'react';
import { Navbar, Image, Jumbotron, CardGroup, Row, Col, Nav, Button, Container, Form, Modal, Card, CardDeck, InputGroup, Carousel } from 'react-bootstrap';

import laptop from '../../images/home/laptop.png';
import phone from '../../images/home/phone.png';

import share from '../../images/icons/share.png';
import planet from '../../images/icons/planet.png';
import dartboard from '../../images/icons/dartboard.png';

import 'bootstrap/dist/css/bootstrap.min.css';

import { FaEyeSlash, FaEye } from 'react-icons/fa';

import history from '../../views/navigation/history';
import Footer from './Footer';
import FooterBanner from './FooterBanner';
import FooterMenu from './FooterMenu';

export default class HomeIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            username: '',
            password: '',
            isShow: false,
            validate: false,
            showModal: false
        };
    }
    
    OnClicked = (e, path) => {
        history.push(path);
    
    }




    render() {

        return (
            <div style={{ background: "white" }}>
                {/* ================================
                Header
                ================================ */}
                <section id="intro">
                    <div className="intro-content">
                        <h2>EL CIELO NO ES EL LÍMITE</h2>
                        <h3>Ahora puedes acceder a proyectos de inversión con muchos beneficios 100% online</h3>
                        <div>
                            <a className="btn-get-started" onClick={e => this.OnClicked(e, "/portfolio")}>Ver más</a>
                            <a className="btn-register" onClick={e => this.OnClicked(e, "/register-in")}>Registrarme</a>
                        </div>
                    </div>
                </section>
                <main id="main">
                {/* =======================
                Quinese somos
                ======================= */}
                <section id="info"  className="wow fadeInUp">
                    <div className="container">
                    <div className="section-header">
                        <h2>¿Quiénes somos?</h2>
                        <p>Ayudamos a la gente a crear una cartera de inversión inteligente y alcanzar la tan anhelada libertad financiera.</p>
                        <p>Inspirados por el deseo de hacer que el networking sea más rentable para todos, InClub toma lo mejor de los mercados de inversión y ofrece una plataforma para invertir en los más rentables y modernos proyectos.</p>
                        <br></br>
                        <p>InClub te da oportunidades de invertir en muchos rubros como immobiliario, técnologico, transporte, etc. Con una amplia gama de beneficios como ningún otro club de inversión.</p>

                    </div>
                    </div>
                </section>
                <div>
                    <hr className="line-divider"></hr>
                </div>
                {/* =======================
                Oportunidades
                ======================= */}
                <section id="oportunities">
                    <div className="container">
                        <div className="section-header">
                            <h2>Oportunidades y beneficios para ti</h2>
                        </div>
                    <div className="row">

                        <div className="col-lg-4">
                        <div className="box wow">
                            {/* <div className="icon"><i className="fa fa-bar-chart"></i></div> */}
                            <img src={dartboard}></img>
                            <p className="description">Impulsa el comercio y elimina intermediarios innecesarios.</p>
                        </div>
                        </div>

                        <div className="col-lg-4">
                        <div className="box wow">
                            {/* <div className="icon"><i className="fa fa-bar-chart"></i></div> */}
                            <img src={share}></img>
                            <p className="description">Una creciente presencia en la red con miembros en los siete continentes.</p>
                        </div>
                        </div>

                        <div className="col-lg-4">
                        <div className="box wow">
                            {/* <div className="icon"><i className="fa fa-bar-chart"></i></div> */}
                            <img src={planet}></img>
                            <p className="description">Asociaciones de afiliados asegurados en todo el mundo.</p>
                        </div>
                        </div>

                    </div>
                    </div>
                </section>
                {/* =======================
                Images 1
                ======================= */}
                <section id="about" className="wow fadeInUp">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 about-img" style={{marginRight: '-15px'}}>
                                <img src={laptop} alt=""/>
                            </div>
                        
                            <div className="col-lg-6 content">
                                <h2>Más poder</h2>
                                <h2>Más rendimiento</h2>
                                <h2>Más pro</h2>
                                {/* <h3>text</h3> */}

                                <p>Creemos que la clave del éxito es utilizar la última tecnología para construir un negocio que todos adoren.</p>
                        
                            </div>
                        </div>
                    </div>
                </section>
                <section id="about-right" className="wow fadeInUp">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 content">
                                <h3>Empoderar a nuestros miembros para ser líderes en la industria de redes en línea.</h3>

                                <h2>Dirige tu negocio sin limitaciones</h2>
                                <p>Los miembros son recompensados por el éxito de los conceptos internos y externos gracias a la masa crítica de los usuarios.</p>
                            </div>
                            <div className="col-lg-6 about-img">
                                <img src={phone} alt=""/>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ====================
                section: footer banner
                ==================== */}
                
                {/* Footer menu */}
                <FooterBanner></FooterBanner>
                <FooterMenu></FooterMenu>
                </main>
                {/* ==========================
                    Footer
                ========================== */}

                <Footer></Footer>
                {/* <footer id="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 copyright">
                                <strong>&copy; 2020 InClub, Todos los derechos reservados</strong>.
                            </div>
                            <div className="col-lg-6 social">
                                    <ul className="social-icons">
                                        <li><a className="facebook" href="https://www.facebook.com/"><img src={facebook}></img></a></li>
                                        <li><a className="youtube" href="https://www.youtube.com/"><img src={youtube}></img></a></li>   
                                    </ul>    
                            </div>
                        </div>
                    </div>
                </footer> */}
            </div >

        );
    }
}