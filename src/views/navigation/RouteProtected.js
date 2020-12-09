import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../../services/auth.service';

export default class RouteProtected extends Component {

    render() {
        // //console.log("Route private");
        const Componentview = this.props.component;
        const isLogged= AuthService.getIsLogged();

        return  isLogged ? 
        (<Componentview></Componentview>): 
        (<Redirect to={"/home-in"}></Redirect>);
    }
}