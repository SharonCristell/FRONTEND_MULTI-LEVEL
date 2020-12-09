import React, { Component } from 'react';
import { Form, Row, Col, Spinner, Button,
    InputGroup, FormControl, Image, Modal, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
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

 /**
  * Class
  */
export default class PayRegister extends Component {
    constructor(props){
        super(props);
        this.state = {
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
            suscription: undefined,
            showWallet: false,
            amountWallet: 0,
            idUser: 0
        }

        this.getTypeBank = this.getTypeBank.bind(this);
    }

    componentWillMount(){
        // Data from registerPaymentView
        if(this.props.packages !== undefined){
            this.setState({ packages: this.props.packages });
            let item = this.props.packages[0];
            if(item !== undefined) {
                let initial =  Number(item.initialPrice);
                let priceAll =  Number (item.price);
                let quotesAll = priceAll - initial;
                let quotes = Number(item.quotes)
                let perQuotes = quotesAll / quotes;
                // let temp = initial + perQuotes;
                let temp = initial + perQuotes * this.state.countQuotes;


                // totalCuotas:  perQuotes,
                this.setState({
                    idPackage : item.id,
                    name: item.name,
                    description : item.description,
                    price: item.price,
                    initialPrice: item.initialPrice,
                    duration: item.duration,
                    total:  temp,
                    initial: initial,
                    totalCuotas:  perQuotes * this.state.countQuotes,
                    perQuotes: perQuotes,
                    quotes: item.quotes,
                    isLoaded: true,
                    code: ""
                });
            }
        }

        if(this.props.suscription !== undefined){
            this.setState({
                suscription: this.props.suscription,
                idUser:  this.props.suscription.idUser
            });
        }
    }

    //--- typePaidMethod 
    // 1 -> paypal, 2 --> vouchers , 3 ->after pay(send email)
    //--- voucher body
    // type
    // bank
    // code operation
    // titular cuenta
    // Comision
    // voucher64
    // name

    componentWillReceiveProps(props) {

        // From rgister step 3: slect suscription
        this.setState({ packages: props.packages });
        let item = props.packages[0];
        if(item !== undefined) {
            let initial =  Number(item.initialPrice);
            let priceAll =  Number (item.price);
            let quotesAll = priceAll - initial;
            let quotes = Number(item.quotes)
            let perQuotes = quotesAll / quotes;
            // let temp = initial + perQuotes;
            let temp = initial + perQuotes * this.state.countQuotes;


            // totalCuotas:  perQuotes,
            this.setState({
                idPackage : item.id,
                name: item.name,
                description : item.description,
                price: item.price,
                initialPrice: item.initialPrice,
                duration: item.duration,
                total:  temp,
                initial: initial,
                totalCuotas:  perQuotes * this.state.countQuotes,
                perQuotes: perQuotes,
                quotes: item.quotes,
                isLoaded: true,
                code: ""
            });

            let suscription = props.suscription;
            console.log(suscription)
            if(suscription !== undefined){
                this.setState({
                    suscription: suscription,
                    idUser: suscription.idUser
                });
            }
        }
        
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
    /**
     * Method to get packages information
     */
    async getPackages(id) {
        if(this.state.idPackage !== id){
          
            let item = await UtilService.getPackageById(id);

            if(item !== undefined) {
                let initial =  Number(item.initialPrice);
                let priceAll =  Number (item.price);
                let quotesAll = priceAll - initial;
                let quotes = Number(item.quotes)
                let perQuotes = quotesAll / quotes;
                let temp = initial + perQuotes;
           
                this.setState({
                    idPackage : id,
                    idUser: item.idUser,
                    name: item.name,
                    description : item.description,
                    price: item.price,
                    initialPrice: item.initialPrice,
                    duration: item.duration,
                    total:  temp,
                    initial: initial,
                    totalCuotas:  perQuotes,
                    perQuotes: perQuotes,
                    quotes: item.quotes,
                    isLoaded: true,
                    code: ""
                });
            }

            // this.forceUpdate();
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
    
    onEventCode = (e) => {
        e.preventDefault();
        if(this.state.code.length > 0){
            this.validateCode(this.state.code);
        }
    }

    async validateCode(code){
        
        let codePromotion = await UtilService.verifyCode(code);
        
        if(codePromotion !== undefined && codePromotion.status > 0){
            this.setState({
                codeMessage: "" ,
                discount: 1
            });
        } else {
            this.setState({
                codeMessage: "El código no es válido o ya expiró." ,
                discount: 0
            });
        }

    }


    handleChange = (e) => {
        let value = Number(e.target.value);
        if(value >= 0 && value <= this.state.quotes){

            let totalQuote = this.state.perQuotes * value;
            let total = this.state.initial + totalQuote - this.state.discount;

            this.setState({
                total: this.state.total = total,
                totalCuotas: this.state.totalCuotas = totalQuote,
                isOkQuote: this.state.isOkQuote = true,
                countQuotes: this.state.countQuotes = value
            });

            if(this.props.eventPay){
                this.props.eventPay(value, 'quotesPay');
            }
        } else {
            let totalQuote = this.state.perQuotes * 0;
            let total = this.state.initial + totalQuote - this.state.discount;

            this.setState({
                total: this.state.total = total,
                totalCuotas: this.state.totalCuotas = totalQuote,
                isOkQuote: this.state.isOkQuote = false,
                countQuotes: this.state.countQuotes = 0
            });

            if(this.props.eventPay){
                this.props.eventPay(0, 'quotesPay');
            }

            var el = document.getElementById("txtQuotes");
            el.value = "0";
        }

    }

    onChange = (e, field) => {
        //console.log(e.target.value, field);
        this.setState({ [field]: e.target.value });
        // this.setState({ [field]: e.target.value }, () => {
        //     if (this.props.onChange) {
        //         this.props.onChange(e.target.value, field);
        //       }
        // });

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

    handleRadio = (e, id) => {
        //console.log(id)
        this.setState({
            typePay: this.state.typePay = id
        });
        // Send type selected vouchers - paypal or after
        this.props.eventPay(id, 'typePay');
    }

    // Add list of vouchers
    addVoucher = (voucherList) => {
        let vouchers = this.state.vouchers;
        vouchers = vouchers.concat(voucherList);
        this.setState({
            vouchers: this.state.vouchers = vouchers
        });
        this.props.eventPay(vouchers, 'vouchers');
       
    }

    deleteVoucher = (e, idx) => {
        let temp = [];
        let vouchers = this.state.vouchers;
        let i = 0;
        for(i = 0; i < vouchers.length; i ++)
        {
            if(i !== idx){
                temp.push(vouchers[i]);
            }
        }
        this.setState({
            vouchers: temp
        });
        this.props.eventPay(temp, 'vouchers');
    }


    // Change of voucher
    onchangePayVoucher = (value, field) => {
        //console.log("event pay voucher");
        this.setState({[field]: value});
        if(this.props.onchangePayVoucher){
            this.props.onchangePayVoucher(value, field);
        }
    }


    // Handle modal voucher
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
    
    // Call function save paypal of parent
    savePaypal = () => {
        
        if(this.props.savePaypal){
            this.handleClose();
            this.props.savePaypal();
        }
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


    // Register Payment only with wallet
    registerPayWallet = (amount) => {
        console.log("register wallet");
        console.log(amount);
        // this.props.registerPayWallet(amount)

    }

    eventWallet= (amount) => {
        console.log("event wallet")
        this.setState({
            amountWallet: this.state.amountWallet = amount
        });
        if(this.props.eventWallet) {
            this.props.eventWallet(amount)
        }

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

    render(){
        const { vouchers, typePay, typeExchange, isPaid, idUser } = this.state;
        // //console.log(typePay)
        
        return (
            <div>
                <Form.Label className="content-subtitle">Métodos de pagos</Form.Label>

                <div>
                    <Form.Group>
                        <Row>
                            <Col sm={12}>
                                    <Form.Label>Paquete seleccionado</Form.Label>
                                
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <Row>
                                    <Form.Label column="sm">Descripción</Form.Label>
                                </Row>
                                {/* <Row>
                                    <Col> 
                                        <Form.Text>{this.state.name} </Form.Text>
                                    </Col>
                                </Row> */}
                                <Row><Col>
                                    <Form.Text>{this.state.description} </Form.Text>
                                    </Col>
                                </Row>
                                <Row><Col>
                                    <Form.Text>Duración: {this.state.duration} </Form.Text>
                                    </Col>
                                </Row>
                                
                            </Col>
                           <Col sm={3}>
                               <Row>
                                    <Form.Label column="sm">Precio Total</Form.Label>
                               </Row>
                               <Row><Col>
                                    <Form.Text >{this.state.price}</Form.Text>
                                </Col>
                               </Row>
                           </Col>
                           {/* <Col>
                                <Form.Label>Nro. de cuotas</Form.Label>
                           </Col> */}
                           <Col sm={3}>
                               <Row>
                                    <Form.Label column="sm">Inicial</Form.Label>
                               </Row>
                               <Row><Col>
                                    <Form.Text>{this.state.initialPrice}</Form.Text>
                                    </Col>
                                </Row>
                           </Col>
                           <Col sm={3}>
                                <Row>
                                    <Form.Label column="sm">Nro. de cuotas</Form.Label>
                                </Row>
                                <Row><Col>
                                    <Form.Text>{this.state.quotes}</Form.Text>
                                    </Col>
                                </Row>
                           </Col>
                        </Row>
                        
                        <Row>
                            <Col sm={12}>
                        <Form.Text style={{color:'red', fontSize:'10'}}>{this.state.message}</Form.Text>
                            </Col>
                        </Row>
                    </Form.Group>
                    <hr></hr>
                    {/* <Form.Group>
                        <Row>
                            <Col sm={6}>
                            <Form.Label>Código promocional</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl
                                placeholder="Ingresa un código"
                                aria-describedby="basic-addon2"
                                onChange={e => this.onChange(e, "code")}
                                />
                                <InputGroup.Append>
                                    <Button variant="secondary" size="sm" onClick={this.onEventCode}>
                                        <Spinner animation="border" role="status"  size="sm"
                                            style={{display: this.state.loading? 'inline-block': 'none'}}>
                                            <span className="sr-only">Validar</span>
                                        </Spinner> Validar
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                            <Form.Text className="textAlert">{this.state.codeMessage}</Form.Text>
                            </Col>
                        </Row>
                    </Form.Group>
                    <hr></hr> */}
                    <div style={{width:'60%'}}>
                        <Row>
                            <Col>
                            <Form.Label>Detalle</Form.Label>
                            </Col>

                        </Row>
                        <Row>
                            {/* <Col>
                                <Form.Text style={{fontSize:'14px'}}>Inicial</Form.Text>
                            </Col> */}
                            <Col sm="8">
                                <Form inline>
                                <Form.Text style={{fontSize:'14px'}}>Inicial : &nbsp; </Form.Text>
                                <Form.Control size="sm" type="number" min="1" max="1" defaultValue="1"
                                    onChange={e => this.handleChange(e)}
                                    ></Form.Control>
                                </Form>
                            </Col>

                            <Col sm="4" style={{textAlign: 'right'}}>
                                <Form.Text style={{fontSize:'14px'}}>$ {this.state.initial}</Form.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="8">
                            <Form inline>
                                <Form.Text style={{fontSize:'14px'}}>Total de cuotas a pagar : &nbsp; </Form.Text>
                                <Form.Control id="txtQuotes" size="sm" type="number" min="0" max={this.state.quotes} defaultValue="0"
                                    onChange={e => this.handleChange(e)}
                                    ></Form.Control>
                                </Form>
                            </Col>

                            <Col sm="4" style={{textAlign: 'right'}}>
                                <Form.Text style={{fontSize:'14px'}} id="totalCuota">$ {this.state.totalCuotas}</Form.Text>
                            </Col>
                        </Row>
                        <Row style={{display: this.state.isOkQuote? 'none': 'block'}}>
                            <Col>
                                <Form.Text className="textAlert">El número máximo de cuotas a pagar es : {this.state.quotes}</Form.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Text style={{fontSize:'14px'}}>Descuento : &nbsp; </Form.Text>
                            </Col>
                            <Col sm="4" style={{textAlign: 'right'}}>
                                <Form.Text style={{fontSize:'14px'}} id="idDiscount">$ {this.state.discount}</Form.Text>
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col>
                                <Form.Label>Total: </Form.Label>
                            </Col>

                            <Col sm="4" style={{textAlign: 'right'}}>
                                <Form.Label id="total">$ {this.state.total}</Form.Label>
                            </Col>
                        </Row>
                    </div>
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
                            {/* <Col sm={3}>
                                <div onClick={(e) => {this.handleShowWallet(e)}}>
                                    <p style={{margin: 2, fontWeight: 'bold'}}>
                                        <Image src={walletImge} style={{width: "32px", marginRight: "10px"}}></Image>
                                       Mi Wallet
                                    </p>
                                </div>
                            </Col>  */}
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
                                exchange={typeExchange.venta}
                                savePaypal={this.savePaypal}></PayPalButton>
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
                    <Modal.Title>Pago con Wallet</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                       
                        <Form.Group>
                            <PayWallet 
                                idUser={idUser}
                                total={this.state.total}
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