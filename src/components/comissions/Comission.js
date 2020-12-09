import React, { Component } from 'react';
import { Form, Table, Button, Modal, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import Validation from '../utils/Validation';
export default class Comission extends Component {

    constructor(props){
        super(props);
        this.state = {
            registers: [],
            loading: true,
            noData: false,
            noDataMessage: "",
            showModal: false,
            registerModal: [],
            loadingModal: false,
            noDataModal: false,
            noDataMes: "",
            totalPages: 1,
            page: 1,
            size: 30,
            totalRegister: 0,
            totalPagesModal: 1,
            pageModal: 1,
            sizeModal: 30,
            totalRegisterModal: 0,
        }
    }

    componentDidMount(){
        this.getRegister();
    }

    async getRegister () {
       
        // Get by id
        let idUser = AuthService.getCurrentIdUser()
        let data = {
            "SizeList" : this.state.size,
            "NroPage" : this.state.page,
            "ParametersSearched" : {
                "IdSocioSearch" : Number(idUser)
            }
        }
        let response = await UserService.getPeriodByUser(data);
        console.log(response.objModel === null)
        if(response !== undefined ){
            if(response.status !== 1) {
                //console.log(response);
                this.setState({
                    registers: this.state.registers = [],
                    loading: this.state.loading = false,
                    noData: this.state.noData = true,
                    noDataMesssage : this.state.noDataMessage = "Ocurrió un problema mientras obteniamos los registros. Inténtelo más tarde.",
                });
            } else {
                if(response.objModel !== null && response.objModel.listElements.length > 0) {
                    
                 
                    this.setState({
                        registers: this.state.registers = response.objModel.listElements,
                        totalRegister: this.state.totalRegister = response.objModel.totalElemList,
                        totalPages: this.state.totalPages = response.objModel.totalPages,
                        loading: this.state.loading = false,
                        noData: this.state.noData = false,
                        noDataMesssage : this.state.noDataMessage = "",
                    });
                } else {
                    this.setState({
                        registers: this.state.registers = [],
                        totalRegister: this.state.totalRegister = 0,
                        totalPages: this.state.totalPages = 0,
                        loading: this.state.loading = false,
                        noData: this.state.noData = true,
                        noDataMesssage : this.state.noDataMessage = "No hay registros para mostrar.",
                    });
                }
               
            }
        }
        
    }

    async getResumen(id){

        
        
        // let response = {
        //     objModel: packages,
        //     status : 1
        // }
        // if(response !== undefined ){
        //     if(response.status !== 1) {
        //         //console.log(response);
        //         this.setState({
        //             registerModal: this.state.registerModal = [],
        //             loadingModal: this.state.loadingModal = false,
        //             noDataModal: this.state.noDataModal = true,
        //             noDataMes : this.state.noDataMes = "Ocurrió un problema mientras obteniamos los registros. Inténtelo más tarde.",
        //         });
        //     } else {
        //         if(response.objModel.length > 0) {
        //             this.setState({
        //                 registerModal: this.state.registerModal = response.objModel,
        //                 loadingModal: this.state.loadingModal = false,
        //                 noDataModal: this.state.noDataModal = false,
        //                 noDataMes : this.state.noDataMes = "",
        //             });
        //         } else {
        //             this.setState({
        //                 registerModal: this.state.registerModal = response.objModel,
        //                 loadingModal: this.state.loadingModal = false,
        //                 noDataModal: this.state.noDataModal = true,
        //                 noDataMes : this.state.noDataMes = "No hay registros para mostrar.",
        //             });
        //         }
               
        //     }
        // }
    }
    

    // Handle main pagination 
    handlePageChange = (e, field) => {
        let value = Number(e.target.value);
        this.setState({
            [field]: this.state[field] = value           
        });

        // Call to  services
        this.getRegister();
    }

    handleSizeChange = (e, field) => {
        let value = Number(e.target.value);
       
        this.setState({
            size: this.state.size = value,
            page: this.state.page = 1
        });

        // Call to  services
        this.getRegister();
    }

    // TODO agregar paginadoHandle modal 
    onclickDetails = (e, item) => {
        e.preventDefault();
        this.setState({
            itemPeriod: this.state.itemPeriod = item
        });
        this.getDetailsPeriod(item);
          
    }

    getDetailsPeriod = async(item) => {
        if(item !== undefined) {
            let idUser = AuthService.getCurrentIdUser()
            let data = {
                "SizeList" : this.state.sizeModal,
                "NroPage" : this.state.pageModal,
                "IdReference" : item.id,
                "ParametersSearched" : {
                    "IdSocioSearch" : Number(idUser)
                }
            }
            this.setState({
                showModal: true,
                loadingModal: true
            });

            let response = await UserService.getComisiones(data);
            if(response !== undefined ){
                if(response.status !== 1) {
                    //console.log(response);
                    this.setState({
                        registerModal: this.state.registerModal = [],
                        totalRegisterModal: this.state.totalRegisterModal = 0,
                        totalPagesModal: this.state.totalPagesModal = 0,
                        loadingModal: this.state.loadingModal = false,
                        noDataModal: this.state.noDataModal = true,
                        noDataMes : this.state.noDataMes = "Ocurrió un problema mientras obteniamos los registros. Inténtelo más tarde.",
                    });
                } else {
                    if(response.objModel.listElements.length > 0) {
                        this.setState({
                            
                            registerModal: this.state.registerModal = response.objModel.listElements,
                            totalRegisterModal: this.state.totalRegisterModal = response.objModel.totalElemList,
                            totalPagesModal: this.state.totalPagesModal = response.objModel.totalPages,
                            loadingModal: this.state.loadingModal = false,
                            noDataModal: this.state.noDataModal = false,
                            noDataMes : this.state.noDataMes = "",
                        });
                    } else {
                        this.setState({
                            registerModal: this.state.registerModal = [],
                            totalRegisterModal: this.state.totalRegisterModal = 0,
                            totalPagesModal: this.state.totalPagesModal = 0,
                            loadingModal: this.state.loadingModal = false,
                            loadingModal: this.state.loadingModal = false,
                            noDataModal: this.state.noDataModal = true,
                            noDataMes : this.state.noDataMes = "No hay registros para mostrar.",
                        });
                    }
                
                }
            }
        }
    }

    // Handle Modal pagination 
    handlePageChangeModal = (e, field) => {
        let value = Number(e.target.value);
        this.setState({
            [field]: this.state[field] = value           
        });
        
        // Call to  services
        this.getDetailsPeriod(this.state.itemPeriod);
    }

    handleSizeChangeModal = (e, field) => {
        let value = Number(e.target.value);
       
        this.setState({
            sizeModal: this.state.sizeModal = value,
            pageModal: this.state.pageModal = 1
        });

        // Call to  services
        // Call to  services
        this.getDetailsPeriod(this.state.itemPeriod);
    }


    handleClose = () => {
        this.setState({
            showModal : this.state.showModal = false,
            loadingModal: this.state.loadingModal = false,
            registerModal: this.state.registerModal = [],
            noDataModal: this.state.noDataModal = false,
            noDataMes: this.state.noDataMes = "",
            itemPeriod: this.state.itemPeriod = undefined,
            totalPagesModal: 1,
            pageModal: 1,
            sizeModal: 30,
            totalRegisterModal: 0,

        });
    }

    handleShow= () => {
        this.setState({
            showModal : this.state.showModal = true
        });
    }

    // Modal details
    onclickResumen = (e, id) => {
        e.preventDefault();
      
    }

    compareDate = (today, endDate) => {

        today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        let day = "";
        let month = "";
        let year = "";

        
        if(today.getTime() > endDate.getTime()) {
            day = ("00" + (endDate.getDate())).slice(-2);
            month = ("00" + (endDate.getMonth()+1)).slice(-2) 
            year =  endDate.getFullYear();

        } else {
            day = ("00" + (today.getDate())).slice(-2);
            month = ("00" + (today.getMonth()+1)).slice(-2) 
            year =  today.getFullYear();

        }

        return ( day + "-"  +  month+ "-"  + year);
    }
    render() {
        
        const { loading, registers, noData, noDataMessage, 
            loadingModal, noDataModal, showModal, noDataMes, registerModal,
            page, size, totalPages, totalRegister,
            totalPagesModal, pageModal, sizeModal, totalRegisterModal} =  this.state;
        
        let optionPages = [];
        for(let i = 0; i < totalPages; i++) {
            optionPages.push(<option value={i+1}>{i+1}</option>)
        }

        // Modal
        let optionPagesModal = [];
        for(let i = 0; i < totalPagesModal; i++) {
            optionPagesModal.push(<option value={i+1}>{i+1}</option>)
        }
    
        return(
            <div style={{padding:30}}>
                {/* Paginador */}
                <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Form inline>
                    <Form.Label>Mostrando del {size*(page - 1) + 1} al {(size * page > totalRegister)? totalRegister:size * page} de {totalRegister} registros. &nbsp;&nbsp;|</Form.Label>
                        {/* Page */}
                        <Form.Label className="my-1 ml-3 -mr-2" htmlFor="selectCount">
                            Página:
                        </Form.Label>
                        <Form.Control
                            as="select"
                            className="my-2 ml-2 mr-1"
                            id="selecPagesComision"
                            defaultValue={"1"}
                            value={page}
                            style={{fontSize: 10}}
                            onChange={e => {this.handlePageChange(e, 'page')}} 
                        >
                            {optionPages}
                        </Form.Control>
                        <Form.Label className="my-1  mr-sm-2" htmlFor="selectCount">
                            de {totalPages}. 
                        </Form.Label>
                        {/* Per page */}
                        <Form.Label className="my-1 ml-2" htmlFor="selectCount">
                            Por página: 
                        </Form.Label>
                        <Form.Control
                            as="select"
                            className="my-2 mr-sm-4"
                            id="selectCountcomision"
                            defaultValue={'30'}
                            style={{fontSize: 10}}
                            onChange={e => {this.handleSizeChange(e, 'size')}} 
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                        </Form.Control>
                        
                    </Form>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Table responsive>
                            <thead className="table-head">
                                <tr>
                                    <th>N</th>
                                    <th>Periodo</th>
                                    <th>Actualizado a </th>
                                    <th>Comisión</th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {!loading && !noData && 
                                    registers.map((item, idx) => {
                                        // verfiy update 
                                        let today = new Date();
                                        let endDate = new Date(item.endDate);
                                        let update = this.compareDate(today, endDate);
                                        let amount = Math.round((item.amounthTotal + Number.EPSILON) * 100) / 100
                                            
                                        return(
                                        <tr key={idx}>
                                            <td>{size*(page - 1) + 1 + idx}</td>
                                            <td>{Validation.formatDate(item.initialDate)} al {Validation.formatDate(item.endDate)}</td>
                                            <td>{update}</td>
                                            <td>$ {amount}</td>
                                            <td>
                                                {/* <Button variant="dark"
                                                        size="sm" 
                                                        onClick={e => this.onclickResumen(e, item.id)}>Resumen</Button> */}
                                            
                                                <Button variant="secondary" 
                                                        size="sm" 
                                                        className="ml-4"
                                                        onClick={e => this.onclickDetails(e, item)}>Ver detalle</Button>
                                            </td>
                                        </tr>
                                        )
                                    })
                                }
                            </tbody>
                            
                        </Table>
                    </Col>
                </Row>
                
                {loading && 
                         <div>
                            <Spinner animation="border" variant="dark"></Spinner>
                            <p>Cargando registros...</p>
                        </div>
                        
                }
                {!loading && noData && 
                    <Row>
                        <Col sm={12}>
                            <Form.Label>{noDataMessage}</Form.Label>
                        </Col>
                    </Row>
                }
                {/* Modal */}
                <Modal 
                    show={showModal} 
                    onHide={this.handleClose}
                    size="lg"
                    style={{fontSize:12}}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        {loadingModal && 
                            <Row style={{textAlign: 'center'}}>
                                <Col sm={12}>
                                    <div>
                                        <Spinner animation="border" variant="dark"></Spinner>
                                        <p>Cargando registros...</p>
                                    </div>
                            </Col>
                            </Row>
                        }
                        {!loadingModal && noDataModal && 
                            <Row  style={{textAlign: 'center'}}>
                                <Col sm={12}>
                                    <Form.Label>{noDataMes}</Form.Label>
                                </Col>
                            </Row>
                        }
                        {!loadingModal && !noDataModal && <div>
                            {/* Paginador */}
                            <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Form inline>
                        <Form.Label>Mostrando del {sizeModal*(pageModal - 1) + 1} al {(sizeModal * pageModal> totalRegisterModal)? totalRegisterModal:sizeModal * pageModal} de {totalRegisterModal} registros. &nbsp;&nbsp;|</Form.Label>
                                    {/* Page */}
                                    <Form.Label className="my-1 ml-3 -mr-2" htmlFor="selectCount">
                                        Página:
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-2 ml-2 mr-1"
                                        id="selecPagesModal"
                                        defaultValue={"1"}
                                        value={page}
                                        style={{fontSize: 10}}
                                        onChange={e => {this.handlePageChangeModal(e, 'pageModal')}} 
                                    >
                                        {optionPagesModal}
                                    </Form.Control>
                                    <Form.Label className="my-1  mr-sm-2" htmlFor="selectCount">
                                        de {totalPagesModal}. 
                                    </Form.Label>
                                    {/* Per page */}
                                    <Form.Label className="my-1 ml-2" htmlFor="selectCount">
                                        Por página: 
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-2 mr-sm-4"
                                        id="selectCountModal"
                                        defaultValue={'30'}
                                        style={{fontSize: 10}}
                                        onChange={e => {this.handleSizeChangeModal(e, 'sizeModal')}} 
                                    >
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </Form.Control>
                                    
                                </Form>
                            </Row>
                            <Row>
                                <Col>
                                <Table responsive>
                                            <thead className="table-head">
                                                <tr>
                                                    <th></th>
                                                    <th>Nombre</th>
                                                    <th>Tipo de Comisión</th>
                                                    <th>Nivel</th>
                                                    <th>Fecha</th>
                                                    <th>Monto</th>
                                                    <th>Por Estado</th>
                                                    <th>Por Nivel</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {registerModal.map((item , idx) => {
                                                    let amount = Math.round((item.amount + Number.EPSILON) * 100) / 100
                                                
                                                    return(
                                                        <tr key={idx}>
                                                            <td>{sizeModal *(pageModal - 1) + 1 + idx}</td>
                                                            <td>{item.nameSlave} {item.lastNameSlave}</td>
                                                            <td>{item.typeBonusDescription}</td>
                                                            <td>{item.levelSon}</td>
                                                            <td>{Validation.formatDate(item.dateRegister)}</td>
                                                            <td>$ {amount}</td>
                                                            {/* Por estado */}
                                                            <td>{item.forCondition}</td>
                                                            <td>{item.forLevel}</td>
                                                        
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                </Col>
                            </Row>
                
                        </div>
                            
                        }
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={this.handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}