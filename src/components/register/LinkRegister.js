import React, { Component } from 'react';
import { Form, Col, Row, Button, Modal, Alert } from 'react-bootstrap';
import { FaCopy } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';

// // Production
// const linkMail = 'https://inclub.world/register-payment';
// const linkServer = 'https://inclub.world'


// Test
const linkMail = 'https://inresorttest.web.app/register-payment'
const linkServer = 'https://inresorttest.web.app'

export default class LinkRegister extends Component {

    constructor(props) {

        super(props);
        this.state = {
            idSocio : props.idSocio,
            link: "link",
            loadModal: false,
            stateCopy: "Copiar"
        }
    }
    getLink = (e) => {

        navigator.clipboard.writeText(this.state.link)

        this.setState({
            stateCopy: this.state.stateCopy = "Copiado"
        });

    }

    handleClose = () => {
        this.setState({
            loadModal: this.state.loadModal = false,
            stateCopy: this.state.stateCopy = "Copiar"
        });
    }

    handleShow  = () => {
         // sha256 idusuario = c5d0e836701cbad41fcfd2d19af762b0b0a870d9e86ccb190ab0aa9a0fa99df6
        let idSocio =  this.state.idSocio;
        let link = linkServer + '/register?c5d0e836701cbad41fcfd2d19af762b0b0a870d9e86ccb190ab0aa9a0fa99df6=' + idSocio;
         
        this.setState({
            loadModal: this.state.loadModal = true,
            link: this.state.link = link
        });
    }

    render(){
        const { loadModal, link, stateCopy } = this.state;
        return(
            <div>
                <Row style={{textAlign: 'right', paddingTop: 10, paddingBottom: 20}}>
                    <Col sm={12}>
                        <Button variant="outline-primary" 
                            onClick={e => this.handleShow(e)}><FiLink></FiLink>&nbsp;Link de registro</Button>
                    </Col>
                    {/* <Alert variant="info">
                            <p style={{wordBreak: 'break-word'}}
                                onClick={ e => this.getLink(e)}>{link}
                                <p style={{textAlign: 'end'}}>
                                    <FaCopy></FaCopy>&nbsp;{stateCopy}
                                </p>
                            </p>
                        </Alert> */}
                </Row>
                <Modal show={loadModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Link de registro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <Row>
                            <Col sm={12}>
                                <Form.Label>Link de registro: </Form.Label>
                            </Col>
                        </Row> */}
                         <Row>
                            <Col sm={12}>
                        <Alert variant="info">
                            <p style={{wordBreak: 'break-word'}}
                                onClick={ e => this.getLink(e)}>{link}
                                <p style={{textAlign: 'end'}}>
                                    <FaCopy></FaCopy>&nbsp;{stateCopy}
                                </p>
                            </p>
                        </Alert>
                        </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cerrar
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}