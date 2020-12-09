import React, { Component } from 'react';
import { Form, Row, Col, Button, Accordion, Card, Image, Modal, Spinner, Table, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import PayVoucherInter from '../payment/PayVoucherInter';

import UtilService from '../../services/utils.service';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

export default class DeleteBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {
                accountSoles: "2323",
                accountInterSoles: "",
                accountDolars: "",
                accountInterDolars: "",
                bankName: "",
                accountHolder: "",
                accountType: "",
                accountNumber: "",
                taxpayerNumber: "",
                companyName: "",
                fiscalAddress: "",
            },
            typePay: 0,
            exchange: "",
            packageFamily: [

                {
                    id: 0,
                    name: "Cuentas Activas",
                },
                {
                    id: 1,
                    name: "Operaciones con Cuentas",
                },


            ],
            familyInit: [],
            currentAccounts: [
                {
                    id: 0,
                    holderAccount: "",
                    idBankCountry: "",
                    idBankName: "",
                },
                {
                    id: 1,
                    holderAccount: "",
                    idBankCountry: "",
                    idBankName: "",
                },


            ],

            idBankName: -1,
            nationalities: [],
            banks: [],
            tempDocuments: [],
            isPaid: false,
            showVoucher: false,
            idNationality: -1,
            typeDocuments: [],
            showOthers: 'none',
            Accounts: [],
            tempAccounts: [],
            idUser: -1,
            IdBank: -1,
            idAccountBank:-1,
            
        
        }
        this.getIdUser = this.getIdUser.bind(this);
        this.getInformationAccount = this.getInformationAccount.bind(this);
    }

    componentDidMount() {
        this.getIdUser();
        this.getInformationAccount();

    }
    async getIdUser() {

        let id = AuthService.getCurrentIdUser();
        if (id !== undefined) {

            this.setState({
                idUser: this.state.idUser = id,

            });
        }

    }
    async getInformationAccount() {

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

            // console.log( residences )
            this.setState({ tempAccounts: residences });
            this.forceUpdate();
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

        if (field === "idDocumentTypeCountry") {

            let text = e.target.options[e.target.selectedIndex].text.toUpperCase();
            if (text.includes("OTRO")) {
                this.setState({
                    showOthers: this.state.showOthers = 'inline'
                });
            } else {
                this.setState({
                    showOthers: this.state.showOthers = 'none'
                });
                if (this.props.onChange) {
                    this.props.onChange("", "desDocument");
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
        // //console.log('step one');
        let value = e.target.value;
        if (this.props.onChange) {
            this.props.onChange(e.target.value, field);
            this.setState({
                [field]: this.state[field] = value,
                messageDoc: ""
            });
        }
        // })
    };
    
    handleCloseVoucher = () => {
        this.setState({
            showVoucher: false
        });
    }
    validation = () => {

        if (this.state.idBankAccount <= 0) {
            alert("Seleccione una cuenta a eliminar.");
           
            return false;
        } 


        return true;
    }


    onSave = async (e) => {

        e.preventDefault();
        
        let flag = false;

        let id=this.state.idAccountBank;
        // console.log(id)

        if (this.validation()) {

            let response = await UserService.deleteBankAccount(id);

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
                    alert("Ocurrió un error al momento de elimar dicha cuenta.");
                }
            } else {
                this.setState({
                    loadSenData: this.state.loadSenData = false
                });
                alert('Tuvimos un problema. Inténtalo más tarde.');
            }

        }
        if(flag){
           
            this.props.close();
            window.location.reload();
        }
    };

    render() {
        const { account, exchange, currentAccounts } = this.state;
        const loading = this.state.loading;
        const noData = this.state.noData;
        const message = this.state.message;
        const packageFamily = this.state.packageFamily;
        const familyInit = this.state.familyInit;
        return (
            <div>
                <Form>

                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Eliga una cuenta bancaria a eliminar *</Form.Label>

                            </Form.Group>

                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Cuentas Bancarias</Form.Label>
                                <Form.Control as="select" defaultValue={'DEFAULT'}
                                    onChange={e => this.handleSelect(e, "idAccountBank")}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    {this.state.tempAccounts}
                                </Form.Control>
                                <br></br>
                               
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row>
                        <Col sm={6} style={{ textAlign: 'left' }}>
                            <Button variant="secondary" size="sm" onClick={this.props.close}>
                                Cancelar
                            </Button>

                        </Col>
                        
                        <Col sm={6} style={{ textAlign: 'right' }}>
                            <Button variant="primary" size="sm" onClick={this.onSave}>Borrar</Button>

                        </Col>
                    </Row>



                </Form>

            </div>

        );
    }
}