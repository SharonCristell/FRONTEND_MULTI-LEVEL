import React, { Component } from 'react';
import { Form , Row, Col, Image, Table, Modal, Button, Alert } from 'react-bootstrap';
import { RiDeleteBinLine } from 'react-icons/ri';

import PayPalButton from '../payment/PaypalButton';
import PayVoucher from '../payment/PayVoucher';
// import { PayPalButton } from 'react-paypal-button-v2'
import logo from '../../images/paypal-logo.png';
import logoBcp from '../../images/bcp-logo.jpg';
import logoInter from '../../images/interbank-logo.png';
import walletImge from '../../images/wallet.png';
import logoOther from '../../images/other-logo.png';

import UtilService from '../../services/utils.service';
import PayVoucherInter from '../payment/PayVoucherInter';
import PayWallet from './PayWallet';
import PayOther from './PayOther';



export default class PayQuote extends Component {
    
    constructor(props) {
        super(props);
      
        this.state = {
            quote : props.quote,
            idPackage : props.quote.idPaquete,
            total: props.quote.quoteUsd,
            initial: "0",
            totalCuotas: "1",
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
            showWallet: false,
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
            amountWallet: 0
        }

        this.getTypeBank = this.getTypeBank.bind(this);
    }

    componentDidMount(){
        this.getTypeBank();
        this.getExchange();
    }

    // Get exchange dolar
    async getExchange(){
        let response = await UtilService.getExchanges();
        if(response !== undefined){
            if(response.status === 1) {
                this.setState({
                    typeExchange: this.state.typeExchange = response.objModel
                });
            }
        }
    }

    async getTypeBank() {

        let response = await UtilService.getTypeBank();
        if(response !== undefined){
            if(response.status === 1) {
                this.setState({
                    typeBank: this.state.typeBank = response.objModel
                });
            }
        }
    }
    /**
     * Connect with paypal
     * @param {*} e
     */
    onEventPayPal = (e) => {
        if(this.state.idPackage > 0 ){
            if(this.state.isPaid) {
                alert("Su pago con PayPal ha registrado exitosamente.");
            } else {
                if(this.state.vouchers.length > 0){
                    alert("Usted ha subido comprobantes de pago.");
                } else {
                    this.handleShow();
                }
            }

        } else {
            alert("Ocurrió un error al obtener información de paquete.");
        }
    }   
    /**
     * Event pay
     */
    eventPay = (value, field) => {
       
        this.setState({[field]: value});
        if(this.props.eventPay){
            this.props.eventPay(value, field);
        }
    }



    // Handle modal
    handleClose = () => {
        this.setState({
            showPayPal : false
        });
    }
    handleShow = () => {
        this.setState({
            showPayPal : true
        });
    }

    /**Handle upload voucher */
    // Handle modal voucher
     // Add list of vouchers
    addVoucher = (voucherList) => {
        // console.log("vouchers payquote")
        let vouchers = this.state.vouchers;
        vouchers = vouchers.concat(voucherList);
        this.setState({
            vouchers: this.state.vouchers = vouchers
        });
        this.props.eventPay(vouchers, 'vouchers');
       
    }

    handleShowVoucher = (e, bank) => {
        if(this.state.idPackage > 0 ){
            if(this.state.isPaid) {
                alert("Su pago ha sido registrado con PayPal.");
            } else {
                if(bank === 'BCP') {
                    this.setState({
                        showVoucher : true,
                        bank: 'BCP',
                        isBcp: true,
                        isInter: false
    
                    });
                } else if(bank === 'Interbank') {
                    this.setState({
                        showVoucher : true,
                        bank: 'Interbank',
                        isBcp: false,
                        isInter: true
    
                    });
                }
                
            }

        } else {
            alert("Ocurrió un error al obtener información de paquete.");
        }
    }

    handleCloseVoucher = () => {
        this.setState({
            showVoucher : false
        });
    }

    // Handle show modal wallet
    handleShowWallet = (e) => {
        if(this.state.idPackage > 0 ){
            if(this.state.isPaid) {
                alert("Su pago ha sido registrado con PayPal.");
            } else {
            
                this.setState({
                    showWallet : true
                });
                
            }

        } else {
            alert("Ocurrió un error al obtener información de paquete.");
        }
    }

    handleCloseWallet= () => {
        this.setState({
            showWallet : false
        });
    }
   
    // Event Wallet
    addWallet = (amount) => {
        console.log("event wallet")
        this.setState({
            amountWallet: this.state.amountWallet = amount
        });
        // if(this.props.eventWallet) {
        //     this.props.eventWallet(amount)
        // }

    }

    // Register Payment only with wallet
    registerPayWallet = (amount) => {
        
        this.props.registerPayWallet(amount)

    }

    eventWallet= (amount) => {
        
        this.props.eventWallet(amount)

    }

    // Pay Other
    // Payment other
    handleShowOther = (e, bank) => {
        if(this.state.idPackage > 0 ){
            if(this.state.isPaid) {
                alert("Su pago ha sido registrado con PayPal.");
            } else {
               this.setState({
                    showOther : true,
                    bank: 'Otros',
                    isOther: true,
                    isBcp: false,
                    isInter: false
                });
              
            }

        } else {
            alert("Debe seleccionar un paquete de suscripción.");
        }
    }

    handleCloseOther = () => {
        this.setState({
            showOther : false
        });
    }

    render() {
        const { quote, vouchers, isPaid, typeExchange, amountWallet } = this.state;
  
        return(
            <div>
                <Row style={{textAlign: 'center'}}>
                    <Col sm={12}>
                        <Form.Label className="content-subtitle">Pagar cuota</Form.Label>
                    </Col>
                </Row>
                
                <Row>
                    <Col sm={12}>
                        <p><b>Suscripción:</b>  {quote.namePackage}</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <p><b>Descripción:</b> {quote.quoteDescription} </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><b> Cuota:</b> {quote.quoteUsd} USD</p>
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
                            <Col sm={2}>
                                <Image src={logo} rounded style={{width:"100%", maxWidth: 136, cursor:'pointer'}}
                                onClick={this.onEventPayPal}></Image>
                            </Col>
                            <Col sm={2}>
                                <Image src={logoBcp} rounded style={{width:"100%", maxWidth: 136, cursor:'pointer'}}
                                onClick={(e) => {this.handleShowVoucher(e, 'BCP')}}></Image>
                            </Col>
                            <Col sm={2}>
                                <Image src={logoInter} rounded style={{width:"120%", maxWidth: 136, cursor:'pointer'}}
                                onClick={(e) => {this.handleShowVoucher(e, 'Interbank')}}></Image>
                            </Col> 
                            <Col sm={2}>
                                <Image src={logoOther} rounded style={{width:"120%", maxWidth: 136, cursor:'pointer'}}
                                onClick={(e) => {this.handleShowOther(e, 'Otros')}}></Image>
                            </Col>
                            <Col sm={3}>
                                <div onClick={(e) => {this.handleShowWallet(e)}}>
                                    <p style={{margin: 2, fontWeight: 'bold'}}>
                                        <Image src={walletImge} style={{width: "32px", marginRight: "10px"}}></Image>
                                       Mi Wallet
                                    </p>
                                </div>
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

                        {/* Show amount payed with wallet */}
                        {amountWallet > 0 &&
                            <Row  style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 10}} >
                                <Col sm={12} >
                                    <Alert variant='success' >
                                        <b>Monto pagado con Wallet $ : </b>{amountWallet}
                                    </Alert>
                                </Col>
                            </Row>
                        }
                        {/* show the PayPal payment if it was successful */}

                        {isPaid &&
                            <Form.Group>
                                <Form.Label>Su pago ha sido registrado con PAYPAL.</Form.Label>
                            </Form.Group>
                        }
                       
                </Form.Group>
                {/* Modal */}
                <Modal show={this.state.showPayPal} 
                    onHide={this.handleClose}
                    backdrop="static">
                    <Modal.Header closeButton>
                    <Modal.Title>PayPal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <PayPalButton mount={this.state.total}
                                description={this.state.name} 
                                eventPay={this.eventPay}
                                typeBank={this.state.typeBank}
                                exchange={typeExchange.venta}></PayPalButton>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cerrar
                    </Button>
                    {/* <Button variant="primary" onClick={this.handleClose}>
                        Save Changes
                    </Button> */}
                    </Modal.Footer>
                </Modal>
                {/* Modal upload voucher*/}
                <Modal show={this.state.showVoucher} 
                    onHide={this.handleCloseVoucher} style={{fontSize: 10}}
                    size="lg"
                    backdrop="static">
                    <Modal.Header closeButton>
                    <Modal.Title>Pago en efectivo a tavés de {this.state.bank}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.isBcp &&
                            <Form.Group>
                                <PayVoucher total={this.state.total}
                                    addVoucher={this.addVoucher} 
                                    close={this.handleCloseVoucher}
                                    typeBank={this.state.typeBank}
                                    exchange={typeExchange.venta}
                                    fontSize={10}></PayVoucher>
                                {/* <PayVoucher onChangePay= {this.onchangePayVoucher}></PayVoucher> */}
                            </Form.Group>
                        }
                        { this.state.isInter &&
                            <Form.Group>
                                <PayVoucherInter total={this.state.total}
                                    addVoucher={this.addVoucher} 
                                    close={this.handleCloseVoucher}
                                    typeBank={this.state.typeBank}
                                    exchange={typeExchange.venta}
                                    fontSize={10}></PayVoucherInter>
                            </Form.Group>
                        }
                       
                    </Modal.Body>
                </Modal>
                
                {/* Modal pay with wallet*/}
                <Modal show={this.state.showWallet} 
                    onHide={this.handleCloseWallet} style={{fontSize: 10}}
                    backdrop="static">
                    <Modal.Header closeButton>
                    <Modal.Title>Pago con Wallet {this.state.bank}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                       
                        <Form.Group>
                            <PayWallet 
                                idUser={quote.idUser}
                                total={this.state.total}
                                addWallet={this.addWallet} 
                                registerPayWallet={this.registerPayWallet}
                                eventWallet={this.eventWallet}
                                close={this.handleCloseWallet}
                                fontSize={10}></PayWallet>
                        </Form.Group>
                        
                    </Modal.Body>
                </Modal>

                {/* Modal upload voucher other tickets*/}
                <Modal show={this.state.showOther} 
                    onHide={this.handleCloseOther} style={{fontSize: 10}}
                    size="lg"
                    backdrop="static">
                    <Modal.Header closeButton>
                    <Modal.Title>Pago en efectivo a tavés de otros medios de pago</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <PayOther total={this.state.total}
                                addVoucher={this.addVoucher} 
                                close={this.handleCloseOther}
                                typeBank={this.state.typeBank}
                                exchange={typeExchange.venta}
                                fontSize={10}></PayOther>
                        </Form.Group>
                       
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}