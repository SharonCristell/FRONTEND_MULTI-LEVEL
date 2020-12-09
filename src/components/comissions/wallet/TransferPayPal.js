import React, { Component } from 'react';
import { Form, Row, Col, Button, Table, Spinner, Modal } from 'react-bootstrap';

import Validation from '../../utils/Validation'

export default class TransferPayPal extends Component{

    constructor(props){
        super(props);
        this.state = {
            history : [],
            emptyList: true,
            message: "No hay registros para mostrar.",
            loading: false,
            messageMount: "",
            loadSenData : false
        }
    }

    render() {

        const { history, emptyList, message,
            loading, messageMount, loadSenData  } = this.state;

        return(
            <div style={{padding: 30}}>
                <div className="search">
                    <Row>
                        <Col sm={12}>
                            <Form.Label >Puede retirar sus comisiones a traves de su cuenta de PayPal:</Form.Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={2}>
                            <Form.Label className="mt-1"> Cuenta PayPal:</Form.Label>
                        </Col>
                        <Col sm={4}>
                            <Form.Control
                                placeholder="Ingrese su  cuenta de PayPal"
                                onChange={e=>{this.handleChange(e, 'account')}}
                            />
                            <Form.Label className="textAler">{messageMount}</Form.Label>
                        </Col>
                        <Col sm={4}>
                            <Button variant="primary"
                                    onClick={e => {this.registerTransfer(e)}}>Transferir</Button>
                        </Col>
                    </Row>
                </div>
                
                <Row>
                    <Col sm={12}>
                        <Form.Label className="content-subtitle" >Historial de transferencias</Form.Label>
                    </Col>
                </Row>
                { loading && 
                    <div>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p><Form.Label>Cargando información de transferencias.</Form.Label></p>
                    </div>
                }
                {   emptyList && !loading && 
                    <Form.Label>{message}</Form.Label>
                }
                {  !emptyList && 
                <div>
                    <Row>
                        <Col sm={12}>
                            <Table responsive>
                                <thead className="table-head">
                                    <tr>
                                        <th>Nº </th>
                                        <th>Fecha</th>
                                        <th colSpan={2}>Operación</th>
                                        <th>Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { history.map(function(item, idx) {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{idx}</td>
                                                        <td>{Validation.convertDateToString(item.createDate)}</td>
                                                        <td colSpan={2}>{item.operation}</td>
                                                        <td>{item.mount}</td>
                                                    </tr>
                                                )
                                            })

                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
                }
                {/* loading */}
                <Modal
                    show={loadSenData}
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="static"
                    centered>
                    <Modal.Body>
                        <div style={{textAlign: 'center'}}>
                            <Spinner size="sm" animation="border" variant="dark">
                            </Spinner>
                            <Form.Label>&nbsp; Guardando información...</Form.Label>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}