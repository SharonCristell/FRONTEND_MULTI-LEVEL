import React, { Component } from 'react';
import { Image, Form, Container, Table, Button, Row, InputGroup, Modal, Spinner, Col } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import Validation from '../utils/Validation';
import UtilService from '../../services/utils.service';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

import '../../views/styles/ModalCustom.css';


export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {

            emptyList: false,
            message: "No hay registros para mostrar.",
            loading: false,

            username: "",
            affiliateList: {},
            coaffiliateList: {},
            affiliate:
            {
                id: "",
                idNationality: "",
                country: "",
                name: "",
                lastname: "",
                idResidenceCountry: "",
                gender: "",
                nroTelf: "",
                birthday: "",
                idDocument: "",
                nroDocument: "",
                email: "",
                districtAddress: "",
                address: "",
                otherDocument: "",

            },
            coaffiliate: {

                idcoaf: "",
                namecoaf: "",
                lastnamecoaf: "",
                idDocumentcoaf: "",
                nroDocumentcoaf: "",
                otherDocumentcoaf: "",

            },
            newCoaffiliate: {
                id: null,
                nameco: "",
                lastnameco: "",
                idDocumentco: "",
                birthdateco: "",
                nroDocumentco: "",
                idUser: "",
                otherDocumentco: null,
            },


            affiliateMod: {

            },
            coaffiliateMod: {

            },
            nationalities: [],
            typeDocuments: [],
            tempDocuments: [],
            typeDocumentsCo: [],
            tempDocumentsCo: [],
            typeDocumentsCoAdd: [],
            tempDocumentsCoAdd: [],

            showOthers: 'none',
            showOthersCo: 'none',
            showOthersCoAdd: 'none',
            codephone: "",
            messageEmail: "",
            residenceList: [],
            residenceListCode: [],
            isCoaffiliate: false,
            addCoaffiliateMessage: "¿Deseas agregar a un Co-Afiliado?",
            addCoafiliate: false,
            messageDocCo:"",


        }
        this.getCountries = this.getCountries.bind(this);
        this.getResidences = this.getResidences.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.createItemTypesAdd = this.createItemTypesAdd.bind(this);

    }
    componentDidMount() {
        this.getUserInfo();
        this.createItemTypesAdd();
    }

    async getUserInfo() {
        let response = await UserService.getInfobyUser();

        if (response !== null && response !== undefined) {
            if (response.status === 1) {

                if (response.objModel.user !== null) {

                    this.setState({
                        affiliateList: this.state.affiliateList = response.objModel.user,
                        coaffiliateList: this.state.coaffiliateList = response.objModel.coAffiliate,
                        emptyList: this.state.emptyList = false,
                        loading: this.state.loading = false,
                        message: this.state.mesagge = "",

                    });
                    this.getAffiliateInfo();
                    this.getCountries();
                    this.getResidences();
                    this.createItemTypes();
                    this.createItemTypesCo();
                    this.createItemTypesAdd();


                }
                else {
                    this.setState({
                        affiliateList: this.state.affiliateList = {},
                        coaffiliateList: this.state.coaffiliateList = {},
                        emptyList: this.state.emptyList = true,
                        loading: this.state.loading = false,
                        noData: false,
                        message: "No hay registros para mostrar",
                    });

                }

            }
            else {
                this.setState({
                    affiliateList: this.state.affiliateList = {},
                    coaffiliateList: this.state.coaffiliateList = {},
                    emptyList: this.state.emptyList = true,
                    loading: this.state.loading = false,
                    noData: true,
                    message: "No hay información para mostrar.",
                });

            }
        }
        else {
            this.setState({
                affiliateList: {},
                coaffiliateList: {},
                emptyList: this.state.emptyList = true,
                loading: this.state.loading = false,
                message: this.state.mesagge = "No hay registros para mostrar.",
            });
        }


    }
    async createItemTypesAdd() {
        var id = this.state.affiliate.idNationality;

        if (id > 0) {
            let response = await UtilService.getTypeDocByNat(id);
            if (response !== null && response !== undefined) {

                let items = [];
                if (response.status === 1 && response.objModel.length > 0) {
                    response.objModel.forEach(elem => {

                        items.push(<option key={elem.id} value={elem.id}>{elem.name}</option>);

                    });
                } else {
                    items = this.state.tempDocumentsCoAdd;
                }

                this.setState({ typeDocumentsCoAdd: items });
                this.forceUpdate();
            }

        }

    }



    async createItemTypes() {
        console.log(this.state.affiliate.idNationality)
        var id = this.state.affiliate.idNationality;

        if (id > 0) {
            let response = await UtilService.getTypeDocByNat(id);
            if (response !== null && response !== undefined) {

                let items = [];
                if (response.status === 1 && response.objModel.length > 0) {
                    console.log(response.objModel)
                    response.objModel.forEach(elem => {
                        console.log(this.state.affiliate.idDocument)

                        if (elem.id == this.state.affiliate.idDocument) {

                            items.push(<option key={elem.id} value={elem.id} selected>{elem.name}</option>);

                        }
                        else {

                            items.push(<option key={elem.id} value={elem.id}>{elem.name}</option>);

                        }

                    });
                } else {
                    items = this.state.tempDocuments;
                }

                this.setState({ typeDocuments: items });
                this.forceUpdate();
            }

        }

    }
    async createItemTypesCo() {
        console.log(this.state.affiliate.idNationality)
        var id = this.state.affiliate.idNationality;

        if (id > 0) {
            let response = await UtilService.getTypeDocByNat(id);
            if (response !== null && response !== undefined) {

                let items = [];
                if (response.status === 1 && response.objModel.length > 0) {
                    console.log(response.objModel)
                    response.objModel.forEach(elem => {
                        console.log(this.state.coaffiliate.idDocumentcoaf)

                        if (elem.id == this.state.coaffiliate.idDocumentcoaf) {

                            items.push(<option key={elem.id} value={elem.id} selected>{elem.name}</option>);

                        }
                        else {

                            items.push(<option key={elem.id} value={elem.id}>{elem.name}</option>);

                        }

                    });
                } else {
                    items = this.state.tempDocumentsCo;
                }

                this.setState({ typeDocumentsCo: items });
                this.forceUpdate();
            }

        }

    }
    async getResidences() {

        let response = await UtilService.getResidences();
        if (response !== null && response !== undefined) {

            let objs = response.objModel;
            let residences = [];
            objs.forEach(elem => {

                if (elem.idCountry == this.state.affiliate.idResidenceCountry) {
                    residences.push(<option key={elem.idCountry} value={elem.idCountry} selected>{elem.name}</option>);

                }
                else {
                    residences.push(<option key={elem.idCountry} value={elem.idCountry}>{elem.name}</option>);

                }


            });
            this.setState({
                residenceList: this.state.residenceList = residences,
                residenceListCode: this.residenceListCode = objs
            });
        }

    }

    // Get list of countries
    async getCountries() {

        let response = await UtilService.getResidences();
        if (response !== null && response !== undefined) {

            let objs = response.objModel
            let residences = [];
            objs.forEach(elem => {

                if (elem.idCountry == this.state.affiliate.idNationality) {
                    residences.push(<option key={elem.idCountry} value={elem.idCountry} selected>{elem.name}</option>);

                }
                else {
                    residences.push(<option key={elem.idCountry} value={elem.idCountry}>{elem.name}</option>);

                }


            });
            this.setState({
                nationalities: this.state.nationalities = residences,
                showOthers: this.state.showOthers = 'none',
                otherDocument: this.state.otherDocument = "",
                showOthersCo: this.state.showOthersCo = 'none',
                otherDocumentcoaf: this.state.otherDocumentcoaf = "",

            });
        }

    }



    handleRadio = (e, field) => {
        console.log(e.target.value);
        // if (this.props.onChange) {
        //     this.props.onChange(e.target.value, field);
        //   }
        var value = e.target.value;
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
            }
        })
    }



    async getAffiliateInfo() {

        let affiliate = this.state.affiliateList;
        let coaffiliate = this.state.coaffiliateList;

        if (affiliate !== undefined) {

            if (coaffiliate !== null) {

                let coaffiliateInfo = {
                    idcoaf: coaffiliate.id,
                    namecoaf: coaffiliate.name,
                    lastnamecoaf: coaffiliate.lastname,
                    idDocumentcoaf: coaffiliate.idDocument,
                    nroDocumentcoaf: coaffiliate.nroDocument,
                    otherDocumentcoaf: coaffiliate.otherDocument,

                }
                this.setState({
                    coaffiliate: this.state.coaffiliate = coaffiliateInfo,
                    isCoaffiliate: this.state.isCoaffiliate = true,


                });

            } else {

                let coaffiliateInfo = {

                    idcoaf: -1,
                    namecoaf: "",
                    lastnamecoaf: "",
                    idDocumentcoaf: -1,
                    nroDocumentcoaf: "",
                    otherDocumentcoaf: "",

                }
                this.setState({
                    coaffiliate: this.state.coaffiliate = coaffiliateInfo,
                    isCoaffiliate: this.state.isCoaffiliate = false,
                    //addCoaffiliateMessage: this.addCoaffiliateMessage = "¿Deseas agregar a un Co-Afiliado?",
                    addCoaffiliateMessage: this.addCoaffiliateMessage = "",

                });

            }

            let affiliateInfo = {

                id: affiliate.id,
                name: affiliate.name,
                lastname: affiliate.lastname,
                idNationality: affiliate.idNationality,
                gender: affiliate.gender,
                nroTelf: affiliate.nroTelf,
                birthday: affiliate.birthday,
                idDocument: affiliate.idDocument,
                nroDocument: affiliate.nroDocument,
                email: affiliate.email,
                districtAddress: affiliate.districtAddress,
                idResidenceCountry: affiliate.idResidenceCountry,
                address: affiliate.address,
                otherDocument: affiliate.otherDocument,


            }
            this.setState({
                affiliate: this.state.affiliate = affiliateInfo,
                loading: false,
                noData: false,

            });


        } else {
            this.setState({
                affiliate: this.state.affiliate = {},
                loaded: false,
                loading: false,
                noData: true,
                message: "No hay información para mostrar.",
            });
        }


    }
    handleChange = (e, field) => {

        let value = e.target.value;
        console.log(e.target.value)
        let temp = this.state.affiliateMod;
        temp[field] = value;
        this.setState({
            affiliateMod: this.state.affiliateMod = temp,
            messageDoc: ""
        });
    };
    handleNewChange = (e, field) => {

        let value = e.target.value;
        console.log(value)
        let temp = this.state.newCoaffiliate;
        temp[field] = value;
        if (this.props.onChange) {
            this.props.onChange(value, field);
            this.setState({
                newCoaffiliate: this.state.newCoaffiliate = temp,
                messageDoc: ""
            });
        }
        // })
    };

    validation = () => {
        if (this.state.affiliate.name.length === 0) {
            alert("Ingrese sus nombres.");

            return false;
        }
        if (this.state.affiliate.lastname.length === 0) {
            alert("Ingrese sus apellidos.");

            return false;
        }

        if (this.state.affiliate.gender.length === 0) {
            alert("Seleccione su sexo.");

            return false;
        }
        if (this.state.affiliate.idNationality <= 0) {
            alert("Seleccione su nacionalidad.");

            return false;
        }

        if (this.state.affiliate.iddocumenttype <= 0) {
            alert("Seleccione un tipo de documento.");

            return false;
        }
        if (this.state.affiliate.nroDocument.length === 0) {
            alert("Ingrese su número de documento.");

            return false;
        }

        if (this.state.affiliate.email.length === 0) {
            alert("Ingrese su correo electrónico.");

            return false;
        }
        if (this.state.affiliate.idResidenceCountry <= 0) {
            alert("Seleccione su país de residencia.");

            return false;
        }
        if (this.state.affiliate.districtAddress.length === 0) {
            alert("Ingrese su distrito/estado.");

            return false;
        }
        if (this.state.affiliate.address.length === 0) {
            alert("Ingrese su dirección.");

            return false;
        }
        if (this.state.affiliate.nroTelf.length === 0) {
            alert("Ingrese su número de celular.");

            return false;
        }


        return true;
    }
    verifyData = () => {
        var data = this.state.affiliateMod;
        if (!data.hasOwnProperty('idNationality')) {
            data.idNationality = Number(this.state.affiliate.idNationality);
        }
        if (!data.hasOwnProperty('idResidenceCountry')) {
            data.idResidenceCountry = Number(this.state.affiliate.idResidenceCountry);
        }
        if (!data.hasOwnProperty('idDocument')) {
            data.idDocument = this.state.affiliate.idDocument;
        }
        if (!data.hasOwnProperty('name')) {
            data.name = this.state.affiliate.name;
        }
        if (!data.hasOwnProperty('lastname')) {
            data.lastname = this.state.affiliate.lastname
        }

        if (!data.hasOwnProperty('gender')) {
            data.gender = this.state.affiliate.gender
        }
        if (!data.hasOwnProperty('nroDocument')) {
            data.nroDocument = this.state.affiliate.nroDocument
        }
        if (!data.hasOwnProperty('districtAddress')) {
            data.districtAddress = this.state.affiliate.districtAddress
        }
        if (!data.hasOwnProperty('address')) {
            data.address = this.state.affiliate.address
        }
        if (!data.hasOwnProperty('nroTelf')) {
            data.nroTelf = this.state.affiliate.nroTelf
        }
        if (!data.hasOwnProperty('email')) {
            data.email = this.state.affiliate.email
        }
        if (!data.hasOwnProperty('otherDocument')) {
            data.otherDocument = this.state.affiliate.otherDocument
        }

        if (!data.hasOwnProperty('namecoaf')) {
            data.namecoaf = this.state.coaffiliate.namecoaf
        }
        if (!data.hasOwnProperty('lastnamecoaf')) {
            data.lastnamecoaf = this.state.coaffiliate.lastnamecoaf
        }
        if (!data.hasOwnProperty('nroDocumentcoaf')) {
            data.nroDocumentcoaf = this.state.coaffiliate.nroDocumentcoaf
        }
        if (!data.hasOwnProperty('otherDocumentcoaf')) {
            data.otherDocumentcoaf = this.state.coaffiliate.otherDocumentcoaf
        }
        if (!data.hasOwnProperty('idDocumentcoaf')) {
            data.idDocumentcoaf = this.state.coaffiliate.idDocumentcoaf
        }
        data.id = this.state.affiliate.id;


        data.idcoaf = this.state.coaffiliate.idcoaf;

        return data;
    }


    // Verify nro Document
    onBlurDocument = (e, field, fieldMessage) => {
        console.log(e);
        this.verifyDocument(field, fieldMessage);

    }

    async verifyDocument(field, fieldMessage) {
        // verify is the same value
        if (this.state.affiliateMod.nroDocument.lenght > 0 &&
            this.state.affiliateMod.nroDocument !== this.state.affiliate.nroDocument) {
            let data = {};
            data.nroDocument = this.state[field];
            let isRegister = await UserService.isDocumentRegistered(data);

            if (!isRegister) {
                this.setState({ [fieldMessage]: "" });
                this.forceUpdate();
            } else {
                this.setState({ [fieldMessage]: "Este documento ya ha sido registrado." });
                this.props.onChange('', field);
                this.forceUpdate();
            }
        }

    }

    onBlurDocumentCo = (e, field, fieldMessage) => {
        console.log(e);
        this.verifyDocumentCo(field, fieldMessage);

    }

    async verifyDocumentCo(field, fieldMessage) {
        // verify is the same value
        if (this.state.affiliateMod.nroDocumentcoaf !== null) {
            if (this.state.affiliateMod.nroDocumentcoaf.lenght > 0 &&
                this.state.affiliateMod.nroDocumentcoaf !== this.state.affiliate.nroDocumentcoaf) {
                let data = {};
                data.nroDocumentcoaf = this.state[field];
                let isRegister = await UserService.isDocumentRegistered(data);

                if (!isRegister) {
                    this.setState({ [fieldMessage]: "" });
                    this.forceUpdate();
                } else {
                    this.setState({ [fieldMessage]: "Este documento ya ha sido registrado." });
                    this.props.onChange('', field);
                    this.forceUpdate();
                }
            }
        }

    }
    onBlurDocumentCoAdd = (e, field, fieldMessage) => {
        console.log(e);
        this.verifyDocumentCoAdd(field, fieldMessage);

    }

    async verifyDocumentCoAdd(field, fieldMessage) {
        // verify is the same value
        if (this.state.newCoaffiliate.nroDocumentco !== null) {
            if (this.state.newCoaffiliate.nroDocumentco.lenght > 0 &&
                this.state.newCoaffiliate.nroDocumentco !== this.state.newCoaffiliate.nroDocumentco) {
                let data = {};
                data.nroDocumentco = this.state[field];
                let isRegister = await UserService.isDocumentRegistered(data);

                if (!isRegister) {
                    this.setState({ [fieldMessage]: "" });
                    this.forceUpdate();
                } else {
                    this.setState({ [fieldMessage]: "Este documento ya ha sido registrado." });
                    this.props.onChange('', field);
                    this.forceUpdate();
                }
            }
        }

    }
    onUpdate = async (e) => {

        e.preventDefault();

        let flag = false;

        if (this.validation()) {

            let data = this.verifyData();
            console.log(data)

            let response = await UserService.updateAffiliateInfo(data);
            if (response === undefined) {
                alert('Ocurrió un problema. Inténtelo más tarde.');
            } else {
                if (response.status === 0) {
                    alert(response.description);
                } else {
                    flag = true;
                    alert("Tus datos han sido actualizados.");
                }

            };
        };

        if (flag) {

            window.location.reload();
        }

    };

    handleSelect = (e, field) => {
        
        let value = e.target.value;
        let temp = this.state.affiliateMod;
        temp[field] = Number(value);
        this.setState({
            affiliateMod: this.state.affiliateMod = temp,
            messageDoc: ""
        });

        if (field === "idDocumentcoaf") {

            let text = e.target.options[e.target.selectedIndex].text.toUpperCase();
            if (text.includes("OTRO")) {
                this.setState({
                    showOthersCo: this.state.showOthersCo = 'inline'
                });
            } else {
                this.setState({
                    showOthersCo: this.state.showOthersCo = 'none',
                    otherDocumentcoaf: this.state.otherDocumentcoaf = ""
                });

            }

            this.forceUpdate();
        }

              

    };
    handleSelectAdd = (e, field) => {

        
        let value = e.target.value;
        console.log(value)
        let temp = this.state.newCoaffiliate;
        temp[field] = Number(value);
        this.setState({
            newCoaffiliate: this.state.newCoaffiliate= temp,
            messageDoc: ""
        });

     

        if (field === "idDocumentco") {

            let text = e.target.options[e.target.selectedIndex].text.toUpperCase();
            if (text.includes("OTRO")) {
                this.setState({
                    showOthersCoAdd: this.state.showOthersCoAdd = 'inline'
                });
            } else {
                this.setState({
                    showOthersCoAdd: this.state.showOthersCoAdd = 'none',
                    otherDocumentco: this.state.otherDocumentco = ""
                });

            }

            this.forceUpdate();
        }


        

    };

    handleSelectList = (e, field) => {


        let value = e.target.value;
        let temp = this.state.affiliateMod;
        temp[field] = Number(value);
        this.setState({
            affiliateMod: this.state.affiliateMod = temp,
            messageDoc: ""
        });
        if (field === "idNationality") {
            this.setState({
                idNationality: this.state.affiliate.idNationality = Number(value)

            });
            console.log()
            this.createItemTypes(this.state.idNationality);
        }
        if (field === "idDocument") {

            let text = e.target.options[e.target.selectedIndex].text.toUpperCase();
            if (text.includes("OTRO")) {
                this.setState({
                    showOthers: this.state.showOthers = 'inline'
                });
            } else {
                this.setState({
                    showOthers: this.state.showOthers = 'none',
                    otherDocument: this.state.otherDocument = ""
                });

            }

            this.forceUpdate();
        }
        if (field === "idDocumentcoaf") {

            let text = e.target.options[e.target.selectedIndex].text.toUpperCase();
            if (text.includes("OTRO")) {
                this.setState({
                    showOthersCo: this.state.showOthersCo = 'inline'
                });
            } else {
                this.setState({
                    showOthersCo: this.state.showOthersCo = 'none',
                    otherDocumentcoaf: this.state.otherDocumentcoaf = ""
                });

            }

            this.forceUpdate();
        }





    };



    async verifyEmail(email, field, fieldMessage) {

        let data = {};
        data.email = email;

        let isRegistered = await UtilService.isEmailRegistered(data);
        if (isRegistered) {
            this.setState({
                [field]: this.state[field] = "",
                [fieldMessage]: this.state[fieldMessage] = "Este correo ya está registrado."
            });
            if (this.props.onChange) {
                this.props.onChange('', 'email');
            }
        }

    }
    onBlurEmail = (e, field, fieldMessage) => {
        let value = e.target.value.trim();
        if (value.length > 0) {
            if (new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(value)) {
                this.setState({
                    [fieldMessage]: this.state[fieldMessage] = ""
                });

                this.verifyEmail(value, field, fieldMessage);


            } else {
                this.setState({
                    [field]: this.state[field] = "",
                    [fieldMessage]: this.state[fieldMessage] = "Ingrese un correo válido."
                });
                if (this.props.onChange) {
                    this.props.onChange('', 'email');
                }
            }
        }
    }
 
    handleCloseInsert = () => {
        this.setState({
            addCoafiliate: false
        });
    }
    handleAddAfiliate = (e) => {
        this.setState({
            addCoafiliate: true
        });

    }
    validationCoAfiliate = () => {
        if (this.state.newCoaffiliate.nameco.length === 0) {
            alert("Ingrese los nombres de su coafiliado.");

            return false;
        }
        if (this.state.newCoaffiliate.lastnameco.length === 0) {
            alert("Ingrese sus apellidos.");

            return false;
        }


        if (this.state.newCoaffiliate.idDocumentco <= 0) {
            alert("Seleccione un tipo de documento.");

            return false;
        }
        if (this.state.newCoaffiliate.nroDocumentco.length === 0) {
            alert("Ingrese su número de documento.");

            return false;
        }

        return true;
    }
    onInsert = async (e) => {

        e.preventDefault();

        let flag = false;

        if (this.validationCoAfiliate()) {


            let data = {};
            data.id = 0;
            data.name = this.state.newCoaffiliate.nameco;
            data.lastname = this.state.newCoaffiliate.lastnameco;
            data.idDocument = this.state.newCoaffiliate.idDocumentco;
            data.birthdate = "1971-02-21";
            data.nroDocument = this.state.newCoaffiliate.nroDocumentco;
            data.idUser = Number(AuthService.getCurrentIdUser());
            data.otherDocument = this.state.newCoaffiliate.otherDocumentco;



            console.log(data)

            let response = await UserService.registerCoafiliate(data);
            console.log(response)
            if (response !== undefined) {
                if (response.status === 1) {
                    this.setState({
                        isComplete: this.state.isComplete = true,

                    });
                    console.log(response.status)
                    flag = true;

                } else {
                    this.setState({
                        loadSenData: this.state.loadSenData = false
                    });
                    alert("Ocurrió un error al ingresar los datos del Co Afiliado.");
                    
                }
            } else {
                this.setState({
                    loadSenData: this.state.loadSenData = false
                });
                alert('Tuvimos un problema. Inténtalo más tarde.');
            }

        }
        if (flag) {

            window.location.reload();
        }
    };

    render() {
        const { affiliateDetail, coAffiliateDetail, pendingList, message2, loadModal, email } = this.state;
        const loading = this.state.loading;
        const noData = this.state.noData;
        const message = this.state.message;

        const addCoaffiliateMessage = this.state.addCoaffiliateMessage;
        const { affiliate, loaded, codephone, residenceList, coaffiliate } = this.state;
        const { otherDocumentco, codesDocument} = this.state;

        const { suscription, loadSuscription } = this.state;
        return (
            <div className="panel-form">

                <Form>

                    <Row>
                        <Col sm={12}>

                            {this.state.loading &&
                                <div>
                                    <Spinner animation="border" variant="dark">
                                    </Spinner>
                                    <p><Form.Label>Cargando información de usuarios.</Form.Label></p>
                                </div>
                            }
                            {this.state.emptyList && !this.state.loading &&
                                <Form.Label>{this.state.message}</Form.Label>
                            }
                            {!this.state.emptyList &&
                                <div>
                                    <Form.Group>
                                        <h4>Titular</h4>
                                    </Form.Group>
                                    <Row>
                                        <Col sm={4}>

                                            <Form.Group>
                                                <Form.Label>Nacionalidad</Form.Label>
                                                <Form.Control as="select"
                                                    onChange={e => this.handleSelectList(e, "idNationality")}>

                                                    {this.state.nationalities}
                                                </Form.Control>

                                            </Form.Group>


                                        </Col>

                                        <Col sm={4}>
                                            <Form.Group>
                                                <Form.Label>Nombres *</Form.Label>
                                                <Form.Control required type="text" placeholder="Nombres"
                                                    defaultValue={affiliate.name}
                                                    onChange={e => this.handleChange(e, "name")} />
                                            </Form.Group>
                                        </Col>

                                        <Col sm={4}>
                                            <Form.Group>
                                                <Form.Label>Apellidos *</Form.Label>
                                                <Form.Control required type="text" placeholder="Apellidos"
                                                    defaultValue={affiliate.lastname}
                                                    onChange={e => this.handleChange(e, "lastname")} />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col sm={4}>

                                            <Form.Group>
                                                <Form.Label>Sexo *</Form.Label>
                                                <div key={'inline-radio'} className="mb-3">
                                                    <Form.Check inline label="Masculino" type='radio' id={`inline-radio`} value="M"
                                                        onChange={e => this.handleRadio(e, "gender")}
                                                        checked={affiliate.gender === "M"} />
                                                    <Form.Check inline label="Femenino" type='radio' id={`inline-radio2`} value="F"
                                                        onChange={e => this.handleRadio(e, "gender")}
                                                        checked={affiliate.gender === "F"} />
                                                </div>
                                            </Form.Group>


                                        </Col>

                                        <Col sm={4}>

                                            <Form.Group>
                                                <Form.Label>País de residencia</Form.Label>
                                                <Form.Control as="select"
                                                    onChange={e => this.handleSelectList(e, "idResidenceCountry")}>
                                                    {this.state.residenceList}
                                                </Form.Control>

                                            </Form.Group>

                                        </Col>
                                        <Col sm={4}>
                                            <Form.Group>
                                                <Form.Label>Nro. Celular *</Form.Label>
                                                <Form.Control required type="text" placeholder="Nro. celular"
                                                    defaultValue={affiliate.nroTelf}
                                                    onChange={e => this.handleChange(e, "nroTelf")}></Form.Control>
                                                <Form.Control.Feedback type="invalid">Ingrese un número de celular válido.</Form.Control.Feedback>
                                            </Form.Group>

                                        </Col>



                                    </Row>

                                    <Row>

                                        <Col sm={5}>

                                            <Form.Group>
                                                <Form.Label>Tipo de documento *</Form.Label>
                                                <Form.Control as="select"
                                                    onChange={e => this.handleSelectList(e, "idDocument")}>

                                                    {this.state.typeDocuments}
                                                </Form.Control>


                                                <br></br>
                                                <Form.Control style={{ display: this.state.showOthers, paddingTop: 6 }} type="text"
                                                    placeholder="Ingrese tipo de documento"
                                                    value={affiliate.otherDocument}
                                                    onChange={e => this.handleChange(e, "otherDocument")}></Form.Control>
                                            </Form.Group>


                                        </Col>
                                        <Col sm={5}>
                                            <Form.Group>
                                                <Form.Label>Nro. de documento *</Form.Label>
                                                <Form.Control required type="text" placeholder="Nro. documento"
                                                    defaultValue={affiliate.nroDocument}
                                                    onChange={e => this.handleChange(e, "nroDocument")}
                                                    onBlur={e => this.onBlurDocument(e, "nroDocument", "messageDoc")}></Form.Control>
                                                <Form.Text className="textAlert">{this.state.messageDoc}</Form.Text>
                                            </Form.Group>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col sm={4}>
                                            <Form.Group>
                                                <Form.Label>Distrito / Estado *</Form.Label>
                                                <Form.Control required type="text" placeholder="Distrito"
                                                    defaultValue={affiliate.districtAddress}
                                                    onChange={e => this.handleChange(e, "districtAddress")}></Form.Control>
                                                <Form.Control.Feedback type="invalid">Ingrese su distrito.</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col sm={4}>
                                            <Form.Group>
                                                <Form.Label>Dirección</Form.Label>
                                                <Form.Control required type="text" placeholder="Dirección"
                                                    defaultValue={affiliate.address}
                                                    onChange={e => this.handleChange(e, "address")}></Form.Control>
                                                <Form.Control.Feedback type="invalid">Ingrese su dirección.</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={4}>
                                            <Form.Group>
                                                <Form.Label>Correo eléctronico</Form.Label>
                                                <Form.Control required type="mail" placeholder="Correo eléctronico"
                                                    defaultValue={affiliate.email}
                                                    onChange={e => this.handleChange(e, "email")}
                                                    onBlur={e => this.onBlurEmail(e, "email", "messageEmail")}></Form.Control>
                                                <Form.Text className="textAlert">{this.state.messageEmail}</Form.Text>
                                            </Form.Group>
                                        </Col>


                                    </Row>

                                    {this.state.isCoaffiliate &&

                                        <div>
                                            <Form.Group>
                                                <h4>Co-Titular</h4>
                                            </Form.Group>
                                            <Row>

                                                <Col sm={6}>
                                                    <Form.Group>
                                                        <Form.Label>Nombres *</Form.Label>
                                                        <Form.Control required type="text" placeholder="Nombres"
                                                            defaultValue={coaffiliate.namecoaf}
                                                            onChange={e => this.handleChange(e, "namecoaf")} />
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={6}>
                                                    <Form.Group>
                                                        <Form.Label>Apellidos *</Form.Label>
                                                        <Form.Control required type="text" placeholder="Apellidos"
                                                            defaultValue={coaffiliate.lastnamecoaf}
                                                            onChange={e => this.handleChange(e, "lastnamecoaf")} />
                                                    </Form.Group>
                                                </Col>


                                            </Row>

                                            <Row>

                                                <Col sm={6}>

                                                    <Form.Group>
                                                        <Form.Label>Tipo de documento *</Form.Label>
                                                        
                                                        <Form.Control as="select" defaultValue={'DEFAULT'}
                                                            onChange={e => this.handleSelectAdd(e, "idDocumentco")}>
                                                            <option value="DEFAULT" disabled>Seleccione una opción</option>
                                                            {this.state.typeDocumentsCoAdd}
                                                        </Form.Control>
                                                        <br></br>
                                                    </Form.Group>


                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group>
                                                        <Form.Label>Nro. de documento *</Form.Label>
                                                        <Form.Control required type="text" placeholder="Nro. documento"
                                                            defaultValue={coaffiliate.nroDocumentcoaf}
                                                            onChange={e => this.handleChange(e, "nroDocumentcoaf")}
                                                            onBlur={e => this.onBlurDocumentCo(e, "nroDocumentcoaf", "messageDoc")}></Form.Control>
                                                        <Form.Text className="textAlert">{this.state.messageDoc}</Form.Text>
                                                    </Form.Group>
                                                </Col>



                                            </Row>
                                        </div>
                                    }
                                    <Form.Group>
                                        <Row>

                                            <Col sm={12} style={{ textAlign: 'center' }}>
                                                <Form.Group>
                                                    <Button size="sm" onClick={this.onUpdate}>Guardar Cambios </Button>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <br></br>
                                        <Row>
                                            <Col sm={8}>

                                                {!this.state.isCoaffiliate &&

                                                    <Form.Group>
                                                        <Form.Label><h6>{"¿No tienes un Co Afiliado? Agrégalo ahora mismo aquí"}</h6></Form.Label>

                                                    </Form.Group>
                                                }
                                            </Col>

                                            <Col sm={4}>

                                                {!this.state.isCoaffiliate &&

                                                    <Form.Group>
                                                        <Button variant="danger" size="sm" onClick={this.handleAddAfiliate}>Agregar CoAfiliado </Button>
                                                    </Form.Group>
                                                }
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                    <Modal show={this.state.addCoafiliate}
                                        onHide={this.handleCloseInsert} style={{ fontSize: 10 }}
                                        size="lg"
                                        backdrop="static">
                                        <Modal.Header closeButton>
                                            <Modal.Title>Nuevo CoAfiliado</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>

                                                <Form.Group>
                                                    <Form.Group>
                                                        <h4>Co-Afiliado</h4>
                                                    </Form.Group>
                                                    <Row>

                                                        <Col sm={6}>
                                                            <Form.Group>
                                                                <Form.Label>Nombres *</Form.Label>
                                                                <Form.Control required type="text" placeholder="Nombres"
                                                                    onChange={e => this.handleNewChange(e, "nameco")} />
                                                            </Form.Group>
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Form.Group>
                                                                <Form.Label>Apellidos *</Form.Label>
                                                                <Form.Control required type="text" placeholder="Apellidos"

                                                                    onChange={e => this.handleNewChange(e, "lastnameco")} />
                                                            </Form.Group>
                                                        </Col>


                                                    </Row>

                                                    <Row>

                                                        <Col sm={6}>

                                                            <Form.Group>
                                                                <Form.Label>Tipo de documento *</Form.Label>
                                                                   <Form.Control as="select" defaultValue={'DEFAULT'}
                                                                    onChange={e => this.handleSelectAdd(e, "idDocumentco")}>
                                                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                                                    {this.state.typeDocumentsCoAdd}
                                                                </Form.Control>



                                                                <br></br>
                                                                <Form.Control style={{ display: this.state.showOthersCoAdd, paddingTop: 6 }} type="text"
                                                                    placeholder="Ingrese tipo de documento"
                                                                    value={otherDocumentco}
                                                                    onChange={e => this.handleNewChange(e, "otherDocumentco")}></Form.Control>
                                                            </Form.Group>


                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group>
                                                                <Form.Label>Nro. de documento *</Form.Label>
                                                                <Form.Control required type="text" placeholder="Nro. documento"

                                                                    onChange={e => this.handleNewChange(e, "nroDocumentco")}
                                                                    onBlur={e => this.onBlurDocumentCoAdd(e, "nroDocumentco", "messageDoc")}></Form.Control>
                                                                <Form.Text className="textAlert">{this.state.messageDocCo}</Form.Text>
                                                            </Form.Group>
                                                        </Col>



                                                    </Row>

                                                </Form.Group>
                                                <Form.Group>
                                                    <Row>
                                                        <Col sm={6} style={{ textAlign: 'left' }}>
                                                            <Button variant="secondary" size="sm" onClick={this.handleCloseInsert}>
                                                                Cancelar
                            </Button>

                                                        </Col>
                                                        <Col sm={6} style={{ textAlign: 'right' }}>
                                                            <Button variant="primary" size="sm" onClick={this.onInsert}>
                                                                Guardar
                            </Button>

                                                        </Col>
                                                    </Row>
                                                </Form.Group>

                                            </Form>



                                        </Modal.Body>
                                    </Modal>
                                </div>
                            }
                        </Col>

                    </Row>

                </Form >

            </div>
        );
    }

}