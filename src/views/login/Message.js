import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Message extends Component {

    constructor(props){
        super(props);
        
    }

    render() {
        //console.log(this.props);
        return(
            <div>
                <h3>{this.props.title}</h3>
                <Form>
                    <Form.Text style={{textAlign:'center'}}>
                        {this.props.content}
                    </Form.Text>
                </Form>
            </div>
        );
    }
}