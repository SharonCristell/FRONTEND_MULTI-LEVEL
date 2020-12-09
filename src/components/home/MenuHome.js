import React, { Component } from 'react'
import {Form,Row, Col, Card, Table, Button, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// chatBot

import ChatBotIntech from "../chatbot/ChatBot";

import icon1 from '../../images/icons/partner.png';
import icon2 from '../../images/icons/settings.png';
import icon3 from '../../images/icons/team.png';
import icon4 from '../../images/icons/money.png';
import icon5 from '../../images/icons/shopping-cart.png';

export default class MenuHome extends Component {
    constructor(props){
        super(props);
        this.state = {
            showMenuHome: true,
            showMenuSocio: false,
            showMenuTool: false,
            showMenuNet: false,
            showMenuPay: false,
            showMenuShop: false
            
        }
    }
    
    onClicked = (e, path) => {
        this.props.onClick(e, path);
    }

    hideComponent(name) {
        //console.log(name);
        switch (name) {
            case "showMenuHome":
                this.setState({ 
                    showMenuHome: this.state.showMenuHome = true,
                    showMenuSocio: this.state.showMenuSocio = false,
                    showMenuTool: this.state.showMenuTool = false,
                    showMenuNet: this.state.showMenuNet = false,
                    showMenuPay: this.state.showMenuPay = false,
                    showMenuShop: this.state.showMenuShop = false });
                break;
            case "showMenuSocio":
                this.setState({ 
                    showMenuHome: this.state.showMenuHome = false,
                    showMenuSocio: this.state.showMenuSocio = true,
                    showMenuTool: this.state.showMenuTool = false,
                    showMenuNet: this.state.showMenuNet = false,
                    showMenuPay: this.state.showMenuPay = false,
                    showMenuShop: this.state.showMenuShop = false 
                });
                break;
            case "showMenuTool":
                this.setState({ 
                    showMenuHome: this.state.showMenuHome = false,
                    showMenuSocio: this.state.showMenuSocio = false,
                    showMenuTool: this.state.showMenuTool = true,
                    showMenuNet: this.state.showMenuNet = false,
                    showMenuPay: this.state.showMenuPay = false,
                    showMenuShop: this.state.showMenuShop = false
                 });
                break;
            case "showMenuNet":
                this.setState({ 
                    showMenuHome: this.state.showMenuHome = false,
                    showMenuSocio: this.state.showMenuSocio = false,
                    showMenuTool: this.state.showMenuTool = false,
                    showMenuNet: this.state.showMenuNet = true,
                    showMenuPay: this.state.showMenuPay = false,
                    showMenuShop: this.state.showMenuShop = false 
                 });
                break;
            case "showMenuPay":
                this.setState({ 
                    showMenuHome: this.state.showMenuHome = false,
                    showMenuSocio: this.state.showMenuSocio = false,
                    showMenuTool: this.state.showMenuTool = false,
                    showMenuNet: this.state.showMenuNet = false,
                    showMenuPay: this.state.showMenuPay = true,
                    showMenuShop: this.state.showMenuShop = false 
                 });
                break;
            case "showMenuShop":
                this.setState({ 
                    showMenuHome: this.state.showMenuHome = false,
                    showMenuSocio: this.state.showMenuSocio = false,
                    showMenuTool: this.state.showMenuTool = false,
                    showMenuNet: this.state.showMenuNet = false,
                    showMenuPay: this.state.showMenuPay = false,
                    showMenuShop: this.state.showMenuShop = true 
                 });
                break;
            default:
                this.setState({ showMenuHome: this.state.showMenuHome = true });
            
        }

        this.props.onChange(this.state);
    }

    render() {
        return (
            <div className="menu-content">
                        <Row>
                            <Col sm={1}></Col>
                            <Col xs={2} sm={2}>
                              <div className="menu-item">
                                {/* <a  onClick={e => this.onClicked(e, "/sign-up")}> */}
                                <a  onClick={e => this.hideComponent("showMenuSocio")}>
                                <Image className="col-image" src={icon1}  ></Image>
                                <p >Nuevo Socio</p>
                                </a> 
                              </div>
                            </Col>
                            <Col  xs={3} sm={2}>
                              <div className="menu-item">
                                {/* <a onClick={e => this.onClicked(e, "/sign-up")}> */}
                                <a  onClick={e => this.hideComponent("showMenuTool")}>
                                <Image className="col-image" src={icon2} ></Image>
                                <p style={{wordBreak: 'break-all'}}>Herramientas</p>
                                </a>
                              </div>
                            </Col>
                            <Col  xs={2} sm={2}>
                              <div className="menu-item">
                                <a onClick={() => this.hideComponent("showMenuNet")}>
                                <Image className="col-image" src={icon3} ></Image>
                                <p >Mi Red</p>
                                </a>
                              </div>
                            </Col>
                            <Col  xs={3} sm={2}>
                              <div className="menu-item">
                                <a onClick={() => this.hideComponent("showMenuPay")}>
                                <Image className="col-image" src={icon4} ></Image>
                                <p style={{wordBreak: 'break-all'}}>Comisiones y Pago</p>
                                </a>
                              </div>
                            </Col>
                            <Col  xs={2} sm={2}>
                              <div className="menu-item">
                                <a onClick={() => this.hideComponent("showMenuShop")}>
                                <Image className="col-image" src={icon5} ></Image>
                                <p >Tienda</p>
                                </a>
                                </div>
                            </Col>
                            <Col sm={1}></Col>
                        </Row>
                        
                    </div>
                    
        );
    }
}