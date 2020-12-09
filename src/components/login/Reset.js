import React, { Component } from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import history from '../../views/navigation/history';
import UserService from '../../services/user.service';


export default class Reset extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            mesagge: ""
        }
    }

    handleChange = (e, field) => {
        //console.log(field, ": ",  e.target.value);
        this.setState({
            [field]: e.target.value,
            message: ""
        });
        //console.log(this.state);
    };

    sendData = async(e) => {
        e.preventDefault();
        var data = {};
        data.username = this.state.email;

        let startRecovery = await UserService.startRecovery(data);
      
        if(startRecovery !== undefined) {
            if(startRecovery.status === 1) {
                this.sendMail();
            } else {
                this.setState({
                    mesagge: this.state.message = "Correo electrónico o usuario no esta registrado."
                });
            }
        } else {
            alert("Ocurrió un problema. Inténtelo más tarde.");
        }
       
    }

    sendMail = async() => {
        var data = {};
        data.username = this.state.email;

        let stateRecovery = await UserService.recoveryPassword(data);

        if(stateRecovery !== undefined) {
            if(stateRecovery.status === 1) {
                alert("Le hemos enviado un correo.");
                history.push("/");
            } else {
                alert("Ocurrió un problema al enviarle el correo. Inténtelo más tarde.");
            }
        } else {
            alert("Ocurrió un problema. Inténtelo más tarde.");
        }
        
    }

    render() {
        return (
                <Form>
                    <h3>Reestablece tu contraseña</h3>
                    <Form.Group>
                        <Form.Label>Ingresa tu correo electrónico o usuario: </Form.Label>
                        <Form.Control required type="email" 
                            placeholder="Ingrese su correo electrónico o usuario."
                            onChange={e => this.handleChange(e, "email")} />
                        <Form.Text className="textAlert">{this.state.message}</Form.Text >
                        <Form.Text>Recibirás un correo para reestablecer tu contraseña. </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Button onClick={this.sendData}>Reestablecer contraseña</Button>
                    </Form.Group>

            </Form>
        );
    }
    

}
