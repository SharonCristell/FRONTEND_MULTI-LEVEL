import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

export default class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            password: '',
            newpassword: '',
            repassword: '',
            message: '',
            messageAlert: '',
            newMessage: ''
        }
    }

    /**
     * Method to handle the change  of properties and send it to parent 
     * @param {*} e 
     * @param {*} field 
     */
    handleChange = (e, field) => {
        let value = e.target.value;
        this.setState({
                [field]: this.state[field] = value,
                newMessage: "",
                message: "",
                messageAlert: ""
            });
       
    }

    validation = () => {
        if(this.state.password.length === 0) {
            this.setState({
                message: this.state.message = "Ingrese su contraseña." 
            });
            return false;
        }if(this.state.password !== AuthService.getCurrentKey()) {
            //console.log(AuthService.getCurrentKey());
            //console.log(this.state.password);
            this.setState({
                message: this.state.message = "Contraseña no coincide."
            });
            return false;
        } else if (this.state.newpassword.length === 0){
            this.setState({
                newMessage: this.state.newMessage = "Ingrese su nueva contraseña." 
            });
            return false;
        } else if (this.state.repassword.length === 0){
            this.setState({
                messageAlert: this.state.messageAlert = "Vuelva a ingresar su contraseña."
            });
            return false;
        } else if (this.state.newpassword !== this.state.repassword){
            this.setState({
                messageAlert: this.state.messageAlert = "Contraseñas no coinciden."
            });
            return false;
        }

        return true;
    }

    onClicked = async(e) => {
        e.preventDefault();
        //console.log("change");
        if(this.validation()){
            let data = {
                password: this.state.password,
                newpassword: this.state.newpassword
            };
            
            let response =  await  AuthService.updatePassword(data);
            if(response !== undefined && response !== null) {
                if(response.status === 0) {
                    alert(response.description)
                } else {
                    alert("Su contraseña ha sido modificada.")
                }
            } else {
                alert("Ocurrió un error, inténtelo más tarde.")
            }
        }

    }

    render() {
        return(
            <div>
                <Form>
                    <Form.Group>
                        <h4>Cambiar contraseña</h4>
                    </Form.Group>
                    <Row>
                        <Col sm={5}>
                            <Form controlid="validationPassword" >
                            <Form.Group>
                                <Form.Label>Ingrese su contraseña anterior</Form.Label>
                                <Form.Control required type="password" placeholder="Contraseña anterior"
                                                onChange={e => this.handleChange(e, "password")}></Form.Control>
                                <Form.Label className="textAlert">{this.state.message}</Form.Label>
                            </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={5}>
                            <Form >
                            <Form.Group>
                                <Form.Label>Ingrese su nueva contraseña</Form.Label>
                                <Form.Control required type="password" placeholder="Nueva contraseña"
                                                onChange={e => this.handleChange(e, "newpassword")}></Form.Control>
                                <Form.Label className="textAlert">{this.state.newMessage}</Form.Label>
                            </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={5}>
                            <Form >
                            <Form.Group >
                                <Form.Label>Vuelva a ingresar su nueva contraseña</Form.Label>
                                <Form.Control required type="password" placeholder="Reperir contraseña"
                                                onChange={e => this.handleChange(e, "repassword")} isValid={this.state.isSame}></Form.Control>
                                <Form.Label className="textAlert">{this.state.messageAlert}</Form.Label>
                            </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Button onClick={e => this.onClicked(e)}>Cambiar contraseña</Button>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}
