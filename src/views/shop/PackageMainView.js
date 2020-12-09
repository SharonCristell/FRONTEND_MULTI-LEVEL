import React, { Component } from 'react';
import { Form, Button, Col, Row, Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import PackageMain from '../../components/shop/PackageMain';
import PackageEndView from './PackageEndView';
import AuthService from '../../services/auth.service';
import ShopService from '../../services/shop.service';
import history from  '../navigation/history';
import { data } from 'jquery';


export default class PackageMainView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packageStatus:"",
            packages: [],
            kitInit: [],
            amountPaid: 0,
            quotesPaid : 0,
            displayFooter: 'none',
            currentTab: '',
            isComplete: false,
            payment: {
                scheduleJSON: "",
                idMethodPayment: 0,
                mountPaid: 0,
                isPaid: false,
                typePay: 0,
                vouchers: [],
                amountPaid: 0,
                quotesPaid : 0,
            },
            voucher: {
                bank: '',
                isPaid: false
            },
            amountWallet: 0,
            loadSenData : false,
        }
    }

    OnClicked = (e, path) => {
        history.push(path);
    }

    eventhandler = (data, field) => {
        // console.log('register view');
        // console.log(field, ": ", data);
        // this.state.tempuser = data;
        
        // console.log(temp);
        this.setState({ [field]: data });
        console.log(field + " " + data)
    };
    /**
     * Event to handle if the footer is shown or hidden
     * @param {*} value 
     * @param {*} field 
     */
    eventFooter = (value, field) => {
        // console.log(field, ": ", value);
        this.setState({ [field]: value });
    }

    /**
     * To handle the event  on payment step
     */
    eventPayment = (value, field) => {
     
        var temp = this.state.payment;
        temp[field] = value;
        this.setState({ payment: temp });

    }

    eventVoucher = (value, field) => {
        var temp = this.state.voucher;
        temp[field] = value;
        this.setState({ voucher: temp });
 
    }

    //Event wallet
    eventWallet = (amount) => {
        this.setState({
            amountWallet: this.state.amountWallet = amount
        });
    }
   

    validationAfterPay = () => {
       
        if (this.state.packageStatus.length === 0) {
            alert("Seleccione una modalidad de compra.");
            this.setState({
                currentTab: this.state.currentTab = "Step1"
            });
            return false;
        }
        
        
        if (this.state.packages.length === 0) {
            alert("Selecione un paquete.");
            this.setState({
                currentTab: this.state.currentTab = "Step3"
            });
            return false;
        }

        return true;
    }


    validation = () => {
       
        if (this.state.packageStatus.length === 0) {
            alert("Seleccione una modalidad de compra.");
            return false;
            
        } else if(this.state.packageStatus === "U" && this.state.upgradeExperience === 0){
            alert("Seleccione la membresia a migrar.");
            return false;
        }
        
        
        if (this.state.packages.length === 0) {
            alert("Selecione un paquete.");
            this.setState({
                currentTab: this.state.currentTab = "Step3"
            });
            return false;
        }

        if (this.state.payment.typePay === 1) {
            if (!this.state.payment.isPaid) {
                if (this.state.payment.vouchers.length <= 0) {
                    alert("Tiene que registrar el pago de su compra.");
                    return false;
                }
            }
        } else if (this.state.payment.typePay == 0) {
            if (this.state.payment.vouchers.length <= 0) {
                alert("Seleccione un método de pago.");
                return false;
            }
            
        } 


        return true;
    }

    sendData = async () => {

        if (this.validation()) {

            // Loading 
            this.setState({
                loadSenData: true
            });

            let data= {};
            // Set properties
            data.IdUserPayment = Number(AuthService.getCurrentIdUser());
            data.IdPackagePayment = this.state.packages[0].id;
            data.AmountPayment = this.state.payment.amountPaid;
            data.QuotesPaid = this.state.payment.quotesPaid;

            // TypePayment
            // {
            //     Paypal = 1,
            //     Vouchers = 2,
            //     Wallet = 3,
            //     Mixto = 4,
            //     Otros = 5,
            // }

            // Pay with paypal
            if( this.state.payment.typePay === 1){

                data.TypePayment = 1;
                data.PaypalDTO = {
                        "nroOperation" : this.state.payment.idTransaction
                };
                data.WalletTransaction = {
                    "Amount" : 0
                };
                data.Vouchers = []; 
       
            } else if( this.state.payment.typePay === 0){
                
                let typeMethod = 0;
                let vouchers = [];
                if(this.state.payment.vouchers.length > 0){

                    typeMethod = 2;
                    for(let i = 0; i < this.state.payment.vouchers.length; i++){

                        let contenType = this.state.payment.vouchers[i].voucherBase.split(',');
                     
                        let temp = {
                                    "IdPayMethod" : Number(this.state.payment.vouchers[i].type),
                                    "NroOperacion" : this.state.payment.vouchers[i].code,
                                    "Content" : contenType[1]
                        }

                        vouchers.push(temp);
                    }

                    data.Vouchers = vouchers;

                }

                //wallet 
                if(this.state.amountWallet > 0) {
                    data.WalletTransaction = {
                        "Amount" : this.state.amountWallet 
                    };

                    // typepayment
                    typeMethod = (typeMethod > 0)? 4: 3;
                }

                data.TypePayment = typeMethod;

            } else if( this.state.payment.typePay === 3){
              
                data.WalletTransaction = {
                    "Amount" : this.state.amountWallet 
                };
  
                data.TypePayment = 3;

            }


            //verify if migration
            if(this.state.packageStatus === "N") {

                
                let response = await ShopService.registerNewSuscription(data);

               

                if(response !== undefined && response.status === 1) {

                    this.setState({
                        isComplete: true,
                        loadSenData: false
                    });
                    // alert("Compra registrada con éxito.")
                } else {

                    this.setState({
                        loadSenData: false
                    });
                    alert("Tuvimos problemas al registrar su compra.");
                }

            } else if( this.state.packageStatus === "U" ){

                
                data.IdSuscriptionPayment = this.state.upgradeExperience;

                let response = await ShopService.registerUpgradeSuscription(data);
                
                if(response !== undefined && response.status === 1) {
                    this.setState({
                        isComplete: true,
                        loadSenData: false
                    });
                    // alert("Migración registrada con éxito.")
                } else {
                    this.setState({
                        loadSenData: false
                    });
                    alert("Tuvimos problemas al registrar su migración.");
                }
            }

            this.setState({
                loadSenData: false
            });
        }
    }; 


    // Clean values
    clean = () => {
        this.setState({
            isComplete: false,
            packageStatus:"",
            packages: [],
            kitInit: [],
            amountPaid: 0,
            quotesPaid : 0,
            displayFooter: 'none',
            currentTab: '',
            payment: {
                scheduleJSON: "",
                idMethodPayment: 0,
                mountPaid: 0,
                isPaid: false,
                typePay: 0,
                vouchers: [],
                amountPaid: 0,
                quotesPaid : 0,
            },
            voucher: {
                bank: '',
                isPaid: false
            },
            amountWallet: 0
        });
    }

    render() {
        return (

            // <div className="auth-wrapper">
            <div>
                {!this.state.isComplete &&
                <div className="register-inner" >
                    {/* <Form.Label className="content-title">Registro de nuevo socio</Form.Label> */}

                    <PackageMain onChange={this.eventhandler}
                        eventFooter={this.eventFooter}
                        eventPay={this.eventPayment}
                        eventWallet={this.eventWallet}
                        packages={this.state.packages}
                        currentTab={this.state.currentTab}
                        validateToPay={this.validationAfterPay}
                        registerBuy={this.sendData}
                        ></PackageMain>
                    <hr></hr>
                    {(this.state.packages.length > 0 || this.state.kitInit.length > 0 ) && 
                    <div className="row justify-content-between" >
                        <Col ms={4}>
                            <Button variant="danger"
                            onClick={e => this.OnClicked(e, "/home")}
                            >Cancelar</Button>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            <Button variant="primary"
                                onClick={this.sendData}>Finalizar</Button>
                        </Col>
                    </div>
                    }

                </div>
                }
                {this.state.isComplete &&
                <div >
                    <PackageEndView
                        refresh={this.clean}
                    ></PackageEndView>
                </div>
                }
                <Modal
                    show={this.state.loadSenData}
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


