import React, { Component } from 'react';
import {Form, Button, Row, Col, Spinner , Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserService from '../../services/user.service';
import PayRegister from '../../components/payment/PayRegister';
import history from '../navigation/history';

/**
 * Component to register payments usign the link from the email
 */
export default class RegisterPaymentView extends Component{
        constructor(props){
            super(props);
            this.state = {
                idSuscription: 0,
                suscription: {},
                loading: true,
                noData: false,
                vouchers: [],
                isPaid: false,
                loadSenData : false,
                isComplete: false,
                quotesPay: 0
            }
    
            this.getsuscription = this.getsuscription.bind(this);
        }
    
    
        componentDidMount(){
            this.getsuscription();
        }
    
    
        async getsuscription() {
            let url = window.location;
            let params  = url.search;
            let listParams = params.split('='); //queryString.parse(params);
    
            let id = listParams[1];
            this.setState({
                idSuscription: this.state.idSuscription = Number(id)
            });
            
            let response = await  UserService.getSuscriptionById(id);
            // console.log(response)
            if(response !== undefined) {
                
                if(response.status == 1){
                    this.setState({
                        idUser: response.objModel.idUser,
                        suscription: this.state.suscription = response.objModel,
                        packages: this.state.packages = [response.objModel.package],
                        mountPaid:  response.objModel.package.initialPrice,
                        // packages: this.state.packages = [item],
                        loading: this.state.loading = false,
                        noData: this.state.noData = false,
                        noDataMessage: this.state.noDataMessage = ""
                    });
                } else {
                    this.setState({
                        suscription: this.state.suscription = {},
                        loading: this.state.loading = false,
                        noData: this.state.noData = true,
                        noDataMessage: this.state.noDataMessage = "Ocurrió un problema al obtener información. Regrese más tarde."
                    });
                }
            } else {
                this.setState({
                    suscription: this.state.suscription = {},
                    loading: this.state.loading = false,
                    noData: this.state.noData = true,
                    noDataMessage: this.state.noDataMessage = "Ocurrió un problema al obtener información. Regrese más tarde."
                });
            }
        }

        eventPay = (data, field) => {

            if(field === 'vouchers'){
                // let vouchers = this.state.vouchers;
                // vouchers = vouchers.concat(data);
                this.setState({
                    vouchers: this.state.vouchers = data
                });
            } else {
                this.setState({
                    [field]: this.state[field] = data
                });
            }

            if(field === 'quotesPay') {
                let total = this.state.packages[0].initialPrice + data * this.state.packages[0].quoteprice;
                this.setState({
                    mountPaid: this.state.mountPaid = total
                });
            }
            console.log(this.state)
            

        }

        eventVoucher = (data, field) => {
            // console.log(data);
            // console.log(field);
        }

        validate = () => {
            // verify if the payment was by paypal
            if(this.state.isPaid) {
                if(this.state.status === "COMPLETED") {
                    
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

        /**
         * Register pay by tickets or paypal
         */

        sendData = async() => {

            if(this.validate()) {
                this.setState({
                    loadSenData: this.state.loadSenData = true
                });
                let data = {
                    IdUserPayment: this.state.idUser,
                    IdPackagePayment: this.state.packages[0].id,
                    IdSuscriptionPayment: this.state.idSuscription,
                    QuotesPaid: this.state.quotesPay,
                    AmountPayment: this.state.mountPaid,
                   
                }
                // By paypal register
                if(this.state.isPaid) {
                    data.TypePayment =1;
                    data.Vouchers = [];
                    data.WalletTransaction = {
                        Amount: 0
                    };
                    data.PaypalDTO = {
                        nroOperation: this.state.idTransaction
                    };
                   
                } else {
                    //Vouchers
                    let vouchers = [];
                    let vouchersUpload = this.state.vouchers;
                    let i;
                    for(i=0; i < vouchersUpload.length ; i++){
                        // Split base64 code type and string
                        let contenType = vouchersUpload[i].voucherBase.split(',');
                        let temp = {
                            NroOperacion: vouchersUpload[i].code,
                            IdPayMethod: Number(vouchersUpload[i].type),
                            AccountHolder: vouchersUpload[i].titular,
                            Content: contenType[1]
                        }
                        vouchers.push(temp);
                    }

                    data.TypePayment = 2;
                    data.Vouchers = vouchers;
                    data.WalletTransaction = {
                            Amount: 0
                    };
                    data.PaypalDTO = {
                            nroOperation: ""
                    };
                                        
                }

                let response = await UserService.registerVouhersV2(data);

                    if(response !== undefined) {
                        if(response.status === 1){
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

        cancelar = () => {
            
        }

        returnLogin = () => {
            history.push("/sign-in");
        }

        render() {
            const { suscription, loading, noData, noDataMessage, isComplete } = this.state;
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
                                 <PayRegister packages={this.state.packages}
                                        suscription={suscription}
                                        eventPay={this.eventPay}
                                        onchangePayVoucher={this.eventVoucher} 
                                        savePaypal={this.sendData}></PayRegister>
                                     
                                 <div className="row justify-content-between" style={{display:this.state.displayFooter}}>
                                     {/* <Col ms={4}>
                                         <Button variant="danger"
                                             onClick={this.cancelar}
                                             >Cancelar</Button>
                                     </Col> */}
                                     <Col style={{textAlign: 'right'}}>
                                         <Button variant="primary"
                                             onClick={this.sendData}>Guardar</Button>
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
    