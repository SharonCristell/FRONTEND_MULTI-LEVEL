import React, { Component } from 'react';
import { Form, Tabs, Tab } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';


import PackageMainView from '../shop/PackageMainView';
import ServiceView  from '../shop/ServiceView';
import MyPurchaseView from '../shop/MyPurchaseView';

export default class ShopView extends Component {

    render() {
        return (
            <div>
                <Form.Label class="content-title">Tienda</Form.Label>
                <Tabs className="custom-tabs-main" defaultActiveKey="package" >
                    <Tab eventKey="package" title="Paquetes">
                        <PackageMainView></PackageMainView>
                    </Tab>
                    <Tab eventKey="service" title="Servicios">
                        <ServiceView></ServiceView>
                    </Tab>
                    <Tab eventKey="mypurchase" title="Mis Compras">
                        <MyPurchaseView></MyPurchaseView>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}