import  React, { Component } from 'react';
import { Button, Form, Spinner, 
        Table, Accordion, Card, 
        InputGroup, FormControl} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UtilService from '../../services/utils.service';

export default class StepThree extends Component {
    constructor(props){
        super(props);
        this.state = {
            kitInit: [], // selected kit
            packages: [], // selected packages
            checkList: [],
            packageFamily: [],
            familyInit: [],
            tempPackage: [],
            loading: true,
            noData: false,
            message: ''
        }
        
        this.getPackageFamily = this.getPackageFamily.bind(this);
    }

    /**
     * Execute befores renderer 
     * Get packages
     */
    componentDidMount(){
        this.getPackageFamily();
    }

    async getPackageFamily(){
        
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

    // Handle teh selection of radio butoon bys package family
    // The selection by package is unique
    // Id of family represent the position in the array
    handleSelection = (e, field) => {
        //console.log(e.target.id);
        var idField = Number(e.target.id); // id package
        var selectedPackage = {};
        let tempPackages = this.state.tempPackage;
        let i;
        for(i = 0; i < tempPackages.length; i++){
            if(tempPackages[i].id === idField){
                selectedPackage = tempPackages[i];
            }
        }   
        this.setState({ packages: [selectedPackage] }, () => {
            if (this.props.onChange) {
                this.props.onChange([selectedPackage], "packages");
            }
        })
        
        // TODO implement get kit selected
        let kitInit = this.state.familyInit[0].packages[0];
        this.setState({ kitInit: [kitInit] }, () => {
            if (this.props.onChange) {
                this.props.onChange([kitInit], "kitInit");
            }
        })
        
        
        
    };


    render() {
       
        const packageFamily =  this.state.packageFamily;
        const familyInit =  this.state.familyInit;
        
        const loading   = this.state.loading;
        const noData    = this.state.noData;
        const message   = this.state.message;

        return (
            <div>
                {loading &&
                    <div style={{textAlign: 'center', paddingTop: 30}}>
                        <Spinner animation="border" role="status"  size="sm" >
                            <span className="sr-only">Loading...</span>
                        </Spinner> <Form.Label>Cargando información de paquetes...</Form.Label>
             
                    </div>
                }
                {!loading && !noData &&
                <div>
                    <Form.Label className="content-subtitle">Kit de inicio</Form.Label>
                    <Form.Group>
                        <Accordion>
                        {familyInit.map((item , i) => {
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
                                                                onChange={e => this.handleSelection(e)} 
                                                                disabled/>
                                                            
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
                    </Form.Group>
                    <Form.Group controlId="formStepThree">
                    <Form.Label className="content-subtitle">Paquetes de inscripción</Form.Label>
                        <Form.Group>
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
                                                                    onChange={e => this.handleSelection(e)} />
                                                                
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
                        </Form.Group>
                    </Form.Group>
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