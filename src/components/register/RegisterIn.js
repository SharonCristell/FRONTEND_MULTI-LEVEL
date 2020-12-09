import React, { Component } from 'react';
import { Navbar, Image, Nav, Button, Container, Form, Modal, Card, CardDeck, InputGroup, Carousel } from 'react-bootstrap';
import facebook from '../../images/icons/facebook.png';
import youtube from '../../images/icons/youtube.png';
import register1 from '../../images/sections/1.png';
import register2 from '../../images/sections/C.png';
import register3 from '../../images/sections/banner2.png';
import register4 from '../../images/sections/banner1.png';
import inresorts1 from '../../images/sections/inresorts1.png';
import keola1 from '../../images/sections/keola1.png';
import unete1 from '../../images/sections/unete1.png';
import InTech from '../../images/LogoIntech.png';
import Logo from '../../images/LogoInresorts.png';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../views/styles/Custom.css';

import { FaEyeSlash, FaEye } from 'react-icons/fa';

import history from '../../views/navigation/history';

export default class RegisterIn extends Component {

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
    handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.setState({ validate: true });
    };
    handleChange = (e, name) => {
        // //console.log(name);
        let label = e.target.name;
        let value = e.target.value;
        this.setState({
            [label]: this.state[label] = value
        });

    }




    render() {

        return (
            <div style={{ background: "white" }}>
       
                <Card className="bg-dark text-white">
                    <Card.Img src={register1} alt="Card image" />
                    <Card.ImgOverlay>
                            

                    </Card.ImgOverlay>
                </Card>
                <br></br>
                <br></br>
                
                    <div className="auth-inner">
                        <Form noValidate validate={this.validate}>

                            <h2>¿Nuevo en InClub?</h2>

                            <div className="form-group">
                                <label>Patrocinador:</label>
                                <input name='username' type="text" className="form-control" placeholder="Usuario"
                                    onChange={e => this.handleChange(e, "username")} />
                                <p className="forgot-password text-right">
                                    Enviar Recibo:
                </p>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block"
                               onClick={e => this.OnClicked(e, "/sign-in")}>Validar</button>
                  

                        <Modal
                            show={this.state.showModal}
                            onHide={this.handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Error</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Tuvimos problemas en iniciar tu sesión. Inténtalo más tarde.
                    </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Aceptar
                    </Button>
                            </Modal.Footer>
                        </Modal>
                
            </Form>
            </div>

            
            <br></br>
                <br></br>
                     
              
                <Carousel>
                   
                    <Carousel.Item>
                        <Image className="d-block w-100" src={register3}/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image className="d-block w-100" src={register4} />
                    </Carousel.Item>
                </Carousel>

                   
            </div >

        );
    }
}