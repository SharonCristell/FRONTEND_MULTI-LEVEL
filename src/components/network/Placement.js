import React, { Component } from 'react';
import { Form, Table, Button, Spinner, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

import Autosuggest from 'react-autosuggest';
import AutosuggestCustom from './AutosuggestCustom';

import Validation from '../utils/Validation';
import UserService from '../../services/user.service';
// import DropSuggest from './DropSuggest';

export default class Placement extends Component {

    constructor(props){
        super(props);
        this.state = {
            registers: [],
            value: '',
            loadRegisters: false,
            loading: true,
            noData: false,
            noDataMesssage: false,
            tree: [],
            idsUpliner: [],
            listUpliner : [],
            suggestions: [],
            loadSenData : false,
            loadConfirm: false,
            itemSaved: undefined
        }

        this.getRegister = this.getRegister.bind(this);
        this.getListAvailable = this.getListAvailable.bind(this);
        
    }

    componentDidMount() {
        this.getRegister();
    }

    componentWillReceiveProps(props) {
        // From register step 3: select suscription
        this.setState({ 
            tree: this.state.tree = props.data 
        });

        // console.log(props.data)
        // Convert tree into list only with the child have < 3 children and the state team==SI
        let listTree = [];
        let idsUpliner = [];

        // verify the root
        let tree = this.state.tree;
        if(tree.length > 0){
            if(tree[0].children.length < 3) {
                listTree.push(tree[0]);
                idsUpliner.push(tree[0].id)
            }
            this.getListAvailable(tree[0].children, listTree, idsUpliner);
            // console.log(listTree)
        }

        // order list accordign to level
        listTree.sort(function(a,b) { return a.nivel - b.nivel})
        this.setState({ 
            suggestions: this.state.suggestions = listTree ,
            idsUpliner : this.state.idsUpliner = idsUpliner
        });
        // console.log(listTree);
        // console.log(idsUpliner );

     
    }
    getListAvailable = (children, listTree, idsUpliner) => {

        let list = []
        for(let i=0; i < children.length; i++) {
            // console.log(children[i])
            if(children[i].children.length < 3 && children[i].team !== undefined && children[i].team.toUpperCase().includes('SI')){
                listTree.push(children[i]);
                idsUpliner.push(children[i].id)
                // console.log(children[i])
            }
            //get children
            this.getListAvailable(children[i].children, listTree, idsUpliner)
        }
        // return list;
    }

    // Get register for the table: user uvailable
    async getRegister() {
        let response = await UserService.getRegPlacement();
        if(response !== undefined && response !== null){
            if(response.status !== 1) {
                //console.log(response);
                this.setState({
                    registers: this.state.registers = [],
                    loading: this.state.loading = false,
                    loadRegisters: this.state.loadRegisters = true,
                    noData: this.state.noData = true,
                    noDataMesssage : this.state.noDataMessage = "Ocurrió un problema mientras obteniamos los registros. Inténtelo más tarde.",
                });
            } else {
                if(response.objModel.length > 0) {
                    this.setState({
                        registers: this.state.registers = response.objModel,
                        loading: this.state.loading = false,
                        loadRegisters: this.state.loadRegisters = true,
                        noData: this.state.noData = false,
                        noDataMesssage : this.state.noDataMessage = "",
                    });
                } else {
                    this.setState({
                        registers: this.state.registers = response.objModel,
                        loading: this.state.loading = false,
                        loadRegisters: this.state.loadRegisters = false,
                        noData: this.state.noData = true,
                        noDataMesssage : this.state.noDataMessage = "No hay registros para mostrar.",
                    });
                }
               
            }
        }
        

    }

    // Set position with post services
    setPosition = async(e, item) => {

        //Verify if upliner is selected; 
        if(item.idUpliner !== undefined && item.idUpliner > 0) {

            // Change state
            this.setState({
                loadConfirm: this.state.loadConfirm = true,
                itemSaved: this.state.itemSaved = item
            });
            // consume services without confirm
            // this.savePosition(item);

        } else {
           
            alert("Seleccione un upliner");
        }
        
    }

    savePosition = async(item) => {
        this.setState({
            loadSenData: this.state.loadSenData = true
        });

        let data = {
            idUpliner : item.idUpliner,
            idSon :     item.idSon
        };

        let response =  await UserService.saveUpliner(data);
        // this.updateData(item);
        
        if(response !== undefined) {
            this.setState({
                loadSenData: this.state.loadSenData = false
            });
            if(response.status === 1) {
                // update suggestion
                this.updateData(item);
                alert("La información ha sido guardada correctamente.")
            } else {
                alert("No pudimos guardar su información. Inténtelo más tarde.");
            }
        } else {
            this.setState({
                loadSenData: this.state.loadSenData = false
            });
            alert("Tuvimos un error al guardar la información. Inténtelo más tarde.");
        }
    }
    
    // modal confirm
    handleCloseConfirm = () => {
        this.setState({
            loadConfirm : this.state.loadConfirm = false,
            itemSaved : this.state.itemSaved = undefined
        });
    }
    
    handleConfirm = (e) => {
        this.setState({
            loadConfirm : this.state.loadConfirm = false,
        });

        let savedData = this.state.itemSaved;
        this.savePosition(savedData);

    }
    /**
     * Update data after save  registration of upliner
     * @param {*} item 
     */
    updateData = (item) => {
        // For looking in register item.IdSon and delete
        let register = this.state.registers;
        let temp = []
        for(let i=0; i < register.length; i++) {
            if(register[i].idSon !== item.idSon) {

                // TOD update upliners set in null
                register[i].idUpliner = 0;
                register[i].upliner = 0;
                
                temp.push(register[i])

               
            }
        }
        // set suggestions until tree services response
        this.setState({
            registers : this.state.registers = temp,
            loadSenData: this.state.loadSenData = false,
            suggestions: this.state.suggestions = []
        });

        // Update tree residual
       if(this.props.updateTree) {
           this.props.updateTree("Actualizando lista de upliners.", true)
       }
    }

    /**
     * Update data after save  registration of upliner
     * @param {*} item 
     */
    // updateData = (item) => {
    //     // For looking in register item.IdSon and delete
    //     let register = this.state.registers;
    //     let temp = []
    //     for(let i=0; i < register.length; i++) {
    //         if(register[i].idSon !== item.idSon) {
    //             temp.push(register[i])
    //         }
    //     }
    //     this.setState({
    //         registers : this.state.registers = temp
    //     });

    //     // looking into suggestion with ididUpliner and verify their child 
    //     // idUpliner is idHijo in the array suggestion
    //     let idsUpliner = [];
    //     let suggestions = this.state.suggestions;
    //     let tempSug = []
    //     for(let i=0; i < suggestions.length; i++) {
    //         if(suggestions[i].idsocio === item.idUpliner) {
    //             //Verify children
    //             if(suggestions[i].children.length < 2) {
    //                 // if it < 2 => push item 
    //                 suggestions[i].children.push({id: item.idSon});
    //                 tempSug.push(suggestions[i]);
    //             } 
    //             // else {
    //             //     // else no consider in th enew array
    //             // }
    //         } else {
    //             tempSug.push(suggestions[i]);
    //             idsUpliner.push(suggestions[i].id);
    //         }
    //     }

    //     this.setState({
    //         suggestions : this.state.suggestions = tempSug,
    //         idsUpliner : this.state.idsUpliner = idsUpliner
    //     });

    // }

    selectUpliner = (item, upliner) => {
        // Receive item from autosuggestcustom
        //Update register in the list
        let register = this.state.registers;
        let flag = false;

        for(let i=0; i < register.length; i++) {
            if(register[i].idSon === item.idSon) {
                if(upliner !== undefined) {
                    register[i].idUpliner = upliner.id;
                    register[i].upliner = upliner;
                    flag = true;
                } else {
                    register[i].idUpliner = -1;
                    register[i].idUpliner = undefined;
                    flag = true;
                }
            }
        }

        if(!flag) {
            alert("Registro no disponible.")
        } else {
            this.setState({
                registers: this.state.registers = register
            });
        }
    }

    handleSelectUpLiner = (e, item) => {
      
        //Update register in the list
        let register = this.state.registers;
        let name = e.target.options[e.target.selectedIndex].text;
        let id = e.target.value;
        let flag = false;

        for(let i=0; i < register.length; i++) {
            if(register[i].idSon === item.idSon) {
                register[i].idUpliner = Number(id);
                flag = true;
            }
        }

        if(!flag) {
            alert("Registro no disponible.")
        } else {
            this.setState({
                registers: this.state.registers = register
            });
        }

    }
    
    getState = (idState) => {
        let description = "";
        if(idState === 0 ) {
          // Inactivo
          description = "Inactivo"
          
        } else if(idState === 1 ) {
          // Patrocinados directos
          description = "Activo"
          
        }  else if(idState === 2 ) {
          // Socios activos
          description = "Pendiente"
          
        }  else if(idState === 3 ) {
          // Activos nuevos
          description = "Temporal"
          
        } else if(idState === 4 ) {
          // socio con deuda
          description = "Pago despues"
          
        } 
        
        return description;
    }
    

    render() {
        const {  registers, suggestions, value, loadRegisters, loading, noData, noDataMesssage, loadSenData, loadConfirm, itemSaved} = this.state;
    //   console.log(itemSaved)
        return(
            <div style={{padding:30 }}>
                <Table responsive>
                    <thead className="table-head">
                        <tr>
                            <th>Usuario</th>
                            <th>Nombres</th>
                            <th>Fecha</th>
                            <th>Tipo de Membresía</th>
                            <th>Estado</th>
                            <th>Upliner</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { loading &&
                            <tr>
                                <td colSpan={6}>
                                    <div>
                                        <Spinner animation="border" variant="dark">
                                        </Spinner>
                                        <p>Cargando registros...</p>
                                    </div>
                                </td>
                            </tr>
                        }
                        { loadRegisters &&
                            (this.state.registers.map((item, idx)  => {
                                let date = "";
                                // console.log(item)
                                let value = (item.upliner !== undefined)? item.upliner.title : "";
                                    return (
                                        <tr key={item.idSon}>
                                            <td>{item.username}</td>
                                            <td>{item.name} {item.lastname}</td>
                                            <td>{Validation.convertDateToString(item.createDate)}</td>
                                            <td>{item.packageName}</td>
                                            <td>{this.getState(item.idState)}</td>
                                            {/* <td>
                                                <Form.Control as="select"
                                                    defaultValue="0"
                                                    value={item.idUpliner}
                                                    style={{fontSize: 10}}
                                                    onChange={e => this.handleSelectUpLiner(e, item)}>
                                                    <option value="0" disabled>Seleccione..</option>
                                                    {suggestions.map((item, id) => (
                                                        <option value={item.idsocio}>{item.title}</option>
                                                    ))}
                                                </Form.Control>
                                            </td> */}
                                            <td align={"left"}>
                                            {
                                             item.idState === 1 &&
                                                <AutosuggestCustom 
                                                    id={item.idSon}
                                                    value={value}
                                                    item={item}
                                                    list={suggestions}
                                                    selectUpliner={this.selectUpliner}></AutosuggestCustom>
                                            }
                                            </td>
                                            <td>
                                                { item.idState === 1 &&
                                                    <Button variant="success" 
                                                        size="sm"
                                                        onClick={e => {this.setPosition(e, item)}}>Posicionar</Button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }))
                        }
                       
                        {noData && 
                        <tr>
                            <td colSpan="6">
                                    <Form.Label>{noDataMesssage}</Form.Label>
                            </td>
                        </tr>
                        }
                         <tr>
                            <td colSpan={6}>
                                <div style={{height: '400px'}}>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {/* loading */}
                <Modal
                    show={loadSenData}
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="static"
                    centered>
                    <Modal.Body>
                        <div style={{textAlign: 'center'}}>
                            <Spinner size="sm" animation="border" variant="dark">
                            </Spinner>
                            <Form.Label>&nbsp; Guardando información...</Form.Label>
                        </div>
                    </Modal.Body>
                </Modal>
                {/* confirmacion */}
                <Modal show={loadConfirm} onHide={this.handleCloseConfirm}>
                    <Modal.Header closeButton>
                    {/* <Modal.Title>Modal heading</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>{ itemSaved !== undefined && <div>
                        ¿Desea posicionar a <b>{itemSaved.name} {itemSaved.lastname}</b> debajo de <b>{itemSaved.upliner.title}</b>?
                        </div>}
                        </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseConfirm}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={e => this.handleConfirm(e)}>
                        Confirmar
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}