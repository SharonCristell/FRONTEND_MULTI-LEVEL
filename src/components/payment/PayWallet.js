import React, { Component } from 'react';
import { Form, Row, Col, Image, Button, Spinner } from 'react-bootstrap';
import { RiDeleteBinLine } from 'react-icons/ri';

import AuthService from '../../services/auth.service';
import WalletService from '../../services/wallet.service';


export default class PayWallet extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            idUser: props.idUser,
            accountBalance: 0,
            availableBalance: 0,
            total: this.props.total,
            amount: 0,
            message: ""
        }
        
    }
    componentDidMount() {
        
        this.getWalletInformation();
    }

    getWalletInformation = async() => {

        let response = await WalletService.getWalletInformation(this.state.idUser);
        if(response !== undefined && response.status === 1) {
            this.setState({
                loading: this.state.loading = false,
                accountBalance: this.state.accountBalance = response.objModel.accountingBalance,
                availableBalance: this.state.availableBalance = response.objModel.availableBalance
            });
        } else {
            this.setState({
                loading: this.state.loading = false,
                accountBalance: 0,
                availableBalance: 0
            });
        }
    }

    handleChange = (e, field) => {
        let value = Number(e.target.value);
        if(value <= this.state.availableBalance) {
            this.setState({
                [field]: this.state[field] = value,
                message: ""
            });
        } else {
            this.setState({
                [field]: this.state[field] = 0,
                message: " Monto no puede exceder el saldo contable"
            });
        }
       
    }

    onAddWallet = (e) => {
        
        this.props.eventWallet(this.state.amount);
        this.props.close();
       
    }

    onSave = (e) => {
        
        this.props.registerPayWallet(this.state.amount);
        this.props.close();
       
    }

   
    

    render() {

        const { total, amount, availableBalance, accountBalance, message, loading} = this.state; 
   
        return(
            <div>
                {loading && 
                    <div style={{textAlign: 'center'}}>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p><Form.Label>Cargando información...</Form.Label></p>
                    </div>
                }
                {!loading && 
                    <div>
                    
                        <Row>
                            <Col sm={12}>
                                <Form.Label>Saldo disponible: $ {availableBalance}</Form.Label> 
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Label>Saldo contable: $ {accountBalance}</Form.Label>
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col sm={12}>
                                <Form.Label>Monto a pagar: $ {total}</Form.Label> 
                            </Col>
                        </Row>
                        <Row style={{paddingBottom:10}}>
                            <Col sm={12}>
                                <Form.Label>Ingrese monto USD:</Form.Label>
                                <Form.Control placeholder="Ingrese monto"
                                            type="number" min="0"
                                            defaultValue={amount}
                                            style={{fontSize: 10}}
                                            onChange={(e) => {this.handleChange(e, 'amount')}}
                                ></Form.Control>
                                <Form.Text className="text-alert">{message}</Form.Text>
                            </Col>
                        </Row>
                    
                    </div>
                }
                
                <Row className="row justify-content-between">
                    <Col ms={4}>
                        <Button variant="secondary" size="sm" onClick={this.props.close}>
                            Cancelar
                        </Button>
                        
                    </Col>
                    {amount > 0 && amount < total && 
                    <Col  style={{textAlign: 'right'}}>
                            <Button variant="primary" size="sm" onClick={this.onAddWallet}>
                            Agregar 
                        </Button>
                    </Col>
                    }
                    {amount > 0 && amount === total && 
                        <Col  style={{textAlign: 'right'}}>
                            <Button variant="primary" size="sm" onClick={this.onSave}>
                                Pagar 
                            </Button>
                        </Col>
                    }
                </Row>
            </div>



        );
    }   
}