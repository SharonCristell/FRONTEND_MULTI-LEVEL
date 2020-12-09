import React, { Component } from "react";
import { Form, Table, Button, Modal, Row, Col, Spinner } from 'react-bootstrap';

import CSVReader from 'react-csv-reader'
import UserService from '../../services/user.service';

export default class ValidadorView extends Component{

    constructor(props){
        super(props);
        this.state = {
            registers: [],
            loading: false,
            noData: false,
            noDataMessage: "",
            nameFile: ''
            
        }
    }

    handleChange = (e, field) => {
        let value = e.target.value;
        this.setState({
            [field]: this.state[field] = value
        });
    };

    loadCSV = (data, fileInfo) => {
       
        let registers = [];
        let flag = false;
        for (let i = 0; i < data.length;  i++) {
            let array = data[i]; // each list have 24 register convert to obje
            let register = {};
            
            if(array.length  === 11){
                
                if(flag) {
                    register.fecha = array[0];
                    register.fechaDeOperacion = array[0];
                    register.fechaDeOperacion = array[1];
                    register.detalle = array[2];
                    register.monto = array[3].replace(",", "");
                    register.saldo = array[4].replace(",", "");
                    register.sucursal = array[5];
                    register.nroOperacion = array[6];
                    register.opHora = array[7];
                    register.usuario = array[8];
                    register.utc = array[9];
                    register.ref = array[10];
    
                 
                    registers.push(register);
                } else {
                    // change flag  fins firt field and ignore
                    let field = array[0].toUpperCase()

                    flag = field.includes("FECHA");
                }
               
            }
        }
       
        this.setState({
            registers: this.state.registers = registers,
            nameFile: fileInfo.name
        });
    }

    save = async(e) => {

        // Verify the name of file
        if(this.state.nameFile.length > 0) {
            if(this.state.registers.length > 0) {
                let data = {
                    nameoffile: "test"
                }
                let registers = [];
        
                for(let i = 0 ; i < this.state.registers.length ; i++) {
                    let temp = {
                        fecha:  this.state.registers[i].fecha,
                        fechaDeproceso:  this.state.registers[i].fecha,
                        nroOperacion:  this.state.registers[i].nroOperacion,
                        detalle:  this.state.registers[i].detalle,
                        monto:  Number(this.state.registers[i].monto)
                    }
                    registers.push(temp);
                }
        
                data.operationfrombank = registers;
                let response = await UserService.saveOperation(data);
                if(response !== undefined) {
                    if(response.status === 1){
                        alert('save');
                       
                    } else {
                        alert("Ocurrió un error al momento de guardar..");
                    }
                } else {
                    alert('Tuvimos un problema. Inténtalo más tarde.');
                }
            } else {
                alert('No hay registros a guardar.');
            }
            
        } else {
            alert('Ingrese nombre de archivo.');
        }
        
       
    }


    render() {

        const { loading, registers, noData, noDataMessage, nameFile } =  this.state;
        

        return(
            <div  className="home-container" style={{textAlign: 'left'}}>
                <Row>
                    <Col sm={4}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Ingrese nombre de archivo</Form.Label>
                            <Form.Control type="text" 
                                        placeholder="Ingrese nombre de archivo" 
                                        value={nameFile}
                                        onChange={e => this.handleChange(e, "nameFile")}/>
                        </Form.Group>
                    </Col>
                    <Col sm={4}>
                        <Form.Label>Seleccione documento(.csv)</Form.Label>
                        {/* <Button size="sm" variant="dark" 
                            onClick={(e) => {this.loadCsv()}}>Cargar csv</Button> */}
                        <CSVReader onFileLoaded={(data, fileInfo) => this.loadCSV(data, fileInfo)} />
    
                    </Col>
                </Row>
              
                <Row>
                    <Col sm={12}>
                        <Table >
                    <thead className="table-headsch">
                        <tr>
                            <th></th>
                            <th>Fecha</th>
                            <th>Fecha valuta</th>
                            <th>Descripción operación</th>
                            <th>Monto</th>
                            <th>Saldo</th>
                            <th>Sucursal - agencia</th>
                            <th>Operación - Número</th>	
                            <th>Operación - Hora</th>	
                            <th>Usuario</th>	
                            <th>UTC</th>
                            <th>Referencia2</th>
                        </tr>
                    </thead>
                    <tbody >
                        {!loading && !noData && 
                            registers.map((item, idx) => {
                                return(
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <th>{item.fecha}</th>
                                    <td>{item.fechaval}</td>
                                    <td>{item.detalle}</td>
                                    <td>{item.monto}</td>
                                    <td>{item.saldo}</td>
                                    <td>{item.sucursal}</td>
                                    <td>{item.nroOperacion}</td>	
                                    <td>{item.opHora}</td>	
                                    <td>{item.usuario}</td>	
                                    <td>{item.utc}</td>
                                    <td>{item.ref}</td>
                                </tr>
                                )
                            })
                        }
                    </tbody>
                    {loading && 
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <Spinner animation="border" variant="dark"></Spinner>
                                    <p>Cargando registros...</p>
                                </div>
                            </Col>
                        </Row>
                    }
                    {!loading && noData && 
                        <Row>
                            <Col sm={12}>
                                <Form.Label>{noDataMessage}</Form.Label>
                            </Col>
                        </Row>
                    }
                </Table>
                </Col>
                </Row>
                <Row>
                    <Col sm={12} style={{textAlign: 'right'}}>
                        <Button onClick={e => this.save(e)}>Guardar</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}