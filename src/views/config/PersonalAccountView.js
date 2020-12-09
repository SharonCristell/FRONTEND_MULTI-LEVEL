import React, { Component } from 'react';
import Account from '../../components/user/Account';

export default class PersonalAccountView extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="container-fluid">
                <Account></Account>
            </div>
            
        );
    }
}