import React, { Component, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import DatePicker from 'react-bootstrap-date-picker

import UtilService from '../../services/utils.service';
import UserService from '../../services/user.service';

const civilStateKey = "Casado"; // casado

// Datos personales
export default class StepOne extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gender: '',
            idNationality: -1,
            idDocumentType: -1,
            desDocument: "",
            codesDocument: "",
            showOthersC: 'none',
            showOthers: 'none',
            nroDocument : '',
            conroDocument : '',
            civilState : '',
            nationalities: [],
            typeDocuments: [],
            tempDocuments: [],
            showRegister: 'none',
            checked: false,
            messageDate: "",
            messageDoc: "",
            messageDocCo: "",
        }

        this.getCountries = this.getCountries.bind(this);
        this.getDefaultDocument = this.getDefaultDocument.bind(this);
    }

    componentDidMount() {
        //console.log("Load data");
        this.getDefaultDocument();
        this.getCountries();
    }

    async getDefaultDocument () {
        let response = await UtilService.getTypeDocDefault();
        if(response !== null && response !== undefined){
            if(response.status === 1){
                let data = response.objModel;
                let items = [];
                data.forEach( elem => {
                    items.push(<option key={elem.id} value={elem.id}>{elem.name}</option>);
                        
                });
                
                this.setState({ 
                    tempDocuments: this.state.tempDocuments = items 
                });
                
            }
        }
    }

    // Get list of countries
    async getCountries() {

        let response = await UtilService.getResidences();

        if(response !== null && response !== undefined){
            
            let  objs = response.objModel
                let residences = [];
                objs.forEach( elem => {
                    residences.push(<option key={elem.idCountry} value={elem.idCountry}>{elem.name}</option>);
                });

                this.setState({ 
                    nationalities: this.state.nationalities =  residences
                });
        }

    }


    async createItemTypes() {
        var id = this.state.idNationality;

        if (id > 0) {
            let response = await UtilService.getTypeDocByNat(id);
            if(response !== null && response !== undefined){
                
                let items = [];
                if(response.status === 1 && response.objModel.length > 0){
                    response.objModel.forEach( elem => {
                        
                        items.push(<option key={elem.id} value={elem.id}>{elem.name}</option>);

                    });
                } else {
                    items = this.state.tempDocuments;
                }
                                              
                this.setState({ typeDocuments: items });
                this.forceUpdate();
            }

        }

    }

    /**
     * Method to handle the change  of properties and send it to parent 
     * @param {*} e 
     * @param {*} field 
     */
    handleChange = (e, field) => {

        let value = e.target.value.trim();
        if (this.props.onChange) {
            this.props.onChange(value, field);
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
    handleSelect = (e, field) => {
        // //console.log(e.target.value, field);
        var value = e.target.value;
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
            }
        })
      
        
        if(field === "idNationality") {
            this.setState({
                idNationality: this.state.idNationality = value
            });
            this.createItemTypes();
        }

        if(field === "idDocumentTypeCountry") {
            
            let text = e.target.options[e.target.selectedIndex].text.toUpperCase();
            if(text.includes("OTRO")) {
                this.setState({
                    showOthers: this.state.showOthers = 'inline'
                });
            } else {
                this.setState({
                    showOthers: this.state.showOthers = 'none',
                    desDocument: this.state.desDocument = ""
                });
                if (this.props.onChange) {
                    this.props.onChange("", "desDocument");
                }
            }
          
            this.forceUpdate();
        }

        if (field === "coidDocumentTypeCountry") {
            let text = e.target.options[e.target.selectedIndex].text.toUpperCase();
            if (text.includes("OTRO")) {
                this.setState({
                    showOthersC: this.state.showOthersC = 'inline'
                });
            } else {
                this.setState({
                    showOthersC: this.state.showOthersC = 'none',
                    codesDocument: this.state.codesDocument = ""
                });
                if (this.props.onChange) {
                    this.props.onChange("", "codesDocument");
                }

            }
          
            this.forceUpdate();
        }

    };

    handleCivilState = (e, field) => {
        //console.log(e.target.value, field);
        var value = e.target.value;
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
            }
        });
        // if (value === civilStateKey) {
        //     this.setState({
        //         showRegister: this.state.showRegister = 'block'
        //     }, () => {
        //         if (this.props.onChange) {
        //             this.props.onChange(true, 'coafiliate');
        //         }
        //     });
        // } else {
        //     this.setState({
        //         showRegister: this.state.showRegister = 'none',
        //     }, () => {
        //         if (this.props.onChange) {
        //             this.props.onChange(false, 'coafiliate');
        //         }
        //     });
        // }

    };

    handleCheck = (e) => {
        this.setState({
            checked: this.state.checked = !this.state.checked
        });

        console.log(this.state.checked)
        if (this.state.checked) {
            this.setState({
                showRegister: this.state.showRegister = 'block'
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange(true, 'coafiliate');
                }
            });
        } else {
            this.setState({
                showRegister: this.state.showRegister = 'none',
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange(false, 'coafiliate');
                }
            });
        }

    }

    /**
     * Method to handle the change  of properties and send it to parent 
     * @param {*} e 
     * @param {*} field 
     */
    handleRadio = (e, field) => {
        //console.log(e.target.value);
        // if (this.props.onChange) {
        //     this.props.onChange(e.target.value, field);
        //   }
        var value = e.target.value;
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
            }
        })
        // this.setState({ [field]: e.target.value }, //console.log(e.target.value))
    };

    /**
     * Method to handle the change  of properties and send it to parent 
     * @param {*} e 
     * @param {*} field 
     */
    handledate = (e, field) => {
        this.setState({
            messageDate: this.state.messageDate = ""
        });
        if (this.props.onChange) {
            this.props.onChange(e.target.value, field);
        }
    };

    onBlurDate = (e, field, fieldMessage) => {
        // Validate date
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        let date = e.target.value;
        let correct = date.match(regEx);
        if (correct) {
            this.setState({
                [fieldMessage]: this.state[fieldMessage] = ""
            });
        } else {
            this.setState({
                [fieldMessage]: this.state[fieldMessage] = "Ingrese una fecha válida."
            });
            if (this.props.onChange) {
                this.props.onChange("", field);
            }
        }

    }

    // Verify nro Document
    onBlurDocument = (e, field, fieldMessage) => {

        let nroDocument = this.state[field];
        if (nroDocument.length > 0) {
            this.verifyDocument(field, fieldMessage);
        }
    }

    async verifyDocument(field, fieldMessage) {

        let data = {};
        data.nroDocument = this.state[field];

        let isRegister = await UserService.isDocumentRegistered(data);

        if (!isRegister) {
            this.setState({ [fieldMessage]: "" });
            this.forceUpdate();
        } else {
            this.setState({ [fieldMessage]: "Este documento ya ha sido registrado." });
            this.props.onChange('', field);
            this.forceUpdate();
        }
    }
    render() {

        const { desDocument, codesDocument, checked} = this.state;
        return (
            <div>
                {/* <Form>
                    <Form.Group>
                        
                    </Form.Group>
                </Form> */}
                <Form.Label className="content-subtitle">Datos personales</Form.Label>

                <Form.Group controlId='formStepOne'>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Nombres *</Form.Label>
                                <Form.Control required type="text" placeholder="Nombres"
                                    onChange={e => this.handleChange(e, "name")} />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Apellidos *</Form.Label>
                                <Form.Control required type="text" placeholder="Apellidos"
                                    onChange={e => this.handleChange(e, "lastname")} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Nacionalidad *</Form.Label>
                                <Form.Control as="select" defaultValue={'DEFAULT'}
                                    onChange={e => this.handleSelect(e, "idNationality")}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    {this.state.nationalities}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Tipo de documento *</Form.Label>
                                <Form.Control as="select" defaultValue={'DEFAULT'}
                                    onChange={e => this.handleSelect(e, "idDocumentTypeCountry")}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    {this.state.typeDocuments}
                                </Form.Control>
                                <br></br>
                                <Form.Control style={{display: this.state.showOthers, paddingTop: 6}} type="text" 
                                    placeholder="Ingrese tipo de documento"
                                    value={desDocument}
                                    onChange={e => this.handleChange(e, "desDocument")}></Form.Control>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Nro. de documento *</Form.Label>
                                <Form.Control required type="text" placeholder="Nro. documento"
                                    onChange={e => this.handleChange(e, "nroDocument")}
                                    onBlur={e => this.onBlurDocument(e, "nroDocument", "messageDoc")}></Form.Control>
                                <Form.Text className="textAlert">{this.state.messageDoc}</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Fecha de nacimiento *</Form.Label>
                                <Form.Control type="date"
                                    onChange={e => this.handledate(e, "birthdate")}
                                    onBlur={e => this.onBlurDate(e, "birthdate", "messageDate")}></Form.Control>
                                <Form.Text className="textAlert">{this.state.messageDate}</Form.Text>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Sexo *</Form.Label>
                                <div key={'inline-radio'} className="mb-3">
                                    <Form.Check inline label="Masculino" type='radio' id={`inline-radio`} value="M"
                                        onChange={e => this.handleRadio(e, "gender")}
                                        checked={this.state.gender === "M"} />
                                    <Form.Check inline label="Femenino" type='radio' id={`inline-radio2`} value="F"
                                        onChange={e => this.handleRadio(e, "gender")}
                                        checked={this.state.gender === "F"} />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Estado Civil *</Form.Label>
                                <Form.Text></Form.Text>
                                <Form.Control as="select" defaultValue={'DEFAULT'}
                                    onChange={e => this.handleCivilState(e, "civilState")}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    <option value="Soltero" >Soltero</option>
                                    <option value="Casado">Casado</option>
                                    <option value="Viudo">Viudo</option>
                                    <option value="Divorciado">Divorciado</option>
                                    <option value="Convivencia">Convivencia</option>
                                    <option value="Union libre">Union libre</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>


                    <Row>
                        <Col sm={12}>
                        <Form.Check 
                            custom
                            type={'checkbox'}
                            id={'chkCo'}
                            label={'Registrar co-solicitante'}
                            checked={checked}
                            onChange={e => this.handleCheck(e)}
                        />
                        </Col>
                    </Row>


                    <Form.Group style={{ display: this.state.showRegister }}>
                        {/* <RegisterBeneficiary ></RegisterBeneficiary> */}
                        <hr></hr>
                        <Form.Label className="content-subtitle">Co-Solicitante</Form.Label>

                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Nombres</Form.Label>
                                    <Form.Control placeholder="Nombres"
                                        onChange={e => this.handleChange(e, "coname")}></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Apellidos</Form.Label>
                                    <Form.Control placeholder="Apellidos"
                                        onChange={e => this.handleChange(e, "colastname")}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Tipo de documento *</Form.Label>
                                    <Form.Control as="select" defaultValue={'DEFAULT'}
                                        onChange={e => this.handleSelect(e, "coidDocumentTypeCountry")}>
                                        <option value="DEFAULT" disabled>Seleccione una opción</option>
                                        {this.state.typeDocuments}
                                    </Form.Control>
                                    </Form.Group>
                            </Col>
                            <Col sm={6} style={{ display: this.state.showOthersC }}>
                                <Form.Group>
                                    <Form.Label>Ingrese tipo de documento *</Form.Label>
                                    <Form.Control  type="text" placeholder="Ingrese tipo de documento"
                                        value={codesDocument}
                                        onChange={e => this.handleChange(e, "codesDocument")}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                        <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Nro. de documento</Form.Label>
                                    <Form.Control placeholder="Nro. de documento"
                                        onChange={e => this.handleChange(e, "conroDocument")}
                                        onBlur={e => this.onBlurDocument(e, "conroDocument", "messageDocCo")}></Form.Control>
                                    <Form.Text className="textAlert">{this.state.messageDocCo}</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Fecha de nacimiento *</Form.Label>
                                    <Form.Control type="date"
                                        onChange={e => this.handledate(e, "cobirthdate")}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form.Group>
            </div>
        );
    }
}