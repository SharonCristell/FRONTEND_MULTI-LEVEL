import React, { Component } from 'react';
import { Form, Table } from 'react-bootstrap';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { IoIosCloseCircle } from 'react-icons/io';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserService from '../../services/user.service';

export default class Activation extends Component {
    constructor(props){
        super(props);
        this.state = {
            activations: [],
            loadActivations: false
        };

        this.getActivations = this.getActivations.bind(this);
    }
    
    componentDidMount(){

        // Call services
        this.getActivations();
    }

    async getActivations() {
        //console.log("activtions");
        let activations = await UserService.getActivations();
        if(activations !== undefined && activations !== null){
            if(activations.status !== 1) {
                //console.log(activations);
                this.setState({
                    activations: this.state.activations = [],
                    loadActivations: this.state.loadActivations = true
                });
            } else {
                
                this.setState({
                    activations: this.state.activations = activations.objModel,
                    loadActivations: this.state.loadActivations = true
                });
            }
        }
    }

    render() {
        return(
            <div  style={{padding:30}}>
                <Form>
                    <Table responsive>
                        <thead className="table-head">
                            <tr>
                                <th>Activo desde</th>
                                <th>Activo hasta </th>
                                <th>Puntos</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.activations.map(function(item) {
                                let date = "";
                                    return (
                                        <tr key={item.id}>
                                            <td>text </td>
                                            <td>text</td>
                                            <td>
                                                <div style={{color: 'green'}}>
                                                    <IoIosCheckmarkCircle size={32} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Form></div>
        );
    }
}