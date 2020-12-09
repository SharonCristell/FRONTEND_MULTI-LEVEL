import React, { Component } from 'react';
import BankAccount from '../../components/user/BankAccount';

export default class BankInfoView extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <BankAccount></BankAccount>
            </div>
            
        );
    }
}