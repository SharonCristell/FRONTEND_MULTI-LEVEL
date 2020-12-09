import React, { Component } from 'react';
import { Form, Tabs, Tab, Row, Col, Table, Button, Spinner, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FaEdit } from 'react-icons/fa';
import { AiFillNotification } from 'react-icons/ai';

import UserService from '../../services/user.service';
import Validation from '../utils/Validation';
import AuthService from '../../services/auth.service';

export default class InitialPayment extends Component {

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
            showModal: false,
            suscriptionModal: undefined,
            userModal: undefined,
            checkCurrent: true,
            checkSponsor: false,
            checkOther: false,
            emailOther: ""
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
        
        let response = [];
        if(Number(this.state.idState) > 0) {
            response = await UserService.managementAffiliateFilter(parameter);
        } else {
            response = await UserService.managementAffiliate(parameter);
        }
        
        if(response !== undefined && response !== null){
            if(response.status !== 1) {
                //console.log(response);
                this.setState({
                    registers: this.state.registers = [],
                    emptyList: this.state.emptyList = true,
                    loading: this.state.loading = false,
                    message: this.state.message = "Se ha producido un error. Inténtelo más tarde."
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
                        totalPages: this.state.totalPages = object.totalPages
                    
                    });
                } else {
                    this.setState({
                        registers: this.state.registers = [],
                        emptyList: this.state.emptyList = true,
                        loading: this.state.loading = false,
                        message: this.state.mesagge = "No hay registros para mostrar.",
                        totalPages: this.state.totalPages = 1,
                        page: this.state.page = 1
                    });
                }
               
            }
        } else {
            this.setState({
                registers: this.state.registers = [],
                emptyList: this.state.emptyList = true,
                loading: this.state.loading = false,
                message: this.state.message = "Se ha producido un error. Inténtelo más tarde."
            });
        }
    }

    

    sendWelcome = async(e, item) => {
        e.preventDefault();
        if(item.currentSuscription !== undefined){
            let data = {
                FlagEnvioPatrocinador : 0,
                IdSuscripcion : item.currentSuscription.id
            };
            let  response = await UserService.sendWelcomeMsg(data);

            if(response !== undefined && response.status === 1) {
                alert("Mensaje de bienvenida fue enviado con éxito.")
            } else {
                alert("Se ha producido un error. Inténtelo más tarde.");
            }
        } else {
            alert("Seleccione una suscripción.")
        }
       
    }

    /**
     * 
     * @param {*} e : event 
     * @param {*} item : item selected od the list users
     * @param {*} idx : index - position od user into list
     */
    getSuscription = (e, item, idx) => {
        let idPackage = Number(e.target.value);
        let idxPackage = e.target.selectedIndex - 1;

        // modify current item
        item.currentSuscription =  item.suscriptions[idxPackage];

        //update item in registers
        let listRegisters = this.state.registers;
        listRegisters[idx] = item;
        this.setState({
            registers: this.state.registers = listRegisters
        });

    }

    // Handle modal alert
    handleClose = (e) => {
        this.setState({
            showModal : false,
            suscriptionModal: undefined,
            checkCurrent: true,
            checkSponsor: false,
            checkOther: false,
            emailOther: ""
        });
    }
    handleShow = (e, item) => {
        e.preventDefault();
        if( item.currentSuscription !== undefined){
            this.setState({
                showModal : true,
                suscriptionModal: item.currentSuscription,
    
            });
        } else {
            alert("Seleccione una suscripción.");
        }
        
    }

    sendAlert = async(e) => {
        e.preventDefault();
        if(this.state.suscriptionModal !== undefined){
            let checkSponsor = this.state.checkSponsor;
            let checkOther = this.state.checkOther;
            let emailOther = this.state.emailOther;
    
            let object = {
                FlagEnvioPatrocinador: (checkSponsor)? 1: 0,
                IdSuscripcion: this.state.suscriptionModal.id

            };

            if(checkOther ) {
                if( emailOther.length > 0) {
                    object.OtroEmail = emailOther;
                } else {
                    alert("Ingrese correo.");
                    return;
                }
                
            } 
            
            this.handleClose();

            let  response = await UserService.sendAlertPayment(object);

            if(response !== undefined && response.status === 1) {
                alert("Alerta de pago fue enviada con éxito.")
            } else {
                alert("Se ha producido un error. Inténtelo más tarde.");
            }
        } else {
            alert("Seleccione una suscripción.")
        }
        
    }

    render() {
        const { registers, activePage, page, totalPages,
             showModal, suscriptionModal, userModal, checkCurrent, checkSponsor, checkOther } = this.state;
      
        let optionPages = [];
        for(let i = 0; i < totalPages; i++) {
            optionPages.push(<option value={i+1}>{i+1}</option>)
        }

        return(
            <div style={{padding: 30}}>
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
                                id="selecPagesAf"
                                defaultValue={"1"}
                                value={page}
                                style={{fontSize: 10}}
                                onChange={e => {this.handlePageChange(e, 'page')}} 
                            >
                                {optionPages}
                            </Form.Control>
                            <Form.Label className="my-1  mr-sm-4" htmlFor="selectCountAf">
                                de {totalPages} 
                            </Form.Label>
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
                                    <th>N° Socio</th>
                                    {/* <th>F. Afiliación</th> */}
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    {/* <th>Rango</th> */}
                                    <th>Estado</th>
                                    <th>Nivel Patrocinio</th>
                                    {/* <th>Nivel Residual</th> */}
                                    <th>Rama</th>
                                    {/* <th>Patrocinador</th> */}
                                    <th>Suscripcion</th>
                                    <th>Próxima cuota</th>
                                    <th>Fecha</th>
                                    <th>Monto cuota</th>
                                    <th>Not. bienvenida</th>
                                    <th>Enviar alerta</th>
                                </tr>
                            </thead>
                            <tbody>
                                { registers.map((item, idx) => {
                                        let date = "";
                                            return (
                                                <tr key={item.id}>
                                                    <td>{idx}</td>
                                                    <td>{item.name} {item.lastName}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.stateText}</td>
                                                    <td>{item.nivelPatrocinio}</td>
                                                    {/* <td>{item.nivelResidual}</td> */}
                                                    <td>{item.branch}</td>
                                                    {/* <td>{item.nameSponsor} {item.lastnameSponsor}</td> */}
                                                    {/* <td>{item.suscriptionResponse.package.name}</td> */}
                                                    <td>
                                                        <Form.Control as="select"
                                                            defaultValue={'DEFAULT'}
                                                            onChange={e => {this.getSuscription(e,item, idx)}}>
                                                            <option value="DEFAULT" disabled>Seleccione</option>
                                                            {item.suscriptions.map((itemSus, ind) => {
                                                                return (<option value={ind}>{itemSus.package.name}</option>)
                                                            })}
                                                        </Form.Control>
                                                    </td>
                                                    {/* <td>
                                                        <Form.Control as="select"
                                                                    id={item.id}
                                                                    onChange={e => this.selectSuscription(e, item)}>
                                                                    {item.suscription.map((itemSusc) => {
                                                                        <option value="10">{itemSusc.name}</option>
                                                                    })
                                                                    }
                                                        </Form.Control>
                                                    </td> */}
                                                    {item.currentSuscription !== undefined && 
                                                         <td>{item.currentSuscription.descriptionPendingFee}</td>
                                                    }
                                                    {item.currentSuscription !== undefined && item.currentSuscription.lastDatePaidFee !== null &&
                                                         <td>{Validation.convertDateToString(item.currentSuscription.lastDatePaidFee)}</td>
                                                    }
                                                    {item.currentSuscription !== undefined && item.currentSuscription.lastDatePaidFee === null &&
                                                         <td></td>
                                                    }
                                                    {item.currentSuscription !== undefined && 
                                                         <td>USD {item.currentSuscription.pendingFee}</td>
                                                    }
                                                   {item.currentSuscription === undefined && 
                                                        <td colSpan={3}></td>
                                                   }
                                                   { item.state === 1 &&
                                                        <td> 
                                                        <Button variant="secondary" size="sm" onClick={(e) => {this.sendWelcome(e, item)}}>Bienvenido</Button>
                                                        </td>
                                                   }
                                                   { item.state !== 1 &&
                                                        <td> 
                                                       </td>
                                                   }
                                                    
                                                    <td>
                                                        <Button variant="warning" size="sm" onClick={(e) => {this.handleShow(e, item)}}><AiFillNotification></AiFillNotification></Button>
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

            <Modal show={showModal} 
                onHide={this.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Enviar alerta de pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {suscriptionModal !== undefined && <div>
                    <Row>
                        <Col sm={12}>
                            <Form.Label>Seleccione destinatarios:</Form.Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Form.Check 
                                custom
                                type={"checkbox"}
                                id={1}
                                label={"correo suscripcion"}
                                disabled
                                onChange={e => this.handleChangeCheck(e, "checkCurrent")}
                                checked={checkCurrent} 
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Form.Check 
                                custom
                                type={"checkbox"}
                                id={2}
                                label={"Patrocinador"}
                                onChange={e => this.handleChangeCheck(e, "checkSponsor")}
                                checked={checkSponsor} 
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Form.Check 
                                custom
                                type={"checkbox"}
                                id={3}
                                label={"Otro"}
                                onChange={e => this.handleChangeCheck(e, "checkOther")}
                                checked={checkOther} 
                            />
                        </Col>
                    </Row>
                    <Row style={{display:(checkOther)? 'inline':'none'}}>
                        <Col sm={12}>
                            <Form.Control placeholder="Ingrese correo electronico" onChange={e => {this.handleChange(e, 'emailOther')}}></Form.Control>
                        </Col>
                    </Row>
                    <hr></hr>
                    <Row>
                        <Col sm={4}>
                            <Form.Label>Suscripcion: </Form.Label>
                        </Col>
                        <Col sm={4}>
                            <Form.Label>{suscriptionModal.package.name}</Form.Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <Form.Label>Descripcion: </Form.Label>
                        </Col>
                        <Col sm={4}>
                            <Form.Label>{suscriptionModal.descriptionPendingFee}</Form.Label>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <Form.Label>Fecha de pago: </Form.Label>
                        </Col>
                        <Col sm={4}>
                            {suscriptionModal.datePendingFee === null &&
                                <Form.Label>/</Form.Label>
                            }
                            {suscriptionModal.datePendingFee !== null &&
                                <Form.Label>{Validation.convertDateToString(suscriptionModal.datePendingFee)}</Form.Label>
                            }
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={4}>
                            <Form.Label>Monto USD: </Form.Label>
                        </Col>
                        <Col sm={4}>
                            <Form.Label>{suscriptionModal.pendingFee}</Form.Label>
                        </Col>
                        
                    </Row>
                    </div>}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={(e) => this.handleClose(e)}>
                    Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={(e) => this.sendAlert(e)}>
                    Enviar
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
        );
    }
}