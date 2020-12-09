import React, { Component } from 'react';
import { Form, Row, Col, Button, Accordion, Card, Image, Modal, Spinner, Table, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UtilService from '../../services/utils.service';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

export default class AddBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typePay: 0,

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

            FlagRegisterAnotherBank: 0,
            holder: "",
            NumberAccount: "",
            NumberContribuyente: "",
            RazonSocial: "",
            AddressFiscal: "",
            Status: 1,
            Cci: "",
            BankAddress: "",
            Swift: "",
            Iban: "",
            IdBank: -1,
            IdUser: -1,
            NameBank: "",
            isComplete: false,
            IdTypeAccountBank: "0",
            idDocumentTypeCountry: "",

            messageNumberAccount: "",
            messageNumberCci: "",


        }
        this.getCountries = this.getCountries.bind(this);
        this.createItemTypes = this.createItemTypes.bind(this);
    }

    componentDidMount() {
        this.getInformationAccount();
        this.getCountries();
        //this.createItemTypes();

    }
    async getCountries() {

        let response = await UtilService.getResidences();

        if (response !== null && response !== undefined) {

            let objs = response.objModel
            let residences = [];
            objs.forEach(elem => {
                residences.push(<option key={elem.idCountry} value={elem.idCountry}>{elem.name}</option>);
            });

            this.setState({
                nationalities: this.state.nationalities = residences
            });
        }

    }

    async getDefaultDocument() {
        let response = await UtilService.getTypeDocDefault();
        if (response !== null && response !== undefined) {
            if (response.status === 1) {
                let data = response.objModel;
                let items = [];
                data.forEach(elem => {
                    items.push(<option key={elem.id} value={elem.id}>{elem.name}</option>);

                });

                this.setState({
                    tempDocuments: this.state.tempDocuments = items
                });

            }
        }
    }



    async getInformationAccount() {
        let account = await UserService.getInformationAccount();
        if (account != null) {
            this.setState({ account: account });
        }
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
        // console.log(value)

        this.setState({
            [field]: this.state[field] = value,
            messageDoc: ""
        });

    };
    async createItemTypes() {

        var id = this.state.idNationality;
       
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

    validation = () => {

        if (this.state.idNationality <= 0) {
            alert("Seleccione su país de operaciones.");

            return false;
        }
        if (this.state.IdBank <= 0) {
            alert("Seleccione el nombre de su banco.");

            return false;
        }

        if (this.state.holder.length <= 0) {
            alert("Ingrese el titular");

            return false;
        }

        if (this.state.NumberAccount.length <= 0) {
            alert("Ingrese el número de cuenta.");

            return false;
        }

        if (this.state.Cci.length <= 0) {
            alert("Digite el código CCI.");

            return false;
        }
        if (this.state.IdTypeAccountBank === "0") {
            alert("Seleccione el tipo de cuenta.");

            return false;
        }

        return true;
    }
    async verifyNumberAccount(numberAccount, field, fieldMessage) {
        // console.log(numberAccount)

        let data = {};
        data.numberAccount = numberAccount;

        let isRegistered = await UserService.isNumberAccountRegistered(data);
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

    onBlurNumberAccount = (e, field, fieldMessage) => {
        let value = e.target.value.trim();
        if (value.length > 0) {
            if (new RegExp(/^([0-9]{12,17})|([0-9]{5}-[0-9]{4}-[0-9]{3}-[0-9]{3})$/).test(value)) {
                this.setState({
                    [fieldMessage]: this.state[fieldMessage] = ""
                });

                this.verifyNumberAccount(value, field, fieldMessage);


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

    async verifyNumberCci(Cci, field, fieldMessage) {
        // console.log(Cci)

        let data = {};
        data.Cci = Cci;

        let isRegistered = await UserService.isNumberCciRegistered(data);
        if (isRegistered) {
            this.setState({
                [field]: this.state[field] = "",
                [fieldMessage]: this.state[fieldMessage] = "El código de CCI ya está registrado."
            });
            if (this.props.onChange) {
                this.props.onChange('', 'Cci');
            }
        }

    }

    onBlurNumberCci = (e, field, fieldMessage) => {
        let value = e.target.value.trim();
        if (value.length > 0) {
            if (new RegExp(/^([0-9]{20})|([0-9]{3}-[0-9]{3}-[0-9]{12}-[0-9]{2})$/).test(value)) {
                this.setState({
                    [fieldMessage]: this.state[fieldMessage] = ""
                });

                this.verifyNumberCci(value, field, fieldMessage);


            } else {
                this.setState({
                    [field]: this.state[field] = "",
                    [fieldMessage]: this.state[fieldMessage] = "Ingrese un código de CCI válido."
                });
                if (this.props.onChange) {
                    this.props.onChange('', 'Cci');
                }
            }
        }
    }

    onSave = async (e) => {

        e.preventDefault();

        let flag = false;

        if (this.validation()) {

            let data = {};
            let AccountBank = {};
            let AnotherBank = {};
            let FlagRegisterAnotherBank = "";

            AccountBank.IdTypeAccountBank = Number(this.state.IdTypeAccountBank);
            AccountBank.Holder = this.state.holder;
            AccountBank.NumberAccount = this.state.NumberAccount;
            AccountBank.NumberContribuyente = this.state.NumberContribuyente;
            AccountBank.RazonSocial = this.state.RazonSocial;
            AccountBank.AddressFiscal = this.state.AddressFiscal;
            AccountBank.Cci = this.state.Cci;
            AccountBank.BankAddress = this.state.BankAddress;
            AccountBank.Swift = this.state.Swift;
            AccountBank.Iban = this.state.Iban;
            AccountBank.Status = this.state.Status;
            AccountBank.IdBank = Number(this.state.IdBank);
            AccountBank.IdUser = Number(AuthService.getCurrentIdUser());

            FlagRegisterAnotherBank = this.state.FlagRegisterAnotherBank;
            AnotherBank.NameBank = this.state.NameBank;

            data.FlagRegisterAnotherBank = FlagRegisterAnotherBank;
            if (this.state.FlagRegisterAnotherBank === 1) {
                data.AnotherBank = AnotherBank;
            }
            data.AccountBank = AccountBank;


            let response = await UserService.registerBankAccount(data);

            if (response !== undefined) {
                if (response.status === 1) {
                    this.setState({
                        isComplete: this.state.isComplete = true,

                    });
                    flag = true;

                } else {
                    this.setState({
                        loadSenData: this.state.loadSenData = false
                    });
                    alert("Ocurrió un error al momento de añadir la cuenta bancaria.");
                }
            } else {
                this.setState({
                    loadSenData: this.state.loadSenData = false
                });
                alert('Tuvimos un problema. Inténtalo más tarde.');
            }

        }
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
        return (
            <div>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group >
                                <Form.Label>El pago de comisiones será transferido en Soles para el caso de Perú. Para otros páises será transferido en dólares USD. Es requerido que el número de
                                cuenta suministrado por usted sea una cuenta en función a la moneda a recibir.
                                </Form.Label>
                                <Form.Text className="textAlert"><h6>Verifique bien los datos, después no será POSIBLE editar el país de operaciones, el nombre del banco y el tipo de cuenta.</h6></Form.Text>
                            </Form.Group>

                        </Col>
                    </Row>
                    <Form.Group >

                        <Form.Text className="text-primary"><h6> DATOS DEL BANCO</h6></Form.Text>
                    </Form.Group>

                    <Row>
                        <Col sm={4}>

                            <Form.Group>
                                <Form.Label>País de Operaciones *</Form.Label>
                                <Form.Control as="select" defaultValue={'DEFAULT'}
                                    onChange={e => this.handleSelect(e, "idNationality")}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    {this.state.nationalities}
                                </Form.Control>
                            </Form.Group>

                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label>Nombre del Banco *</Form.Label>
                                <Form.Control as="select" defaultValue={'DEFAULT'}
                                    onChange={e => this.handleSelect(e, "IdBank")}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    {this.state.typeDocuments}
                                </Form.Control>
                                <br></br>
                                <Form.Control style={{ display: this.state.showOthers, paddingTop: 6 }} type="text" placeholder="Ingrese nombre de banco"
                                    onChange={e => this.handleChange(e, "NameBank")}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group >
                                <Form.Label>Dirección del Banco</Form.Label>
                                <Form.Control required type="text" placeholder="Dirección del Banco"
                                    onChange={e => this.handleChange(e, "BankAddress")}></Form.Control>

                            </Form.Group>

                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <Form.Group >
                                <Form.Label>Código SWIFT</Form.Label>
                                <Form.Control required type="text" placeholder="Código SWIFT"
                                    onChange={e => this.handleChange(e, "Swift")}></Form.Control>

                            </Form.Group>

                        </Col>
                        <Col sm={6}>
                            <Form.Group >
                                <Form.Label>Código IBAN</Form.Label>
                                <Form.Control required type="text" placeholder="Código IBAN"
                                    onChange={e => this.handleChange(e, "Iban")}></Form.Control>
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
                                    onChange={e => this.handleChange(e, "NumberAccount")}
                                    onBlur={e => this.onBlurNumberAccount(e, "NumberAccount", "messageNumberAccount")}></Form.Control>
                                <Form.Text className="textAlert">{this.state.messageNumberAccount}</Form.Text>
                            </Form.Group>

                        </Col>
                        <Col sm={4}>
                            <Form.Group >
                                <Form.Label>Código de Cuenta Interbancario CCI</Form.Label>
                                <Form.Control required type="text" placeholder="Código de Cuenta Interbancario CCI"
                                    onChange={e => this.handleChange(e, "Cci")}
                                    onBlur={e => this.onBlurNumberCci(e, "Cci", "messageNumberCci")}></Form.Control>
                                <Form.Text className="textAlert">{this.state.messageNumberCci}</Form.Text>

                            </Form.Group>

                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                            <Form.Label>Tipo de cuenta *</Form.Label>
                        
                                <div className="mb-3">
                                <br></br>
                             
                                    <Form.Check inline
                                        id={1}
                                        value="1"
                                        label="Cuenta de Ahorros"
                                        type='radio'
                                        onChange={e => this.handleRadio(e, "IdTypeAccountBank")}
                                        checked={this.state.IdTypeAccountBank === "1"} />

                                    <Form.Check inline
                                        id={2}
                                        value="2"
                                        label="Cuenta corriente"
                                        type='radio'
                                        onChange={e => this.handleRadio(e, "IdTypeAccountBank")}
                                        checked={this.state.IdTypeAccountBank === "2"} />
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
                                    onChange={e => this.handleChange(e, "holder")}></Form.Control>

                            </Form.Group>

                        </Col>
                        <Col sm={6}>
                            <Form.Group >
                                <Form.Label>Número de Contribuyente</Form.Label>
                                <Form.Control required type="text" placeholder="Número de Contribuyente"
                                    onChange={e => this.handleChange(e, "NumberContribuyente")}></Form.Control>

                            </Form.Group>
                        </Col>
                        
                    </Row>
                    <Row>
                    <Col sm={6}>
                            <Form.Group >
                                <Form.Label>Razón Social</Form.Label>
                                <Form.Control required type="text" placeholder="Razón Social"
                                    onChange={e => this.handleChange(e, "RazonSocial")}></Form.Control>

                            </Form.Group>

                        </Col>
                        <Col sm={6}>
                            <Form.Group >
                                <Form.Label>Dirección Fiscal</Form.Label>
                                <Form.Control required type="text" placeholder="Dirección Fiscal"
                                    onChange={e => this.handleChange(e, "AddressFiscal")}></Form.Control>
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
                                <Button variant="primary" size="sm" onClick={this.onSave}>
                                    Guardar
                            </Button>

                            </Col>
                        </Row>
                    </Form.Group>


                </Form>
            </div >

        );
    }
}