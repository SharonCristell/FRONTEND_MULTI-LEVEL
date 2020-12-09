import React, { Component } from 'react';
import { Button, Form,  Modal, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FaEyeSlash, FaEye } from 'react-icons/fa';

import AuthService from '../../services/auth.service';
import history from  '../../views/navigation/history';

export default class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            username:'',
            password:'',
            isShow: false,
            validate:false,
            showModal: false
        };
    }
    
    handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
    
        this.setState({validate: true});
      };

    handleChange = (e, name) => {
        // //console.log(name);
        let label = e.target.name;
        let value = e.target.value;
        this.setState({
            [label]: this.state[label] = value
        });
        
    }

    handleClose = () => {
        this.setState({showModal: false});
    }

    // Show password
    showPassword = () => {

        this.setState({
            isShow: this.state.isShow = !this.state.isShow 
        });
    }


    sendLogin = async(e) => {
        e.preventDefault();
        // //console.log("Login");
        // history.push("/home")
        
        var data = {
            username: this.state.username,
            password: this.state.password
        };

        let response =  await  AuthService.login(data);
        // console.log(response)
        if(response === undefined) {
            alert('Ocurrió un problema. Inténtelo más tarde.');
                
        } else {
            if(response.access_Token!== null) {
                if(this.props.isLogged){
                    this.props.isLogged(true);
                }
                history.push("/home")
            } else {
                if(this.props.isLogged){
                    this.props.isLogged(false);
                }
                if(response.message.includes("usuario")) {
                    alert(response.message)
                } else {
                    alert('Usuario y/o contraseña incorrecto.');

                }
                
            }
        }
    };
    
    render() {
         
        return (
            <Form noValidate validate={this.validate}>
                <h3>Iniciar sesión</h3>

                <div className="form-group">
                    <label>Usuario</label>
                    <input name='username' type="text" className="form-control" placeholder="Ingresa tu usuario"
                            onChange={e => this.handleChange(e, "username")}/>
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <InputGroup className="mb-2">
                        <Form.Control 
                            name="password" 
                            type={this.state.isShow? "text": "password" }
                            placeholder="Ingresa tu contraseña"
                            onChange={e => this.handleChange(e, "password")} />
                        <InputGroup.Prepend onClick={e => this.showPassword()}>                            
                        <InputGroup.Text>
                        {this.state.isShow && <FaEyeSlash></FaEyeSlash>}
                        {!this.state.isShow && <FaEye></FaEye>}
                        </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>

                    
                </div>

                {/* <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="chkRemember" />
                        <label className="custom-control-label" htmlFor="chkRemember">Recordar inicio de sesión</label>
                    </div>
                </div> */}

                <button type="submit" className="btn btn-primary btn-block"
                        onClick={this.sendLogin}>Aceptar</button>
                <p className="forgot-password text-right">
                     <a href="/reset">¿Olvidaste tu contraseña?</a>
                </p>
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
            // <Router>
            //     <Route exact path="/home" component={HomeView} />
            // </Router>
        );
    }
}