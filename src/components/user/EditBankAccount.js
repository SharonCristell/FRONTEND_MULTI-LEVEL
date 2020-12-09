import React, { Component } from 'react';
import { Form, Row, Col, Button, Accordion, Card, Image, Modal, Spinner, Table, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UtilService from '../../services/utils.service';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

export default class EditBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            familyInit: [],

            idBankName: -1,
            nationalities: [],
            banks: [],
            tempDocuments: [],
            isPaid: false,
            showVoucher: false,
            idNationality: -1,
            typeDocuments: [],
            showOthers: 'none',

            account: {
                countryOperation: "",
                nameBank: "",
                idAccountBank: "",
                idTypeAccountBank: "",
                holder: "",
                numberAccount: "",
                numberContribuyente: "",
                razonSocial: "",
                addressFiscal: "",
                status: "",
                cci: "",
                swift: "",
                bank: "",
                bankAddress: "",
                idBank: -1,
                idUser: -1,
                anotherBank: {
                    idDetailAnotherBank: "",
                    nameBank: "",
                    idAccountBank: ""
                },
            },
            bankDetail: {
                idBank: "",
                name: "",
                abbreviation: "",
                idCountry: "",

            },

            accountMod: {

            },


            Accounts: [],
            tempAccounts: [],
            loading: true,
            noData: false,
            message: '',
            showRegister: 'none',

            idAccountBank: -1,
            NameBank: "",
            FlagRegisterAnotherBank: 0,
            bankSelected: [],
            countrySelected: "",
            messageNumberAccount: "",
            messageNumberCci: "",

        }
        this.getIdUser = this.getIdUser.bind(this);
        //this.getCountries = this.getCountries.bind(this);
        this.createItemTypes = this.createItemTypes.bind(this);
        this.getAccountsbyUser = this.getAccountsbyUser.bind(this);
        this.getAccountInfo = this.getAccountInfo.bind(this);


    }


    componentDidMount() {
        this.getIdUser();
        //this.getCountries();
        this.getAccountsbyUser();

    }
    async getCountries() {

        let response = await UtilService.getResidences();

        if (response !== null && response !== undefined) {

            let objs = response.objModel
            let residences = [];
            objs.forEach(elem => {

                if (elem.idCountry == this.state.bankDetail.idCountry) {
                    residences.push(<option key={elem.idCountry} value={elem.idCountry}>{elem.name}</option>);
                }

            });

            this.setState({
                nationalities: this.state.nationalities = residences
            });
        }

    }

    async getIdUser() {

        let id = AuthService.getCurrentIdUser();
        if (id !== undefined) {

            this.setState({
                idUser: this.state.idUser = id,

            });
        }

    }
    async getAccountsbyUser() {

        let idUser = this.state.idUser;

        let response = await UserService.getUserAccounts(idUser);
        if (response !== undefined) {
            if (response.status === 1) {
                this.setState({
                    Accounts: this.state.Accounts = response.objModel
                });
            }
        }
        this.getAccountList();
    }
    async getAccountList() {
        // console.log(this.state.Accounts)

        let response = this.state.Accounts;

        if (response !== null && response !== undefined) {

            let objs = response
            let residences = [];
            objs.forEach(elem => {
                residences.push(<option key={elem.idAccountBank} value={elem.idAccountBank}>{elem.numberAccount}</option>);
            });

            this.setState({ tempAccounts: residences });
            this.forceUpdate();
        }

    }

    async getAccountInfo(idAccountBank) {

        let idSelectedAccount = this.state.idAccountBank;

        let response = await UserService.getInfoAccount(idSelectedAccount);
        if (response !== null && response !== undefined) {
            if (response.status === 1) {

                this.setState({
                    selectedAccount: this.state.selectedAccount = response.objModel,

                });

            }
            else {
                this.setState({
                    selectedAccount: this.state.selectedAccount = [],
                    loading: false,
                    noData: true,
                    message: "No hay información para mostrar.",
                });

            }
        }
        else {
            this.setState({
                selectedAccount: [],
                loading: false,
                noData: true,
                message: "Ocurrió un error al obtener las cuentas bancarias. Vuelva a intentarlo más tarde."
            });
        }

    }
    async getInfoBankbyId() {

        var id = this.state.account.idBank;
        // console.log(this.state.account.idBank)

        if (id > 0) {
            let response = await UserService.getInfoBank(id);
            if (response !== null && response !== undefined) {
                if (response.status === 1) {

                    this.setState({
                        selectedBank: this.state.selectedBank = response.objModel,


                    });

                }
                else {
                    this.setState({
                        selectedBank: this.state.selectedBank = {},

                    });

                }
            }
            else {
                this.setState({
                    selectedBank: {},

                });
            }

        }

    }

    onSelect = async (e) => {

        let id = this.state.idAccountBank;
        let selectedAccount = await UserService.getInfoAccount(id);


        let account = selectedAccount.objModel;

        if (selectedAccount !== undefined) {

            if (account.anotherBank === null) {
                let accountInfo = {

                    //countryOperation: "",
                    //nameBank: account.nameBank,
                    idAccountBank: account.idAccountBank,
                    idTypeAccountBank: String(account.idTypeAccountBank),
                    holder: account.holder,
                    numberAccount: account.numberAccount,
                    numberContribuyente: account.numberContribuyente,
                    razonSocial: account.razonSocial,
                    addressFiscal: account.addressFiscal,
                    status: account.status,
                    cci: account.cci,
                    swift: account.swift,
                    iban: account.iban,
                    bankAddress: account.bankAddress,
                    idBank: account.idBank,
                    idUser: account.idUser,

                    anotherBank: {

                        idDetailAnotherBank: "",
                        nameBank: "",
                        idAccountBank: "",
                    },

                };
                this.setState({
                    account: this.state.account = accountInfo,
                    loading: false,
                    noData: false,

                });

            } else {


                let accountInfo = {

                    idAccountBank: account.idAccountBank,
                    idTypeAccountBank: String(account.idTypeAccountBank),
                    holder: account.holder,
                    numberAccount: account.numberAccount,
                    numberContribuyente: account.numberContribuyente,
                    razonSocial: account.razonSocial,
                    addressFiscal: account.addressFiscal,
                    status: account.status,
                    cci: account.cci,
                    swift: account.swift,
                    iban: account.iban,
                    bankAddress: account.bankAddress,
                    idBank: account.idBank,
                    idUser: account.idUser,

                    anotherBank: {

                        idDetailAnotherBank: account.anotherBank.idDetailAnotherBank,
                        nameBank: account.anotherBank.nameBank,
                        idAccountBank: account.anotherBank.idAccountBank,
                    },

                }
                // console.log(accountInfo)
                this.setState({
                    account: this.state.account = accountInfo,
                    loading: false,
                    noData: false,

                });
            };

        } else {
            this.setState({
                selectedAccount: this.state.selectedAccount = {},
                loaded: false,
                loading: false,
                noData: true,
                message: "No hay información para mostrar.",
            });
        }

        let idBank = this.state.account.idBank;

        let bankSelected = await UserService.getInfoBank(idBank);
        let bankDetail = bankSelected.objModel;

        let bankInfo = {


            idBank: bankDetail.idBank,
            name: bankDetail.name,
            abbreviation: bankDetail.abbreviation,
            idCountry: bankDetail.idCountry,
        };

        this.setState({
            bankDetail: this.state.bankDetail = bankInfo,
            showRegister: this.state.showRegister = 'block'

        });
        this.getCountries();

    }
    handleSelect = (e, field) => {
        // //console.log(e.target.value, field);
        var value = e.target.value;
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
            }
        })

        if (field === "idNationality") {
            this.setState({
                idNationality: this.state.idNationality = value
            });
            this.createItemTypes();
        }
        
        if (field === "IdBank") {

            let text = e.target.options[e.target.selectedIndex].text.toUpperCase();
            if (text.includes("OTRO")) {
                this.setState({
                    showOthers: this.state.showOthers = 'inline',
                    FlagRegisterAnotherBank: this.state.FlagRegisterAnotherBank = 1

                });
            } else {
                this.setState({
                    showOthers: this.state.showOthers = 'none'
                });
                if (this.props.onChange) {
                    this.props.onChange("", "NameBank");
                }
            }

            this.forceUpdate();
        }
    }

    handleSelectBank = (e, field) => {
        var value = e.target.value;
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
            }
        });


        if (field === "idAccountBank") {
            this.setState({
                idAccountBank: this.state.idAccountBank = value
            });
            this.getAccountInfo();
        }
    }

    handleRadio = (e, field) => {
        //console.log(e.target.value);
        // if (this.props.onChange) {
        //     this.props.onChange(e.target.value, field);
        //   }
        var value = e.target.value;
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
            }
        })
        // this.setState({ [field]: e.target.value }, //console.log(e.target.value))
    };
    handleChange = (e, field) => {

        let value = e.target.value;
        let temp = this.state.accountMod;
        temp[field] = value;
        this.setState({
            accountMod: this.state.accountMod = temp,
            messageDoc: ""
        });
    };
    async createItemTypes() {

        var id = this.state.idNationality;
        // console.log(this.state.idNationality)

        if (id > 0) {
            let response = await UtilService.getBankNameByNat(id);
            if (response !== null && response !== undefined) {

                let items = [];
                if (response.status === 1 && response.objModel.length > 0) {
                    response.objModel.forEach(elem => {

                        items.push(<option key={elem.idBank} value={elem.idBank}>{elem.name}</option>);

                    });
                } else {
                    items = this.state.tempDocuments;
                }

                this.setState({ typeDocuments: items });
                this.forceUpdate();
            }

        }

    }
    async verifyNumberUpdateAccount(numberAccount, field, fieldMessage) {
        // console.log(numberAccount, this.state.idAccountBank)

        let data = {};
        data.IdAccountBank = this.state.idAccountBank;
        data.numberAccount = numberAccount;

        let isRegistered = await UserService.isNumberAccountUpdateRegistered(data);
        if (isRegistered) {
            this.setState({
                [field]: this.state[field] = "",
                [fieldMessage]: this.state[fieldMessage] = "Esta cuenta bancaria ya está registrada."
            });
            if (this.props.onChange) {
                this.props.onChange('', 'numberAccount');
            }
        }

    }
    onBlurNumberUpdateAccount = (e, field, fieldMessage) => {
        let value = e.target.value.trim();
        if (value.length > 0) {
            if (new RegExp(/^([0-9]{12,17})|([0-9]{5}-[0-9]{4}-[0-9]{3}-[0-9]{3})$/).test(value)) {
                this.setState({
                    [fieldMessage]: this.state[fieldMessage] = ""
                });

                this.verifyNumberUpdateAccount(value, field, fieldMessage);


            } else {
                this.setState({
                    [field]: this.state[field] = "",
                    [fieldMessage]: this.state[fieldMessage] = "Ingrese un número de cuenta válido."
                });
                if (this.props.onChange) {
                    this.props.onChange('', 'email');
                }
            }
        }
    }
    async verifyCciUpdate(cci, field, fieldMessage) {
        // console.log(cci, this.state.idAccountBank)

        let data = {};
        data.IdAccountBank = this.state.idAccountBank;
        data.Cci = cci;

        let isRegistered = await UserService.isNumberCciUpdateRegistered(data);
        if (isRegistered) {
            this.setState({
                [field]: this.state[field] = "",
                [fieldMessage]: this.state[fieldMessage] = "Este código CCI ya está registrado."
            });
            if (this.props.onChange) {
                this.props.onChange('', 'numberAccount');
            }
        }

    }
    onBlurCciUpdate = (e, field, fieldMessage) => {
        let value = e.target.value.trim();
        if (value.length > 0) {
            if (new RegExp(/^([0-9]{20})|([0-9]{3}-[0-9]{3}-[0-9]{12}-[0-9]{2})$/).test(value)) {
                this.setState({
                    [fieldMessage]: this.state[fieldMessage] = ""
                });

                this.verifyCciUpdate(value, field, fieldMessage);


            } else {
                this.setState({
                    [field]: this.state[field] = "",
                    [fieldMessage]: this.state[fieldMessage] = "Ingrese un código de CCI válido."
                });
                if (this.props.onChange) {
                    this.props.onChange('', 'cci');
                }
            }
        }
    }

    validation = () => {


        if (this.state.account.holder.length <= 0) {
            alert("Ingrese el titular");

            return false;
        }

        if (this.state.account.numberAccount.length <= 0) {
            alert("Ingrese el número de cuenta.");

            return false;
        }
        if (this.state.account.idTypeAccountBank === "0") {
            alert("Seleccione el tipo de cuenta.");

            return false;
        }

        if (this.state.account.cci.length <= 0) {
            alert("Digite el código CCI.");

            return false;
        }

        return true;
    }
    verifyData = () => {
        var data = this.state.accountMod;
        if (!data.hasOwnProperty('addressFiscal')) {
            data.addressFiscal = this.state.account.addressFiscal;
        }
        if (!data.hasOwnProperty('razonSocial')) {
            data.razonSocial = this.state.account.razonSocial;
        }
        if (!data.hasOwnProperty('numberAccount')) {
            data.numberAccount = this.state.account.numberAccount;
        }
        if (!data.hasOwnProperty('holder')) {
            data.holder = this.state.account.holder;
        }

        if (!data.hasOwnProperty('cci')) {
            data.cci = this.state.account.cci;
        }
        if (!data.hasOwnProperty('bankAddress')) {
            data.bankAddress = this.state.account.bankAddress;
        }
        if (!data.hasOwnProperty('swift')) {
            data.swift = this.state.account.swift;
        }

        if (!data.hasOwnProperty('iban')) {
            data.iban = this.state.account.iban;
        }


        data.idAccountBank = this.state.account.idAccountBank;

        data.idTypeAccountBank = Number(this.state.account.idTypeAccountBank);



        return data;
    }

    onUpdate = async (e) => {

        e.preventDefault();

        let flag = false;

        if (this.validation()) {

            let data = this.verifyData();

            let response = await UserService.updateBankAccount(data);
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

            this.props.close();
            window.location.reload();
        }

    };

    render() {
        const { AccountBank, exchange, currentAccounts } = this.state;
        const loading = this.state.loading;
        const noData = this.state.noData;
        const message = this.state.message;
        const packageFamily = this.state.packageFamily;
        const familyInit = this.state.familyInit;
        const { account, bankDetail } = this.state;
        return (
            <div>
                <Form>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Eliga una cuenta bancaria a editar *</Form.Label>

                            </Form.Group>

                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label>Cuentas Bancarias</Form.Label>
                                <Form.Control as="select" defaultValue={'DEFAULT'}
                                    onChange={e => this.handleSelectBank(e, "idAccountBank")}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    {this.state.tempAccounts}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <br></br>
                                <br></br>
                                <Button variant="primary" size="sm" onClick={this.onSelect}>
                                    Buscar Datos de Cuenta
                                        </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                {loading &&
                    <div style={{ textAlign: 'center', paddingTop: 30 }}>
                        <Spinner animation="border" role="status" size="sm" >
                            <span className="sr-only">Loading...</span>
                        </Spinner> <Form.Label>Cargando información de cuenta bancaria...</Form.Label>

                    </div>
                }

                {!loading && !noData &&
                    <div class="form-style" style={{ margin: "0 auto" }}>
                        <Form style={{ display: this.state.showRegister }}>
                            <Row>

                                <Form.Group>
                                    <h5>Cuenta seleccionada</h5>

                                </Form.Group>

                            </Row>
                            <Form.Group >

                                <Form.Text className="text-primary"><h6> DATOS DEL BANCO</h6></Form.Text>
                            </Form.Group>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group>
                                        <Form.Label>País de Operaciones *</Form.Label>
                                        <Form.Control as="select"
                                            onChange={e => this.handleSelect(e, "idNationality")}>
                                            {this.state.nationalities}
                                        </Form.Control>
                                    </Form.Group>

                                </Col>
                                <Col sm={4}>
                                    <Form.Group>
                                        <Form.Label>Nombre del Banco *</Form.Label>
                                        <Form.Control as="select" defaultValue={'DEFAULT'}
                                            onChange={e => this.handleSelect(e, "IdBank")}>
                                            <option value={account.idBank}>{bankDetail.name + ' - ' + account.anotherBank.nameBank}</option>

                                        </Form.Control>
                                       
                                    </Form.Group>
                                </Col>
                                <Col sm={4}>
                                    <Form.Group >
                                        <Form.Label>Dirección del Banco</Form.Label>
                                        <Form.Control required type="text" placeholder="Dirección del Banco"
                                            onChange={e => this.handleChange(e, "bankAddress")}></Form.Control>

                                    </Form.Group>

                                </Col>
                            </Row>
                            <Row>

                                <Col sm={6}>
                                    <Form.Group >
                                        <Form.Label>Código SWIFT </Form.Label>
                                        <Form.Control required type="text" placeholder="Código SWIFT"
                                            defaultValue={account.swift}
                                            onChange={e => this.handleChange(e, "swift")}></Form.Control>

                                    </Form.Group>

                                </Col>
                                <Col sm={6}>
                                    <Form.Group >
                                        <Form.Label>Código IBAN</Form.Label>
                                        <Form.Control required type="text" placeholder="Código IBAN"
                                            defaultValue={account.iban}
                                            onChange={e => this.handleChange(e, "iban")}></Form.Control>

                                    </Form.Group>

                                </Col>
                            </Row>
                            <Form.Group >

                                <Form.Text className="text-primary"><h6> DATOS DE LA CUENTA BANCARIA</h6></Form.Text>
                            </Form.Group>

                            <Row>
                                <Col sm={4}>
                                    <Form.Group >
                                        <Form.Label>Número de cuenta</Form.Label>
                                        <Form.Control required type="text" placeholder="Número de cuenta"
                                            defaultValue={account.numberAccount}
                                            onChange={e => this.handleChange(e, "numberAccount")}
                                            onBlur={e => this.onBlurNumberUpdateAccount(e, "numberAccount", "messageNumberAccount")}></Form.Control>
                                        <Form.Text className="textAlert">{this.state.messageNumberAccount}</Form.Text>

                                    </Form.Group>

                                </Col>
                                <Col sm={4}>
                                    <Form.Group >
                                        <Form.Label>Código de Cuenta Interbancario CCI </Form.Label>
                                        <Form.Control required type="text" placeholder="Código de Cuenta Interbancario CCI"
                                            defaultValue={account.cci}
                                            onChange={e => this.handleChange(e, "cci")}
                                            onBlur={e => this.onBlurNumberCci(e, "cci", "messageNumberCci")}></Form.Control>
                                        <Form.Text className="textAlert">{this.state.messageNumberCci}</Form.Text>

                                    </Form.Group>

                                </Col>
                                <Col sm={4}>
                                    <Form.Group>
                                        <Form.Label>Tipo de cuenta *</Form.Label>
                                        <div className="mb-3">

                                            <Form.Check inline
                                                id={1}
                                                value="1"
                                                label="Cuenta de Ahorros"
                                                type='radio'
                                                onChange={e => this.handleRadio(e, "idTypeAccountBank")}
                                                checked={account.idTypeAccountBank === "1"} />

                                            <Form.Check inline
                                                id={1}
                                                value="2"
                                                label="Cuenta corriente"
                                                type='radio'
                                                onChange={e => this.handleRadio(e, "idTypeAccountBank")}
                                                checked={account.idTypeAccountBank === "2"} />
                                        </div>

                                    </Form.Group>


                                </Col>

                            </Row>
                            <Form.Group >

                                <Form.Text className="text-primary"><h6> DATOS DEL TITULAR</h6></Form.Text>
                            </Form.Group>

                            <Row>

                                <Col sm={6}>
                                    <Form.Group >
                                        <Form.Label>Nombre del titular de la cuenta bancaria</Form.Label>
                                        <Form.Control required type="text" placeholder="Nombre del titular"
                                            defaultValue={account.holder}
                                            onChange={e => this.handleChange(e, "holder")}></Form.Control>

                                    </Form.Group>

                                </Col>


                                <Col sm={6}>
                                    <Form.Group >
                                        <Form.Label>Número de Contribuyente</Form.Label>
                                        <Form.Control required type="text" placeholder="Número de Contribuyente"
                                            defaultValue={account.numberContribuyente}
                                            onChange={e => this.handleChange(e, "numberContribuyente")}></Form.Control>

                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group >
                                        <Form.Label>Razón Social</Form.Label>
                                        <Form.Control required type="text" placeholder="Razón Social"
                                            defaultValue={account.razonSocial}
                                            onChange={e => this.handleChange(e, "razonSocial")}></Form.Control>

                                    </Form.Group>

                                </Col>
                          
                                <Col sm={6}>
                                    <Form.Group >
                                        <Form.Label>Dirección Fiscal</Form.Label>
                                        <Form.Control required type="text" placeholder="Dirección Fiscal"
                                            defaultValue={account.addressFiscal}
                                            onChange={e => this.handleChange(e, "addressFiscal")}></Form.Control>
                                    </Form.Group>
                                </Col>

                            </Row>
                            <Form.Group>
                                <Row>
                                    <Col sm={6} style={{ textAlign: 'left' }}>
                                        <Button variant="secondary" size="sm" onClick={this.props.close}>
                                            Cancelar
                            </Button>

                                    </Col>
                                    <Col sm={6} style={{ textAlign: 'right' }}>
                                        <Button variant="primary" size="sm" onClick={this.onUpdate}>
                                            Actualizar Información
                            </Button>

                                    </Col>
                                </Row>
                            </Form.Group>


                        </Form>
                    </div>
                }
            </div>

        );
    }
}