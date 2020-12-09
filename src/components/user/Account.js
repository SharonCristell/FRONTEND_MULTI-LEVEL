import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import { Form, Button, Row, Col, Image, Table, BreadcrumbItem, Container, InputGroup } from 'react-bootstrap';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Avatar from 'react-avatar-edit';

import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

export default class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            user: {
                username: "",
            },
            userMod: {

            },
            username: '',
            password: '',
            newpassword: '',
            repassword: '',
            message: '',
            messageAlert: '',
            newMessage: '',

            preview: null,
            defaultPreview: null,
            base64: null,
            sponsorNames: "",
            isShow: false,
            isShowNew: false,
            isShowRew: false,
        }
        this.onCrop = this.onCrop.bind(this)
        this.onCropDefault = this.onCropDefault.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onCloseDefault = this.onCloseDefault.bind(this)
    }

    componentDidMount() {
        let user = AuthService.getCurrentUserInfo();
        if (user !== undefined) {
            let userInfo = {

                username: user.username,

            }
            this.setState({
                user: this.state.user = userInfo,
                id: this.state.id = user.id,
                loaded: true,

            });
        } else {
            this.setState({
                user: this.state.user = {},
                id: this.state.id = 0,
                loaded: false
            });
        }
        this.getUserProfilePicture();
        this.getSponsor();


    }
    async getUserProfilePicture() {

        let id = AuthService.getCurrentIdUser();

        let response = await AuthService.getProfilePicture(id);

        if (response === undefined) {
            alert('Ocurrió un problema. Inténtelo más tarde.');
        } else {
            if (response.status === 1) {


                this.setState({
                    defaultPreview: this.state.defaultPreview = "data:image/png;base64," + response.objModel,
                })
            }

        };

    }

    async getSponsor() {

        let response = await UserService.getSponsorbyUser();

        if (response === undefined) {
            alert('Ocurrió un problema. Inténtelo más tarde.');
        } else {
            if (response.status === 0) {
                this.setState({

                    sponsorNames: this.state.sponsorNames = "No se registra Sponsor",
                })

            } else {
                this.setState({
                    sponsorNames: this.state.sponsorNames = response.objModel.name + " " + response.objModel.lastname,
                })
            }

        };

    }

    /**
     * Method to handle the change  of properties and send it to parent 
     * @param {*} e 
     * @param {*} field 
     */




    handleChange = (e, field) => {
        let value = e.target.value;
        this.setState({
            [field]: this.state[field] = value,
            newMessage: "",
            message: "",
            messageAlert: ""
        });

    }

    validation = () => {
        if (this.state.password.length === 0) {
            this.setState({
                message: this.state.message = "Ingrese su contraseña."
            });
            return false;
        } if (this.state.password !== AuthService.getCurrentKey()) {
            // console.log(AuthService.getCurrentKey());
            // console.log(this.state.password);
            this.setState({
                message: this.state.message = "Contraseña anterior no coincide."
            });
            return false;
        } else if (this.state.newpassword.length === 0) {
            this.setState({
                newMessage: this.state.newMessage = "Ingrese su nueva contraseña."
            });
            return false;
        } else if (this.state.repassword.length === 0) {
            this.setState({
                messageAlert: this.state.messageAlert = "Vuelva a ingresar su contraseña."
            });
            return false;
        } else if (this.state.newpassword !== this.state.repassword) {
            this.setState({
                messageAlert: this.state.messageAlert = "Las nuevas contraseñas no coinciden."
            });
            return false;
        }
        return true;

    }
    validatePicture = () => {
        if (this.state.defaultPreview === null) {

            alert("Seleccione primero una foto de perfil antes de guardar");

            return false;
        }
        return true;

    }

    onClicked = async (e) => {
        e.preventDefault();
     
        if (this.validation()) {
            let flag = false;
            let data = {};
            let password = "";
            let newpassword = "";

            password = this.state.password;
            newpassword = this.state.newpassword;

            data.password = password;
            data.newpassword = newpassword;

            let response = await AuthService.updatePassword(data);

            if (response !== undefined && response !== null) {
                if (response.status === 0) {
                    alert(response.description)
                } else {
                    alert("Su contraseña ha sido modificada.")
                    flag = true;
                }
            } else {
                alert("Ocurrió un error, inténtelo más tarde.")
            }
            if (flag) {
                window.location.reload();

            }
        }

    }

    onSave = async (e) => {

        if (this.validatePicture()) {

            var base64result = this.state.defaultPreview.split(',')[1];

            let flag = false;

            let data = {};
            let idUser = "";
            let picture = "";

            idUser = this.state.id;
            picture = base64result;

            data.IdRefeferenciaClass = idUser;
            data.Base64 = picture;
     

            let response = await UserService.updateProfilePicture(data);

            if (response === undefined) {
                alert('Ocurrió un problema. Inténtelo más tarde.');
            } else {
                if (response.status === 0) {
                    alert("Ocurrió un error al momento de subir la foto de perfil.");
                } else {
                    flag = true;   
                                                                 
                    alert("Imagen actualizada con éxito.");
                    
                    
                }

            };

            if (flag) {
                
                window.location.reload();
                
            }

        }
    };



    onCropDefault(preview) {
        this.setState({ defaultPreview: preview })
    }

    onCrop(preview) {
        this.setState({ preview })
    }

    onCloseDefault() {
        this.setState({ defaultPreview: null })
    }

    onClose() {
        this.setState({ preview: null })
    }
    onBeforeFileLoad(elem) {
        if (elem.target.files[0].size > 100000000) {
            alert("Este archivo es demasiado pesado!");
            elem.target.value = "";
        };
    }

    showPassword = () => {

        this.setState({
            isShow: this.state.isShow = !this.state.isShow
        });
    }
    showNewPassword = () => {

        this.setState({
            isShowNew: this.state.isShowNew = !this.state.isShowNew
        });
    }
    showRewPassword = () => {

        this.setState({
            isShowRew: this.state.isShowRew = !this.state.isShowRew
        });
    }


    render() {
        const { user, loaded, sponsorNames } = this.state;
        const { vouchersTable, typePays, typeExchange } = this.state;
        const fontSize = this.props.fontSize;
        return (

            <div>
                <div class="form-style" style={{ margin: "0 auto" }}>
                    <Form>
                        <Form.Group>

                            <Form.Group>
                                <h4>Cambio de Contraseña</h4>
                            </Form.Group>

                            <Container>
                                <Row>
                                    <Col sm={6}>

                                        <Form.Group>
                                            <Form.Label>UserName</Form.Label>
                                            <Form.Control required type="text" placeholder="Usuario"
                                                defaultValue={user.username}
                                                onChange={e => this.handleChange(e, "username")} disabled />
                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form>
                                            <Form.Group>
                                                <Form.Label>Patrocinador</Form.Label>
                                                <Form.Control required type="text" placeholder="Patrocinador"
                                                    defaultValue={sponsorNames}
                                                    onChange={e => this.handleChange(e, "patrocinador")} disabled></Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={4}>
                                        <Form controlid="validationPassword" >
                                            <Form.Group>
                                                <Form.Label>Ingrese su contraseña anterior</Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control required
                                                        type={this.state.isShow ? "text" : "password"} placeholder="Contraseña anterior"
                                                        onChange={e => this.handleChange(e, "password")}></Form.Control>

                                                    <InputGroup.Prepend onClick={e => this.showPassword()}>
                                                        <InputGroup.Text>
                                                            {this.state.isShow && <FaEyeSlash></FaEyeSlash>}
                                                            {!this.state.isShow && <FaEye></FaEye>}
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                </InputGroup>
                                                <Form.Label className="textAlert">{this.state.message}</Form.Label>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col sm={4}>
                                        <Form >
                                            <Form.Group>
                                                <Form.Label>Ingrese su nueva contraseña</Form.Label>                                                
                                                <InputGroup className="mb-2">
                                                    <Form.Control required
                                                        type={this.state.isShowNew ? "text" : "password"} placeholder="Nueva contraseña"
                                                        onChange={e => this.handleChange(e, "newpassword")}></Form.Control>

                                                    <InputGroup.Prepend onClick={e => this.showNewPassword()}>
                                                        <InputGroup.Text>
                                                            {this.state.isShowNew && <FaEyeSlash></FaEyeSlash>}
                                                            {!this.state.isShowNew && <FaEye></FaEye>}
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                </InputGroup>

                                                <Form.Label className="textAlert">{this.state.newMessage}</Form.Label>

                                            </Form.Group>
                                        </Form>
                                    </Col>

                                    <Col sm={4}>
                                        <Form >
                                            <Form.Group >
                                                <Form.Label>Repetir su nueva contraseña</Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control required
                                                        type={this.state.isShowRew ? "text" : "password"} placeholder="Repetir contraseña"
                                                        onChange={e => this.handleChange(e, "repassword")}
                                                        isValid={this.state.isSame}></Form.Control>

                                                    <InputGroup.Prepend onClick={e => this.showRewPassword()}>
                                                        <InputGroup.Text>
                                                            {this.state.isShowRew && <FaEyeSlash></FaEyeSlash>}
                                                            {!this.state.isShowRew && <FaEye></FaEye>}
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                </InputGroup>
                                               
                                                <Form.Label className="textAlert">{this.state.messageAlert}</Form.Label>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                                <Form.Group>
                                    <Container>
                                        <Row>



                                            <Col sm={12} style={{ textAlign: 'center' }}>
                                                <Button variant="primary" size="sm" onClick={e => this.onClicked(e)}>Guardar</Button>

                                            </Col>
                                        </Row>
                                    </Container>
                                </Form.Group>
                                <Form.Group>
                                    <h4>Foto de Perfil</h4>
                                </Form.Group>

                                <Form.Group>
                                    <Row>

                                        <Col sm={1} />

                                        <Col sm={5} style={{ textAlign: 'center' }}>
                                            <h5 style={{ textAlign: 'left' }}>Presione el  recuadro y eliga una foto</h5>
                                            <Avatar
                                                width={200}
                                                height={200}
                                                onCrop={this.onCropDefault}
                                                onClose={this.onCloseDefault}
                                                onBeforeFileLoad={this.onBeforeFileLoad}

                                            />
                                        </Col>

                                        <Col sm={4} style={{ textAlign: 'right' }}>
                                            <h5>Vista Actual de la foto</h5>
                                            <img alt="" style={{ width: '150px', height: '150px', borderRadius: "50%" }} src={this.state.defaultPreview} />
                                        </Col>

                                    </Row>
                                </Form.Group>
                                <br></br>
                                <br></br>

                                <Row className="row justify-content-between">
                                    <Col style={{ textAlign: 'center' }}>
                                        <Button variant="primary" size="sm" onClick={this.onSave}>
                                            Actualizar foto de perfil
                            </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        );
    }
}