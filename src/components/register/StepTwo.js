import React, { Component } from 'react';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UtilService from '../../services/utils.service';
import UserService from '../../services/user.service';
// Step 2: Datos de contacto
export default class StepTwo extends Component {

    constructor(props){
        super(props);
        this.state =  {
            codephone: "",
            messageEmail: "",
            idResidenceCountry: -1,
            residenceList: [],
            typeDocuments: []
        }

        this.getResidences = this.getResidences.bind(this);
        
    }

    componentDidMount(){
        
        this.getResidences();
    }

    async getResidences () {
        
        let response = await UtilService.getResidences();
        if(response !== null && response !== undefined){
            
            let  objs = response.objModel;
            this.setState({ 
                residenceList: this.state.residenceList =  objs
            });
        }
      
    }

    handleChange = (e, field) => {
        // //console.log('step one');
        // //console.log(field, ": ",  e.target.value);
        // this.setState({ [field]: e.target.value }, () => {
        var value = e.target.value.trim();
        // get code number phone
        if(field === "email"){
            this.setState({
                messageEmail: this.state.messageEmail = ""
            });
        }
        if (this.props.onChange) {
            this.props.onChange(value, field);
        }
        // })
    };

    // Verify email
    async verifyEmail(email, field, fieldMessage){

        let data = {};
        data.email = email;

        let isRegistered = await UserService.isEmailRegistered(data);
        if(isRegistered){
            this.setState({
                [field]: this.state[field] = "",
                [fieldMessage]: this.state[fieldMessage] = "Este correo ya está registrado."
            });
            if (this.props.onChange) {
                this.props.onChange('', 'email');
            }
        } 
       
    }

    onBlurEmail = (e, field, fieldMessage) => {
        let value = e.target.value.trim();
        if(value.length > 0){
            if(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(value)){
                this.setState({
                    [fieldMessage]: this.state[fieldMessage] = ""
                });
                
                this.verifyEmail(value, field, fieldMessage);
                
                
            } else {
                this.setState({
                    [field]: this.state[field] = "",
                    [fieldMessage]: this.state[fieldMessage] = "Ingrese un correo válido."
                });
                if (this.props.onChange) {
                    this.props.onChange('', 'email');
                }
            }
        }
    }

    handleSelect = (e, field) => {
        
        var value = e.target.value;
         // get code number phone
         let obj = this.state.residenceList.find(elem => elem.idCountry === Number(value))

         let codePhone = obj.symbol + obj.phonecode;
 
         this.setState({
             codephone: this.state.codephone = codePhone
         });
         
        this.setState({ [field]: value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value, field);
                this.props.onChange(codePhone, "codephone");
            }
        })

    };

    /**
     *TODO Evlate if it is applicated from parent component
     * To control if the fields are completed.
     * @param {*} event 
     */
    handleSummit = (event) => {
        //console.log(event);
    }

    render () {
        
        const { residenceList, codephone } = this.state;

        return (
            <div >
                <Form.Label className="content-subtitle">Datos del contacto</Form.Label>
                
                <Form.Group controlId="formStepTwo">
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Correo electrónico *</Form.Label>
                                <Form.Control required type="email" placeholder="Correo electrónico" 
                                            onChange={e => this.handleChange(e, "email")}
                                            onBlur={e => this.onBlurEmail(e, "email", "messageEmail")}></Form.Control>
                                <Form.Text className="textAlert">{this.state.messageEmail}</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>País de residencia *</Form.Label>
                                <Form.Control as="select" defaultValue={'DEFAULT'}
                                    onChange={e => this.handleSelect(e, "idResidenceCountry")}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    {residenceList.map((elem) =>     (

                                                                         <option key={elem.idCountry} value={elem.idCountry}>{elem.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Ciudad *</Form.Label>
                                <Form.Control required type="text" placeholder="Ciudad"
                                                onChange={e => this.handleChange(e, "districtAddress")}></Form.Control>
                                <Form.Control.Feedback type="invalid">Ingrese su distrito.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Dirección *</Form.Label>
                                <Form.Control required type="text" placeholder="Dirección"
                                                onChange={e => this.handleChange(e, "address")}></Form.Control>
                                <Form.Control.Feedback type="invalid">Ingrese su dirección.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Nro. Celular *</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text style={{fontSize: 12}}>{codephone}</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control id="txtphone" required type="text" placeholder="Nro. celular"
                                                onChange={e => this.handleChange(e, "phone")}></Form.Control>
                                <Form.Control.Feedback type="invalid">Ingrese un número de celular válido.</Form.Control.Feedback>
                                </InputGroup>

                                
                            </Form.Group>
                        </Col>
                    </Row>
                    
                </Form.Group>
            </div>
        );
    }
}