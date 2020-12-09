// https://codepen.io/pghiran/pen/XMoEmY 
import React, { Component } from 'react';
import { Form, Row, Button, Modal, Table, Spinner, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaRegImages } from 'react-icons/fa';
import { GrDocumentPdf } from 'react-icons/gr'

import NoImage from '../../images/noimage.jpg'

import Validation from '../utils/Validation';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import '../../views/styles/ModalCustom.css';

// // Production
// const url = 'https://inclub.world/register-quote';


// Test
const url = 'https://inresorttest.web.app/register-quote'

export default class MyPayment extends Component {
    constructor(props){
        super(props);
        this.state = {
            suscription: [],
            schedule: [],
            loadSuscription: true,
            noData: false,
            message: "",
            showModal: false,
            showImagesItem: false,
            collectionImage: [],
            itemCurrentQuote: undefined,
            showModalQuote: false,
            stateUser: "",
            totalActivos: 0,
            totalResidual: 0,
        }
        
        this.toggleGallery = this.toggleGallery.bind(this);
        this.getSuscription = this.getSuscription.bind(this);
        
    }

    componentDidMount(){
        this.getSuscription();

       
    }

    toggleGallery() {
        this.setState(prevState => ({
          galleryOpened: !prevState.galleryOpened
        }));
      }

    async getSuscription () {
        // //console.log("my pay");
        let suscriptions = await UserService.getSuscriptionv2();
        if(suscriptions !== undefined && suscriptions !== null){
            if(suscriptions.status !== 1) {
                // console.log(suscriptions);
                this.setState({
                    suscription: this.state.suscription = [],
                    loadSuscription: this.state.loadSuscription = false,
                    noData: this.state.noData = true,
                    message: this.state.message = "Ocurrió un error mientras consultábamos su información."
                });
            } else {
              
                if(suscriptions.objModel !== undefined){
                    this.setState({
                        stateUser: this.state.stateUser = suscriptions.objModel.stateNameUsuario,
                        totalActivos: this.state.totalActivos = suscriptions.objModel.totalScoreActivoCompuesto,
                        totalResidual: this.state.totalResidual = suscriptions.objModel.totalScoreActivoResidual
                    });
                    if(suscriptions.objModel.suscriptions.length > 0){

                        // Sum suscription points residual only quotes and compuesto all registers active
                        // let total = suscriptions.objModel.reduce(function(total, item) { 
                        //     return (item.package.estatus === 1) ? total + item.package.volume: total ;
                        //   },0);

                        this.setState({
                            suscription: this.state.suscription = suscriptions.objModel.suscriptions,
                            loadSuscription: this.state.loadSuscription = false,
                            noData: this.state.noData = false,
                            message: this.state.message = ""
                        });
                    }
                } else {
                    this.setState({
                        suscription: this.state.suscription = [],
                        loadSuscription: this.state.loadSuscription = false,
                        noData: this.state.noData = true,
                        message: this.state.message = "No hay registros para mostrar."
                    });
                }
                
            }
        } else {
            this.setState({
                suscription: this.state.suscription = [],
                loadSuscription: this.state.loadSuscription = false,
                noData: this.state.noData = true,
                message: this.state.message = "Ocurrió un error. Intételo más tarde."
            });
        }
        

    }

   
    
     // Handle modal 
     getSchedule = async(e, idSuscription) => {
        e.preventDefault();

        let schedule = await  UserService.getScheduleWithImages(idSuscription);

        if(schedule !== undefined && schedule !== null){
            // console.log(schedule)
            if(schedule.status === 1) {
                schedule.objModel.objModel.map((item) => {
                    item.idSuscription = idSuscription
                    item.idUser = Number(AuthService.getCurrentIdUser());
                    // let quote = item.quote/item.dollarExchange;
                    // item.quoteUsd = Math.round((quote + Number.EPSILON) * 100) / 100;
                    
                });
                // console.log(schedule.objModel.objModel)
                this.setState({
                    schedule : this.state.schedule = schedule.objModel.objModel,
                    showModal : true
                });
            } else {
                this.setState({
                    schedule : this.state.schedule = [],
                    showModal : false
                });
                alert("Tuvimos un error al obtener la información. Inténtelo más tarde.");
            }
        } else {
            this.setState({
                schedule : this.state.schedule = [],
                showModal : false
            });
            alert("Tuvimos un error al obtener la información. Inténtelo más tarde.")
        }
        
    }

    onShowImage = (e, item) => {
        
        this.setState({
            showImagesItem  : this.state.showImagesItem = true,
            collectionImage : this.state.collectionImage = item.objImagen
        });
    }

    backToDetail = (e) => {
        this.setState({
            showImagesItem  : this.state.showImagesItem = false,
            collectionImage : this.state.collectionImage = []
        });
    }

    handleClose = () => {
        this.setState({
            showModal : false,
            schedule : this.state.schedule = [],
            showImagesItem  : this.state.showImagesItem = false,
            collectionImage : this.state.collectionImage = []
        });
    }

    handleShow= () => {
        this.setState({
            showModal : true
        });
    }


    /**
     * Handle payment of quotes
     */
    payQuote = (e, itemQuote) => {
        // console.log(itemQuote)
        this.setState({
            itemCurrentQuote: this.state.itemCurrentQuote = itemQuote
        });
        // Save item quote
        localStorage.setItem("currentQuote", JSON.stringify(itemQuote));
        let a = window.open(url, '_blank');
        this.handleClose();

    }

    /**End modal to pay quote */
    render() {
        const { 
            suscription, 
            loadSuscription, 
            noData, message, 
            loadModal,
            collectionImage,
            showImagesItem,
            showModalQuote,
            itemCurrentQuote,
            totalActivos,
            totalResidual,
            stateUser } = this.state;
            // console.log(collectionImage[0])
       
        return(
            <div style={{padding:30}}>
                {loadSuscription && 
                    <div>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p><Form.Label>Cargando información...</Form.Label></p>
                    </div>
                }
                {!loadSuscription && 
                    <div className="card-wallet" >
                        {/* <p className="title-wallet">Puntaje total por rama: 0.00</p> */}
                        <Row style={{marginTop: 16}}>
                            <Col sm={4}><p className="label-title">Status:{stateUser}</p></Col>
                        {/* </Row>
                        <Row> */}
                            <Col sm={4}><p className="label-title"> Puntaje Activo Compuesto: {totalActivos}</p></Col>
                        {/* </Row>
                        <Row> */}
                            <Col sm={4}><p className="label-title" > Puntaje Activo Residual: {totalResidual}</p></Col>
                        </Row>
                    </div>
                              
                }
                {!loadSuscription && !noData && <div className="box-container-wrap">
                {suscription.map((item, id) => {

                        // 0 inactivo
                        // 1 activo
                        // 2 pendiente
                        // 3 rechazado
                        // 4 enviar después
                        // 5 deuda1
                        // 6 deuda2
                        // 7 deuda3
                        // 8 deuda4
                        // 9 congelamiento
                        let classCard = "card-suscription-default";
                        if(item.status === 1) {
                            classCard = "card-suscription"
                        } else if(item.status === 0 || item.status === 9) {
                            classCard = "card-suscription-inactive"
                        } else if(item.status >= 5 && item.status <= 8){
                            classCard = "card-suscription-overdue";
                        }
                   
                    return (<div className={classCard} 
                        key={id} onClick={e => this.getSchedule(e, item.id)}>
                        
                        {item.status === 1 &&
                            <div className="card-header-suscription">{item.statusName}</div>
                        }
                        {(item.status === 0 || item.status === 9) && 
                            <div className="card-header-suscription-inactive">{item.statusName}</div>
                        }
                        {item.status >= 5 && item.status <= 8 && 
                            <div className="card-header-suscription-overdue">{item.statusName}</div>
                        
                        }
                        {item.status >= 2 && item.status <= 4 &&
                            <div className="card-header-suscription-default">{item.statusName}</div>
                        }
                        
                        <div className="card-main-suscription">
                            <p className="content-title">{item.package.name}</p>
                            <div className="main-suscription"><b>Descripción de pago:</b> {item.quotaDescription}</div>
                            <div className="main-suscription"><b>Puntaje:</b> {item.package.volume}</div>
                            <div className="main-suscription"><b>Fecha de adquisición:</b>  {Validation.convertDateToString(item.creationDate)}</div>
                        </div>
                    </div>)
                })}
                </div>}
                {noData && 
                    <div>
                        <Form.Label>{message}</Form.Label>
                    </div>
                }
                {/* Modal */}
                <Modal 
                    size="lg"
                    show={this.state.showModal} 
                    onHide={this.handleClose}
                    style={{fontSize:12}}
                    backdrop="static"
                    keyboard={false}
                   >
                    <Modal.Header closeButton>
                        <Modal.Title>Detalle de cronograma</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <Row>
                            <Col sm={3}><Button size="sm" variant="secondary" block>Amortizar</Button></Col>
                            <Col sm={3}><Button size="sm" variant="secondary" block>Adelanto de pago de cuotas</Button></Col>
                            <Col sm={3}><Button size="sm" variant="secondary" block>Congelamiento de Deuda</Button></Col>
                        </Row> */}
                        <br></br>
                        {!showImagesItem && <Row>
                            <Col>
                            <Table responsive>
                                <thead className="table-head">
                                    <tr>
                                        <th>Descripción</th>
                                        <th>Fecha de vencimiento</th>
                                        <th>Capital</th>
                                        <th>Amortización</th>
                                        <th>Ínteres</th>
                                        <th>Mora</th>
                                        {/* <th>Puntaje de Mora</th> */}
                                        <th>Cuota</th>
                                        <th>Fecha de Pago</th>
                                        <th>Estado</th>
                                        <th></th>
                                        <th>Observación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.schedule.map((item, idx) => {
                                            let amortization = item.amortization/item.dollarExchange;
                                            amortization = Math.round((amortization + Number.EPSILON) * 100) / 100

                                            let capitalBalance = item.capitalBalance/item.dollarExchange;
                                            capitalBalance = Math.round((capitalBalance + Number.EPSILON) * 100) / 100

                                           
                                            return (
                                                
                                                <tr key={idx}>
                                                    <td>{item.quoteDescription}</td>
                                                    <td>{Validation.convertDateToStringEx(item.nextExpiration)}</td>
                                                    <td>{capitalBalance} USD</td>
                                                    <td>{amortization} USD</td>
                                                    <td>{item.interested} USD</td> 
                                                    <td>-</td>
                                                    {/* <td>-</td> */}
                                                    {/* <td>{item.quoteUsd} USD</td> */}
                                                    <td>{item.quoteUsd} USD</td>
                                                    <td>{Validation.convertDateToStringEx(item.payDate)}</td>
                                                    <td>
                                                        {item.verif === 1 && 
                                                            ("Pagado")
                                                        }
                                                        {item.verif === 2 && 
                                                            ("Pendiente de validación")
                                                        }
                                                        {item.verif === 3 && 
                                                            ("Rechazado")
                                                        }
                                                        {item.verif === 4 && 
                                                            ("Pagar después")
                                                        }
                                                        {item.verif > 4 && item.verif < 1 && 
                                                            ("")
                                                        }
                                                    </td>
                                                    {/* Button  */}
                                                    <td style={{textAlign: 'center'}}>
                                                        {item.verif === 0 &&
                                                            <Button size="sm" variant="success" onClick={e => this.payQuote(e, item)}>Pagar</Button>
                                                        }
                                                        {item.verif === 3 &&
                                                            <Button size="sm" variant="success" onClick={e => this.payQuote(e, item)}>Pagar</Button>
                                                        }
                                                        {item.verif === 1 && item.objImagen.length === 1 &&!item.objImagen[0].ticketImage.includes('pdf') && 
                                                            // <FaRegImages 
                                                            //     onClick={e => {this.onShowImage(e, item)}}
                                                            //     size={16}></FaRegImages>
                                                            <img  src = {`data:image/jpeg;base64,${item.objImagen[0].imagenes}`} 
                                                                    width={50} style={{height: 'auto', width: 32}}
                                                                    onClick={e => {this.onShowImage(e, item)}}/>
                                                            // <img src={"https://www.hola.com/imagenes/estar-bien/20180925130054/consejos-para-cuidar-a-un-gatito-recien-nacido-cs/0-601-526/cuidardgatito-t.jpg"} style={{margin: 10, height: 'auto', height: auto, width: 80}}></img>
                                                        }
                                                        {item.verif === 2 && item.objImagen.length === 1 &&!item.objImagen[0].ticketImage.includes('pdf') && 
                                                            // <FaRegImages 
                                                            //     onClick={e => {this.onShowImage(e, item)}}
                                                            //     size={16}></FaRegImages>
                                                            <img  src = {`data:image/jpeg;base64,${item.objImagen[0].imagenes}`} 
                                                                    width={50} style={{height: 'auto', width: 32}}
                                                                    onClick={e => {this.onShowImage(e, item)}}/>
                                                            // <img src={"https://www.hola.com/imagenes/estar-bien/20180925130054/consejos-para-cuidar-a-un-gatito-recien-nacido-cs/0-601-526/cuidardgatito-t.jpg"} style={{margin: 10, height: 'auto', height: auto, width: 80}}></img>
                                                        }
                                                        {item.verif === 2 && item.objImagen.length > 0 && 
                                                            // <FaRegImages 
                                                            //     onClick={e => {this.onShowImage(e, item)}}
                                                            //     size={16}></FaRegImages>
                                                            <img  src = {`data:image/jpeg;base64,${item.objImagen[0].imagenes}`} 
                                                                    width={50} style={{height: 'auto', width: 32}}
                                                                    onClick={e => {this.onShowImage(e, item)}}/>
                                                            // <img src={"https://www.hola.com/imagenes/estar-bien/20180925130054/consejos-para-cuidar-a-un-gatito-recien-nacido-cs/0-601-526/cuidardgatito-t.jpg"} style={{margin: 10, height: 'auto', height: auto, width: 80}}></img>
                                                        }
                                                        {item.verif === 1 && item.objImagen.length === 1 && item.objImagen[0].ticketImage.includes('pdf') && 
                                                            <GrDocumentPdf size={24} onClick={e => {this.onShowImage(e, item)}}></GrDocumentPdf>
                                                            // <FaRegImages 
                                                            //     onClick={e => {this.onShowImage(e, item)}}
                                                            //     size={16}></FaRegImages>
                                                            // <img  src = {`data:image/jpeg;base64,${item.objImagen[0].imagenes}`} 
                                                            //         width={50} style={{height: 'auto', width: 32}}
                                                            //         onClick={e => {this.onShowImage(e, item)}}/>
                                                            // <img src={"https://www.hola.com/imagenes/estar-bien/20180925130054/consejos-para-cuidar-a-un-gatito-recien-nacido-cs/0-601-526/cuidardgatito-t.jpg"} style={{margin: 10, height: 'auto', height: auto, width: 80}}></img>
                                                        }
                                                        {item.verif === 1 && !item.ticketImage.includes('pdf') && item.objImagen.length > 1 &&
                                                            // <FaRegImages 
                                                            //     onClick={e => {this.onShowImage(e, item)}}
                                                            //     size={16}></FaRegImages>
                                                            <img  src = {`data:image/jpeg;base64,${item.objImagen[0].imagenes}`} 
                                                                    width={50} style={     {height: 'auto', width: 32}} 
                                                                    onClick={e => {this.onShowImage(e, item)}}/>
                                                        }
                                                        {/* {item.verif === 1 && item.ticketImage.includes('.pdf') && item.objImagen.length > 0 &&
                                                            <GrDocumentPdf size={32} onClick={e => {this.onShowImage(e, item)}}></GrDocumentPdf>
                                                        } */}
                                                    </td>
                                                    <td>{item.obs}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            </Col>
                        </Row>
                        }
                        {showImagesItem && 
                        <Form.Group>
                                <Row style={{textAlign: 'right'}}>
                                    <Col sm={12}>
                                        <Button variant="primary" 
                                            size="sm"
                                            onClick={e => {this.backToDetail(e)}}>Regresar</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <div className="box-container-wrap">
                                            { collectionImage.map((image, id) => {
                                                let src = "";
                                                // Verify length of base 64
                                                if(image.imagenes.length > 40) {
                                                    src = `data:image/jpeg;base64,${image.imagenes}`;
                                                } else {
                                                    src = NoImage;
                                                }
                                                return(
                                                    <div className="card-main-suscription">
                                                        <Form.Label><strong>Codigo:</strong> {image.nroOperacion}</Form.Label>
                                                        <img key={id} src={src} width={350} style={{margin: 10, height: 'auto'}}/>
                                                    </div>
                                                )
                                            }
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                        </Form.Group>
                        
                        }
                        
                    </Modal.Body>
                    <Modal.Footer>
                        {!showImagesItem && <Button variant="secondary" onClick={this.handleClose}>
                            Cerrar
                        </Button>}
                    </Modal.Footer>
                </Modal>
                
            </div>
        );
    }
}