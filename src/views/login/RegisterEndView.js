import React, { Component } from 'react';
import { Button, Image, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../images/logo.png'

import history from '../navigation/history';

export default class RegisterEndView extends Component{

    constructor(props) {
        super(props);
        this.state = {
            reload: props.reload
        }
    }
    onEventClcik = (e) => {
        e.preventDefault();
        if(this.state.reload !== undefined && !this.state.reload){
            history.push("/home");
        } else {
            window.location.reload(false);
        }
       
        
    }
    render(){
        return(
            <div className="register-inner">
                <Form style={{textAlign:'center'}}>
                    <Image src={logo} fluid></Image>
                    <hr className="line"></hr>
                    <Form.Group>
                        <h4 className="textMessage">Estamos validando ...</h4>
                        <Form.Label className="textMessage">Muy pronto serás parte de la familia inResorts. </Form.Label>
                        <Form.Label className="textMessage">Te enviaremos un correo con la confirmación de tu registro.</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Button onClick={this.onEventClcik}>Volver al inicio</Button>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}