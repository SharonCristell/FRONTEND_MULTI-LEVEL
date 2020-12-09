import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default  class RegisterBeneficiary extends Component {

    render(){
        return (
            <div>
                {/* <Form.Group> */}
                    <hr></hr>
                    <h5>Co-Solicitante (opcional)</h5>
                    <Form.Group>
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control placeholder="Nombres"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control placeholder="Apellidos"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Tipo de documento *</Form.Label>
                        <Form.Control as="select" defaultValue={'DEFAULT'}>
                            <option value="DEFAULT" disabled>Seleccione una opción</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nro. de documento</Form.Label>
                        <Form.Control placeholder="Nro. de documento"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Fecha de nacimiento *</Form.Label>
                        <Form.Control type="date"></Form.Control>
                    </Form.Group>
                {/* </Form.Group> */}
            </div>
        );
    }
}