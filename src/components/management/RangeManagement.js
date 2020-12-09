import React, { Component } from 'react';
import { Form, Tabs, Tab, Row, Col, Table, Button, Spinner, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FaEdit } from 'react-icons/fa';
import { AiFillNotification } from 'react-icons/ai';

import UserService from '../../services/user.service';
import Validation from '../utils/Validation';
import AuthService from '../../services/auth.service';
import MainView from '../../views/home/MainView';

export default class RangeManagement extends Component {

    constructor(props) {
        super(props);

        this.state = {
          
            registers: [],
            emptyList: true,
            message: "No hay registros para mostrar.",
            loading: false,
            activePage: 1,
            txtSearch: "",
            idState: '0',
            totalPages: 1,
            page: 1,
            size: 30,
            totalRegister: 0,
            showModal: false,
            suscriptionModal: undefined,
            userModal: undefined,
            checkCurrent: true,
            checkSponsor: false,
            checkOther: false,
            emailOther: "",
            showModalEdit: false,
            userCurrent: undefined,
            loadingSaveUSer: false,
            saveService: false, 
            messageSave: "",
            index: -1,
            id : undefined,
            name : undefined,
            lastname : undefined,
            nroDocument : undefined,
            email : undefined,
            nroTelf : undefined
        }
    }

    handlePageChange = (e, field) => {
        let value = Number(e.target.value);
        this.setState({
            [field]: this.state[field] = value,
            loading: true,
            registers: [],
            emptyList: true,
        });

        // Call to  services
        
        let parameter = this.getParameter();
        if(parameter !== undefined) {
            this.getSearchResults(parameter);
        }
    }

    handleSizeChange = (e, field) => {
        let value = Number(e.target.value);
       
        this.setState({
            size: this.state.size = value,
            page: this.state.page = 1,
            loading: true,
            registers: [],
            emptyList: true,
        });

        // Call to  services
        
        let parameter = this.getParameter();
        if(parameter !== undefined) {
            this.getSearchResults(parameter);
        }
    }


    handleChange = (e, field) => {
     
        let value = e.target.value;
     
        this.setState({
            [field]: this.state[field] = value
        })

    }

    handleChangeCheck = (e, field) => {
     
        let value = e.target.value;

        this.setState({
            [field]: this.state[field] = !this.state[field]
        })

    }

  
    /**
     * Event to search 
     * @param {*} e 
     */
    searchAffiliate = (e) => {
        // console.log(this.state)
        this.setState({
            loading: true,
            registers: [],
            emptyList: true,
        });
        let parameter = this.getParameter();
        if(parameter !== undefined) {
            this.getSearchResults(parameter);
        }
        
    }

    getParameter = () => {
        let data = {};
        let parameters = {};

        //Add search by name and type
        // if(this.state.txtSearch.trim().length > 0) {
        //     parameters.FlagSearchText = 1;
        //     parameters.TextSearch     = this.state.txtSearch;
        // } else {
        //     parameters.FlagSearchText = 0;
        //     parameters.TextSearch     = "";
        // }

        if( Number(this.state.idState) > 0 ) {
            parameters.FlagSearchSuscription =  1;
            parameters.StateSuscriptionSearch =  Number(this.state.idState);
        } 


        parameters.IdSocioSearch = Number(AuthService.getCurrentIdUser());
        
        data.ParametersSearched = parameters;
        data.SizeList = this.state.size;
        data.NroPage = this.state.page;


        return data;
    }
    

    getSearchResults = async(parameter) => {
        
        let response = await UserService.managementAffiliate(parameter);
        // if(Number(this.state.idState) > 0) {
        //     response = await UserService.managementAffiliateFilter(parameter);
        // } else {
        //     response = await UserService.managementAffiliate(parameter);
        // }
        
        if(response !== undefined && response !== null){
            if(response.status !== 1) {
                //console.log(response);
                this.setState({
                    registers: this.state.registers = [],
                    emptyList: this.state.emptyList = true,
                    loading: this.state.loading = false,
                    message: this.state.message = "Se ha producido un error. Inténtelo más tarde.",
                    totalRegister: this.state.totalRegister = 0
                });
            } else {
                let object = response.objModel;
                if(object.listElements.length > 0){

                    object.listElements.map((item) => {
                       
                        item.currentSuscription = undefined;
                    });

           
                    this.setState({
                        registers: this.state.registers = object.listElements,
                        emptyList: this.state.emptyList = false,
                        loading: this.state.loading = false,
                        message: this.state.mesagge = "",
                        totalPages: this.state.totalPages = object.totalPages,
                        totalRegister: this.state.totalRegister = object.totalElemList
                    
                    });
                } else {
                    this.setState({
                        registers: this.state.registers = [],
                        emptyList: this.state.emptyList = true,
                        loading: this.state.loading = false,
                        message: this.state.mesagge = "No hay registros para mostrar.",
                        totalPages: this.state.totalPages = 1,
                        page: this.state.page = 1,
                        totalRegister: this.state.totalRegister = 0
                    });
                }
               
            }
        } else {
            this.setState({
                registers: this.state.registers = [],
                emptyList: this.state.emptyList = true,
                loading: this.state.loading = false,
                message: this.state.message = "Se ha producido un error. Inténtelo más tarde.",
                totalRegister: this.state.totalRegister = 0
            });
        }
    }

    
   
    showDashBoard = (item) => {
        console.log(item);
        this.setState({
            showModal: true,
            item: item
        });
    }

    handleClose= () =>  {
        this.setState({
            item: undefined,
            showModal: false
        });
    }


    render() {
        const { registers, page, size, totalPages, totalRegister,
             showModal, item} = this.state;
      
        let optionPages = [];
        for(let i = 0; i < totalPages; i++) {
            optionPages.push(<option value={i+1}>{i+1}</option>)
        }

        return(
            <div >
            <Form.Group>
                {/* <p>Información actualizada al: <b>{this.state.date}</b></p> */}
            </Form.Group>
            {/* <div className="search"> */}
                {/* <h1 className="search-title">Buscador</h1> */}
                <Row style={{textAlign: 'left'}}>
                    <Col sm={12}>
                        <Form.Group>
                        <Button variant="secondary"
                                size="sm"
                                style={{ marginTop: 30}}
                                onClick={e => {this.searchAffiliate(e)}}>Obtener listado</Button>
                        </Form.Group>
                    </Col>
                </Row>
              
            {/* </div> */}
            <hr></hr>
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
                        id="selecPages"
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
                    
                </Form>
            </Row>
            { this.state.loading && 
                <div>
                    <Spinner animation="border" variant="dark">
                    </Spinner>
                    <p><Form.Label>Cargando información ...</Form.Label></p>
                </div>
            }
            {   this.state.emptyList && !this.state.loading && 
                <Form.Label>{this.state.message}</Form.Label>
            }
            {  !this.state.emptyList && 
            <div>
                <Row>
                    <Col sm={12}>
                        <Table responsive>
                            <thead className="table-head">
                                <tr>
                                    <th>N°</th>
                                    <th>F. Afiliación</th>
                                    <th>Nombres y apellidos</th>
                                    <th>Documento</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Estado</th>
                                    <th>Nivel Patrocinio</th>
                                    <th>Rango actual</th>
                                    <th>Rama 1</th>
                                    <th>Rama 2</th>
                                    <th>Rama 3</th>
                                    <th>Directos</th>
                                    <th>Dashboard</th>
                                    <th>Placement Pendientes</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { registers.map((item, idx) => {
                                        let date = "";
                                            return (
                                                <tr key={item.id}>
                                                    <td>{size*(page - 1) + 1 + idx}</td>
                                                    <td>{Validation.convertDateToStringEx(item.createDate)}</td>
                                                    <td>{item.name} {item.lastName}</td>
                                                    <td>
                                                        <div style={{width: '200px', wordBreak: 'break-all'}}>
                                                           {item.nroDocument} 
                                                        </div>
                                                        </td>
                                                    <td>
                                                        <div style={{width: '200px', wordBreak: 'break-all'}}>
                                                            {item.email}
                                                        </div></td>
                                                    <td>{item.nroTelf}</td>
                                                    <td>{item.stateText}</td>
                                                    <td>{item.nivelPatrocinio}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <Button variant="secondary" size="sm" onClick={e => {this.showDashBoard(item)}}>Dashboard</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })

                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
            }

            

            {/* Modal show dashboard */}
            <Modal show={showModal} 
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                onHide={this.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Dashboard</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                            {item !== undefined && 
                                    <p><b>Nombres: </b>{item.name} {item.lastName}</p>
                            }
                        </Col>
                        <Col sm={6}>
                            {item !== undefined && 
                                    <p><b>DNI: </b>{item.nroDocument}</p>
                            }
                        </Col>
                    </Row>
                    <hr></hr>
                    <Row>
                        <Col sm={12}>
                            {item !== undefined && 
                                <div style={{textAlign: 'center', margin: "30px"}}>
                                    <MainView idUser={item.id}></MainView>
                                </div>
                            }
                        </Col>
                    </Row>
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={(e) => this.handleClose(e)}>
                    Cerrar
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
        );
    }
}