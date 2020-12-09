import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import RouteProtected from './RouteProtected';
import LoginView  from '../login/LoginView';
import RegisterMainView from '../login/RegisterMainView';
import ResetView from '../login/ResetView';
import HomeView from '../home/HomeView';
import HomeGuestView from '../home/HomeGuestView';

import history from './history';
import RegisterEndView from "../login/RegisterEndView";
import AccountView from "../login/AccountView";
import NavBar from '../navigation/NavBar';
import PasswordView from "../config/PasswordView";

import AuthService from '../../services/auth.service';
import HomeInView from '../../views/sections/HomeInView';
import PortfolioView from '../../views/sections/PortfolioView';
import KeolaView from '../../views/sections/KeolaView';
import RiberaView from '../../views/sections/RiberaView';
import RegisterInView from '../../views/sections/RegisterInView';

import RegisterPaymentView from "../payment/RegisterPaymentView";
import UsersView from "../admin/UsersView";
import RegisterExView from "../external/RegisterExView";

import ValidadorView from "../admin/ValidadorView";
import RegisterQuoteView from "../payment/RegisterQuoteView";
import UserSchedulesView from "../admin/UserSchedulesView";

export default class Routes extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            isLogged: false
        }
    }

    handleLogged = (isLogged) => {
        //console.log("route:", isLogged);
        if(!isLogged){
            let isLoggedStorage= AuthService.getIsLogged();
            if(isLoggedStorage){
                isLogged = true;
            }
        }
        this.setState({
            isLogged: this.state.isLogged = isLogged
        });
    }
    render() {
        const { isLogged } = this.state;
        const LoginPage = (props) => {
            return (
              <LoginView 
                isLogged={this.handleLogged}
              />
            );
          }

        return (
            <Router history={history}>
                <NavBar isLogged={isLogged}></NavBar>
                <Switch>
                    <Route path="/sign-in" render={LoginPage}/>
                    <Route path="/register-payment" component={RegisterPaymentView} />
                    <Route path="/register-quote" component={RegisterQuoteView}></Route>
                    <Route path="/payment-quote" component={RegisterQuoteView}></Route>
                    <Route path="/register" component={RegisterExView}></Route>

                    <Route path="/schedules" component={UsersView}></Route>
                    <Route path="/loadfile" component={ValidadorView}></Route>
                    <Route path="/guest" component={HomeGuestView}></Route>

                    <Route path="/user-schedules" component={UserSchedulesView}></Route>

                    
                    <RouteProtected path="/sign-up" component={RegisterMainView} />
                    <Route path="/reset" component={ResetView} />
                    <RouteProtected path="/home" component={HomeView}/>
                    {/* <RouteProtected path="/tree" component={TreeView} /> */}
                    <RouteProtected path="/profile" component={AccountView} />
                    <RouteProtected path="/password" component={PasswordView} />
                    <Route path="/home-in" component={HomeInView} />
                    <Route path="/portfolio" component={PortfolioView} />
                    <Route path="/keola" component={KeolaView} />
                    <Route path="/ribera" component={RiberaView} />
                    <Route path="/register-in" component={RegisterInView} />
                    <Route path="" component={HomeInView} />                
                  
                </Switch>
            </Router>
        )
    }
}