import React, { Component } from 'react';
import { Form, Tabs, Tab, Row, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Movement from './wallet/Movement';
import Transfer from './wallet/Transfer';
import TransferWallet from './wallet/TransferWallet';
import ReportProblem from './wallet/ReportProblem';
import TransferPayPal from './wallet/TransferPayPal';

import AuthService from '../../services/auth.service';
import WalletService from '../../services/wallet.service';

import { IoMdAlert } from 'react-icons/io'

export default class Wallet extends Component {

    constructor(props) {
        super(props);
        this.state = {
          showReport: false,
          accountBalance: 0,
          availableBalance: 0,
          registers: [],
          idWallet: 0
        }
        // this.getWalletInformation = this.getWalletInformation.bind(this);
    }

    componentDidMount() {
        // Get amount available
        this.getWalletInformation();
        
    }

    getWalletInformation = async() => {

        let idUser = AuthService.getCurrentIdUser();
        let response = await WalletService.getWalletInformation(idUser);
        if(response !== undefined && response.status === 1) {
            this.setState({
                idWallet: this.state.idWallet = response.objModel.idWallet,
                accountBalance: this.state.accountBalance = response.objModel.accountingBalance,
                availableBalance: this.state.availableBalance = response.objModel.availableBalance,
                registers:  this.state.registers = response.objModel.walletTransactions
            });
        } else {
            this.setState({
                accountBalance: 0,
                availableBalance: 0,
                registers: []
            });
        }
    }

   


    // Handle modal report problem
    handleClose = (e) => {
        this.setState({
            showReport : false
        });
    }
    handleShow = (e) => {
        e.preventDefault();
        this.setState({
            showReport : true
        });
    }
    sendReport = (e) => {
        alert("reportar problema");
    }
   

    render() {
        const { availableBalance, accountBalance, registers, idWallet } = this.state;
        console.log(idWallet);

        return(
            <div style={{padding: 30}}>
                <div className="card-wallet">
                    <p className="title-wallet">Saldo disponible: $ {availableBalance} | Saldo contable: $ {accountBalance}</p>
                    <p style={{color:'green', fontSize: 12}}>Nota: Los montos están en dólares.</p>
                    <div>
                        <a onClick={(e) => { this.handleShow(e)}}>
                            <p className="text-problem">
                                <IoMdAlert size={16} color={"#d62323"} />
                                Reportar problema</p>
                        </a>
                    
                    </div>
                    
                </div>
                
                
                <Tabs className="custom-tabs-main" defaultActiveKey="movement" >
                        <Tab eventKey="movement" title="Movimientos">
                            {idWallet > 0 &&
                            <Movement id={idWallet}></Movement>
    }
                        </Tab>
                        {/* <Tab eventKey="tranferAccount" title="Transferencia a cuenta">
                            <Transfer></Transfer>
                        </Tab> */}
                        <Tab eventKey="tranferWalltet" title="Transferencia entre Wallet">
                            <TransferWallet
                                updateBalance={this.getWalletInformation}
                            ></TransferWallet>
                        </Tab>
                        {/* <Tab eventKey="transferPayPal" title="Transferencia a Mi PayPal">
                            <TransferPayPal></TransferPayPal>
                        </Tab> */}
                </Tabs>
                {/* Modal report problem */}
                <Modal show={this.state.showReport} 
                    onHide={this.handleClose}
                    style={{fontSize: 12}}>
                    <Modal.Header closeButton>
                    <Modal.Title>Reportar problema</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReportProblem></ReportProblem>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" size="sm" onClick={(e) => this.sendReport(e)}>
                        Reportar
                    </Button>
                    <Button variant="secondary" size="sm" onClick={(e) => this.handleClose(e)}>
                        Cancelar
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}