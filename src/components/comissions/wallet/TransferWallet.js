import React, { Component } from 'react';
import { Row, Form, Col, Button, InputGroup } from 'react-bootstrap';

import AuthService from '../../../services/auth.service';
import WalletService from '../../../services/wallet.service';
import Stepper from '../../utils/Stepper';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

export default class TransferWallet extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            amount   : 0,
            keyDigital: "",
            isShow: false,
            loading : false,
            code    : "",
            stepOne: true,
            stepTwo: false,
            stepThree: false,
            completedRegister : false,
            message: "",
            numStep : 3,
            active: 1,
        };
      
    }


    handlechange = (e, field) => {
        let value = e.target.value.trim();

        this.setState({
            [field]: this.state[field] = value
        });
    }
   
    // Validate account available and send code
    validateAccountAvailable = async(e) => {
        if(this.state.amount.length > 0 && this.state.username.length > 0) {
            if(!isNaN(Number(this.state.amount))) {
                if(Number(this.state.amount) > 0) {
                    let idUser = AuthService.getCurrentIdUser();

                    let data = {
                        IdUser : Number(idUser),
                        AmountTransaction : Number(this.state.amount)
                    };
                    let response  = await WalletService.validateTransaccion(data);
                    // If  status is correct  send a code   "objModel": 1
                    if(response.status > 0){
                        if(response.objModel === 1) {
                            this.sendCode();
                        } else {
                            alert("No se puede realizar transacción. Saldo insuficiente.")
                        }
                    } else {
                        alert("Ocurrió un error mientras validamos sus datos, inténtelo mas tarde.")
                    }
                } else {
                    alert("El monto debe ser mayor a 0 (cero).")
                }
            } else {
                alert("Ingrese un monto válido.")
            }
        } else {
            alert("Complete la informacion requerida.")
        }
    }

    sendCode = async() => {

        let idUser = AuthService.getCurrentIdUser();
        let response = await WalletService.getToken(idUser);
        if(response !== undefined && response.status === 1){
            this.setState({
                stepOne: this.state.stepOne = false,
                stepTwo: this.state.stepTwo = true,
                stepThree: this.state.stepThree = false,
                active: this.state.active = this.state.active + 1
            });

        } else {
            alert("Tuvimos problemas en enviar el código de validación.")
        }
        

    }

    validateCode = async(e) => {

        let data = {
            "CodigoToken" : this.state.code 
        };
        let idUser = AuthService.getCurrentIdUser();
        let response = await WalletService.verifyToken(idUser, data);
        console.log(response)
        if(response !== undefined ) {
            if( response.status === 1 ) {
                if(response.objModel === 1) {
                    this.setState({
                        stepOne: this.state.stepOne = false,
                        stepTwo: this.state.stepTwo = false,
                        stepThree: this.state.stepThree = true,
                        active: this.state.active = this.state.active + 1
                    });
                } else {
                    alert("Token no válido o ya expiró.")
                }
                
            } else {
                alert("Código incorrecto.")
            }

        } else {
            alert("Tuvimos problemas en validar tu código.")
        }

       
    }

    sendTransfer = async(e) => {

        if(this.state.keyDigital) {
            let idUser = Number(AuthService.getCurrentIdUser());
            let user = AuthService.getCurrentUser();
            let data = {
                IdUser : idUser,
                ClaveWeb : this.state.keyDigital,
                WalletTransaction :{
                    Amount : Number(this.state.amount),
                    ReferenceData : this.state.username
                }
            };
    
            let response = await WalletService.registerTransaction(data, user);
            console.log(response)
    
            if(response !== undefined ) {
                if( response.status === 1 ) {
                    this.reloadForm();
                    alert("Su transferencia ha sido realizada correctamente.");
                    
                    if(this.props.updateBalance){
                        this.props.updateBalance();
                    }
                } else {
                    alert("Ocurrió un error mientras se procesaba su transferencia.");
                }
    
            } else {
                alert("Ocurrió un error al momento de registrar su transferencia.");
            }
        } else {
            alert("Ingrese clave.")
        }
       
    }

    reloadForm() {
        this.setState({
            username: this.state.username = "",
            amount   : this.state.amount = 0,
            keyDigital: this.state.keyDigital = "",
            loading : this.state.loading = false,
            code    : this.state.code = "",
            stepOne: this.state.stepOne = true,
            stepTwo: this.state.stepTwo = false,
            stepThree: this.state.stepThree = false,
            completedRegister : this.state.completedRegister = false,
            message: this.state.message = "",
            numStep : this.state.numStep = 3,
            active: this.state.active = 1,
        });
      this.forceUpdate()
    }

    // Show password
    showPassword = () => {

        this.setState({
            isShow: this.state.isShow = !this.state.isShow 
        });
    }

    render() {
        const { username, amount , code, keyDigital, isShow,
            loading, stepOne, stepTwo, stepThree,  completedRegister, message, numStep, active } = this.state;
        return(
            <div style={{padding: 30, textAlign: 'left'}}>
                {/* Paso 1 */}

                <div>

                    {!completedRegister && 
                    <div>
                        <Row style={{textAlign: 'right', paddingBottom: 15}}>
                            <Col sm={12}>
                                <Button variant="secondary" onClick={e => this.reloadForm()}>Nueva transferencia</Button>
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Stepper numStep={numStep} active={active}></Stepper>
                        </Row>
                        <Row style={{justifyContent: 'center'}}>
                            <Col sm={4}>
                            <Form.Group style={{opacity: (stepOne)? "1" : "0.5", pointerEvents: (stepOne)? "all":"none"}}>
                            {/* <Form.Group style={{display: (stepOne)? "inline" : "none", pointerEvents: (stepOne)? "all":"none"}}> */}
                                <Form.Label className="content-subtitle">Datos de la transferencia</Form.Label>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Group>
                                                <Form.Label>Usuario: </Form.Label>
                                                <Form.Control 
                                                    id="username"
                                                    value={username}
                                                    onChange={e => {this.handlechange(e, 'username')}}
                                                    placeholder="Ingrese usuario destino"
                                                    ></Form.Control>
                                                
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Label>Monto $ : </Form.Label>
                                            <Form.Control 
                                                id="amount"
                                                value={amount}
                                                onChange={e => {this.handlechange(e, 'amount')}}
                                                min="0"
                                                placeholder="Ingrese monto"></Form.Control>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} style={{paddingTop: 10}}>
                                            <Button onClick={e => {this.validateAccountAvailable(e)}}>Siguiente</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group style={{opacity: (stepTwo)? "1" : "0.5", pointerEvents: (stepTwo)? "all":"none"}}>
                                <Form.Label className="content-subtitle">Ingrese código</Form.Label>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Group>   
                                                <Form.Label>Se le ha enviado a su correo un código de confirmación. Revise su correo. </Form.Label>
                                                <br></br>
                                                <br></br>
                                            </Form.Group> 
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Label>Ingrese código: </Form.Label>
                                            <Form.Control 
                                                value={code}
                                                onChange={e => {this.handlechange(e, 'code')}}
                                                placeholder="Ingrese código"></Form.Control>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} style={{paddingTop: 10}}>
                                            <Button onClick={e => {this.validateCode(e)}}>Validar código</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group style={{opacity: (stepThree)? "1" : "0.5", pointerEvents: (stepThree)? "all":"none"}}>
                                    <Form.Label className="content-subtitle">Verifique</Form.Label>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Group>
                                                <Form.Label>Usuario: {username}</Form.Label>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Label>Monto $ : {amount}</Form.Label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12}>
                                            <div className="form-group">
                                                <label>Contraseña</label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control 
                                                        id="keyDigital"
                                                        value={keyDigital}
                                                        type={isShow? "text": "password" }
                                                        placeholder="Ingrese su clave digital"
                                                        onChange={e => {this.handlechange(e, 'keyDigital')}}
                                                        autoComplete='new-password' />
                                                    <InputGroup.Prepend onClick={e => this.showPassword()}>                            
                                                    <InputGroup.Text>
                                                    {isShow && <FaEyeSlash></FaEyeSlash>}
                                                    {!isShow && <FaEye></FaEye>}
                                                    </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                </InputGroup>

                                                
                                            </div>
                                            {/* <Form.Group>
                                                <Form.Label>Clave: </Form.Label>
                                                <Form.Control 
                                                    value={keyDigital}
                                                    onChange={e => {this.handlechange(e, 'keyDigital')}}
                                                    placeholder="Ingrese su clave digital"></Form.Control>
                                                
                                            </Form.Group> */}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} style={{paddingTop: 10}}>
                                            <Button onClick={e => {this.sendTransfer(e)}}>Transferir</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                    }
                    {completedRegister && 
                    <Row>   
                        <Col sm={12}>
                            <Form.Label>{message}</Form.Label>
                            <Button onClick={e => this.backView(e)}>Volver</Button>
                        </Col>
                    </Row>
                    }
                </div>
            </div>
        );
    }
}