import React, { Component } from 'react';
import { Form , Row, Col, Image, Table } from 'react-bootstrap';
import { RiDeleteBinLine } from 'react-icons/ri';

import PayPalButton from '../payment/PaypalButton';
import PayVoucher from '../payment/PayVoucher';
import logo from '../../images/paypal-logo.png';
import logoBcp from '../../images/bcp-logo.jpg';
import logoInter from '../../images/interbank-logo.png';
import UtilService from '../../services/utils.service';
import PayVoucherInter from '../payment/PayVoucherInter';


export default class PayMultipleQuote extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user : {
                name: "pepito",
                lastname: "mas na"
            },
            suscription: {
                name: "stand by"
            },
            schedule: [],
            idPackage : 0,
            total: "0",
            initial: "0",
            totalCuotas: "0",
            discount: 0,
            packages: [],
            name: "",
            description : "",
            price: "",
            quotes: 1,
            perQuotes: 0,
            countQuotes: 0,
            initialPrice: "",
            duration: "",
            message :"",
            codeMessage:"",
            isOkQuote: true,
            showPayPal: false,
            showVoucher: false,
            isPaid: false,
            typePaidMethod: 0,
            method: '',
            bank: '',
            vouchers: [],
            typePay: 0,
            typeBank: {},
            typeExchange: {
                venta: 1
            },
            total: 0
        }
    }

    render() {

        const { user, suscription, schedule, vouchers, isPaid, total } = this.state;
        return(
            <div className="panel-form">
                <Row>
                    <Col>
                        <Form.Label className="content-subtitle">Registra pago</Form.Label>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Form.Label>Usuario: {user.name} {user.lastname}</Form.Label>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Form.Label>Suscripción: {suscription.name}</Form.Label>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Table responsive>
                            <thead className="table-head">
                                <tr>
                                    <th>Descripción</th>
                                    <th>Fecha de pago</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th><Form.Check></Form.Check></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Cuota 1</td>
                                    <td>12-12-2020</td>
                                    <td>12.00</td>
                                    <td>Pagado</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Cuota 1</td>
                                    <td>12-12-2020</td>
                                    <td>12.00</td>
                                    <td>Por pagar</td>
                                    <td>
                                        <Form.Check></Form.Check>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Cuota 1</td>
                                    <td>12-12-2020</td>
                                    <td>12.00</td>
                                    <td>Por pagar</td>
                                    <td>
                                        <Form.Check></Form.Check>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Label > Monto a pagar: {total} USD</Form.Label>
                    </Col>
                </Row>
                <hr></hr>
                    <Form.Group>
                        <Row>
                            <Col>
                                <Form.Label>Selecione  un medio de pago: </Form.Label>
                            </Col>
                        </Row>
                        <Row style={{padding: 16}}>
                            <Col sm={3}>
                                <Image src={logo} rounded style={{width:"100px", cursor:'pointer'}}
                                onClick={this.onEventPayPal}></Image>
                                {/* <Image src={logo} rounded style={{width:"100px", cursor:'no-drop', opacity: "0.5"}}
                                ></Image> */}
                            </Col>
                            <Col sm={3}>
                                <Image src={logoBcp} rounded style={{width:"100px", cursor:'pointer'}}
                                onClick={(e) => {this.handleShowVoucher(e, 'BCP')}}></Image>
                            </Col>
                            <Col sm={3}>
                                <Image src={logoInter} rounded style={{width:"120px", cursor:'pointer'}}
                                onClick={(e) => {this.handleShowVoucher(e, 'Interbank')}}></Image>
                            </Col> 
                        </Row>
                        {/* show the table if has register */}
                        { vouchers.length > 0 && 
                            <Row style={{padding: 16}}>
                                <Table responsive>
                                    <thead className="table-head">
                                        <tr>
                                            <th>Banco</th>
                                            <th>Operación</th>
                                            <th>Moneda</th>
                                            <th>Código</th>
                                            <th>Titular</th>
                                            <th>Archivo</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vouchers.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.bank}</td>
                                                <td>{item.typeDescription}</td>
                                                <td>{item.typeExchangeDes}</td>
                                                <td>{item.code}</td>
                                                <td>{item.titular}</td>
                                                <td>{item.name}</td>
                                                <td style={{fontSize: 15}}
                                                    onClick={(e) => {this.deleteVoucher(e, idx)}}>
                                                    <RiDeleteBinLine ></RiDeleteBinLine>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Row> 
                        }
                        {/* show the PayPal payment if it was successful */}

                        {isPaid &&
                            <Form.Group>
                                <Form.Label>Su pago ha sido registrado con PAYPAL.</Form.Label>
                            </Form.Group>
                        }
                       
                    </Form.Group>
                    <hr></hr>
            </div>
        );
    }
}