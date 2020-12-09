import React, { Component } from 'react';
import { Form, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

import MyPayment from '../../components/comissions/MyPayment';
import Comission from '../../components/comissions/Comission';
import Activation from '../../components/comissions/Activation';
import Wallet from '../../components/comissions/Wallet';

export default class PayView extends Component {
    
    render(){
        return(
            <div>
                <Form.Label className="content-title">Comisiones y pagos</Form.Label>
                <Tabs className="custom-tabs-main" defaultActiveKey="comission" >
                        <Tab eventKey="comission" title="Mis comisiones">
                            <Comission></Comission>
                            {/* <Form.Label>En construcción ...</Form.Label> */}
                        </Tab>
                        <Tab eventKey="mypayment" title="Mis pagos">
                            <MyPayment></MyPayment>
                        </Tab>
                        {/* <Tab eventKey="activation" title="Mis activaciones">
                            <Activation></Activation>
                        </Tab> */}
                        <Tab eventKey="wallet" title="Wallet">
                            <Wallet></Wallet>
                            {/* <Form.Label>En construcción ...</Form.Label> */}
                        </Tab>
                </Tabs>
            </div>
        );
    }
}