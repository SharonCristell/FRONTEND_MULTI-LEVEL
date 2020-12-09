import React, { Component } from 'react';
import { Form, Tabs, Tab, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Affiliate from '../management/Affiliate';
import Residual from '../management/Residual';
import InitialPayment from '../management/InitialPayment';
import QuotePayment from '../management/QuotePayment';


export default class ManageActivation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            
        }
    }


    render() {
        return(
            <div style={{padding:30}}>
                 <Form>
{/* 
                    <div className="card-wallet">
                        <p className="title-wallet">Puntaje total por rama: 0.00</p>
                        <Row>
                            <Col sm={4}><p className="label-title">Rama 1: 0.00</p></Col>
                            <Col sm={4}><p className="label-title">Rama 2: 0.00</p></Col>
                            <Col sm={4}><p className="label-title">Rama 3: 0.00</p></Col>
                        </Row>
                    </div>
                    <hr></hr> */}
                    <Affiliate></Affiliate>
                    {/* <Tabs className="custom-tabs-main" defaultActiveKey="tab-patrocinado" id="uncontrolled-tab-example">
                        <Tab eventKey="tab-patrocinado" title="Pagos iniciales">
                            <Affiliate></Affiliate>
                        </Tab> */}
                        {/* <Tab eventKey="tab-residual" title="Pagos de cuotas">
                            <Residual></Residual>
                        </Tab> */}
                    {/* </Tabs> */}
                    {/* <Tabs className="custom-tabs-main" defaultActiveKey="tab-patrocinado" id="uncontrolled-tab-example">
                        <Tab eventKey="tab-patrocinado" title="Pagos iniciales">
                            <InitialPayment></InitialPayment>
                        </Tab>
                        <Tab eventKey="tab-residual" title="Pagos de cuotas">
                            <QuotePayment></QuotePayment>
                        </Tab>
                    </Tabs> */}
                </Form>
            </div>
        );
    }
}