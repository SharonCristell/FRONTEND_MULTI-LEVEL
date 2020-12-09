import React, { Component } from 'react';
import { Form, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

import NetComponent from '../../components/network/NetComponent';
import Placement from '../../components/network/Placement';
import Promotor from '../../components/network/Promotor';
import ManageActivation from '../../components/network/ManageActivation'; 
import ManagementRange from '../../components/network/ManagementRange';
import Sponsor from '../../components/network/Sponsors';
import  NetResidual from '../../components/network/NetResidual';

export default class NetworkView extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            tree: []
        }

        //Ref
        this.childResidual = React.createRef();
    }
    setTree = (data, field) => {
        this.setState({
            tree: data
        });
    }

    updateResidual = (message, loaded) => {
        // Call update tree of child
        this.childResidual.current.updateTree(message, loaded);
    }

    render() {
        
        const { tree } =  this.state;
        
        return(
            <div>
                <Form.Label className="content-title">Mi Red</Form.Label>
                
                <Tabs className="custom-tabs-main" defaultActiveKey="treePat" >
                        <Tab eventKey="treePat" title="Árbol de Patrocinio">
                            <NetComponent type="patrocinio"></NetComponent>
                            {/* <Form.Label>En construcción ...</Form.Label> */}
                        </Tab>
                        <Tab eventKey="treeResidual" title="Árbol Residual">
                            <NetResidual ref={this.childResidual}
                                type="residual"
                                setTree={this.setTree}></NetResidual>
                            {/* <Form.Label>En construcción ...</Form.Label> */}

                        </Tab>
                        <Tab eventKey="sponsor" title="Lista de socios">
                            <Sponsor></Sponsor>
                            {/* <Form.Label>En construcción ...</Form.Label> */}
                        </Tab>
                        <Tab eventKey="placement" title="Placement">
                            <Placement data={tree}
                                updateTree={this.updateResidual}></Placement>
                            {/* <Form.Label>En construcción ...</Form.Label> */}
                        </Tab>
                        {/* <Tab eventKey="promotor" title="Promotores">
                            <Promotor></Promotor>
                        </Tab> */}
                        {/* <Tab eventKey="historyRange" title="Historial de Rangos">
                            
                        </Tab> */}
                        <Tab eventKey="activations" title="Gestión de Activación">
                            <ManageActivation></ManageActivation>
                            {/* <Form.Label>En construcción ...</Form.Label> */}
                        </Tab>
                        <Tab eventKey="ranges" title="Gestión de Rango">
                            <ManagementRange></ManagementRange>
                        </Tab>
                </Tabs>
            </div>
        );
    }
}