import React, { Component } from 'react';
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AboutView extends Component {

    constructor(props) {
        super(props);
    }
   //insertando razon
    render() {
        return (
            <div className="modal-custom">
                <Form>
                    <Form.Group >
                        <Form.Label>Razon Social: </Form.Label>
                        <Form.Text>VALLE ENCANTADO SAC</Form.Text>
                    </Form.Group>

                    <Form.Group >
                        <Form.Label>Ruc:</Form.Label>
                        <Form.Text>20601460271 </Form.Text>
                    </Form.Group>

                    <Form.Group >
                        <Form.Label>Cuenta Corriente Soles BCP: </Form.Label>
                        <Form.Text>191-2606708-0-8</Form.Text>
                    </Form.Group>
                    
                    <Form.Group >
                        <Form.Label>Cuenta Corriente Dólares BCP: </Form.Label>
                        <Form.Text>191-2616687-1-90</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Cuenta Corriente Soles INTERBANK:</Form.Label>
                        <Form.Text>200-3002538987</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Cuenta Corriente Dólares INTERBANK:</Form.Label>
                        <Form.Text>200-3002538994</Form.Text>
                    </Form.Group>
                    </Form>                        
            </div>

        );
    }
}