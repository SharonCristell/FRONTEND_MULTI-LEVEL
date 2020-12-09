import React, { Component } from 'react';
import {Carousel, Row, Col,Spinner, Button, Image, Modal, Form} from 'react-bootstrap';
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
import UserService from '../../services/user.service';

export default class HomeGuestView extends Component {

    constructor(props){
        super(props);

        this.state = {
            loading: true,
            empty: true,
            idUser: 0,
            eventState:{
                showMenuHome: true,
                showMenuSocio: false,
                showMenuTool: false,
                showMenuNet: false,
                showMenuPay: false,
                showMenuShop: false
            }
        }

        this.getDataUrl = this.getDataUrl.bind(this);
    }

    componentDidMount() {
        this.getDataUrl();
    }

    async getDataUrl() {
        let url = window.location;
        let params  = url.search;
        let listParams = params.split('=');

        // [1] is idsocio
        // console.log(listParams)
        if(listParams[1] !== undefined){
            let response = await AuthService.getUserInformationAsync(Number(listParams[1]));
            
            if(response !== undefined) {
                let id = AuthService.getCurrentIdUser();
                this.setState({
                    loading: this.state.loading = false,
                    empty: this.state.empty = false,
                    idUser: id
                });
            } else {
                this.setState({
                    loading: this.state.loading = false,
                    empty: this.state.empty = true
                });
            }
        } else {
            this.setState({
                loading: this.state.loading = false,
                empty: this.state.empty = true
            });
        }
    
    }

    /**
     * Event of menu's component
     * @param {*} eventMenuState stat of menu component to show Views
     */
    eventMenu = (eventMenuState) => {
        this.setState({ eventState: this.state.eventState = eventMenuState });
        //console.log("event menu");
    };

    render() {
        const { loading, empty, eventState, idUser } = this.state;

        return(
            <div className="register-form">
                {loading && 
                    <div style={{textAlign: 'center'}}>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p>Obteniendo información ...</p>
                    </div>
                }
                {!loading && empty && 
                    <div style={{textAlign: 'center'}}>
                        <Form.Label>Ocurrió un problema al obtener información de socio</Form.Label>
                    </div>
                }
                {!loading && !empty &&
                    <div>
                        <Carousel>
                            <Carousel.Item>
                                <Image className="d-block w-100" src={logo3}/>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Image className="d-block w-100" src={logo4} />
                            </Carousel.Item>
                        </Carousel>

                        <div  className="home-container">
                        <MenuHome onChange={this.eventMenu} onClick={this.onClicked}></MenuHome>
                        <hr></hr>
                        <div>
                            {eventState.showMenuHome && <MainView idUser={idUser}></MainView>}
                            {eventState.showMenuSocio && <div>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Label> Esta vista a sido deshabilitada para este modo.</Form.Label>
                                    </Col>
                                </Row>
                            </div>
                            }
                            {eventState.showMenuTool && <ToolView></ToolView>}
                            {eventState.showMenuNet && <NetworkView></NetworkView>}
                            {eventState.showMenuPay && <PayView></PayView>}
                            {eventState.showMenuShop && <div>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Label> Esta vista a sido deshabilitada para este modo.</Form.Label>
                                    </Col>
                                </Row>
                            </div>}
                        </div>
                    </div>

                    </div>
                }
            </div>
        )
    }
}