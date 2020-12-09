import React, { Component, useState } from 'react';
import { Container, Row, Col, Button, Form, Table, Spinner, Accordion, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Validation from '../utils/Validation';
import UtilService from '../../services/utils.service';
import UserService from '../../services/user.service';

//import '../../views/styles/ModalCustom.css';

const selectionPackageKey = "U"; // upgrade

export default class PackageSelected extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showRegister: false,
            package: [],
            kitInit: [], // selected kit
            packages: [],
            checkList: [],
            packageFamily: [],
            familyInit: [],
            packageUpgrade: [],
            loading: true,
            noData: false,
            message: '',
            packageStatus:"",
            packageSelected: undefined,
            upgradeOptions: [], 
            suscription: [],
            schedule: [],
            loadSuscription: false,
        
        }

        this.getPackageFamily = this.getPackageFamily.bind(this);
        this.getSuscription = this.getSuscription.bind(this);
        this.getUpgradeSuscription = this.getUpgradeSuscription.bind(this);


    }
    componentDidMount() {
        this.getPackageFamily();
        this.getUpgradeSuscription();
        // this.getSuscription();
    }

    async getPackageFamily() {

        let data = await UtilService.getPackages();
        if(data !== undefined){
            if(data.length > 0){
                // Store packages in temp
                let temp = [];
                let i;
                for(i = 0; i < data.length ; i++) {
                    temp = temp.concat(data[i].packages);
                }
                // sepate kit package family and packages families
                // Get kit initial
                let packageFamily   = [];
                let familyInit      = [];
                let idInit          = 27;
                let x ;
                for(x = 0; x < data.length; x++){
                    if(data[x].id === idInit) {
                        data[x].packages.sort(function(a,b){ return a.price-b.price});
                        familyInit.push(data[x]);
                    } else {
                        data[x].packages.sort(function(a,b){ return a.price-b.price});
                        packageFamily.push(data[x]);
                    }
                }

                // Add 
                this.setState({
                    tempPackage: temp,
                    packageFamily: packageFamily,
                    familyInit: familyInit,
                    loading: false,
                    noData: false
                });

                // call this.getSuscription();
                this.getSuscription();
            } else {
                this.setState({
                    packageFamily: [],
                    familyInit: [],
                    loading: false,
                    noData: true,
                    message: "No hay registros para mostrar."
                });
            }
        } else {
            this.setState({
                packageFamily: [],
                familyInit: [],
                loading: false,
                noData: true,
                message: "Ocurrió un error al obtener los paquetes. Vuelva a intentarlo más tarde."
            });
        }
       

    }

    async getSuscription() {
        
        // Get currect suscription and remove fron list packageFamily 
        let suscriptions = await UserService.getSuscription();
        if (suscriptions !== undefined && suscriptions !== null) {
            if (suscriptions.status !== 1) {
                
                this.setState({
                    suscription: this.state.suscription = [],
                    loadSuscription: this.state.loadSuscription = true
                });
            } else {

                let susTemp = this.state.packageFamily;
                console.log(susTemp);
                console.log(suscriptions.objModel)
                this.setState({
                    suscription: this.state.suscription = suscriptions.objModel,
                    loadSuscription: this.state.loadSuscription = true
                });
            }
        }


    }

    async getUpgradeSuscription() {
        let response = await UserService.getUpgradePackages();
        console.log(response);
        if(response !== undefined && response.status === 1) {
            this.setState({
                packageUpgrade: this.state.packageUpgrade = response.objModel
            });
        } else {
            

            this.setState({
                packageUpgrade: this.state.packageUpgrade = []
            });

        }
    }


    handleSelection = (e, field) => {
        // console.log(e.target.id);
        var idField = Number(e.target.id); // id package
       

        // Only accept kit init o packages
        if(field === "packages") {
            var selectedPackage = {};
            let tempPackages = this.state.tempPackage;
            let i;
            for(i = 0; i < tempPackages.length; i++){
                if(tempPackages[i].id === idField){
                    selectedPackage = tempPackages[i];
                }
            }   
    
            this.setState({ selectedPackage: [selectedPackage] }, () => {
                if (this.props.onChange) {
                    this.props.onChange([selectedPackage], "packages");
                    this.props.onChange([], "kitInit");
                }
            })

        } else if(field === "kitInit") {
           
            var selectedPackage = {};
            let tempPackages = this.state.familyInit[0].packages;
            let i;
            for(i = 0; i < tempPackages.length; i++){
                if(tempPackages[i].id === idField){
                    selectedPackage = tempPackages[i];
                }
            }   
    
            this.setState({ kitInit: [selectedPackage] }, () => {
                if (this.props.onChange) {
                    this.props.onChange([selectedPackage], "kitInit");
                    this.props.onChange([], "packages");
                }
            })
        }
       
    };
    /**
     * Method to handle the change  of properties and send it to parent 
     * @param {*} e 
     * @param {*} field 
     */
    handleChange = (e, field) => {
        // console.log('step one');
        let value = e.target.value;
        if (this.props.onChange) {
            this.props.onChange(e.target.value, field);
            this.setState({
                [field]: this.state[field] = value,
                messageDoc: ""
            });
        }
        // })
    };

    /**
     * Method to handle the selected item  send it to parent 
     * @param {*} e 
     * @param {*} field 
     */

    handleSelectPackage = (e, field) => {
        // console.log(e.target.value, field);
        var value = Number(e.target.value);

        let idx = e.target.selectedIndex - 1; // idx of array in the combobox
        if( this.state.packageUpgrade.length > 0 &&  idx >= 0){
            
            let packageSelected = this.state.packageUpgrade[idx];
            let upgrapeOtions = [];
            let idFamily  = packageSelected.package.idFamilyPackage;
           
            for(let i = 0; i< this.state.packageFamily.length; i++){
                if(this.state.packageFamily[i].id === idFamily){
                    let temp = this.state.packageFamily[i].packages;
                    
                    for(let y = 0; y < temp.length ; y++){
                        if(temp[y].price > packageSelected.package.price){
                            upgrapeOtions.push(temp[y]);
                        }
                    }
                }
            }
            this.setState({
                packageSelected: this.state.packageSelected = packageSelected,
                upgradeOptions: this.state.upgradeOptions = upgrapeOtions
            });
            this.setState({ [field]: value }, () => {
                if (this.props.onChange) {
                    this.props.onChange(value, field);
                }
            });

        }
       
    };
    /**
     * Method to handle the change  of properties and send it to parent 
     * @param {*} e 
     * @param {*} field 
     */
    handleRadio = (e, field) => {
        // console.log(e.target.value);
        // if (this.props.onChange) {
        //     this.props.onChange(e.target.value, field);
        //   }
        var value = e.target.value;
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
            }
        })

        this.setState({
            packageSelected: this.state.packageSelected = undefined,
            upgradeOptions: this.state.upgradeOptions = [],
            kitInit: [], // selected kit
            packages: [],
        });

        if(this.props.onChange){
            this.props.onChange([], "kitInit");
            this.props.onChange([], "packages");
        }
        

        // if (value === selectionPackageKey) {
        //     this.setState({
        //         showRegister: this.state.showRegister = true
        //     }, () => {
        //         if (this.props.onChange) {
        //             this.props.onChange(true, 'show');
        //         }
        //     });
        // } else {
        //     this.setState({
        //         showRegister: this.state.showRegister = false,
        //     }, () => {
        //         if (this.props.onChange) {
        //             this.props.onChange(false, 'show');
        //         }
        //     });
        // }


    };

    render() {

        const { packageFamily, 
                loading, 
                noData,
                message, 
                suscription, 
                loadSuscription, 
                familyInit, 
                packageUpgrade,
                upgradeOptions
        } = this.state;

        console.log(packageFamily);
        console.log(packageUpgrade);
        return (
           <div>
               {loading &&
                        <div style={{ textAlign: 'center' }}>
                            <Spinner animation="border" role="status" size="sm" >
                                <span className="sr-only">Loading...</span>
                            </Spinner> <Form.Label>Cargando información de paquetes...</Form.Label>

                        </div>
                    }
                    {!loading && !noData &&
                        <div>
                            <Form.Label className="content-subtitle">¿Qué Deseas Hacer?</Form.Label>
                            <Row>
                                <Col sm={6}>
                                    <Form.Check inline label="Comprar Nuevo Paquete" type='radio' id={`inline-radio`} value="N"
                                        style={{marginTop: 2}}
                                        onChange={e => this.handleRadio(e, "packageStatus")}
                                        checked={this.state.packageStatus === "N"} />
                                </Col>

                                <Col sm={6}>
                                    <Form inline>
                                        <Form.Check label="Upgrade mi Membresía: " type='radio' id={`inline-radio2`} value="U"
                                        onChange={e => this.handleRadio(e, "packageStatus")}
                                        checked={this.state.packageStatus === "U"} />
                                           
                                    </Form>
                                    
                                </Col>
                                
                            </Row>
                            {this.state.packageStatus === "N" && 
                            <div> 
                                <Row>
                                    <Col sm={12}>
                                        <Form.Label  className="content-subtitle">Seleccione un paquete: </Form.Label>
                                    </Col>
                                </Row>
                                {/* Kit initial */}
                            <Row>
                                <Col sm={12}>
                                    <Accordion>
                                        {familyInit.map((item , i) => {
                                            return item.packages.length > 0?
                                            (<Card key={item.id}>
                                                <Card.Header>
                                                <Accordion.Toggle  as={Button} variant="link" eventKey={item.id} style={{color: '#142d47',fontWeight:'bold', fontSize: 14}}>
                                                KIT DE MANTENIMIENTO ANUAL
                                                </Accordion.Toggle> 
                                                </Card.Header>
                                                <Accordion.Collapse eventKey={item.id}>
                                                <Card.Body>
                                                    <Table  striped bordered hover responsive="md" size="sm">
                                                        <thead className="table-head">
                                                            <tr>
                                                                {/* <th></th>
                                                                {
                                                                    item.headers.map((header, id) => (
                                                                    <th>{header}</th>
                                                                    ))
                                                                } */}
                                                                <th></th>
                                                                <th>Nombre</th>
                                                                <th colSpan={3}>Descripción</th>
                                                                <th>Precio</th>
                                                                {/* <th>Duración</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                item.packages.map((itempck)  =>(
                                                                    <tr key={itempck.id}>
                                                                        <td>
                                                                            <Form.Check inline type='radio' 
                                                                                name="packages"
                                                                                id={itempck.id}
                                                                                onChange={e => this.handleSelection(e, 'kitInit')} 
                                                                                />
                                                                        </td>
                                                                        <td>{itempck.name}</td>
                                                                        <td colSpan={3}>{itempck.description}<br></br>
                                                                            Duración: {itempck.duration}
                                                                            {/* <ul>
                                                                                {
                                                                                    itempck.descriptions.map((label, idxLabel) => (
                                                                                    <li>{label}</li>
                                                                                    ))
                                                                                }
                                                                            </ul> */}
                                                                        </td>
                                                                        <td>$ {itempck.price}</td>
                                                                        {/* <td>{itempck.quotes}</td>
                                                                        <td>{itempck.initialPrice}</td> */}
                                                                        {/* <td>{itempck.duration}</td> */}
                                                                    </tr>
                                                                ))
                                                                
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>) : null
                                            }       
                                        )}
                                        </Accordion>
                                </Col>
                            </Row>

                            {/* Suscription */}
                           
                            <Row>
                                <Col sm={12}>
                                    <Accordion>
                                    {packageFamily.map((item , i) => {
                                        return item.packages.length > 0?
                                        (<Card key={item.id}>
                                            <Card.Header>
                                            <Accordion.Toggle  as={Button} variant="link" eventKey={item.id} style={{color: '#142d47',fontWeight:'bold', fontSize: 14}}>
                                            {item.name}
                                            </Accordion.Toggle> 
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={item.id}>
                                            <Card.Body>
                                                <Table  striped bordered hover responsive="md" size="sm">
                                                    <thead className="table-head">
                                                        <tr>
                                                            {/* <th></th>
                                                            {
                                                                item.headers.map((header, id) => (
                                                                <th>{header}</th>
                                                                ))
                                                            } */}
                                                            <th></th>
                                                            <th>Nombre</th>
                                                            <th>Descripción</th>
                                                            <th>Precio</th>
                                                            <th>Número de cuotas</th>
                                                            <th>Cuota  inicial</th>
                                                            {/* <th>Duración</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            item.packages.map((itempck)  => {
                                                                return (itempck.estatus === 1 ? 
                                                                <tr key={itempck.id}>
                                                                    <td>
                                                                        <Form.Check inline type='radio' 
                                                                            name="packages"
                                                                            id={itempck.id}
                                                                            onChange={e => this.handleSelection(e, 'packages')} />
                                                                        
                                                                    </td>
                                                                    <td>{itempck.name}</td>
                                                                    <td>{itempck.description}<br></br>
                                                                        Duración: {itempck.duration}
                                                                        {/* <ul>
                                                                            {
                                                                                itempck.descriptions.map((label, idxLabel) => (
                                                                                <li>{label}</li>
                                                                                ))
                                                                            }
                                                                        </ul> */}
                                                                    </td>
                                                                    <td>$ {itempck.price}</td>
                                                                    <td>{itempck.quotes}</td>
                                                                    <td>$ {itempck.initialPrice}</td>
                                                                    {/* <td>{itempck.duration}</td> */}
                                                                </tr>: null)
                                                                }
                                                            )
                                                            
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>) : null
                                        }       
                                    )}
                                    </Accordion>
                                </Col>
                            </Row>
                                </div>}
                            { this.state.packageStatus === "U" && 
                                <div>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Label  className="content-subtitle">Migración de suscripción </Form.Label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12}>
                                            {packageUpgrade.length > 0 &&
                                                <Form inline>
                                                    <Form.Label>Seleccione suscripción: </Form.Label>
                                                    <Form.Control as="select" defaultValue={'DEFAULT'} className="ml-2"
                                                        // style={ this.state.showRegister? {} : { opacity: 0.5, pointerEvent: 'none' }}
                                                        onChange={e => this.handleSelectPackage(e, "upgradeExperience")}>
                                                            <option value="DEFAULT" disabled>Seleccione</option>
                                                            {packageUpgrade.map((item, idx) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.package.name} adquirida en {Validation.convertDateToString(item.creationDate)}
                                                                </option>
                                                            ))}
                                                    </Form.Control> 
                                                </Form>
                                            }
                                            { packageUpgrade.length === 0 &&
                                                <Form.Label>No tiene paquetes disponibles para realizar un upgrade.</Form.Label>
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            }
                            {this.state.packageSelected !== undefined &&
                                <div>
                                    <br></br>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Label>Paquetes disponibles para migrar:</Form.Label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12}>
                                        <Table  striped bordered hover responsive="md" size="sm">
                                                        <thead className="table-head">
                                                            <tr>
                                                                {/* <th></th>
                                                                {
                                                                    item.headers.map((header, id) => (
                                                                    <th>{header}</th>
                                                                    ))
                                                                } */}
                                                                <th></th>
                                                                <th>Nombre</th>
                                                                <th colSpan={3}>Descripción</th>
                                                                <th>Precio</th>
                                                                {/* <th>Duración</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                upgradeOptions.map((itempck)  =>(
                                                                    <tr key={itempck.id}>
                                                                        <td>
                                                                            <Form.Check inline type='radio' 
                                                                                name="packages"
                                                                                id={itempck.id}
                                                                                onChange={e => this.handleSelection(e, 'packages')} 
                                                                                />
                                                                        </td>
                                                                        <td>{itempck.name}</td>
                                                                        <td colSpan={3}>{itempck.description}<br></br>
                                                                            Duración: {itempck.duration}
                                                                            {/* <ul>
                                                                                {
                                                                                    itempck.descriptions.map((label, idxLabel) => (
                                                                                    <li>{label}</li>
                                                                                    ))
                                                                                }
                                                                            </ul> */}
                                                                        </td>
                                                                        <td>$ {itempck.price}</td>
                                                                        {/* <td>{itempck.quotes}</td>
                                                                        <td>{itempck.initialPrice}</td> */}
                                                                        {/* <td>{itempck.duration}</td> */}
                                                                    </tr>
                                                                ))
                                                                
                                                            }
                                                        </tbody>
                                                    </Table>
                                        
                                        </Col>
                                    </Row>
                                </div>
                            }
                        </div>                            
                    }
                    
                    {noData &&
                        <div>
                            <Form.Label>{message}</Form.Label>
                        </div>
                    }
           </div>
              
        );
    }
}