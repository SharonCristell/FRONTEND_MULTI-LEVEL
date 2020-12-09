import React, { Component } from 'react';
import Profile from '../../components/register/Profile';

export default class ProfileView extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <Profile></Profile>
            </div>
            
        );
    }
}