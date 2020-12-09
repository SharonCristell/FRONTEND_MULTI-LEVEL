import React, { Component } from 'react'
import { Button, Form, Card, Dropdown, Row, Col } from 'react-bootstrap' 
import  'bootstrap/dist/css/bootstrap.min.css';

// Setting
export default class StepSettings extends Component {
    constructor(props){
        super(props);
        this.state={
            sponsor: false,
            payment: false,
            initial: false,
        }
    }
    handleSponsor = (e) => {
        //console.log("Sponsor");
        this.setState({
            sponsor: !this.state.sponsor
        });
    }

    handlePayments = (e) => {
        //console.log("payments");
        this.setState({
            payment: !this.state.payment
        });
    }

    handleInitial= (e) => {
        //console.log("Initial");
        this.setState({
            initial: !this.state.initial
        });
    }
    render() {
        return (
            <Form>
                <Form.Label className="content-subtitle">Configuración avanzada</Form.Label>

                <Form.Group controlId="formSetting">
                    <Form.Group>
                        <Card >
                            <Card.Header style={{background:'#7ebbf5'}}>
                                <Form.Check type='checkbox' onChange={e => this.handleSponsor(e)}
                                    checked={this.state.sponsor}
                                    label="Editar solo si desea cambiar el Patrocinador">
                                </Form.Check>
                            </Card.Header>
                            <Form.Group style={{padding:10}}>
                                <Form.Label>Patrocinador</Form.Label>
                                <Form.Control as="select"
                                    disabled={!this.state.sponsor}>
                                    <option>Carlos</option>
                                    <option>Pepito</option>
                                    <option>Mateo</option>
                                </Form.Control>
                            </Form.Group>
                            {/* <Dropdown>
                                <Dropdown.Toggle>Seleccione patrocinador</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>Laura Sanchez</Dropdown.Item>
                                    <Dropdown.Item>Marta Sanchez</Dropdown.Item>
                                    <Dropdown.Item>Julia Sanchez</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </Card>
                    </Form.Group>

                    <Form.Group>
                        <Card>
                            <Card.Header style={{background:'#7ebbf5'}}>
                                <Form.Check type="checkbox" onChange={e => this.handlePayments(e)}
                                    checked={this.state.payment}
                                    label="Editar si desea modificar su Cronograma de Pagos">
                                </Form.Check>
                            </Card.Header>
                            <Form.Group style={{padding:10}}>
                                <Form.Label>Tipo de usuario</Form.Label>
                                <Form.Control as="select"
                                    disabled={!this.state.payment}>
                                    <option>Multinivel</option>
                                    <option>Básico</option>
                                </Form.Control>
                            </Form.Group>
                        </Card>
                    </Form.Group>

                    <Form.Group>
                        <Card>
                            <Card.Header style={{background:'#7ebbf5'}}>
                                <Form.Label>Día de pago de las cuotas </Form.Label>
                            </Card.Header>
                            {/* <Form.Group>
                                <Row md="auto">
                                    <Col>
                                        <Form.Label>A partir de: </Form.Label>
                                        <Form.Control as='select'></Form.Control>
                                    </Col>
                                    <Col>
                                        <Form.Check type="checkbox" 
                                            label="¿Válido para inicial?"></Form.Check>
                                    </Col>
                                </Row>
                            </Form.Group> */}
                            <Form.Group style={{padding:10}}>
                                <Form.Label>A partir de: </Form.Label>
                                        <Form.Control as='select'></Form.Control>
                                    <Form.Check type="checkbox" onChange={e => this.handleInitial(e)}
                                            checked={this.state.initial}
                                            label="¿Válido para inicial?"></Form.Check>
                                   
                            </Form.Group>
                        </Card>
                    </Form.Group>

                    

                </Form.Group>
            </Form>
        );
    }
}