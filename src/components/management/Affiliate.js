import React, { Component } from 'react';
import { Form, Tabs, Tab, Row, Col, Table, Button, Spinner, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FaEdit } from 'react-icons/fa';
import { AiFillNotification } from 'react-icons/ai';

import UserService from '../../services/user.service';
import Validation from '../utils/Validation';
import AuthService from '../../services/auth.service';

export default class Affiliate extends Component {

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
                    totalRegister: this.state.totalRegister = 0,
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
    getSuscription = async (e, item, idx) => {
        let idPackage = Number(e.target.value);
        let idxPackage = e.target.selectedIndex - 1;
        
        // modify current item
        let response = await UserService.getScheduleDatail(idPackage)
        if(response.status === 1 ){
            item.currentSuscription =  response.objModel;

            //update item in registers
            let listRegisters = this.state.registers;
            listRegisters[idx] = item;
            this.setState({
                registers: this.state.registers = listRegisters
            });
        }
       

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

    // Handle modal alert
    handleCloseEdit = (e) => {
        this.setState({
            showModalEdit : false,
            name : undefined,
            lastname : undefined,
            nroDocument : undefined,
            email : undefined,
            nroTelf : undefined,
            userCurrent: undefined,
            loadingSaveUSer: false,
            saveService: false, 
            messageSave: ""
        });
    }
    handleShowEdit = (e, item, idx) => {
        e.preventDefault();
        if( item !== undefined){
            this.setState({
                showModalEdit : true,
                userCurrent: item,
                index: idx,
                id : item.id,
                name : item.name,
                lastname : item.lastName,
                nroDocument : item.nroDocument,
                email : item.email,
                nroTelf : item.nroTelf
    
            });
        } else {
            console.log("select user")
        }
        
    }
    //Save user 
    saveUser = async(e) => {
        this.setState({
            loadingSaveUSer: true,
            saveService: false, 
            messageSave: ""
        });
        
        if(this.state.name.length === 0){
            alert("Ingrese nombres.")
            return;
        }

        if(this.state.lastname.length === 0){
            alert("Ingrese apellidos.")
            return;
        }
        
        if(this.state.nroDocument === 0){
            alert("Ingrese número de documento.")
            return;
        }
    
        if(this.state.email.length === 0){
            alert("Ingrese correo electrónico.")
            return;
        }
        

        if(this.state.nroTelf.length === 0){
            alert("Ingrese teléfono.")
            return;
        }
        

        let data = {
            id : this.state.id,
            name : this.state.name,
            lastName : this.state.lastName,
            nroDocument : this.state.nroDocument,
            email : this.state.email,
            nroTelf : this.state.nroTelf
        }

        
        let response = await UserService.updateUser(data);

        if(response != undefined) {
            this.setState({
                loadingSaveUSer: false,
                saveService: true, 
                messageSave: "",
                name : undefined,
                lastname : undefined,
                nroDocument : undefined,
                email : undefined,
                nroTelf : undefined,
                userCurrent: undefined
            });
            if(response.status === 1) {
                this.setState({
                    messageSave: "Información actualizada."
                });
                this.updateItem(this.state.index, data);
            } else {
                this.setState({
                    messageSave: "Tuvimos problemas al actualizar la información."
                });
            }
           
        } else {
            this.setState({
                loadingSaveUSer: false,
                saveService: true, 
                messageSave: "Ocurrió un problema al actualizar información."
            });
        }
    }

    // update index 
    updateItem = (idx, item) => {

        if(idx > 0){
            let registers = this.state.registers;
            registers[idx] = item;

            this.setState({
                registers: this.state.registers
            });
        }
        
    }
    // Verify nro Document
    onBlurDocument = (e, field, fieldMessage) => {

        let nroDocument = this.state[field];
        if (this.state.userCurrent.nroDocument !== nroDocument &&  nroDocument.length > 0) {
            this.verifyDocument(field, fieldMessage);
        }
    }

    async verifyDocument(field, fieldMessage) {

        let data = {};
        data.nroDocument = this.state[field];

        let isRegister = await UserService.isDocumentRegistered(data);

        if (!isRegister) {
            this.setState({ [fieldMessage]: "" });
        } else {
            this.setState({ [fieldMessage]: "Este documento ya ha sido registrado." });
          
        }
    }

    onBlurEmail = (e, field, fieldMessage) => {
        let value = e.target.value.trim();
        if(value.length > 0){
            if(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(value)){
                this.setState({
                    [fieldMessage]: this.state[fieldMessage] = ""
                });
                
                if(value !== this.state.userCurrent.email){
                    this.verifyEmail(value, field, fieldMessage);
                }
                
            } else {
                this.setState({
                    [field]: this.state[field] = "",
                    [fieldMessage]: this.state[fieldMessage] = "Ingrese un correo válido."
                });
                
            }
        }
    }
    // Verify email
    async verifyEmail(email, field, fieldMessage){

        let data = {};
        data.email = email;
        if(this.state.userCurrent.email !== email){
            let isRegistered = await UserService.isEmailRegistered(data);
            if(isRegistered){
                this.setState({
                    [field]: this.state[field] = "",
                    [fieldMessage]: this.state[fieldMessage] = "Este correo ya está registrado."
                });
            
            } 
        }
       
    }

    // Build rows
    getOptions = (item, idx) => {
        let rows = [];

     
        // Alert
        if(item.currentSuscription !== undefined){
            rows.push(<td>
                        <Button variant="warning" size="sm" onClick={(e) => {this.handleShow(e, item)}}><AiFillNotification></AiFillNotification></Button>
                    </td>);
        } else {
            rows.push(<td></td>)
        }

        // Welcome
        if(item.currentSuscription !== undefined && item.currentSuscription.descriptionPendingFee.toUpperCase().includes("INICIAL")) {
            rows.push(<td>
                <Button variant="secondary" size="sm" onClick={(e) => {this.sendWelcome(e, item)}}>Bienvenida</Button>
            </td>);
        } else {
            rows.push(<td></td>)
        }

        // Edit state 2 or 4

        if((item.state === 0 || item.state === 4)) {
            rows.push(<td>
                <Button variant="secondary" size="sm" onClick={(e) => {this.handleShowEdit(e, item, idx)}}>Editar</Button>
            </td>);
        } else {
            rows.push(<td></td>)
        }

        return rows;
    }

    render() {
        const { registers, activePage, page, size, totalPages, totalRegister,
             showModal, suscriptionModal, userModal, checkCurrent, checkSponsor, checkOther,
             showModalEdit, userCurrent, loadingSaveUSer, saveService, messageSave} = this.state;
      
        console.log(userCurrent)
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
                                    <th></th>
                                    <th>F. Afiliación</th>
                                    <th>Nombres y apellidos</th>
                                    <th>Documento</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Estado</th>
                                    <th>Nivel Patrocinio</th>
                                    <th>Suscripcion</th>
                                    <th>Estado</th>
                                    <th>Próxima cuota</th>
                                    <th>Fecha</th>
                                    <th>Monto cuota</th>
                                    <th>Not. de Pago</th>
                                    <th>Not. bienvenida</th>
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
                                                    <td>
                                                        <Form.Control as="select"
                                                            defaultValue={'DEFAULT'}
                                                            onChange={e => {this.getSuscription(e,item, idx)}}>
                                                            <option value="DEFAULT" disabled>Seleccione</option>
                                                            {item.suscriptions.map((itemSus, ind) => {
                                                                return (<option value={itemSus.id}>{itemSus.package.name}</option>)
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
                                                        <td>{item.currentSuscription.statusName}</td>
                                                    }
                                                    {item.currentSuscription !== undefined && 
                                                         <td>{item.currentSuscription.descriptionPendingFee}</td>
                                                    }
                                                    {item.currentSuscription !== undefined &&
                                                         <td>{Validation.convertDateToString(item.currentSuscription.datePendingFee)}</td>
                                                    }
                                                    {/* {item.currentSuscription !== undefined && item.currentSuscription.lastDatePaidFee === null &&
                                                         <td></td>
                                                    } */}
                                                    {item.currentSuscription !== undefined && 
                                                         <td>USD {item.currentSuscription.pendingFee}</td>
                                                    }
                                                   {item.currentSuscription === undefined && 
                                                        <td colSpan={4}></td>
                                                   }
                                                   {/* { item.state === 1 &&
                                                        <td> 
                                                        <Button variant="secondary" size="sm" onClick={(e) => {this.sendWelcome(e, item)}}>Bienvenido</Button>
                                                        </td>
                                                   } */}
                                                   {/* { item.state !== 1 &&
                                                        <td> 
                                                       </td>
                                                   } */}
                                                   {(item.suscriptions.length > 0)?
                                                        this.getOptions(item, idx)
                                                        :<td colSpan={3}>
                                                            <Form.Label>No hay suscripciones.</Form.Label>
                                                        </td>
                                                    }
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

            <Modal show={showModalEdit} 
                onHide={this.handleCloseEdit}>
                <Modal.Header closeButton>
                <Modal.Title>Editar usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingSaveUSer && <div style={{textAlign: 'center'}}>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p><Form.Label>Guardando información</Form.Label></p>
                    </div>}
                    {!loadingSaveUSer && userCurrent !== undefined && 
                        <div>
                            <Row>
                                <Col sm={6}>
                                    <Form.Group>
                                        <Form.Label>Nombres *</Form.Label>
                                        <Form.Control required type="text" placeholder="Nombres"
                                            defaultValue={userCurrent.name}
                                            onChange={e => this.handleChange(e, "name")} />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group>
                                        <Form.Label>Apellidos *</Form.Label>
                                        <Form.Control required type="text" placeholder="Apellidos"
                                            defaultValue={userCurrent.lastName}
                                            onChange={e => this.handleChange(e, "lastname")} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label>Nro. de documento *</Form.Label>
                                <Form.Control required type="text" placeholder="Nro. documento"
                                    defaultValue={userCurrent.nroDocument}
                                    onChange={e => this.handleChange(e, "nroDocument")}
                                    onBlur={e => this.onBlurDocument(e, "nroDocument", "messageDoc")}></Form.Control>
                                <Form.Text className="textAlert">{this.state.messageDoc}</Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Correo electrónico *</Form.Label>
                                <Form.Control required type="email" placeholder="Correo electrónico" 
                                            defaultValue={userCurrent.email}
                                            onChange={e => this.handleChange(e, "email")}
                                            onBlur={e => this.onBlurEmail(e, "email", "messageEmail")}></Form.Control>
                                <Form.Text className="textAlert">{this.state.messageEmail}</Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nro. Celular *</Form.Label>
                                <Form.Control id="txtphone" required type="text" placeholder="Nro. celular"
                                            defaultValue={userCurrent.nroTelf}
                                            onChange={e => this.handleChange(e, "nroTelf")}></Form.Control>
                                
                            </Form.Group>
                     
                        </div>
                    }
                    {!loadingSaveUSer && saveService && 
                        <div style={{textAlign: 'center'}}>
                            <Form.Label className="alert">{messageSave}</Form.Label>
                            
                        </div>}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={(e) => this.handleCloseEdit(e)}>
                    Cerrar
                </Button>
                {!loadingSaveUSer && !saveService && 
                    <Button variant="primary" size="sm" onClick={(e) => this.saveUser(e)}>
                        Guardar
                    </Button>
                }
                </Modal.Footer>
            </Modal>

            {/* Modal send alert */}
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
                    Cerrar
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