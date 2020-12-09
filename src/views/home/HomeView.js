import React, { Component } from 'react';
import {Carousel, Row, Col, Card, Table, Button, Image, Modal, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo1 from '../../images/carousel/BANNER INCLUB-1.png';
import logo2 from '../../images/carousel/BANNER INCLUB-2.png';
import logo3 from '../../images/carousel/BANNER INRESORT FINAL.png';
import logo4 from '../../images/carousel/BANNER KEOLA-3.png';


import history from '../navigation/history';
import MainView from './MainView';
// import TreeView from '../tree/TreeView';
import RegisterMainView from '../login/RegisterMainView';
import MenuHome from '../../components/home/MenuHome';
import NetworkView from './NetworkView';
import ToolView from './Toolview';
import PayView from './PayView';
import ShopView from './ShopView';
import AuthService from '../../services/auth.service';
import LinkRegister from '../../components/register/LinkRegister';
import FlyerView from '../message/FlyerView';

import '../styles/Flyer.css';

export default class HomeView extends Component {
    constructor(props){
        super(props);

        // get idSocio from current socio
        // console.log(AuthService.getCurrentIdUser())
        let idSocio =  Number(AuthService.getCurrentIdUser());
        this.state = {
            idSocio: idSocio,
            loadSenData: false,
            eventState:{
                showMenuHome: true,
                showMenuSocio: false,
                showMenuTool: false,
                showMenuNet: false,
                showMenuPay: false,
                showMenuShop: false
            },
            showModalFlyer: false
        }

        localStorage.setItem("flyer", 1);

    }

    componentDidMount() {
        this.verifyCurrentUser();
        if(Number(localStorage.getItem("flyer")) === 0){
            console.log("true")
            this.setState({
                showModalFlyer: true,
            });
            localStorage.setItem("flyer",1 );
        }
    }

    verifyCurrentUser() {
        // console.log(this.state.idSocio)
        if(this.state.idSocio <= 0) {
            this.setState({
                loadSenData: this.state.loadSenData = true,
            });
        }
    }

    onClicked = (e, path) => {
        history.push(path);
    }

    redirect = (e) => {
        history.push('sign-in');
    }
    /**
     * Event of menu's component
     * @param {*} eventMenuState stat of menu component to show Views
     */
    eventMenu = (eventMenuState) => {
        this.setState({ eventState: this.state.eventState = eventMenuState });
        //console.log("event menu");
    };

    // handle close modal flyer
    handleClose = () => {
        this.setState({
            showModalFlyer: false
        });
    }
    
    render() {
        const { eventState, idSocio, showModalFlyer } = this.state;
        //console.log("refresh home");
        //console.log(eventState );
        return(
            <div style={{background: "white"}}>
                {/* <div style={{display: showCarrusel?'inline':'none'}}> */}
                {/* Carousel */}
                <Carousel>
                    <Carousel.Item>
                        <Image className="d-block w-100" src={logo3}/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image className="d-block w-100" src={logo4} />
                    </Carousel.Item>
                </Carousel>
                {/* </div> */}
                <div  className="home-container">
                    {/* Menu home */}
                    <MenuHome  onChange={this.eventMenu} onClick={this.onClicked}></MenuHome>
                    <hr></hr>
                    {/* Content */}
                    <div>
                        {eventState.showMenuHome && <MainView idUser={idSocio}></MainView>}
                        {eventState.showMenuSocio && <div>
                            <Row>
                                <Col sm={12}>
                                    <LinkRegister idSocio={idSocio}></LinkRegister>
                                </Col>
                            </Row>
                            <RegisterMainView idSocio={idSocio} showWallet={true}></RegisterMainView>
                        </div>
                        }
                        {eventState.showMenuTool && <ToolView></ToolView>}
                        {eventState.showMenuNet && <NetworkView></NetworkView>}
                        {eventState.showMenuPay && <PayView></PayView>}
                        {eventState.showMenuShop && <ShopView></ShopView>}
                    </div>
                </div>

                <Modal
                    show={this.state.loadSenData}
                    
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="static"
                    centered>
                    <Modal.Body>
                        <div style={{textAlign: 'center'}}>
                            <Row>
                                <Col sm={12}>
                                    <Form.Label>No pudimos obtener informacion de usuario.</Form.Label>
                                    <Form.Label>Inicie sesión nuevamente.</Form.Label>

                                </Col>
                            </Row>
                            <Button onClick={e => this.redirect(e)}>Iniciar sesión</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={showModalFlyer}
                    onHide={this.handleClose}
                    dialogClassName="modal-90w"
                    centered
                    >
                    <Modal.Header closeButton>
                       
                    </Modal.Header>
                    <Modal.Body>
                        <FlyerView></FlyerView>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            
        );
    }
}