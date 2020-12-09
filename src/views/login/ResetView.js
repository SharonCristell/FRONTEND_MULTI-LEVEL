import React, { Component } from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import  queryString from 'query-string';
import Reset from '../../components/login/Reset';
import ResetPassword from '../../components/login/ResetPassword';
import Message from './Message';

import AuthService from '../../services/auth.service';

export default class ResetView extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            tags: <Reset></Reset>
        }

        this.showComponent = this.showComponent.bind(this);
    }


    componentDidMount(){
        this.showComponent();
    }

    handleChange = (e, field) => {
        //console.log(field, ": ",  e.target.value);
        this.setState({[field]: e.target.value});
        //console.log(this.state);
    };

    async showComponent() {
        let url = this.props.location;
        let params  = url.search;
        let listParams = queryString.parse(params);

        //console.log(listParams);
        if(listParams.token !== undefined)
        {
            let data = await AuthService.executeRecoveryPass(listParams.token);
            
            if (data !== undefined){
                let tags;
                if(data.status === 1){
                    tags = <ResetPassword token={listParams.token}></ResetPassword>;
                } else {
                    tags = <Message title="Ups!" content="El enlace ya ha sido usado o expiró."></Message>
                }
                this.setState({
                    tags: this.state.tags = tags
                });
            } else {
                let tags = <Reset></Reset>;
                this.setState({
                    tags: this.state.tags = tags
                });
            }
        }
    }
    render() {
        // GEt URL paramters http://localhost:3000/reset?usuario=user
        // <Route path="/user/:userId" component={UserComponent} />
        // params : ?usuario=user
        
        return (
            <div className="auth-wrapper">
            <div className="auth-inner">
                {this.state.tags}
            </div>
          </div>
        );
    }
    

}
