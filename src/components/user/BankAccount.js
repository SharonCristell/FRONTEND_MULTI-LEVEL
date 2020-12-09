import React, { Component } from 'react';
import {
    Button, Form, Spinner,
    Table, Accordion, Card,
    InputGroup, FormControl, Col, Row, Image, Modal, Container
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import addCard from '../../images/icons/addCard.png';
import editCard from '../../images/icons/editCard.png';
import deleteCard from '../../images/icons/deleteCard.png';
import AddBankAccount from '../../components/user/AddBankAccount';
import EditBankAccount from '../../components/user/EditBankAccount';
import DeleteBankAccount from '../../components/user/DeleteBankAccount';


export default class BankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Accounts: [],
            loading: true,
            noData: false,
            message: '',
            idUser: -1,
            isAdd: false,
            isEdit: false,
            isDelete: false,
            showVoucher: false,
            operation: "",

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
                        Accounts: this.state.Accounts = response.objModel,
                        loading: false,
                        noData: false
                    });
                   
            }
            else {
                this.setState({
                    Accounts: this.state.Accounts = [],
                    loading: false,
                    noData: true,
                    message: "No hay registros para mostrar.",
                });

            }
        }
        else {
            this.setState({
                Accounts: [],
                loading: false,
                noData: true,
                message: "Ocurrió un error al obtener las cuentas bancarias. Vuelva a intentarlo más tarde."
            });
        }


    }
    getTypeAccount = (i) => {
        let tags = <td></td>;

        if (i == 1) {
            tags =

                <td>
                    <p>Ahorros</p>
                </td>
        }

        else if (i == 2) {
            tags =

                <td>
                    <p>Corriente</p>
                </td>
        }
        return tags;
    }
    getAccountStatus = (i) => {
        let tags = <td></td>;

        if (i == 0) {
            tags =

                <td>
                    <p>Inactivo</p>
                </td>
        }

        else if (i == 1) {
            tags =

                <td>
                    <p>Activo</p>
                </td>
        }
        return tags;
    }
    handleShowVoucher = (e, operation) => {

        if (operation === 'Añadir') {
            this.setState({
                showVoucher: true,
                operation: 'Añadir',
                isAdd: true,
                isDelete: false,
                isEdit: false,

            });
        } else if (operation === 'Editar') {
            this.setState({
                showVoucher: true,
                operation: 'Editar',
                isAdd: false,
                isDelete: false,
                isEdit: true,

            });
        }
        else if (operation === 'Borrar') {
            this.setState({
                showVoucher: true,
                operation: 'Borrar',
                isAdd: false,
                isDelete: true,
                isEdit: false,

            });
        }

    }

    handleCloseVoucher = () => {
        this.setState({
            showVoucher: false
        });
    }


    render() {

        const packageFamily = this.state.packageFamily;
        const Accounts = this.state.Accounts;

        const loading = this.state.loading;
        const noData = this.state.noData;
        const message = this.state.message;

        return (
            <div>
                {loading &&
                    <div style={{ textAlign: 'center', paddingTop: 30 }}>
                        <Spinner animation="border" role="status" size="sm" >
                            <span className="sr-only">Loading...</span>
                        </Spinner> <Form.Label>Cargando información de cuentas bancarias...</Form.Label>

                    </div>
                }
                {!loading && !noData &&
                    <div class="form-style" style={{ margin: "0 auto" }}>
                        <Form>
                            <Form.Group>
                                <Container>

                                    <Row>
                                        <Col>

                                            <Form.Group>
                                                <h4>CUENTAS REGISTRADAS</h4>
                                            </Form.Group>

                                        </Col>
                                    </Row>
                                    <Row>

                                        <Table striped bordered hover responsive="md" size="sm">
                                            <thead className="table-head">
                                                <tr>

                                                    <th>País de Operaciones</th>
                                                    <th>Nombre del Banco</th>
                                                    <th>Dirección del Banco</th>
                                                    <th>Código SWIFT</th>
                                                    <th>Código IBAN</th>              
                                                    <th>Número de cuenta</th>
                                                    <th>Código CCI</th>
                                                    <th>Tipo de Cuenta</th>
                                                    <th>Nombre del Titular</th>                                                    
                                                    <th>Número de Contribuyente</th>
                                                    <th>Razón Social</th>
                                                    <th>Dirección Fiscal</th>
                                                    <th>Estado</th>


                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    Accounts.map((item, i) => {

                                                        return (
                                                            <tr key={item.id}>

                                                                <td>{item.countryOperation}</td>
                                                                <td>{item.nameBank}</td>
                                                                <td>{item.bankAddress}</td>
                                                              
                                                                <td>{item.swift}</td>
                                                                <td>{item.iban}</td>
                                                                <td>{item.numberAccount}</td>
                                                                <td>{item.cci}</td>
                                                                {this.getTypeAccount(item.idTypeAccountBank)}   
                                                                <td>{item.holder}</td>          
                                                                <td>{item.numberContribuyente}</td>
                                                                <td>{item.razonSocial}</td>
                                                                <td>{item.addressFiscal}</td>
                                                                {this.getAccountStatus(item.status)}

                                                            </tr>


                                                        )
                                                    })


                                                }
                                            </tbody>
                                        </Table>
                                    </Row>
                                </Container>
                            </Form.Group>
                        </Form>
                    </div>

                }

               

                {noData &&
                    <div>
                        <Form.Label>{message}</Form.Label>
                    </div>
                }
                <div>
                    <Form.Group>
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Group >

                                    </Form.Group>

                                </Col>
                            </Row>
                            <Row>

                                <Col sm={4}>
                                    <Image src={addCard} rounded style={{ width: "100px", cursor: 'pointer' }}
                                        onClick={(e) => { this.handleShowVoucher(e, 'Añadir') }}></Image>
                                    <strong>  Añadir Cuentas </strong>
                                </Col>
                                <Col sm={4}>
                                    <Image src={editCard} rounded style={{ width: "125px", cursor: 'pointer' }}
                                        onClick={(e) => { this.handleShowVoucher(e, 'Editar') }}>
                                    </Image>
                                    <strong>Editar Cuentas</strong>

                                </Col>
                                <Col sm={4}>
                                    <Image src={deleteCard} rounded style={{ width: "110px", cursor: 'pointer' }}
                                        onClick={(e) => { this.handleShowVoucher(e, 'Borrar') }}>
                                    </Image>
                                    <strong> Borrar Cuentas</strong>

                                </Col>
                            </Row>
                        </Container>

                    </Form.Group>
                </div>


                <Modal show={this.state.showVoucher}
                    onHide={this.handleCloseVoucher} style={{ fontSize: 10 }}
                    size="lg"
                    backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title> {this.state.operation} Cuenta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.isAdd &&
                            <Form.Group>
                                <AddBankAccount
                                    close={this.handleCloseVoucher}
                                    fontSize={10}></AddBankAccount>

                            </Form.Group>
                        }
                        {this.state.isEdit &&
                            <Form.Group>
                                <EditBankAccount
                                    close={this.handleCloseVoucher}
                                    fontSize={10}></EditBankAccount>
                            </Form.Group>
                        }
                        {this.state.isDelete &&
                            <Form.Group>
                                <DeleteBankAccount
                                    close={this.handleCloseVoucher}
                                    fontSize={10}></DeleteBankAccount>
                            </Form.Group>
                        }

                    </Modal.Body>
                </Modal>

            </div >
        );
    }
}