import React, { Component } from 'react';
import { Form, Tabs, Tab, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import RangeManagement from '../management/RangeManagement';


export default class ManagementRange extends Component {

    constructor(props) {
        super(props);

        this.state = {
            
        }
    }


    render() {
        return(
            <div style={{padding:30}}>
                 <RangeManagement></RangeManagement>
            </div>
        );
    }
}