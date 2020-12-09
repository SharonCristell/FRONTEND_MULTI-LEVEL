import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import { Form, Row, Col, Image, Button, Table, BreadcrumbItem } from 'react-bootstrap';
import { RiDeleteBinLine } from 'react-icons/ri';

import logoBcp from '../../images/bcp-logo.jpg';
import { type } from 'jquery';

export default class PayVoucher extends Component {
    constructor(props){
        super(props);
        this.state = {
            type:0,
            code: '',
            titular:'',
            comission:0,
            name:'',
            voucherbase: '',
            mount: this.props.total,
            total: 0,
            typeExchange: 1,
            typeExchangeDes: "Dólares",
            exchange: props.exchange,
            pictures: [] ,
            vouchersTable: [
                { 
                    comision: 0,
                    comisionExchange: 0,
                    type: "0",
                    typeDescription: "",
                    code: '',
                    titular: '',
                    voucherBase: '',
                    imageRaw: {},
                    name: '',
                    bank:'BCP'
                }
            ],
            bank:'BCP',
            idBank :1,
            typePays: [],
            typeDolars: [],
            typeSoles: []
        }
        
    }
    componentDidMount() {
        if(this.props.typeBank != undefined){
            let types = this.props.typeBank;
            types.forEach((item, idx) => {
                if(item.idTipoPago === this.state.idBank){
                    this.setState({
                        typePays: this.state.typePays= item.subTipoPagos
                    });

                    // create idsDolars and Soles
                    let idSoles = [];
                    let idDolars = [];
                    item.subTipoPagos.forEach((item) => {
                        if(item.statusDolares === 1) {
                            idDolars.push(item.idSubTipoPago)
                        }
                        if(item.statusSoles === 1) {
                            idSoles.push(item.idSubTipoPago);
                        }
                    });
                    this.setState({
                        typeDolars: this.state.typeDolars = idDolars,
                        typeSoles: this.state.typeSoles = idSoles
                    });

                }

                
            });
        }
    }

    validation(item) {
        if(Number(item.type) <= 0) {
            alert("Seleccione un tipo de operación.");
            return false;
        }
        if(item.code.length <= 0) {
            alert("Ingrese el código de operación.");
            return false;
        }  
        if(item.voucherBase.length  <= 0) {
            alert("Seleccione una imagen.");
            return false;
        }

        return true;
    }

    onSave = (e) => {
        // Verify 
        let vouchers = this.state.vouchersTable;
        let i = 0;
        let flag = true;
        for(i = 0; i < vouchers.length; i ++)
        {
           // Validate each voucher
           vouchers[i].typeExchange = this.state.typeExchange;
           vouchers[i].typeExchangeDes  = this.state.typeExchangeDes;
           if(!this.validation(vouchers[i])) {
               flag = false;
               break;
           }

        }
        if(flag){
            this.props.addVoucher(vouchers)
            this.props.close();
        }
    }

    handleItem = (e, field, id) => {
        // //console.log(e.target.value);
        let vouchers = this.state.vouchersTable;
        let i = 0;
        for(i = 0; i < vouchers.length; i ++)
        {
            if(i === id){
                vouchers[i][field] = e.target.value
            }
        }
        this.setState({
            vouchersTable: this.state.vouchersTable = vouchers
        });
        
    };

    // Handle exchange
    handleExchange = (e) => {
        let value = Number(e.target.value);
        // 1 -> dolar
        // 2 -> soles
        if(value === 1) {
            this.setState({
                typeExchange: this.state.typeExchange = 1,
                typeExchangeDes: "Dólares"
            });
        } else if(value === 2) {
            this.setState({
                typeExchange: this.state.typeExchange = 2,
                typeExchangeDes: "Soles"
            });
        }

        //Verify tupe operation
        let isnotAllow = false;
        let vouchers = this.state.vouchersTable;
        let idSoles = this.state.typeSoles;
        let idDolares = this.state.typeDolars;
        
        for(let i = 0; i < vouchers.length; i ++)
        {
            //verfy is selected type operation is allowed
            if(Number(vouchers[i].type) > 0){
                if(value === 1 &&  idDolares.includes(Number(vouchers[i].type))) {
                    continue;
                } else if(value === 2 &&  idSoles.includes(Number(vouchers[i].type))) {
                    continue;
                } else {
                    isnotAllow = true;
                    vouchers[i].type = 0;
                    vouchers[i].comision = 0;
                    vouchers[i].comisionExchange = 0;
                }
            }
        }
        this.setState({
            vouchersTable: this.state.vouchersTable = vouchers
        });

        if(isnotAllow) {
            alert("Verifique el tipo de operación de cada registro.")
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
                let vouchers = this.state.vouchersTable;
                let i = 0;
                for(i = 0; i < vouchers.length; i ++)
                {
                    if(i === id){
                        vouchers[i].voucherBase = result;
                        vouchers[i].name = image.name;
                        vouchers[i].imageRaw = image;
                    }
                }
                this.setState({
                    vouchersTable: this.state.vouchersTable = vouchers
                });

            });

        } else {
            let vouchers = this.state.vouchersTable;
            let i = 0;
            for(i = 0; i < vouchers.length; i ++)
            {
                if(i === id){
                    vouchers[i].voucherBase = '';
                    vouchers[i].name = ''
                    vouchers[i].imageRaw = {}
                }
            }
            this.setState({
                vouchersTable: this.state.vouchersTable = vouchers
            });
        }
        
    }
    
    // handle selected type operation 
    handleSelect = (e,  id) => {
        //console.log(e.target);
        let textDescription = e.target.options[e.target.selectedIndex].text;

        let vouchers = this.state.vouchersTable;
        let i = 0;
        for(i = 0; i < vouchers.length; i ++)
        {
            if(i === id){
                // Verfidy is selected item is avaible accorgin type chage
                //typeExchange == 1 -> dolar
                let typeOper = undefined;
                this.state.typePays.forEach((item) => {
                    if(item.idSubTipoPago === Number(e.target.value)){
                        typeOper = item;
                        // vouchers[i].comision = item.dolares;
                        // vouchers[i].comisionExchange = item.soles;
                    }
                });

                if(typeOper !== undefined) {
                    if(this.state.typeExchange === 1 && typeOper.statusDolares === 1){ 
                        // Dolares
                        // console.log(typeOper)
                        vouchers[i].comision = typeOper.dolares;
                        vouchers[i].comisionExchange = typeOper.soles;
                        vouchers[i].type = e.target.value;
                        vouchers[i].typeDescription = textDescription;

                    } else if(this.state.typeExchange === 2 && typeOper.statusSoles === 1){ 
                        // soles
                        // Dolares
                        // console.log(typeOper)
                        vouchers[i].comision = typeOper.dolares;
                        vouchers[i].comisionExchange = typeOper.soles;
                        vouchers[i].type = e.target.value;
                        vouchers[i].typeDescription = textDescription;
                    } else {
                        vouchers[i].type = 0;
                        vouchers[i].comision = 0;
                        vouchers[i].comisionExchange = 0;
                        alert(textDescription + ", no está permitido para este tipo de moneda. Seleccione otro tipo de operación.")
                    }
                   
                } else { 

                }
               
                break;
            }
        }
        this.setState({
            vouchersTable: this.state.vouchersTable = vouchers
        });
    }

    addRegister = () => {
        let register = {
            comision: 0,
            comisionExchange: 0,
            type: 0,
            typeDescription: '',
            code: '',
            titular: '',
            voucherBase: '',
            name: '',
            bank: 'BCP'
        };
        let list = this.state.vouchersTable;
        list.push(register);
        this.setState({
            vouchersTable: this.state.vouchersTable = list
        });
    }

    deleteVoucher = (idx) => () => {
        const vouchersTable = [...this.state.vouchersTable]
        vouchersTable.splice(idx, 1)
        this.setState({ vouchersTable })
    }

    roundCalculate = (value) => {
        let round = Math.round((value + Number.EPSILON) * 100)/100;
        return round;
    }

    render() {

        const { vouchersTable, typePays, typeExchange } = this.state; 
        const fontSize = this.props.fontSize;
        return(
            <div>
                <Row>
                    <Col sm={12}>
                        <Form.Label><b>Valle Encantado SAC</b></Form.Label>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <Form.Label><b>Cuenta Corriente en soles: </b></Form.Label>
                        <br></br>
                        <Form.Label>191-2606708-0-82</Form.Label>
                        <br></br>
                        <Form.Label><b>Código de Cuenta Interbancario(CCI): </b></Form.Label>
                        <br></br>
                        <Form.Label>00219100260670808255</Form.Label>
                    </Col>
                    <Col sm={6}>
                    <Form.Label><b>Cuenta Corriente en dólares: </b></Form.Label>
                        <br></br>
                        <Form.Label>191-2616687-1-90</Form.Label>
                        <br></br>
                        <Form.Label><b>Código de Cuenta Interbancario(CCI): </b></Form.Label>
                        <br></br>
                        <Form.Label>00219100261668719050</Form.Label>
                    </Col>
                </Row>
                {/* <Row>
                    <Col sm={4}>
                        <Form.Label><b>Cuenta Bancaria en dólares: </b></Form.Label>
                        <br></br>
                        <Form.Label>191-2616687-1-90</Form.Label>
                    </Col>
                    <Col sm={4}>
                        <Form.Label><b>Cuenta interbancaria en dólares:</b></Form.Label>
                        <br></br>
                        <Form.Label>00219100261668719050</Form.Label>
                    </Col>
                </Row> */}
                <Row>
                    <Col sm={12}>
                        <Form.Label className="textAlert">* Los pagos a través de este medio tienen una COMISIÓN de acuerdo al tipo de operación.</Form.Label>
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col sm={8}>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={2}>
                            <b>Moneda:</b>
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control as="select" 
                                        defaultValue={'1'} style={{fontSize: fontSize}}
                                        onChange={e => this.handleExchange(e)}>
                                            {/* <option value="0" disabled>Seleccione</option> */}
                                            <option value="1" >Dólares</option>
                                            <option value="2" >Soles</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        
                    </Col>
                    
                </Row>
                <Row>
                    <Col sm={4} style={{display: (typeExchange === 2)? 'inline':'none'}}>
                        <Form.Label><b>Tipo de Cambio:</b> {this.state.exchange}</Form.Label>
                    </Col>
                    <Col sm={4}>
                        <Form.Label ><b>Monto $:</b> {this.state.mount}</Form.Label>
                    </Col>
                    <Col sm={4} style={{display: (typeExchange === 2)? 'inline':'none'}}>
                        <Form.Label><b>Monto S/ :</b> {this.roundCalculate(this.state.mount*this.state.exchange)}</Form.Label>
                    </Col>
                </Row>
                
                <hr></hr>
                <Row>
                    <Col sm={12}>
                        <div className="main" style={{fontSize: 12, color:'green'}}>
                            (*) Después de agregar los comprobantes de pago no olvide REGISTRAR el formulario.
                        </div>
                    </Col>
                </Row>
                   <Row>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Tipo de operación</th>
                                    <th>Comisión</th>
                                    <th>(*)Código de operación</th>
                                    <th>Titular</th>
                                    <th>Imagen</th>
                                    <th style={{textAlign: 'center'}}> <Button size="sm" variant="dark" onClick={(e) => {this.addRegister()}}>+</Button></th>
                                </tr>
                            </thead>
                            <tbody>
                                {vouchersTable.map((item, idx) => (
                                    <tr key={idx}>
                                                <td>
                                                    <Form.Control as="select" 
                                                        defaultValue="0"
                                                        value={Number(item.type)} 
                                                        style={{fontSize: fontSize}}
                                                        onChange={e => this.handleSelect(e, idx)}>
                                                        <option value="0" disabled>Operación</option>
                                                        {typePays.map((item, id) => (
                                                            <option key={id} value={item.idSubTipoPago}>{item.descripcion}</option>
                                                        ))}
                                                    </Form.Control>
                                                </td>
                                                <td style={{verticalAlign: 'middle'}}>
                                                    {(typeExchange === 2)? "S/ "  + item.comisionExchange: "$ " +  item.comision}</td>
                                                <td><Form.Control 
                                                        value={item.code}
                                                        onChange={e => this.handleItem(e, 'code', idx)}
                                                        style={{fontSize: fontSize}}></Form.Control></td>
                                                <td><Form.Control 
                                                        value={item.titular}
                                                        onChange={e => this.handleItem(e, 'titular', idx)}
                                                        style={{fontSize: fontSize}}></Form.Control></td>
                                                <td style={{verticalAlign: 'middle'}}>
                                                    {/* {item.name.length > 0 &&
                                                    <input type="file"
                                                        value={item.imageRaw}
                                                        accept="image/png, image/jpeg"
                                                        onChange={e => this.onFileChange(e, idx)}/>
                                                    }
                                                    {item.name.length == 0 && */}
                                                    <input type="file"
                                                        accept="image/png, image/jpeg"
                                                        onChange={e => this.onFileChange(e, idx)}/>
                                                    {/* } */}
                                                </td>
                                                <td style={{fontSize: 15}}
                                                    onClick={this.deleteVoucher(idx)}>
                                                    <RiDeleteBinLine ></RiDeleteBinLine></td>
                                            </tr>
                                    ))
                                }                            
                            </tbody>
                        </Table>
                   </Row>
                   
                   <Row className="row justify-content-between">
                        <Col ms={4}>
                            <Button variant="secondary" size="sm" onClick={this.props.close}>
                                Cancelar
                            </Button>
                           
                        </Col>
                        <Col  style={{textAlign: 'right'}}>
                             <Button variant="primary" size="sm" onClick={this.onSave}>
                                Agregar 
                            </Button>
                        </Col>
                    </Row>
            </div>



        );
    }   
}