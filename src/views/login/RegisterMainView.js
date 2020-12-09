import React, { Component } from 'react';
import { Form, Button, Col, Row, Spinner, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import  RegisterMain  from '../../components/register/RegisterMain';
import RegisterEndView from './RegisterEndView';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

// // Production
// const linkMail = 'https://inclub.world/register-payment';

// Test
const linkMail = 'https://inresorttest.web.app/register-payment'

export default class RegisterMainView extends Component {
    constructor(props){
        super(props);
        this.state = {
            showWallet: props.showWallet,
            idSocio: props.idSocio,
            reload: props.reload,
            user: {
                name:'',
                lastname:'',
                birthdate: '',
                gender:'',
                idNationality: -1,
                nroDocument : '',
                civilState : '',
                email:'',
                idResidenceCountry : -1,
                idDocumentTypeCountry: -1,
                desDocument: "",
                districtAddress : "",
                address : "",
                phone: "",
                username : "",
                password : "",
                coafiliate : false,
                coname:'',
                colastname:'',
                cobirthdate: '',
                conroDocument : '',
                codesDocument: "",
                coidDocumentTypeCountry: -1,
                packages :[],
                kitInit: []
            },
            tempuser:{},
            displayFooter: 'none',
            currentTab:'',
            isComplete: false,
            payment:{
                scheduleJSON: "",
                idMethodPayment: 0,
                mountPaid : 0,
                isPaid: false,
                typePay: 0,
                quotesPay: 0,
                vouchers: [],
                quotesPay: 0,
                amountPay: 0
            },
            voucher: {
                bank: '',
                isPaid: false
            },
            loadSenData : false,
            observerPaypal: {
                isPaid: undefined,
                mountPaid: undefined,
                creationDate: undefined,
                modificationDate: undefined,
                idTransaction: undefined,
                intent: undefined,
                status: undefined
            },
            amountWallet: 0
        }

        // Create reference to Paypal
        this.childPaypal = React.createRef();
    }

   

    eventhandler = (data, field) => {
        // //console.log('register view');
        // //console.log(field, ": ", data);
        // this.state.tempuser = data;
        var temp = this.state.user;
        temp[field] = data;
        // //console.log(temp);
        this.setState({ user: temp });
    };
    /**
     * Event to handle if the footer is shown or hidden
     * @param {*} value
     * @param {*} field
     */
    eventFooter = (value, field) =>  {
        //console.log(field, ": ", value);
        this.setState({[field]: value });
    }


    /**
     * Validate form for step 1, step  and step 3
     */
    eventValidate = () =>  {

        // Step 1
        if(this.state.user.name.length === 0) {
            alert("Ingrese sus nombres.");
            return false;
        }
        if(this.state.user.lastname.length === 0) {
            alert("Ingrese sus apellidos.");
            return false;
        }
        if(this.state.user.birthdate.length === 0){
            alert("Ingrese su fecha de nacimiento");
            return false;
        }
        if(this.state.user.gender.length === 0) {
            alert("Seleccione su sexo.");
            return false;
        }
        if(this.state.user.idNationality <= 0){
            alert("Seleccione su nacionalidad.");
            return false;
        }

        if(this.state.user.idDocumentTypeCountry <= 0){
            alert("Seleccione un tipo de documento.");
            return false;
        }
        if(this.state.user.nroDocument.length === 0){
            alert("Ingrese su número de documento.");
            return false;
        }
        if(this.state.user.civilState.length === 0){
            alert("Seleccione su estado civil.");
            return false;
        }

        if(this.state.user.coafiliate){

            if(this.state.user.coname.length === 0) {
                alert("Ingrese los nombres de su coafiliado.");
                return false;
            }
            if(this.state.user.colastname.length === 0) {
                alert("Ingrese los apellidos de su coafiliado.");
                return false;
            }
            if(this.state.user.coidDocumentTypeCountry <= 0){
                alert("Seleccione el tipo de documento de su coafiliado.");
                return false;
            }
            if(this.state.user.conroDocument.length === 0){
                alert("Ingrese el numero de documento de su coafiliado.");
                return false;
            }
            if(this.state.user.cobirthdate.length === 0){
                alert("Ingrese la fecha de nacimiento  de su coafiliado.");
                return false;
            }
        }

        //Step 2
        if(this.state.user.email.length === 0){
            alert("Ingrese su correo electrónico.");
            return false;
        }
        if(this.state.user.idResidenceCountry <= 0){
            alert("Seleccione su país de residencia.");
            return false;
        }
        if(this.state.user.districtAddress.length === 0){
            alert("Ingrese su ciudad.");
            return false;
        }
        if(this.state.user.address.length === 0){
            alert("Ingrese su dirección.");
            return false;
        }
        if(this.state.user.phone.length === 0){
            alert("Ingrese su número de celular.");
            return false;
        }

        // Step 3
        if(this.state.user.packages.length === 0){
            alert("Selecione un paquete.");
            return false;
        }
        
        return true;
    }


    /**
     * To handle the event  on payment step
     */
    eventPayment = (value, field) => {
        
        var temp = this.state.payment;
        temp[field] = value;
        this.setState({ payment: temp });

        // TODO change by object verify if the field of paypal are filled
        if(field === "isPaid") {
            var temp = this.state.observerPaypal;
            temp[field] = value;
            this.setState({ observerPaypal: temp });
        }
        if(field === "mountPaid") {
            var temp = this.state.observerPaypal;
            temp[field] = value;
            this.setState({ observerPaypal: temp });
        }
        if(field === "creationDate") {
            var temp = this.state.observerPaypal;
            temp[field] = value;
            this.setState({ observerPaypal: temp });
        }
        if(field === "modificationDate") {
            var temp = this.state.observerPaypal;
            temp[field] = value;
            this.setState({ observerPaypal: temp });
        }
        if(field === "idTransaction") {
            var temp = this.state.observerPaypal;
            temp[field] = value;
            this.setState({ observerPaypal: temp });
        }
        if(field === "intent") {
            var temp = this.state.observerPaypal;
            temp[field] = value;
            this.setState({ observerPaypal: temp });
        }
        if(field === "status") {
            var temp = this.state.observerPaypal;
            temp[field] = value;
            this.setState({ observerPaypal: temp });
        }

        //verify if all field are not undefined
        this.verifyObjetPaypal(this.state.observerPaypal);
    }

    /** verify observer paypal */
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

    eventVoucher = (value, field) => {
        var temp = this.state.voucher;
        temp[field] = value;
        this.setState({ voucher: temp });
     
    }

    validation = () => {
        if(this.state.user.name.length === 0) {
            alert("Ingrese sus nombres.");
            this.setState({
                currentTab: this.state.currentTab ="Step1"
            });
            return false;
        }
        if(this.state.user.lastname.length === 0) {
            alert("Ingrese sus apellidos.");
            this.setState({
                currentTab: this.state.currentTab ="Step1"
            });
            return false;
        }
        if(this.state.user.birthdate.length === 0){
            alert("Ingrese su fecha de nacimiento");
            this.setState({
                currentTab: this.state.currentTab ="Step1"
            });
            return false;
        }
        if(this.state.user.gender.length === 0) {
            alert("Seleccione su sexo.");
            this.setState({
                currentTab: this.state.currentTab ="Step1"
            });
            return false;
        }
        if(this.state.user.idNationality <= 0){
            alert("Seleccione su nacionalidad.");
            this.setState({
                currentTab: this.state.currentTab ="Step1"
            });
            return false;
        }

        if(this.state.user.idDocumentTypeCountry <= 0){
            alert("Seleccione un tipo de documento.");
            this.setState({
                currentTab: this.state.currentTab ="Step1"
            });
            return false;
        }
        if(this.state.user.nroDocument.length === 0){
            alert("Ingrese su número de documento.");
            this.setState({
                currentTab: this.state.currentTab ="Step1"
            });
            return false;
        }
        if(this.state.user.civilState.length === 0){
            alert("Seleccione su estado civil.");
            this.setState({
                currentTab: this.state.currentTab ="Step1"
            });
            return false;
        }
        if(this.state.user.email.length === 0){
            alert("Ingrese su correo electrónico.");
            this.setState({
                currentTab: this.state.currentTab ="Step2"
            });
            return false;
        }
        if(this.state.user.idResidenceCountry <= 0){
            alert("Seleccione su país de residencia.");
            this.setState({
                currentTab: this.state.currentTab ="Step2"
            });
            return false;
        }
        if(this.state.user.districtAddress.length === 0){
            alert("Ingrese su ciudad.");
            this.setState({
                currentTab: this.state.currentTab ="Step2"
            });
            return false;
        }
        if(this.state.user.address.length === 0){
            alert("Ingrese su dirección.");
            this.setState({
                currentTab: this.state.currentTab ="Step2"
            });
            return false;
        }
        if(this.state.user.phone.length === 0){
            alert("Ingrese su número de celular.");
            this.setState({
                currentTab: this.state.currentTab ="Step2"
            });
            return false;
        }
        if(this.state.user.packages.length === 0){
            alert("Selecione un paquete.");
            this.setState({
                currentTab: this.state.currentTab ="Step3"
            });
            return false;
        }
        if(this.state.user.coafiliate){


            if(this.state.user.coname.length === 0) {
                alert("Ingrese los nombres de su coafiliado.");
                this.setState({
                    currentTab: this.state.currentTab ="Step1"
                });
                return false;
            }
            if(this.state.user.colastname.length === 0) {
                alert("Ingrese los apellidos de su coafiliado.");
                this.setState({
                    currentTab: this.state.currentTab ="Step1"
                });
                return false;
            }
            if(this.state.user.coidDocumentTypeCountry <= 0){
                alert("Seleccione el tipo de documento de su coafiliado.");
                this.setState({
                    currentTab: this.state.currentTab ="Step1"
                });
                return false;
            }
            if(this.state.user.conroDocument.length === 0){
                alert("Ingrese el numero de documento de su coafiliado.");
                this.setState({
                    currentTab: this.state.currentTab ="Step1"
                });
                return false;
            }
            if(this.state.user.cobirthdate.length === 0){
                alert("Ingrese la fecha de nacimiento  de su coafiliado.");
                this.setState({
                    currentTab: this.state.currentTab ="Step1"
                });
                return false;
            }
        }

        if(this.state.payment.typePay === 1 ){
            if(!this.state.payment.isPaid){
                console.log(this.state.payment.vouchers.length);
                console.log(this.state.amountWallet);
                console.log(this.state.payment.vouchers.length <= 0)
                console.log(this.state.amountWallet <= 0)
                console.log(this.state.payment.vouchers.length <= 0 || this.state.amountWallet <= 0)
                if(!(this.state.payment.vouchers.length > 0 || this.state.amountWallet > 0)) {
                    alert("Tiene que registrar el pago de su membresía.");
                    return false;
                }
            }
        } else if (this.state.payment.typePay === 0){
            alert("Seleccione un método de pago.");
            return false;
        }


        return true;
    }

    // event wallet part of payment
    eventWallet = (amount) => {
        this.setState({
            amountWallet: this.state.amountWallet = amount
        });

        // // verify payment
        // if(amount > 0 || this.state.voucher.length > 0) {
        //     let payment = this.state.payment;
        //     payment.isPaid = true;
        //     this.setState({
        //         payment: payment
        //     });
        // }
    }

    // Register data
    sendData = async()=> {

        // e.preventDefault();
       //console.log("register");
        if(this.validation()){
            this.setState({
                loadSenData: this.state.loadSenData = true
            });

            let data = {};
            let user = {};
            user.name = this.state.user.name;
            user.lastname = this.state.user.lastname;
            user.birthdate = this.state.user.birthdate;
            user.gender = this.state.user.gender;
            user.idNationality = Number(this.state.user.idNationality);
            user.idDocument = Number(this.state.user.idDocumentTypeCountry);
            if(this.state.user.desDocument.length > 0) {
                user.otherDocument = this.state.user.desDocument;
                user.nroDocument = this.state.user.nroDocument;

            } else {
                user.nroDocument = this.state.user.nroDocument;

            }
            user.civilState = this.state.user.civilState;
            user.email = this.state.user.email;
            user.idResidenceCountry = Number(this.state.user.idResidenceCountry);
            user.districtAddress = this.state.user.districtAddress;
            user.address = this.state.user.address;
            user.nroTelf = this.state.user.codephone + " " + this.state.user.phone;
            user.username = "";
            user.password = "";
            user.boolDelete = 0;
            let date = new Date();
            user.createDate = date;
            let  suscription = {};
            suscription.idUser = 0;
            suscription.idPackage = Number(this.state.user.packages[0].id);
            // let datString = "2020-07-14T00:00:00";// date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
            suscription.creationDate = date;
            suscription.observation = "";
            suscription.status =  0;
            suscription.boolMigration = 0

            data.user = user;
            data.suscription = suscription;
            let coafiliate = {};
            // Coafiliate
            if(this.state.user.coafiliate){
                coafiliate.name = this.state.user.coname;
                coafiliate.lastname = this.state.user.colastname;
                coafiliate.idDocument = Number(this.state.user.coidDocumentTypeCountry);
                coafiliate.birthdate = this.state.user.cobirthdate;
                if(this.state.user.codesDocument.length > 0) {
                    coafiliate.otherDocument = this.state.user.codesDocument;
                    coafiliate.nroDocument = this.state.user.conroDocument;
                } else {
                    coafiliate.nroDocument = this.state.user.conroDocument;
                }
                coafiliate.idUser = 1;
                data.CoAffiliate = coafiliate;
            }
            

            // Type method to pay
            let idTypeMethod = 0;
            // Paypal = 1,
            // Vouchers = 2,
            // Wallet = 3,
            // Mixto = 4,
            // Otros = 5,

            //if voucher is paid is true the payment was paid by voucher
            // membDetail :payments
            // TypePay == the pay was by paypal or vouchers or wallet
            if(this.state.payment.typePay == 1){

                // Type payment
                // wallet, mixto Y otros -> services v2
                // Vouchers and wallet -> services v1 
                let payment = {};

                // was with vouchers
                if(!this.state.payment.isPaid){
                    payment.scheduleJSON = "";
                    payment.idMethodPayment = 1; // TODO what are method of payments preguntar
                    payment.creationDate = new Date();
                    payment.modificationDate = new Date();
                    payment.idSuscription = suscription.idPackage;
         
                    let voucher = {};
                    let userVoucher = {
                        name: this.state.user.name,
                        lastname: this.state.user.lastname,
                        nroDocument: this.state.user.nroDocument
                    };
                    voucher.User = userVoucher;
                    voucher.Caption = '';

                    //add vouchers => bytesMap: "" nroOperation":"20554545","PayType" : "2"
                    let vouchers = [];
                    // Vouchers 
                    let vouchersUpload = this.state.payment.vouchers;
                    
                    if(vouchersUpload.length > 0){
                        idTypeMethod = 2;
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
                        // voucher.Base64Images = vouchers;
                        data.VouchersPay = vouchers;
                        data.amountPay = this.state.payment.mountPaid;
                        data.TypePayment = 2;

                        

                        // TODO remove information
                        data.PaypalDTO = {
                            nroOperation: ""
                        };
                        
                        data.link = "";
                        // TODO not neccesary to save data but it is necesary for services  work
                        data.WalletTransactionDto = {
                            IdUser:  this.state.idSocio,
                            IdPackage: Number(this.state.user.packages[0].id),
                            WalletTransaction:{
                                Amount: 0
                            }
                        };
                    }
                    
                    // Verify payment with wallet
                    if(this.state.amountWallet > 0){
                        let walletItem = {
                            IdUser : this.state.idSocio,
                            IdPayMethod : 17,
                            IdPackage : Number(this.state.user.packages[0].id),
                            WalletTransaction : {
                                Amount : this.state.amountWallet,
                                referencedata: "Pago de registro: " + user.name.toUpperCase() + " " + user.lastname.toUpperCase()
                            }
                        }
               
                        data.WalletTransactionDto = walletItem;

                        // -> wallet and vouchers 
                        // Wallet = 3,  Mixto = 4,
                        if(vouchersUpload.length > 0) {
                            idTypeMethod = 4;
                        } else {
                            idTypeMethod = 3;
                        }
                    }
                } else {
                    // was by paypal
                    // Close modal of paypal modal
                    this.childPaypal.current.handleClosePaypal();
                    idTypeMethod = 1;
                    // Version 2
                    data.PaypalDTO = {
                        nroOperation: this.state.payment.idTransaction
                    };
                    
                    data.amountPay = this.state.payment.mountPaid;
                    console.log(data)
                    data.link = "";
                    data.TypePayment = 1;

                    // TODO not neccesary to save data but it is necesary for services  work
                    data.WalletTransactionDto = {
                        IdUser:  this.state.idSocio,
                        IdPackage: Number(this.state.user.packages[0].id),
                        WalletTransaction:{
                            Amount: 0
                        }
                    };
                    data.VouchersPay =  [];
                   
                }
                data.amountQuotesPayed = this.state.payment.quotesPay// numero de quotes
                data.membDetail = payment;
            } else {
                // The pay was without payment
                //Version 1
                let payment = {};
                payment.scheduleJSON = "";
                payment.idMethodPayment = 1;
                // payment.idTransaction = "-"
                payment.creationDate = new Date();
                payment.modificationDate = new Date();
                payment.idSuscription = suscription.idPackage;
                
                data.amountQuotesPayed = 0;
                data.membDetail = payment;
                data.link = linkMail;

            }


            // Add user affiliate
            let affiliate = {};
            // affiliate.idSponsor = Number(AuthService.getCurrentIdUser());
            affiliate.idSponsor = this.state.idSocio;
            affiliate.idSon = 0;
            data.affiliate = affiliate;

            //console.log("Insert usuario")
            //console.log(data);
            let response = undefined;
            
            console.log(idTypeMethod);
            console.log(this.state);
            if(idTypeMethod === 0){
                // Verify coafiliate
                if(data.CoAffiliate === undefined){
                    data.CoAffiliate = {};
                }
                response = await UserService.registerUser(data);
            } else {
                console.log("wallet, mixto y otros");

                data.TypePayment = idTypeMethod;
                // data.amountQuotesPayed = this.state.payment.quotesPay;
                // data.amountPay = this.state.payment.amountPay;
                // // TODO change properties

                // if(data.vouchers !== undefined){
                //     let arrVouchers = [];
               
                //     for(let i=0; i < data.vouchers.Base64Images.length ; i++){
                        
                //         let temp = {
                //             NroOperacion: data.vouchers.Base64Images[i].nroOperation,
                //             IdPayMethod: Number(data.vouchers.Base64Images[i].PayType),
                //             Content: data.vouchers.Base64Images[i].bytesMap
                //         }
                //         arrVouchers.push(temp);
                //     }
                //     data.VouchersPay = arrVouchers;
                // }
                
               
                response = await UserService.registerUserv2(data);
            }

            if(response !== undefined) {
                if(response.status === 1){
                    // alert('Usuario registrado');
                    this.setState({
                        isComplete: this.state.isComplete = true,
                        loadSenData: this.state.loadSenData = false
                    });

                } else {
                    this.setState({
                        loadSenData: this.state.loadSenData = false
                    });
                    alert("Ocurrió un error al momento de registrarte.");
                }
            } else {
                this.setState({
                    loadSenData: this.state.loadSenData = false
                });
                alert('Tuvimos un problema. Inténtalo más tarde.');
            }

        }
    };
    
  

    render() {
        return(

        // <div className="auth-wrapper">
        <div>
            <Form.Label className="content-title">Registro de Nuevo socio</Form.Label>

            <div className="register-inner" style={{display: this.state.isComplete? 'none':'block'}}>
                {/* <Form.Label className="content-title">Registro de nuevo socio</Form.Label> */}

                <RegisterMain onChange={this.eventhandler}
                    eventFooter={this.eventFooter}
                    eventValidate={this.eventValidate}
                    eventPay={this.eventPayment}
                    eventVoucher={this.eventVoucher}
                    eventWallet={this.eventWallet}
                    packages={this.state.user.packages}
                    kitInit={this.state.user.kitInit}
                    currentTab={this.state.currentTab}
                    ref={this.childPaypal}
                    eventRegister={this.sendData}
                    showWallet={this.state.showWallet}></RegisterMain>
                <hr></hr>
               
                <div className="row justify-content-between" style={{display:this.state.displayFooter}}>
                    <Col ms={4}>
                        <Button variant="danger"
                            >Cancelar</Button>
                    </Col>
                    <Col style={{textAlign: 'right'}}>
                        <Button variant="primary"
                            onClick={this.sendData}>Registrar</Button>
                    </Col>
                </div>

            </div>
            <div style={{display: this.state.isComplete? 'block':'none'}}>
                <RegisterEndView reload={this.state.reload}
                ></RegisterEndView>
            </div>
            <Modal
                show={this.state.loadSenData}
                aria-labelledby="contained-modal-title-vcenter"
                backdrop="static"
                centered>
                <Modal.Body>
                    <div style={{textAlign: 'center'}}>
                        <Spinner size="sm" animation="border" variant="dark">
                        </Spinner>
                        <Form.Label>&nbsp; Registrando usuario...</Form.Label>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
        );
    }
}