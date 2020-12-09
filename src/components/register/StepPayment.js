import React, { Component } from 'react';
import { Table, Form, InputGroup,
     Col, Row, Spinner, Image,
    Button, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../images/paypal-logo.png';

export default class StepPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packages : this.props.packages,
            total: "$ 100",
            totalCuotas: "$ 50"
        }
    }

    componentDidMount() {
        // // //console.log(this.props.packages);
        // Get by id
        let packages = [
            {
                id: 3,
                name: "membresia plata",
                description: "la membresia es de plata :D",
                price: 10,
                quotes: 12,
                initialPrice: 10,
                duration: "8",
                min: 2
            },
            {
                id: 4,
                name: "membresia oro",
                description: "la membresia es de oro :D",
                price: 20,
                quotes: 12,
                initialPrice: 10,
                duration: "10",
                min: 2
            }
        ]

        let tags = <tr></tr>;
        if(packages.length > 0) {
            tags = packages.map((item, idx) =>
                <tr>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td>{item.initialPrice}</td>
                            <td>{item.duration}</td>
                            <td>{item.min}</td>
                            <td>
                                <Form.Control type="number" min={item.min} max={item.duration}></Form.Control>
                            </td>
                        </tr>
            );

        }
        
        return tags;

    }

    /**
     * To handle the change in form control to control the 
     * @param {*} e 
     */
    handleChange = (e) => {
        //console.log("key");
        //console.log(e);
    }

    /**
     * To get selected packages by user
     */
    getPackages = () => {
        
        // Get by id
        let packages = [
            {
                id: 3,
                name: "membresia plata",
                description: "la membresia es de plata :D",
                price: 650,
                quotes: 12,
                initialPrice: 50,
                duration: "8",
                min: 2
            },
            {
                id: 4,
                name: "membresia oro",
                description: "la membresia es de oro :D",
                price: 20,
                quotes: 12,
                initialPrice: 10,
                duration: "10",
                min: 2
            }
        ]

        let tags = <tr></tr>;
        if(packages.length > 0) {
            tags = packages.map((item, idx) =>
                <tr>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td>{item.price - item.initialPrice}</td>
                            <td>
                                <Form.Control id={item.id} type="number" min={item.min} max={item.duration}
                                    onchange={e => this.handleChange(e)}></Form.Control>
                            </td>
                            <td>{item.initialPrice}</td>
                            <td>
                                <Form.Control id={item.id} type="number" min={item.min} max={item.duration}
                                    onchange={e => this.handleChange(e)}></Form.Control>
                            </td>
                            {/* <td>{item.price}</td> */}
                            {/* <td>
                                <Form.Control id={item.id} type="number" min={item.min} max={item.duration}
                                    onchange={e => this.handleChange(e)}></Form.Control>
                            </td> */}
                            <td>
                                <Form.Label>$</Form.Label>
                            </td>
                        </tr>
            );

        }
        
        return tags;
    }

    render(){
        const rows = this.getPackages();
        return(
            <div>
                <Form.Label className="content-subtitle">Métodos de pagos</Form.Label>

                <Form.Label>Paquete seleccionado</Form.Label>
                <Table className="tableCustom" striped bordered hover responsive="md" size="sm">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Total</th>
                            <th>Inicial</th>
                            <th>Inicial en cuotas</th>
                            <th>Precio</th>
                            <th>Inicial en cuotas</th>
                            <th>Total a pagar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                <hr></hr>
                    {/* <Form.Group>
                        <Form.Label>Código promocional</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                            placeholder="Ingresa un código"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={e => this.onChange(e, "code")}
                            />
                            <InputGroup.Append>
                                <Button variant="secondary" onClick={this.validateCode}>
                                    <Spinner animation="border" role="status"  size="sm" 
                                        style={{display: this.state.loading? 'inline-block': 'none'}}>
                                        <span className="sr-only">Validar</span>
                                    </Spinner> Validar
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                    <hr></hr> */}
                    <Form.Group style={{width:'500px'}}>
                        <Row>
                            <Col>
                            <Form.Label>Detalle</Form.Label>
                            </Col>
                            
                        </Row>
                        <Row>
                            <Col>
                                <Form.Text style={{fontSize:'14px'}}>Inicial</Form.Text>
                            </Col>
                            
                            <Col sm="2" style={{textAlign: 'right'}}>
                                <Form.Text style={{fontSize:'14px'}}>$ 50</Form.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <Form inline>
                                <Form.Text style={{fontSize:'14px'}}>Total de cuotas a pagar : &nbsp; </Form.Text> 
                                <Form.Control size="sm" type="number" min="1" max="10" defaultValue="1"
                                    onChange={e => this.handleChange(e)}
                                    ></Form.Control>
                                </Form>
                            </Col>
                           
                            <Col sm="2" style={{textAlign: 'right'}}>
                                <Form.Text style={{fontSize:'14px'}} id="totalCuota">{this.state.totalCuotas}</Form.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Total: </Form.Label>
                            </Col>
                            
                            <Col sm="2" style={{textAlign: 'right'}}>
                                <Form.Label id="total">{this.state.total}</Form.Label>
                            </Col>
                        </Row>
                    </Form.Group>
                    <hr></hr>
                    <Form.Group>
                        <Image src={logo} rounded style={{width:"100px"}}></Image>
                    </Form.Group>
            </div>
        );
    }
}