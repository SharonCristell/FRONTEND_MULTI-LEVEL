import React, { Component } from 'react';
import { Form, Row, Col, Spinner, Button, Image, Modal, Table, Alert } from 'react-bootstrap';
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
import PayWallet from '../payment/PayWallet';
import PayOther from '../payment/PayOther';

const RANGE_WALLET_MIN = 3;
const RANGE_WALLET_MAX = 11;

 /**
  * Class
  */
export default class PaymentMethod extends Component {
    constructor(props){
        super(props);
        this.state = {
            idPackage : 0,
            total: "0",
            initial: "0",
            totalCuotas: "0",
            discount: 0,
            kitInit: {
                price: 0
            },
            packages: [],
            name: "",
            description : "",
            price: "",
            quotes: 0,
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
            mount: 0,
            typePaidMethod: 0,
            method: '',
            bank: '',
            vouchers: [],
            typePay: 0,
            typeBank: {},
            typeExchange: {
                venta: 1
            },
            showWallet: false,
            amountWallet: 0,
            idUser: 0,
            showWalletSection: props.showWallet,
            assignedUser: '',
            assignedResult: '',
            showOther : false

        }
        let id = sessionStorage.getItem("id");
      
        this.setState({
            idUser: this.state.idUser = id
        });
        this.getTypeBank = this.getTypeBank.bind(this);
    }

    componentDidMount(){
        if(this.props.showWallet !== undefined){
            this.setState({
                showWallet: this.props.showWallet
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
        // From register step 3: select suscription
        this.setState({ 
            packages: props.packages ,
            kitInit: props.kitInit
        });

        let item = props.packages[0];
        let kit = props.kitInit[0];

        let total = 0;

        //  Verify kit init
        if( kit !== undefined) {
            total += kit.price;
        } 
        // Verify package
        if(item !== undefined) {
            let initial =  Number(item.initialPrice);
            let priceAll =  Number (item.price);
            let quotesAll = priceAll - initial;
            let quotes = Number(item.quotes)
            let perQuotes = quotesAll / quotes;
            // let temp = initial + perQuotes;
            total += initial + perQuotes * this.state.countQuotes ;
            
            // totalCuotas:  perQuotes,
            this.setState({
                idPackage : item.id,
                name: item.name,
                description : item.description,
                price: item.price,
                initialPrice: item.initialPrice,
                duration: item.duration,
                initial: initial,
                totalCuotas:  perQuotes * this.state.countQuotes,
                perQuotes: perQuotes,
                quotes: item.quotes,
                isLoaded: true,
                code: ""
            });
        }

        this.setState({
            total: this.state.total = total
        });


        
    }

    componentDidMount(){
        this.getTypeBank();
        this.getExchange();
        
        // init package
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
            
            // Kit de inicio
            let kitInit = this.props.kitInit[0];
            if(this.props.kitInit.length === 0){
                kitInit = {};
                kitInit.price = 0; // TODO exonerado
            }
            
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
                code: "",
                kitInit: kitInit
            });
        }
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

            let kitCost = this.state.kitInit.price;
            let totalQuote = this.state.perQuotes * value;
            let total = this.state.initial + totalQuote - this.state.discount + kitCost;

            this.setState({
                total: this.state.total = total,
                totalCuotas: this.state.totalCuotas = totalQuote,
                isOkQuote: this.state.isOkQuote = true,
                countQuotes: this.state.countQuotes = value
            });
          
            if(this.props.eventPay){
                this.props.eventPay(value, 'quotePaid');
                this.props.eventPay(total, 'amountPay');
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
                this.props.eventPay(0, 'quotePaid');
                this.props.eventPay(total, 'amountPaid');
            }


            var el = document.getElementById("txtQuotes");
            el.value = "0";
        }

    }

    onChange = (e, field) => {
        //console.log(e.target.value, field);
        this.setState({ [field]: e.target.value });
        
    }


    /**
     * Event paypal 
     */
    eventPay = (value, field) => {
        // idMethodPayment: 0,
        // mountPaid : 0,
        // isPaid: false
        //console.log("event pay ");
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
        // Verify  if the form in completed
        if (this.props.validateToPay() === true){
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
                alert("Debes seleccionar un paquete de suscripción.");
            }
        } else {
            alert("Para pagar con PAYPAL es necesario que complete el formulario.")
        }
        
    }

    // Handle modal
    handleClose = () => {
        this.setState({
            showPayPal : false
        });
        this.forceUpdate();
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

    // handleSave = (e) => {
    //     if(Number(this.state.type) > 0 && this.state.voucher.length > 0){
    //         this.setState({isPaid: true});
    //         if(this.props.onchangePayVoucher){
    //             this.props.onchangePayVoucher('bcp', 'bank');
    //             this.props.onchangePayVoucher(true, 'isPaid');
    //         }
    //         this.handleCloseVoucher();
    //     } else {

    //     }

    // }
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
            alert("Debe seleccionar un paquete de suscripción.");
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
            alert("Debe seleccionar un paquete de suscripción.");
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
        if(this.props.eventWallet) {
            this.props.eventWallet(amount)
        }

        if(this.props.eventPay) {
            this.props.eventPay(3, "typePay");
        }
       
        //Verify if all fields are completed
        // Verify  if the form in completed
        if (this.props.validateToPay() === true){
           
           if(this.props.registerBuy){
               this.props.registerBuy();
           }
        } else {
            alert("Para pagar con WALLET es necesario que complete el formulario.")
        }

    }

    eventWallet = (amount) => {
        console.log("event wallet")
        this.setState({
            amountWallet: this.state.amountWallet = amount
        });
        if(this.props.eventWallet) {
            this.props.eventWallet(amount)
        }

    }


    // validate user to assign payment
    validateUser = async(e) => {
        console.log("registro")
        if(this.state.assignedUser.length > 0){
            this.setState({
                assignedLoading: true
            });
            let response = await UtilService.getRangeByUsername(this.state.assignedUser);
            if(response !== undefined && response.status === 1){
                console.log(response)

                // verify is > oro 
                if(response.objModel.position >= RANGE_WALLET_MIN) {
                    this.setState({
                        assignedResult: "Rango: " + response.objModel.name,
                        assignedLoading: false
                    });
                } else {
                    this.setState({
                        assignedResult: "Rango: " + response.objModel.name + " - No permitido.",
                        assignedLoading: false
                    });
                }
                
            } else  {
                this.setState({
                    assignedResult: "Usuario no existe.",
                    assignedLoading: false
                });
            }
        } else {
            alert("Ingrese usuario");
            this.setState({
                assignedLoading: false
            });
        }
        
    }

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
    
    // register buy
    registerBuy = () => {
        console.log("pay method")
        if(this.props.registerBuy){
            this.props.registerBuy();
        }
    }
    render(){
        const { vouchers, typePay, typeExchange, isPaid, idUser, amountWallet } = this.state;
        // //console.log(typePay)
        
        return (
            <div>
                <Form.Label className="content-subtitle">Métodos de pagos</Form.Label>

                <div>
                    <Form.Group>
                        <Row>
                            <Col sm={12}>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <td><Form.Label>Descripción</Form.Label></td>
                                            <td><Form.Label>Precio Total</Form.Label></td>
                                            <td><Form.Label>Inicial</Form.Label></td>
                                            <td><Form.Label>Nro. de cuotas</Form.Label></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.kitInit.length > 0 && 
                                            <tr>
                                                <td><Form.Text>{this.state.kitInit[0].name} </Form.Text></td>
                                                <td><Form.Text >$ {this.state.kitInit[0].price}</Form.Text></td>
                                                <td><Form.Text>0</Form.Text></td>
                                                <td><Form.Text>0</Form.Text></td>
                                            </tr>
                                        }
                                        {this.state.packages.length > 0 && 
                                            <tr>
                                                <td><Form.Text>{this.state.packages[0].description} </Form.Text>
                                                <Form.Text>Duración: {this.state.packages[0].duration} </Form.Text>
                                                </td>
                                                <td><Form.Text >$ {this.state.packages[0].price}</Form.Text></td>
                                                <td><Form.Text>$ {this.state.packages[0].initialPrice}</Form.Text></td>
                                                <td><Form.Text>{this.state.packages[0].quotes}</Form.Text></td>
                                            </tr>
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                       
                    </Form.Group>
                    <hr></hr>
                   
                    <div className="justify-content-between">
                        <Row>
                            <Col sm={6}></Col>
                            <Col sm={6}>
                        <Row>
                            <Col>
                            <Form.Label>Detalle</Form.Label>
                            </Col>

                        </Row>
                        {/* Kit de mantenimiento */}
                        {this.state.kitInit.length > 0 &&              
                            <Row>
                                <Col sm="8">
                                    <Form inline>
                                    <Form.Text style={{fontSize:'14px'}}>Kit : &nbsp; </Form.Text>
                                    
                                    </Form>
                                </Col>

                                <Col sm="4" style={{textAlign: 'right'}}>
                                    <Form.Text style={{fontSize:'14px'}}>$ {this.state.kitInit[0].price}</Form.Text>
                                </Col>
                            </Row>
                        }
                        {/* Datos del paquete */}
                        {this.state.packages.length > 0 &&
                            <div>
                                <Row>
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
                            </div>
                        }
                        
                       
                       
                        
                        <hr></hr>
                        <Row>
                            <Col>
                                <Form.Label>Total: </Form.Label>
                            </Col>

                            <Col sm="4" style={{textAlign: 'right'}}>
                                <Form.Label id="total">$ {this.state.total}</Form.Label>
                            </Col>
                        </Row>
                        </Col>
                        </Row>
                    </div>
                    <hr></hr>
                    <Form.Group>
                        {/* <Row>
                            <Col>
                            <Form.Check
                                    type='radio'
                                    id='1'
                                    name="typePay"
                                    onChange={e => {this.handleRadio(e, 1)}}
                                    label='Seleccione un medio de pago.'
                                   
                                />
                            </Col>
                        </Row> */}
                        {/* Tipos de pago */}
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
                            {this.state.showWalletSection && 
                            <Col sm={2}>
                                <div onClick={(e) => {this.handleShowWallet(e)}}>
                                    <p style={{margin: 2, fontWeight: 'bold'}}>
                                        <Image src={walletImge} style={{width: "32px", marginRight: "10px"}}></Image>
                                       Mi Wallet
                                    </p>
                                </div>
                            </Col> 
                            }
                        </Row>
                        <Row style={(typePay===1 )? ({padding: 16}): ({padding: 16, pointerEvents: 'none', opacity: 0.5})}>
                            <Col sm={12}>
                                <Form.Label>(*) Puede adjuntar comprobantes de pago de BCP, Intebank y Otros.</Form.Label>
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
                            <Row  style={{padding: 16, paddingRight: 16, paddingBottom: 10}} >
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
                        {/* <Row style={{paddingBottom: 16}}>
                            <Col>
                                <Form.Check
                                    type='radio'
                                    id='2'
                                    name="typePay"
                                    onChange={e => {this.handleRadio(e, 2)}}
                                    label='Subir comprobante de pago despues.'
                                />
                                <div style={(typePay===2)? ({paddingLeft: 16}): ({paddingLeft: 16, opacity: 0.5})}>
                                    <Form.Label className="textAlert">Se le enviará un correo con el detalle de los medios de pago.</Form.Label>
                                </div>
                            </Col>
                        </Row> */}
                    
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
                                close={this.handleClose}
                                registerBuy={this.registerBuy}></PayPalButton>
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