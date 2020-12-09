import React, { Component } from 'react';
import { Form , Row, Col, Table, Spinner} from 'react-bootstrap'

import Validation from '../../utils/Validation';
import WalletService from '../../../services/wallet.service';

export default class Movement extends Component{

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            registers :[],
            emptyList: true,
            message: "No hay registros para mostrar.",
            loading: false,
            totalPages: 1,
            page: 1,
            size: 30,
        }
    }


    componentDidMount(){
        console.log(this.state.id)
        if(this.state.id > 0){
            this.getWalletRegisters();
        }
        
    }

    componentWillReceiveProps(props){
        console.log(props)
        if(props.id > 0){
            this.setState({
                id: props.id
            });
            this.getWalletRegisters();
        }
    }

    getWalletRegisters = async() => {

        let data = {
            "SizeList" : this.state.size,
            "NroPage" : this.state.page,
            "IdReference" : Number(this.state.id)
        }
      
        let response = await WalletService.getWalletRegisters(data);
        console.log(response)
        if(response !== undefined) {
            if(response.listElements.length > 0) {
                this.setState({
                    registers: this.state.registers = response.listElements,
                    totalPages: this.state.totalPages = response.totalPages,
                    emptyList: this.state.emptyList = false,
                    message: this.state.message = "",
                    loading: this.state.loading = false
                });
            } else {
                this.setState({
                    emptyList: this.state.emptyList = true,
                    message: this.state.message = "No hay registros para mostrar.",
                    loading: this.state.loading = false
                })
            }
        }
    }

    handlePageChange = (e, field) => {
        let value = Number(e.target.value);
        this.setState({
            [field]: this.state[field] = value,
            loading: this.state.loading = true,
            registers: this.state.registers = [],
            emptyList: this.state.emptyList = true,
        });

        // Call to  services
        this.getWalletRegisters();
        
    }

    handleSizeChange = (e, field) => {
        let value = Number(e.target.value);
       
        this.setState({
            size: this.state.size = value,
            page: this.state.page = 1,
            loading: true,
            registers: [],
            emptyList: true,
        });

        // Call to  services
        this.getWalletRegisters();
       
    }


    componentWillReceiveProps(props) {
        if(props.idRef > 0){
            this.getWalletRegisters();
        } 
       
    }

    render() {
        const{registers, emptyList,  loading, page, totalPages, size} = this.state;

        let optionPages = [];
        for(let i = 0; i < totalPages; i++) {
            optionPages.push(<option value={i+1}>{i+1}</option>)
        }
        
        return(
            <div style={{padding: 30}}>
                { this.state.loading && 
                    <div>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p><Form.Label>Cargando información de socios.</Form.Label></p>
                    </div>
                }
                {   this.state.emptyList && !this.state.loading && 
                    <Form.Label>{this.state.message}</Form.Label>
                }
                {  !this.state.emptyList && 
                <div>
                    {/* Paginador */}
                    <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Form inline>
                                    <Form.Label className="my-1 mr-2" htmlFor="selectCount">
                                        Registros: 
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-2 mr-sm-4"
                                        id="selectCount"
                                        defaultValue={'30'}
                                        style={{fontSize: 10}}
                                        onChange={e => {this.handleSizeChange(e, 'size')}} 
                                    >
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </Form.Control>
                                    <Form.Label className="my-1 mr-2" htmlFor="selectCount">
                                        Página: 
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-2 ml-1 mr-1"
                                        id="selecPagesAf"
                                        defaultValue={"1"}
                                        value={page}
                                        style={{fontSize: 10}}
                                        onChange={e => {this.handlePageChange(e, 'page')}} 
                                    >
                                        {optionPages}
                                    </Form.Control>
                                    <Form.Label className="my-1  mr-sm-4" htmlFor="selectCountAf">
                                        de {totalPages} 
                                    </Form.Label>
                                </Form>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Table responsive>
                                <thead className="table-head">
                                    <tr>
                                        <th>Nº </th>
                                        <th>Fecha</th>
                                        <th colSpan={2}>Operación</th>
                                        <th>Monto </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { registers.map(function(item, idx) {
                                                return (
                                                    <tr key={idx}>
                                                        <td>{idx + 1}</td>
                                                        <td>{Validation.convertDateToString(item.availabitilyDate)}</td>
                                                        <td colSpan={2}>{item.referenceData}</td>
                                                        <td>$ {item.amount}</td>
                                                    </tr>
                                                )
                                            })

                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
                }
            </div>
        );
    }
}