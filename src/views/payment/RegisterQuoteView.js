import React, { Component } from 'react';
import {Form, Button, Row, Col, Spinner , Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserService from '../../services/user.service';
import history from '../navigation/history';
import PayQuote from '../../components/payment/PayQuote';

/**
 * Component to register payments usign the link from the email
 */
export default class RegisterQuoteView extends Component{
        constructor(props){
            super(props);
            this.state = {
                quote: undefined,
                idSuscription: 0,
                suscription: {},
                loading: true,
                noData: false,
                vouchers: [],
                isPaid: false,
                loadSenData : false,
                isComplete: false,
                objPayPal: {
                    isPaid: undefined,
                    mountPaid: undefined,
                    creationDate: undefined,
                    modificationDate: undefined,
                    idTransaction: undefined,
                    intent: undefined,
                    status: undefined
                },
                walletAmount:0,
            }
    
            this.quoteToPay = this.quoteToPay.bind(this);
            this.getToken = this.getToken.bind(this);

            // Create reference to Paypal
            this.childPaypal = React.createRef();
        }
    
    
        componentDidMount(){

            let object = this.quoteToPay();
        
            if(object === undefined){
                this.getToken()
            }
        }
    
        async getToken(){
            let url = window.location;
            let params  = url.search;
            let listParams = params.split('='); //queryString.parse(params);
            // console.log(listParams);
            let token = listParams[1];
            if(token !== undefined){
                let response = await  UserService.getInfoQuotePayment(token);
                // console.log(response)
                if(response !== undefined) {
                   
                    if(response.status === 1){
                        let quote = {
                            idMembershipDetail: response.objModel.idMembershipPayDetail,
                            idSuscription: response.objModel.idSuscription,
                            idPaquete: response.objModel.idSuscription,
                            idUser: response.objModel.idUser,
                            namePackage: response.description,
                            quoteUsd: response.objModel.quotaAmount,
                            quoteDescription: response.objModel.detail
                        };

                        this.setState({
                            loading: this.state.loading = false,
                            quote: this.state.quote = quote,
                            noData: this.state.noData = false
                        });
                    } else if(response.status === 0) {
                        this.setState({
                            loading: this.state.loading = false,
                            quote: this.state.quote = undefined,
                            noData: this.state.noData = true,
                            noDataMessage: this.state.noDataMessage = "Token de pago expiró."
                        });
                    }else {
                        this.setState({
                            loading: this.state.loading = false,
                            quote: this.state.quote = undefined,
                            noData: this.state.noData = true,
                            noDataMessage: this.state.noDataMessage = "Ocurrió un problema al obtener información. Regrese más tarde."
                        });
                    }
                } else {
                    this.setState({
                        loading: this.state.loading = false,
                        quote: this.state.quote = undefined,
                        noData: this.state.noData = true,
                        noDataMessage: this.state.noDataMessage = "Ocurrió un problema al obtener información. Regrese más tarde."
                    });
                }
            } else {
                this.setState({
                    loading: this.state.loading = false,
                    quote: this.state.quote = undefined,
                    noData: this.state.noData = true,
                    noDataMessage: this.state.noDataMessage = "No pudimos obtener información."
                });
            }
            
        }

        quoteToPay() {
            console.log(localStorage.getItem('currentQuote'));
            if(localStorage.length > 0 && localStorage.getItem('currentQuote') !== null) {
                if(localStorage.getItem('currentQuote').length > 0){
                  let quote = JSON.parse(localStorage.getItem('currentQuote'));
                  this.setState({
                    loading: this.state.loading = false,
                    quote: this.state.quote = quote,
                    noData: this.state.noData = false
                  });

                  return quote;
                } else {
                    this.setState({
                        loading: this.state.loading = false,
                        quote: this.state.quote = undefined,
                        noData: this.state.noData = true
                      });
                    return undefined;
                }
            }else{
                this.setState({
                    loading: this.state.loading = false,
                    quote: this.state.quote = undefined,
                    noData: this.state.noData = true
                  });

                return undefined;
            }
        }

    
        // TODO change for only call send dato from paypal is payment is proccesed
        /**
         * Event to handle the paypal's payment and vouchers
         * @param {*} data 
         * @param {*} field 
         */
        eventPaypal = (data, field) => {
            
            if(field === "vouchers") {
                this.setState({
                    [field]:  this.state[field] = data
                });
            } else {
                let obj = this.state.objPayPal;

                obj[field] = data;
                this.setState({
                    objPayPal:  this.state.objPayPal = obj
                });
                //verify if all field are not undefined
                this.verifyObjetPaypal(obj);
            }
           
        }

        verifyObjetPaypal = (obj) => {
            if(obj.isPaid !== undefined && obj.mountPaid !== undefined 
                && obj.creationDate !== undefined && obj.modificationDate !== undefined 
                && obj.idTransaction !== undefined && obj.intent !== undefined && obj.status !== undefined) {
                    if(obj.isPaid) {
                        // save paypal and complete payment
                        this.sendData()
                    }
            } else {

            }
        }

        validate = () => {
            // verify if the payment was by paypal
            if(this.state.objPayPal.isPaid) {
                if(this.state.objPayPal.status === "COMPLETED") {
                    
                    return true;
                } else {
                    alert("Su pago con PayPal ha sido rechazado. Seleccione otro medio de pago.");
                    return false;
                }

            } else if(this.state.vouchers.length > 0) {
                return true;
            } else {
                alert("Seleccione un medio de pago.");
                return false;
            }
        }

        eventAddWallet = (monto) => {
            console.log(monto)
            this.setState({
                walletAmount: this.state.walletAmount = monto
            });
        }
        /**
         * Register pay by tickets or paypal
         */
        // Paypal = 1,
        // Vouchers = 2,
        // Wallet = 3,
        // Mixto = 4,
        // Otros = 5,
        sendData = async() => {

            if(this.validate()) {
                this.setState({
                    loadSenData: this.state.loadSenData = true
                });
               console.log(this.state)
                // By paypal register
                if(this.state.objPayPal.isPaid) {
                    console.log("payapl")
                    // Close paypal modal 
                    this.childPaypal.current.handleClose();

                    //send data
                    let data = {
                        id: 3,
                        idUser : this.state.quote.idUser,
                        nroOperation : this.state.objPayPal.idTransaction,
                        idSuscription : this.state.quote.idSuscription,
                        idMembershipPaydetail : this.state.quote.idMembershipDetail
                   }
                    let response = await UserService.registerPaymentQuotePayPal(data);

                    if(response !== undefined) {
                        if(response.status === 1){
                            // Delete local storage item
                            localStorage.removeItem('currentQuote');
                            console.log(localStorage.getItem('currentQuote'));
                            this.setState({
                                isComplete: this.state.isComplete = true,
                                loadSenData: this.state.loadSenData = false
                            });
                         
                        } else {
                            this.setState({
                                loadSenData: this.state.loadSenData = false
                            });
                            alert("Ocurrió un error al momento de registrar su pago.");
                        }
                    } else {
                        this.setState({
                            loadSenData: this.state.loadSenData = false
                        });
                        alert('Tuvimos un problema. Inténtalo más tarde.');
                    }

                } else if(this.state.vouchers.length > 0  && this.state.walletAmount <= 0) {
                    //Vouchers
                    console.log("vouchers")
                    // let vouchers = [];
                    // let vouchersUpload = this.state.vouchers;
                    // let i;
                    // for(i=0; i < vouchersUpload.length ; i++){
                    //     // Split base64 code type and string
                    //     let contenType = vouchersUpload[i].voucherBase.split(',');
                    //     let temp = {
                    //         nroOperation: vouchersUpload[i].code,
                    //         PayType: vouchersUpload[i].type,
                    //         bytesMap: contenType[1]
                    //     }
                    //     vouchers.push(temp);
                    // }

                    let data ={
                        TypePayment : 2,
                        WalletTransaction : {
                            Amount : this.state.walletAmount
                        },
                        IdUserPayment : this.state.quote.idUser,
                        IdSuscriptionPayment : this.state.quote.idSuscription,
                        IdMembershipDetailPayment : this.state.quote.idMembershipDetail,
                        
                    };


                    let vouchers = [];
                    let vouchersUpload = this.state.vouchers;
            
                    for(let i=0; i < vouchersUpload.length ; i++){
                        // Split base64 code type and string
                        let contenType = vouchersUpload[i].voucherBase.split(',');
                        let temp = {
                            NroOperacion: vouchersUpload[i].code,
                            IdPayMethod: Number(vouchersUpload[i].type),
                            Content: contenType[1]
                        }
                        vouchers.push(temp);
                    }
                    data.Vouchers = vouchers;



                    // let data = {

                    //     id: 3,
                    //     idUser : this.state.quote.idUser,
                    //     nroOperation : this.state.objPayPal.idTransaction,
                    //     idSuscription : this.state.quote.idSuscription,
                    //     idMembershipPaydetail : this.state.quote.idMembershipDetail,
                    //     vouchers: {
                    //         User:
                    //         {
                    //            name: "-",
                    //            lastname: "-",
                    //            nroDocument: "-"     
                    //         },
                    //         Caption: "",
                    //         Base64Images: vouchers
                    //     }
                    // }

                    let response = await UserService.registerPaymentQuoteVouhersv2(data);

                    if(response !== undefined) {
                        if(response.status === 1){
                            localStorage.removeItem('currentQuote');
                            this.setState({
                                isComplete: this.state.isComplete = true,
                                loadSenData: this.state.loadSenData = false
                            });
                            
                        } else {
                            this.setState({
                                loadSenData: this.state.loadSenData = false
                            });
                            alert("Ocurrió un error al momento de registrar su pago.");
                        }
                    } else {
                        this.setState({
                            loadSenData: this.state.loadSenData = false
                        });
                        alert('Tuvimos un problema. Inténtalo más tarde.');
                    }
                } else if(this.state.vouchers.length === 0  && this.state.walletAmount > 0){
                    // Pay with only wallet
                    console.log("wallet")

                    // Implement into eventPayWallet
                } else if(this.state.vouchers.length > 0  && this.state.walletAmount > 0){
                    // Pay with vouchers and wallet
                    console.log("vouchers wallet")
                    
                    let data ={
                        TypePayment : 4,
                        WalletTransaction : {
                            Amount : this.state.walletAmount
                        },
                        IdUserPayment : this.state.quote.idUser,
                        IdSuscriptionPayment : this.state.quote.idSuscription,
                        IdMembershipDetailPayment : this.state.quote.idMembershipDetail,
                        
                    };

                    let vouchers = [];
                    let vouchersUpload = this.state.vouchers;
            
                    for(let i=0; i < vouchersUpload.length ; i++){
                        // Split base64 code type and string
                        let contenType = vouchersUpload[i].voucherBase.split(',');
                        let temp = {
                            NroOperacion: vouchersUpload[i].code,
                            IdPayMethod: Number(vouchersUpload[i].type),
                            Content: contenType[1]
                        }
                        vouchers.push(temp);
                    }
                    data.Vouchers = vouchers;

                    let response = await UserService.registerPaymentQuoteVouhersWallet(data);
                    if(response !== undefined) {
                        if(response.status === 1){
                            localStorage.removeItem('currentQuote');
                            this.setState({
                                isComplete: this.state.isComplete = true,
                                loadSenData: this.state.loadSenData = false
                            });
                            
                        } else {
                            this.setState({
                                loadSenData: this.state.loadSenData = false
                            });
                            alert("Ocurrió un error al momento de registrar su pago.");
                        }
                    } else {
                        this.setState({
                            loadSenData: this.state.loadSenData = false
                        });
                        alert('Tuvimos un problema. Inténtalo más tarde.');
                    }
                }
            }
        }

        cancelar = () => {
            
        }

        returnLogin = () => {
            history.push("/sign-in");
        }


        // Pay wallet
        eventPayWallet = async(amount) => {
            let data = {
                IdUser : this.state.quote.idUser,
                ClaveWeb : "AQ46408243",
                IdSuscription : this.state.quote.idSuscription,
                IdMembershipPay : this.state.quote.idMembershipDetail,
                IdPayMethod : 17,
                WalletTransaction : {
                    Amount : amount,
                    ReferenceData : this.state.quote.quoteDescription
                }
            }

            let response = await UserService.registerPaymentQuoteWallet(data);

            if(response !== undefined) {
                if(response.status === 1){
                    this.setState({
                        isComplete: this.state.isComplete = true,
                        loadSenData: this.state.loadSenData = false
                    });
                    // Delete local storage item
                    localStorage.removeItem('currentQuote')
                } else {
                    this.setState({
                        loadSenData: this.state.loadSenData = false
                    });
                    alert("Ocurrió un error al momento de registrar su pago. \n" + response.description);
                }
            } else {
                this.setState({
                    loadSenData: this.state.loadSenData = false
                });
                alert('Tuvimos un problema. Inténtalo más tarde.');
            }
            
        }
    

        
        render() {
            const { quote, loading, noData, noDataMessage, isComplete, walletAmount } = this.state;
            return (
                <div>
                    {!isComplete && 
                         <div class="panel-form">
                         {loading && 
                             <div style={{textAlign: 'center'}}>
                                 <Spinner animation="border" variant="dark">
                                 </Spinner>
                                 <p>Obteniendo información ...</p>
                             </div>
                         }
                         {!loading && !noData && 
                             <div>
                                <PayQuote quote={quote}
                                    eventPay={this.eventPaypal}
                                    registerPayWallet={this.eventPayWallet}
                                    eventWallet={this.eventAddWallet}
                                    ref={this.childPaypal}
                                ></PayQuote>
                                {walletAmount > 0 && 
                                <div>
                                    <p><b>Monto pagado con Mi Wallet $ :</b> {walletAmount}</p>
                                </div>
                                }
                                     
                                 <div className="row justify-content-between" style={{display:this.state.displayFooter}}>
                                     <Col style={{textAlign: 'right'}}>
                                         <Button variant="primary"
                                             onClick={this.sendData}>Registrar</Button>
                                     </Col>
                                 </div>
                             </div>
                             
                         }
                         {noData && 
                             <div style={{textAlign: 'center'}}>
                                 <Form.Label>{noDataMessage}</Form.Label>
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
                 
                    }
                    {isComplete && 
                        <div  class="panel-form">
                            <Row style={{textAlign: 'center'}}>
                                <Col sm={12}>
                                    <Form.Label>Registro exitoso!</Form.Label>
                                </Col>
                            </Row>
                            <Row style={{textAlign: 'center'}}>
                                <Col sm={12}>
                                    <Button onClick={this.returnLogin}>Volver</Button>
                                </Col>
                            </Row>
                        </div>
                    }
                </div>
               );
        }
        
    
    }
    