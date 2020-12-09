import React, { Component } from 'react';
import Password from '../../components/register/Password';

export default class PasswordView extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="panel-form">
                <Password></Password>
            </div>
            
        );
    }
}