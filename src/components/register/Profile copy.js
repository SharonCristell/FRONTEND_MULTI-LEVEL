import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            user: {
                name: "",
                lastname: "",
                birthdate: "",
                gender: "",
                nroDocument: "",
                districtAddress: "",
                address: "",
                username: "",
                nroTelf: "",
                idResidenceCountry: "",
                country: "",
            },
            userMod: {

            },
            loaded: false
        }
    }


    componentDidMount() {
        let user = AuthService.getCurrentUserInfo();
        if (user !== undefined) {
            let userInfo = {
                name: user.name,
                lastname: user.lastname,
                birthdate: user.birthdate,
                gender: user.gender,
                nroDocument: user.nroDocument,
                districtAddress: user.districtAddress,
                address: user.address,
                username: user.username,
                nroTelf: user.nroTelf
            }
            this.setState({
                user: this.state.user = userInfo,
                id: this.state.id = user.id,
                loaded: true
            });
        } else {
            this.setState({
                user: this.state.user = {},
                id: this.state.id = 0,
                loaded: false
            });
        }

    }
    /**
     * Method to handle the change  of properties and send it to parent 
     * @param {*} e 
     * @param {*} field 
     */
    handleChange = (e, field) => {
        // //console.log('step one');
        let value = e.target.value;
        let temp = this.state.userMod;
        temp[field] = value;
        this.setState({
            userMod: this.state.userMod = temp,
            messageDoc: ""
        });

        // })
    };

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

    // Verify nro Document
    onBlurDocument = (e, field, fieldMessage) => {
        //console.log(e);
        this.verifyDocument(field, fieldMessage);

    }

    async verifyDocument(field, fieldMessage) {
        // verify is the same value
        if (this.state.userMod.nroDocument.lenght > 0 &&
            this.state.userMod.nroDocument !== this.state.user.nroDocument) {
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

    }

    verifyData = () => {
        var data = this.state.userMod;
        if (!data.hasOwnProperty('name')) {
            data.name = this.state.user.name;
        }
        if (!data.hasOwnProperty('lastname')) {
            data.lastname = this.state.user.lastname
        }
        if (!data.hasOwnProperty('birthdate')) {
            data.birthdate = this.state.user.birthdate
        }
        if (!data.hasOwnProperty('gender')) {
            data.gender = this.state.user.gender
        }
        if (!data.hasOwnProperty('nroDocument')) {
            data.nroDocument = this.state.user.nroDocument
        }
        if (!data.hasOwnProperty('districtAddress')) {
            data.districtAddress = this.state.user.districtAddress
        }
        if (!data.hasOwnProperty('address')) {
            data.address = this.state.user.address
        }
        if (!data.hasOwnProperty('nroTelf')) {
            data.nroTelf = this.state.user.nroTelf
        }
        if (!data.hasOwnProperty('username')) {
            data.username = this.state.user.username
        }
        return data;
    }
    sendData = async (e) => {
        e.preventDefault();

        let data = this.verifyData();

        let response = await UserService.updateInfo(this.state.id, data);
        if (response === undefined) {
            alert('Ocurrió un problema. Inténtelo más tarde.');
        } else {
            if (response.status === 0) {
                alert(response.description);
            } else {
                alert("Tus datos han sido actualizados.");
            }

        }
    };
    render() {
        const { user, loaded } = this.state;
        var dateConverted = new Date(user.birthdate); 

        //console.log(dateConverted);
        // const dateConverted = date.geTime(); // Elapsed time in MS
        return (
            <div >
                {!loaded && <div style={{ textAlign: 'center' }}>
                    <Form.Label>Lo sentimos ocurrió un error.</Form.Label><br></br>
                    <Form.Label>Vuelva a iniciar sesión o consulte con el administrador.</Form.Label>
                </div>
                }
                {loaded &&
                    <Form>
                        <Form.Group>
                            <h4>Titular</h4>
                        </Form.Group>
                        <Row>
                            <Col sm={4}>

                                <Form.Group>
                                    <Form.Label>País de Operaciones</Form.Label>
                                    <Form.Control required type="text" placeholder="Pais"
                                        defaultValue={user.country}
                                        onChange={e => this.handleChange(e, "country")} />
                                </Form.Group>


                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Nombres *</Form.Label>
                                    <Form.Control required type="text" placeholder="Nombres"
                                        defaultValue={user.name}
                                        onChange={e => this.handleChange(e, "name")} />
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Apellidos *</Form.Label>
                                    <Form.Control required type="text" placeholder="Apellidos"
                                        defaultValue={user.lastname}
                                        onChange={e => this.handleChange(e, "lastname")} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4}>

                                <Form.Group>
                                    <Form.Label>Sexo *</Form.Label>
                                    <div key={'inline-radio'} className="mb-3">
                                        <Form.Check inline label="Masculino" type='radio' id={`inline-radio`} value="M"
                                            onChange={e => this.handleRadio(e, "gender")}
                                            checked={user.gender === "M"} />
                                        <Form.Check inline label="Femenino" type='radio' id={`inline-radio2`} value="F"
                                            onChange={e => this.handleRadio(e, "gender")}
                                            checked={user.gender === "F"} />
                                    </div>
                                </Form.Group>


                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Nro. Celular *</Form.Label>
                                    <Form.Control required type="text" placeholder="Nro. celular"
                                        defaultValue={user.nroTelf}
                                        onChange={e => this.handleChange(e, "phone")}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Ingrese un número de celular válido.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Fecha de nacimiento *</Form.Label>
                                    <Form.Control type="date"
                                        defaultValue={dateConverted}
                                        onChange={e => this.handleChange(e, "birthdate")}></Form.Control>
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row>
                            <Col sm={4}>

                                <Form.Group>
                                    <Form.Label>Tipo de documento *</Form.Label>
                                    <Form.Control required type="text" placeholder="Nro. documento"
                                        defaultValue={user.nroDocument}
                                        onChange={e => this.handleChange(e, "nroDocument")}
                                        onBlur={e => this.onBlurDocument(e, "nroDocument", "messageDoc")}></Form.Control>
                                    <Form.Text className="textAlert">{this.state.messageDoc}</Form.Text>
                                </Form.Group>


                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Nro. de documento *</Form.Label>
                                    <Form.Control required type="text" placeholder="Nro. documento"
                                        defaultValue={user.nroDocument}
                                        onChange={e => this.handleChange(e, "nroDocument")}
                                        onBlur={e => this.onBlurDocument(e, "nroDocument", "messageDoc")}></Form.Control>
                                    <Form.Text className="textAlert">{this.state.messageDoc}</Form.Text>
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Correo eléctronico</Form.Label>
                                    <Form.Control required type="text" placeholder="Apellidos"
                                        defaultValue={user.lastname}
                                        onChange={e => this.handleChange(e, "lastname")} />
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row>
                            <Col sm={4}>

                                <Form.Group>
                                    <Form.Label>Nro. Telefono adicional *</Form.Label>
                                    <Form.Control required type="text" placeholder="Nro. telefono adicional"
                                        defaultValue={user.nroTelf}
                                        onChange={e => this.handleChange(e, "aditionalphone")}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Ingrese un número de celular válido.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Distrito / Estado *</Form.Label>
                                    <Form.Control required type="text" placeholder="Distrito"
                                        defaultValue={user.districtAddress}
                                        onChange={e => this.handleChange(e, "districtAddress")}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Ingrese su distrito.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control required type="text" placeholder="Dirección"
                                        defaultValue={user.address}
                                        onChange={e => this.handleChange(e, "address")}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Ingrese su dirección.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                        </Row>


                        <Form.Group>
                            <Button size="sm" onClick={this.sendData}>Actualizar información</Button>
                        </Form.Group>

                        <Form.Group>
                            <h4>Co-Titular</h4>
                        </Form.Group>
                        <Row>

                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Nombres *</Form.Label>
                                    <Form.Control required type="text" placeholder="Nombres"
                                        defaultValue={user.name}
                                        onChange={e => this.handleChange(e, "name")} />
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Apellidos *</Form.Label>
                                    <Form.Control required type="text" placeholder="Apellidos"
                                        defaultValue={user.lastname}
                                        onChange={e => this.handleChange(e, "lastname")} />
                                </Form.Group>
                            </Col>

                            <Col sm={4}>

                                <Form.Group>
                                    <Form.Label>País de Operaciones</Form.Label>
                                    <Form.Control required type="text" placeholder="Pais"
                                        defaultValue={user.country}
                                        onChange={e => this.handleChange(e, "country")} />
                                </Form.Group>

                            </Col>                           

                        </Row>

                        <Row>
                            <Col sm={6}>

                                <Form.Group>
                                    <Form.Label>Tipo de documento *</Form.Label>
                                    <Form.Control required type="text" placeholder="Nro. documento"
                                        defaultValue={user.nroDocument}
                                        onChange={e => this.handleChange(e, "nroDocument")}
                                        onBlur={e => this.onBlurDocument(e, "nroDocument", "messageDoc")}></Form.Control>
                                    <Form.Text className="textAlert">{this.state.messageDoc}</Form.Text>
                                </Form.Group>


                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Nro. de documento *</Form.Label>
                                    <Form.Control required type="text" placeholder="Nro. documento"
                                        defaultValue={user.nroDocument}
                                        onChange={e => this.handleChange(e, "nroDocument")}
                                        onBlur={e => this.onBlurDocument(e, "nroDocument", "messageDoc")}></Form.Control>
                                    <Form.Text className="textAlert">{this.state.messageDoc}</Form.Text>
                                </Form.Group>
                            </Col>

                        </Row>

                        <Form.Group>
                            <Button size="sm" onClick={this.sendData}>Guardar Cambios </Button>
                        </Form.Group>

                    </Form>

                }
            </div>
        );
    }
}