import React, { Component } from 'react';
import PackageSelected from './PackageSelected';
import PaymentMethod from './PaymentMethod';
import { Form, Tabs, Tab, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiCreativeCommonsLine } from 'react-icons/ri';

export default class PackageMainView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTab: "Step1",
            btnBack: 'none',
            btnNext: 'inline0-block',
            tabs: ["Step1", "Step2"],
            packages: [],
            kitInit: []
        }
    }

    componentWillReceiveProps(props) {
      
        this.setState({ 
            packages: props.packages
        })
    }
    /**
     * 
     * @param {*} data  value given for child conmponent, it associates with onChange function from child
     * @param {*} field properties send by child component
     * Send the data using props ( reference of its parents )
     */
    eventhandler = (data, field) => {
        // console.log('register main');
        // console.log(data, field);
        if(this.props.onChange){
            this.props.onChange(data, field);
        }
        
        this.setState({ 
            [field]: this.state[field] = data
        })
       
    };

    eventPay = (data, field) => {
        // console.log('register main');
        // console.log(data, field);
        this.props.eventPay(data, field);
    };

    eventVoucher = (data, field) => {
        this.props.eventVoucher(data, field);
    };

    // event wallet
    eventWallet = (amount) => {
        if(this.props.eventWallet){
            this.props.eventWallet(amount);
        }
    }
    /**
     * 
     * @param {*} e event associates navigation's buttons
     */
    onNavigation = (e) => {
        // console.log(e);
        e.preventDefault();
        let event = e.target.id;
        let current = this.state.currentTab;
        let idx = this.state.tabs.findIndex(element => element === current);
        if (event === "btnBack") {
            idx = idx - 1;
        } else if (event === "btnNext") {
            idx = idx + 1;

        }
        this.updatePageNavigation(idx, current);
    };

    /**
     * TODO : event to handle if the form (steps is complete)
     */
    eventComplete = () => { }


    handleSelect = (key) => {

        let idx = this.state.tabs.findIndex(element => element === key);
        this.updatePageNavigation(idx, key);


    }
    updatePageNavigation = (idx, key) => {
        let back = '';
        let next = '';
        if (idx === (this.state.tabs.length - 1)) {
            next = 'none';
            back = 'inline-block';
            this.props.eventFooter("flex", "displayFooter")

        } else if (idx === 0) {
            next = 'inline-block';
            back = 'none';
            this.props.eventFooter("none", "displayFooter")
        } else {
            next = 'inline-block';
            back = 'inline-block';
            this.props.eventFooter("none", "displayFooter")
        }
        this.setState({
            currentTab: this.state.tabs[idx],
            btnNext: next,
            btnBack: back
        }, () => {
            // console.log(this.state)
        });

    }

    // call validate form
    onValidateToPay = () => {
        if(this.props.validateToPay()){
            return true;
        }

        return false;
    }    


    // Register Buy
    registerBuy = () => {

        if(this.props.registerBuy) {
            this.props.registerBuy();
        }
    }
    render() {
  
        return (
            <div>
                <Row>
                    <Col sm={12}>
                        <PackageSelected onChange={this.eventhandler} ></PackageSelected>
                    </Col>
                </Row>
                <Row>
                    <hr></hr>
                </Row>
                <Row>
                    <Col sm={12}>
                        { (this.state.packages.length > 0 || this.state.kitInit.length > 0) &&
                            <PaymentMethod packages={this.state.packages}
                                ref={this.childPaypal}
                                kitInit = {this.state.kitInit}
                                eventPay={this.eventPay}
                                onchangePayVoucher={this.eventVoucher}
                                validateToPay={this.onValidateToPay}
                                eventWallet={this.eventWallet}
                                registerBuy={this.registerBuy}
                                showWallet={true}></PaymentMethod> 
                        }
                    </Col>
                </Row>
            </div>
        );



    }
}
