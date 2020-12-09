import React, { Component } from 'react';
import { Form, Tabs, Tab } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css'


import ProfileView from '../config/ProfileView';
import DocumentView  from '../config/DocumentView';
import PersonalAccountView  from '../config/PersonalAccountView';
import BankInfoView  from '../config/BankInfoView';
import AboutView  from '../config/AboutView';

export default class AccountView extends Component {

    render() {
        return (
            <div  class="form-style">
                <Form.Label class="content-title">Datos del Socio</Form.Label>
                <Tabs className="custom-tabs-main" defaultActiveKey="accountView" >
                    <Tab eventKey="accountView" title="Datos de la cuenta">
                        <PersonalAccountView></PersonalAccountView>
                    </Tab>
                    <Tab eventKey="profileView" title="Datos personales">
                        <ProfileView></ProfileView>
                    </Tab>
                    <Tab eventKey="bankView" title="Datos bancarios">
                        <BankInfoView></BankInfoView>
                    </Tab>
                    <Tab eventKey="documentView" title="Mis contratos">
                        <DocumentView></DocumentView>
                    </Tab>
                    <Tab eventKey="aboutView" title="Información de la Empresa">
                        <AboutView></AboutView>
                    </Tab>
                
                </Tabs>
            </div>
        );
    }
}