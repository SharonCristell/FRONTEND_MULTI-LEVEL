import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ReportProblem extends Component{
    constructor(props){
        super(props);
        this.state = {
            message:"",
            max: 2500
        }
    }

    handleChange = (e, field) => {
        let value = e.target.value;
        this.setState({
            [field]: this.state[field] = value
        });
        // if (this.props.onChange) {
        //     this.props.onChange(e.target.value, field);
        //     this.setState({
        //         [field]: this.state[field] = value
        //     });
        // }
        // })
    };

    render() {
        // //console.log(this.state.message.length);
        return(
            <div style={{padding: 30}}>
                <Form>
                    <Form.Group>
                        <Form.Label>Asunto</Form.Label>
                        <Form.Control></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Mensaje</Form.Label>
                        <Form.Control as="textarea" rows="4" maxLength={this.state.max}
                            onChange={e => this.handleChange(e, "message")}
                            ></Form.Control>
                        <Form.Text>{this.state.message.length}/{this.state.max}</Form.Text>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}