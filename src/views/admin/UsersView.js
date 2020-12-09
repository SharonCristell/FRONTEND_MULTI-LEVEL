import React, { Component } from 'react';
import { Form, Table, Row, Col, Spinner, Button, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Validation from '../../components/utils/Validation';
import UserService from '../../services/user.service';

import Schedule from './Schedule';

export default class UsersView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            register: [],
            loading: false,
            noData: false,
            message: "",
            showModal: false,
            userModal: {},
            registerModal: [],
            loadingModal: false,
            txtSearch: "",
            typeSponsor: "1",
            totalPages: 1,
            page: 1,
            size: 30,
            showModalEditor: false,
            editorModal: {},
        }
    }

    handleChange = (e, field) => {
     
        let value = e.target.value;
     
        this.setState({
            [field]: this.state[field] = value,
            page: this.state.page = 1,
            sponsors: this.state.sponsors =  [],
        })
    }

    // Seacrh data
    search = (e) => {

        this.setState({
            loading: true,
            register: [],
            noData: true,
        });
        let parameter = {
            SizeList: this.state.size,
            NroPage: this.state.page    
        }

        if(parameter !== undefined) {
            if(this.state.txtSearch.length > 0){
                let ParametersSearched = {
                    FlagSearchText: 1,
                    TextSearch: this.state.txtSearch,
                    DataTypeSearchPartner: Number(this.state.typeSponsor)
                }
                parameter.ParametersSearched = ParametersSearched;
                this.getSearchResults(parameter, true);
            } else {
                this.getSearchResults(parameter, false);
            }
        }
    }

    handlePageChange = (e, field) => {
        let value = Number(e.target.value);
        this.setState({
            [field]: this.state[field] = value,
            loading: true,
            register: [],
            noData: true,
        });

        // Call to  services
        let parameter = {
            SizeList: this.state.size,
            NroPage: this.state.page    
        }

        if(parameter !== undefined) {
            if(this.state.txtSearch.length > 0){
                let ParametersSearched = {
                    FlagSearchText: 1,
                    TextSearch: this.state.txtSearch,
                    DataTypeSearchPartner: Number(this.state.typeSponsor)
                }
                parameter.ParametersSearched = ParametersSearched;
                this.getSearchResults(parameter, true);
            } else {
                this.getSearchResults(parameter, false);
            }
        }
    }

    handleSizeChange = (e, field) => {
        let value = Number(e.target.value);
       
        this.setState({
            size: this.state.size = value,
            page: this.state.page = 1,
            loading: true,
            register: [],
            noData: true,
        });

        // Call to  services
        let parameter = {
            SizeList: this.state.size,
            NroPage: this.state.page    
        }

        if(parameter !== undefined) {
            if(this.state.txtSearch.length > 0){
                let ParametersSearched = {
                    FlagSearchText: 1,
                    TextSearch: this.state.txtSearch,
                    DataTypeSearchPartner: Number(this.state.typeSponsor)
                }
                parameter.ParametersSearched = ParametersSearched;
                this.getSearchResults(parameter, true);
            } else {
                this.getSearchResults(parameter, false);
            }
        }
    }

    getSearchResults = async(parameter, isFilter) => {
        let response = undefined;
        if(isFilter) {
            response = await UserService.getListUserSearchAdmin(parameter);
        } else {
            response = await UserService.getListUserForAdmin(parameter);
        }

        if(response !== undefined && response !== null){
            if(response.status !== 1) {
                //console.log(response);
                this.setState({
                    sponsors: this.state.register = [],
                    emptyList: this.state.noData = true,
                    loading: this.state.loading = false,
                    message: this.state.message = "Se ha producido un error. Inténtelo más tarde."
                });
            } else {
                let object = response.objModel;
                if(object.listElements.length > 0){
                    this.setState({
                        sponsors: this.state.register = object.listElements,
                        emptyList: this.state.noData = false,
                        loading: this.state.loading = false,
                        message: this.state.mesagge = "",
                        totalPages: this.state.totalPages = object.totalPages
                    
                    });
                } else {
                    this.setState({
                        sponsors: this.state.register = [],
                        emptyList: this.state.noData = true,
                        loading: this.state.loading = false,
                        message: this.state.mesagge = "No hay registros para mostrar.",
                        totalPages: this.state.totalPages = 1,
                        page: this.state.page = 1
                    });
                }
               
            }
        } else {
            this.setState({
                sponsors: this.state.sponsors = [],
                emptyList: this.state.emptyList = true,
                loading: this.state.loading = false,
                message: this.state.message = "Se ha producido un error. Inténtelo más tarde."
            });
        }
    }

    //Show modal
    showSuscription = async(e, item) => {
        
        this.handleShow();
        this.setState({
            loadingModal: this.state.loadingModal = true,
            userModal: this.state.userModal = item
        });
        
        let response = await UserService.getSuscriptionByUserAdmin(item.id);
        if(response !== undefined) {
            if(response.objModel.length > 0 && response.status === 1) {
                this.setState({
                    registerModal: this.state.registerModal = response.objModel,
                    loadingModal: this.state.loadingModal = false
                });

            } else {
                this.handleClose()
               alert("Ocurrió un error al consultar información.");
            }
        } else {
            this.handleClose()
            alert("Tuvimos problemas en obtener los registros.");
        }


    }

    handleClose = () => {
        this.setState({
            showModal : false,
            registerModal : this.state.registerModal = []
        });
    }

    handleShow = () => {
        this.setState({
            showModal : true
        });
    }

    //Show modal editor
    showEditor = async(e, item) => {
        
        this.handleShowEditor();
        this.setState({
            editorModal: this.state.editorModal = item
        });
        
       

    }

    handleCloseEditor = () => {
        this.setState({
            showModalEditor : false,
            editorModal: this.state.editorModal = undefined
        });
    }

    handleShowEditor = () => {
        this.setState({
            showModalEditor : true
        });
    }

    render(){
        const { register, 
            loading,
            noData, 
            message, 
            userModal,
            registerModal, 
            showModal,
            totalPages,
            page,
            size,
            loadingModal,
            branchCount,
            showModalEditor,
            editorModal } = this.state;

        let branchesList = [];
        branchesList.push(<option value="-1">Todos</option>)

        for(let i = 0; i < branchCount && i < 3; i++) {
            branchesList.push(<option value={i+1}>Rama {i+1}</option>)
        }
        branchesList.push(<option value="0">Sin posicionar</option>)
        
        let optionPages = [];
        for(let i = 0; i < totalPages; i++) {
            optionPages.push(<option value={i+1}>{i+1}</option>)
        }

        return(
            <div className="home-container">
                {/* Search */}
                <div className="search">
                    <h1 className="search-title">Buscador</h1>
                    <Row>
                        <Col sm={4} >
                            <Form.Group>
                                <Form.Label> Ingrese campo de búsqueda: </Form.Label>
                                <Form.Control required type="text" placeholder="Buscar por ..."
                                    onChange={e => this.handleChange(e, "txtSearch")} />
                                <Form.Label style={{fontSize: 9}}>( Nombre, apellido, usuario o número documento)</Form.Label>
                            </Form.Group>
                        </Col>
                        <Col sm={7} >
                            <Form.Group>
                                <Form.Label> Buscar como:</Form.Label>
                                <div style={{paddingTop: 8}}>
                                    <Form.Check inline 
                                                id={0}
                                                value="1"
                                                name="typeSponsor"
                                                label="Usuario" 
                                                type='radio' 
                                                onChange={e => this.handleChange(e, "typeSponsor")}
                                                checked={this.state.typeSponsor === "1"} />
                                    <Form.Check inline 
                                                id={1} 
                                                value="2"
                                                name="typeSponsor"
                                                label="Patrocinador" 
                                                type='radio'
                                                onChange={e => this.handleChange(e, "typeSponsor")}
                                                checked={this.state.typeSponsor === "2"}/>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row style={{textAlign: 'right'}}>
                        <Col sm={12}>
                            <Button variant="secondary"
                                    size="sm"
                                    onClick={e => {this.search(e)}}>Buscar</Button>
                        </Col>
                    </Row>
                    
                </div>
                {/* Paginador */}
                <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Form inline>
                                <Form.Label className="my-1 mr-2" htmlFor="selectCount">
                                    Registros: 
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    className="my-2 mr-sm-4"
                                    id="selectCount"
                                    defaultValue={'30'}
                                    style={{fontSize: 10}}
                                    onChange={e => {this.handleSizeChange(e, 'size')}} 
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                </Form.Control>
                                <Form.Label className="my-1 mr-2" htmlFor="selectCount">
                                    Página: 
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    className="my-2 ml-1 mr-1"
                                    id="selecPages"
                                    defaultValue={"1"}
                                    value={page}
                                    style={{fontSize: 10}}
                                    onChange={e => {this.handlePageChange(e, 'page')}} 
                                >
                                    {optionPages}
                                </Form.Control>
                                <Form.Label className="my-1  mr-sm-4" htmlFor="selectCount">
                                    de {totalPages} 
                                </Form.Label>
                            </Form>
                </Row>
                {/* Table */}
                <Row>
                    <Col sm={12}>
                        <Table responsive>
                            <thead className="table-head">
                                <tr>
                                    <th>Usuario</th>
                                    <th>N° Documento</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Genero</th>
                                    <th>Email</th>
                                    <th>Telefono</th>
                                    <th colSpan={2}>Patrocinador</th>
                                    <th>Estado</th>
                                    <th>Suscripciones</th>
                                    <th>Editar</th>
                                </tr>
                            </thead>
                            {!loading && !noData &&
                                <tbody> 
                                    {register.map((item) => (
                                        <tr>
                                            <td>{item.username}</td>
                                            <td>{item.nroDocument}</td>
                                            <td>{item.name}</td>
                                            <td>{item.lastname}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.email}</td>
                                            <td>{item.nroTelf}</td>
                                            <td  colSpan={2}>{item.namePatrocinador} {item.lastNamePatrocinador}</td>
                                            <td>{item.stateText}</td>
                                            <td> 
                                                <Button className="ml-4" 
                                                    size="sm" 
                                                    onClick={e => this.showSuscription(e, item)}
                                                    variant="link"> 
                                                {item.numberSuscription} suscripciones</Button></td>
                                            {/* <td>{item.state}</td> */}
                                            <td>
                                                <Button className="ml-4" 
                                                    size="sm" 
                                                    onClick={e => this.showEditor(e, item)}
                                                    variant="success">Editar </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            }
                        </Table>                        
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        {loading && <div style={{textAlign: 'center'}}>
                                <Spinner animation="border" variant="dark">
                                </Spinner>
                                <p><Form.Label>Cargando información...</Form.Label></p>
                            </div>
                        }
                        {!loading && noData && <Form.Label>{message}</Form.Label>}
                    </Col>
                </Row>
                {/* Modal */}
                <Modal 
                    size="lg"
                    // dialogClassName="modal-180w"
                    show={showModal} 
                    onHide={this.handleClose}
                    style={{fontSize:12}}
                    backdrop="static"
                    keyboard={false}
                   >
                    <Modal.Header closeButton>
                        <Modal.Title>Suscripciones</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={4}>
                                <Form.Text style={{fontSize: 12}}><b>Nombre: </b> {userModal.name} {userModal.lastname}</Form.Text>
                            </Col>
                            <Col sm={4}>
                                <Form.Text style={{fontSize: 12}}><b>Usuario: </b> {userModal.username}</Form.Text>
                            </Col>
                            <Col sm={4}>
                                <Form.Text style={{fontSize: 12}}><b>N. Documento: </b> {userModal.nroDocument}</Form.Text>
                            </Col>
                        </Row>
                        <Row>
                           <div style={{paddingTop:20}}></div>
                        </Row>
                        <Row>
                            <Col sm={12}>
                            <Table responsive>
                                <thead className="table-head">
                                    <tr>
                                        <th>Suscripción</th>
                                        <th>Descripción de cuota pendiente</th>
                                        <th>Fecha pendiente de cuota</th>
                                        <th>Cuota pendiente</th>
                                       <th>Fecha de ultima cuota pagada</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { !loadingModal && registerModal.length === 0 && <Form.Label>No se encontraron registros.</Form.Label>}
                                    { !loadingModal && registerModal.length > 0 && registerModal.map((item, idx) => {
                                                                                   
                                            return (
                                                
                                                <tr key={idx}>
                                                    <td>{item.package.name}</td>
                                                    <td>{item.descriptionPendingFee}</td>
                                                     <td>{Validation.convertDateToString(item.datePendingFee)}</td>
                                                    <td>{item.pendingFee} USD</td>
                                                   <td>{Validation.convertDateToString(item.lastDatePaidFee)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            { loadingModal &&
                                        <div style={{textAlign: 'center'}}>
                                            <Spinner size="sm" animation="border" variant="dark">
                                            </Spinner>
                                            <Form.Label>&nbsp; Cargando información...</Form.Label>
                                        </div>
                                    }
                            </Col>
                        </Row>
                       
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal 
                    size="lg"
                    // dialogClassName="modal-180w"
                    show={showModalEditor} 
                    onHide={this.handleCloseEditor}
                   
                    backdrop="static"
                    keyboard={false}
                   >
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizacion de cronograma</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {editorModal !== undefined &&
                            <Schedule iduser={editorModal.id}></Schedule>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseEditor}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}