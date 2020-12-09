import React, { Component } from 'react';
import { Form, Spinner, Row, Col } from 'react-bootstrap';
import RegisterMainView from '../login/RegisterMainView';
import UserService from '../../services/user.service';

export default class RegisterExView extends Component{

    constructor(props){
        super(props);

        this.state = {
            loading: true,
            empty: true,
            userSponsor: undefined
        }

        this.getDataUrl = this.getDataUrl.bind(this);
    }

    componentDidMount() {
        this.getDataUrl();
    }

    async getDataUrl() {
        let url = window.location;
        let params  = url.search;
        let listParams = params.split('=');
        // [1] is idsocio
        if(listParams[1] !== undefined){
            let response = await UserService.getUserById(listParams[1]);
            if(response !== undefined) {
                this.setState({
                    loading: this.state.loading = false,
                    empty: this.state.empty = false,
                    userSponsor: this.state.userSponsor =response
                });
            } else {
                this.setState({
                    loading: this.state.loading = false,
                    empty: this.state.empty = true
                });
            }
        } else {
            this.setState({
                loading: this.state.loading = false,
                empty: this.state.empty = true
            });
        }
    
    }

    render() {
        const { loading, empty, userSponsor } = this.state;

        return(
            <div className="register-form">
                {loading && 
                    <div style={{textAlign: 'center'}}>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p>Obteniendo información ...</p>
                    </div>
                }
                {!loading && empty && 
                    <div style={{textAlign: 'center'}}>
                        <Form.Label>Ocurrió un problema al obtener información de patrocinador</Form.Label>
                    </div>
                }
                {!loading && !empty && userSponsor !== undefined &&
                    <div>
                        <Row>
                            <Col sm={12}>
                                <h3>Bienvenido a InClub</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Label>Has sido invitado por {userSponsor.name} {userSponsor.lastname}</Form.Label>
                            </Col>
                        </Row>
                        <hr></hr>
                        <RegisterMainView idSocio={userSponsor.id} reload={false} showWallet={false}></RegisterMainView>
                    </div>
                    
                }
            </div>
        )
    }
}