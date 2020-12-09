import React, { Component } from 'react';
import { Form , Row, Col, Button, Spinner, Table, Modal } from 'react-bootstrap'

import Validation from '../../utils/Validation';
import WalletService from '../../../services/wallet.service';

export default class Transfer extends Component{

    constructor(props){
        super(props);
        this.state = {
            history : [],
            emptyList: true,
            message: "No hay registros para mostrar.",
            loading: false,
            messageMount: "",
            mount: "",
            base64Image: "",
            name: "",
            imageRaw: "",
            loadSenData : false
        }
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            //console.log('Error: ', error);
        };
    }

    // Handle table voucher
    onFileChange = (event, id) => {
        //console.log(event.target.files[0]);
        let image = event.target.files[0];
        let voucher = '';
        if(image !== undefined) {
            this.getBase64(image, (result) => {
                
                let base64Image = result;
                let name = image.name;
                let imageRaw = image;
                
                this.setState({
                    base64Image  : this.state.base64Image = base64Image,
                    name    : this.state.name = name,
                    imageRaw: this.state.imageRaw = imageRaw,
                });

            });

        } else {
            this.setState({
                base64Image  : this.state.base64Image = "",
                name    : this.state.name = "",
                imageRaw: this.state.imageRaw = "",
            });
        }
        
    }

    handleChange = (e, field) => {
        let value = e.target.value;
        this.setState({
            [field]: this.state[field] = value
        });
    }

    validate = () => {
        if(Number(this.state.mount) <= 0) {
            alert("Ingrese un monto válido.")
            return false;
        }
        if(this.state.base64Image.length <= 0) {
            alert("Seleccione una imagen.")
            return false;
        }

        return true;
    }
    // Register tranfers
    registerTransfer = (e) => {
        if(this.validate()) {
            this.setState({
                loadSenData: this.state.loadSenData = true
            });
            let data = {};
            let response = WalletService.registerTransfer(data);
            if(response !== undefined) {
                this.setState({
                    loadSenData: this.state.loadSenData = false
                });
                if(response.status === 1) {
                     // add to history list
                    let tempList = [response.objModel];
                    tempList = tempList.concat(this.state.history);
                    this.setState({
                        history: this.state.history = tempList,
                        mount: this.state.mount = "",
                        base64Image: this.state.base64Image = "",
                    });                 

                } else {
                    alert("Ocurrió un error al momento de registrar su transferencia.");
                }

            } else {
                this.setState({
                    loadSenData: this.state.loadSenData = false
                });
                alert('Tuvimos un problema. Inténtalo más tarde.');
            }
        }
    }
    render() {

        const { loading, message, history, emptyList, messageMount, loadSenData} = this.state;
        return(
            <div style={{padding: 30}}>

                <Form.Label className="content-subtitle">Solicitar transferencia</Form.Label>
                <div className="search">
                    <Row>
                        <Col sm={4}>
                            <Form inline>
                            <Form.Label> Monto:</Form.Label>
                            <Form.Control
                                className="mb-2 ml-sm-4"
                                type="number"
                                placeholder="Ingrese monto"
                                min={0}
                                onChange={e=>{this.handleChange(e, 'mount')}}
                            />
                            </Form>
                            <Form.Label className="textAler">{messageMount}</Form.Label>
                        </Col>
                        <Col sm={4}>
                            <input type="file"
                                accept="image/png, image/jpeg"
                                onChange={e => this.onFileChange(e)}
                                style={{paddingTop: 4}}/>
                        </Col>
                        <Col sm={4} style={{textAlign: 'right'}}>
                            <Button variant="secondary"
                                    onClick={e => {this.registerTransfer(e)}}>Solicitar</Button>
                        </Col>
                    </Row>
                </div>
                
                <Row>
                    <Col sm={12}>
                        <Form.Label className="content-subtitle" >Historial de solicitudes</Form.Label>
                    </Col>
                </Row>
                { loading && 
                    <div>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p><Form.Label>Cargando información de socios.</Form.Label></p>
                    </div>
                }
                {   emptyList && !loading && 
                    <Form.Label>{message}</Form.Label>
                }
                {  !emptyList && 
                <div>
                    <Row>
                        <Col sm={12}>
                            <Table responsive>
                                <thead className="table-head">
                                    <tr>
                                        <th>Nº </th>
                                        <th>Fecha</th>
                                        <th colSpan={2}>Operación</th>
                                        <th>Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { history.map(function(item, idx) {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{idx}</td>
                                                        <td>{Validation.convertDateToString(item.createDate)}</td>
                                                        <td colSpan={2}>{item.operation}</td>
                                                        <td>{item.mount}</td>
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
                {/* loading */}
                <Modal
                    show={loadSenData}
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="static"
                    centered>
                    <Modal.Body>
                        <div style={{textAlign: 'center'}}>
                            <Spinner size="sm" animation="border" variant="dark">
                            </Spinner>
                            <Form.Label>&nbsp; Guardando información...</Form.Label>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}