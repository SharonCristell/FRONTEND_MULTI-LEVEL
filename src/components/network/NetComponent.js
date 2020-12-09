import React, { Component } from 'react';
import OrganizationChart from "@dabeng/react-orgchart";
import {Form, Carousel, Row, Col, Card, Table, Spinner, Button, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../views/styles/Custom.css';
import  { BsFillSquareFill } from 'react-icons/bs';

import AuthService from '../../services/auth.service';
import  UserService from '../../services/user.service';
import Tree from './netcomp/Tree';

// * state: 1 -> Activo / 0-> Inactivo / 3-> temporal / 4 Pagar 
 const state = {
   "0": "Inactivo",
   "1": "Activo",
   "2": "Pendiente",
   "3": "Temporal",
   "4" : "Pagar"
 }

const colorActiveNew = "#8bc34a"; // Activo(nuevo o migración)
const colorActive = "#2c43c3"; // Activo
const colorPending ="#ec8c1e"; // Pendiente
const colorAfter ="#f11e45"; // Pagar después
const colorInactive ="#9e9e9e"; //Inactivo

export default class NetComponent extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      stateTree: false,
      loading: true,
      noDataTree: false,
      noDataMessage: '',
      showModal: false
    };
  }

  componentDidMount(){
    this.getTree();
    
  }

  /**
   * 
   * @param {*} temp 
   * @param {*} id 
   * @param {*} nivel 
   */

  getChildren = (temp, item, nivel) => {
    let children = [];
    let arrayLevel = temp[nivel];

    if(arrayLevel !== undefined){
      for(let i = 0; i < arrayLevel.length; i++){
        let register = arrayLevel[i];
        if(register.idsocio === item.idsocio) {
          let status = this.getState(register.estadoHijo);
            
          // console.log(register)
          if( register.idHijo > 0){
            children.push({
              id: register.idHijo,
              idsocio: register.idHijo,
              title: register.nombreHijo,
              state: status.state,
              colorState: status.colorState,
              showChild: false,
              children: [],
              team: register.team
            })
          }
        }
      }
    }
    
    // Get each children 
    for(let x=0; x < children.length; x++){
      
      children[x].children = this.getChildren(temp, children[x], nivel + 1);
    }


    return children;
  }

  getMainChildren = (temp, nivel) => {

    let children = []
    let idsChildren = []
    
    //Arreglo por niveles:
    let arrayLevel = [];

    for(let i = 0; i < temp.length; i++){
      if(temp[i].idsocioramaprincipal === temp[i].idsocio 
          && temp[i].nivel === nivel){
            // console.log("idsChildren")
        if(!idsChildren.includes(temp[i].idsocio)) {
          // add to child array
          idsChildren.push(temp[i].idsocio)

          temp[i].id = temp[i].idsocio;
          temp[i].title = temp[i].nombreSocio;
          let state = this.getState(temp[i].estadoSocio);
          temp[i].state = state.state;
          temp[i].colorState = state.colorState;

          temp[i].showChild = false;
          // temp[i].children = [];
          children.push(temp[i]);
        }
        
      }

      // Add to array list
      if(arrayLevel[temp[i].nivel] === undefined){
        arrayLevel[temp[i].nivel] = [temp[i]];
      } else {
        arrayLevel[temp[i].nivel].push(temp[i]);
      }
     
    }

    // Get each children 
    for(let x=0; x < children.length; x++){
      
      children[x].children = this.getChildren(arrayLevel, children[x], nivel);
    }

    return children;
  }  

  // get state
  getState = (idState) => {

     // Verify state
     let data = {
       state: "",
     };
     if(idState === 0 ) {
      // Inactivo
      data.state = "Inactivo";
      data.colorState = colorInactive;
      
    } else if(idState === 1 ) {
      // Patrocinados directos
      data.state = "Activo";
      data.colorState = colorActive;
      
    }  else if(idState === 2 ) {
      data.state = "Pendiente";
      data.colorState = colorPending;
      
    }  else if(idState === 3 ) {
      // Activos nuevos
      data.state = "Temporal";
      data.colorState = colorActiveNew;
      
    } else if(idState === 4 ) {
      // socio con deuda
      data.state = "Pago despues";
      data.colorState = colorAfter;     
    } 
    
    return data;
  }

  async getTree() {
    let treeResponse = await UserService.getPatrocinioTree();
    if(treeResponse !== null && treeResponse !== undefined){
      if(treeResponse.status === 1){
        
        // Add root
        let data = treeResponse.objModel;
        let i;
        let temp = data;

        let idSocio =  Number(AuthService.getCurrentIdUser());
        let infoUser = AuthService.getCurrentUserInfo();
        let nivel = 1;

        let tree ={
          id: idSocio,
          title: infoUser.name + " " + infoUser.lastname,
          state: " ",
          colorState: colorActive
        };
        
        let mainChildren = this.getMainChildren(temp, nivel);
        tree.children = mainChildren;
       
       
        this.setState({
          treeData: this.state.treeData = [tree],
          stateTree: this.state.stateTree = true,
          loading: this.state.loading = false,
          noDataTree: this.state.noDataTree = false,
          noDataMessage: this.state.noDataMessage = ''
        });
      } else {
        this.setState({
          tree: [],
          stateTree: this.state.stateTree = false,
          loading: this.state.loading = false,
          noDataTree: this.state.noDataTree = true,
          noDataMessage: this.state.noDataMessage = 'No podemos mostrar su red. Consulte acerca de su red.'
        });
      }
    } else {
      this.setState({
        tree: [],
        stateTree: this.state.stateTree = false,
        loading: this.state.loading = false,
        noDataTree: this.state.noDataTree = true,
        noDataMessage: this.state.noDataMessage = 'No podemos mostrar su red. Consulte acerca de su red.'
      });
    }
    
  }
  
  updateTree = () => {
    this.setState({
      loading: this.state.loading = true
    });
    this.getTree();
  }

  handleShow = (e) => {
    console.log("show modal")
    this.setState({
      showModal : this.state.showModal = true
  });
  }
  handleClose = () => {
    this.setState({
        showModal : this.state.showModal = false
    });
}


  render() {
    const { treeData, stateTree, loading, noDataTree, noDataMessage, showModal} = this.state;
    return (
      <div>
        <Row style={{paddingTop: 30}}>
          <Col sm={12}>
            <Form className="box-legend">
                  <BsFillSquareFill color="#8bc34a"></BsFillSquareFill> <Form.Label>Activo(nuevo o migración)</Form.Label><br/>
                  <BsFillSquareFill color="#2c43c3"></BsFillSquareFill> <Form.Label>Activo</Form.Label><br/>
                  <BsFillSquareFill color="#ec8c1e"></BsFillSquareFill> <Form.Label>Pendiente</Form.Label><br/>
                  <BsFillSquareFill color="#f11e45"></BsFillSquareFill> <Form.Label>Pagar después</Form.Label><br/>
                  <BsFillSquareFill color="#9e9e9e"></BsFillSquareFill> <Form.Label>Inactivo</Form.Label><br/>
              </Form>
              {/* <Form className="box-legend">
                  <BsFillSquareFill color="#9e9e9e"></BsFillSquareFill> <Form.Label>Patrocinados directos</Form.Label><br/>
                  <BsFillSquareFill color="#2c43c3"></BsFillSquareFill> <Form.Label>Socios activos(Pagando la primera cuota en adelate)</Form.Label><br/>
                  <BsFillSquareFill color="#8bc34a"></BsFillSquareFill> <Form.Label>Activo nuevo(A partir de Experience y solo pago cuota inicial)</Form.Label><br/>
                  {/* <BsFillSquareFill color="#f7e123"></BsFillSquareFill> <Form.Label>Stand By y Promotor</Form.Label><br/> */}
                  {/* <BsFillSquareFill color="#f11e45"></BsFillSquareFill> <Form.Label>Socios con deuda</Form.Label>
              </Form>  */}
          </Col>
        </Row>
        {loading &&
           <div>
           <Spinner animation="border" variant="dark">
           </Spinner>
           <p>Cargando árbol de patrocinio.</p>
           </div>}
        {/* {!loading && stateTree && <Row>
          <Col sm={12}>
            <Button onClick={(e) => this.handleShow(e)}>Vista completa</Button>
          </Col>
        </Row>} */}
        {!loading && stateTree && <Row style={{paddingTop: 30}}>
            <Col sm={12}>
              <Tree tree={treeData} updateTree={this.updateTree}></Tree>
            </Col>
          </Row>}
        {!loading && noDataTree && <Form.Label>{noDataMessage}</Form.Label>}
        
        {/* Modal to watch  */}
          <Modal 
                    show={showModal} 
                    onHide={this.handleClose}
                    size="lg"
                    style={{fontSize:12}}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                    <Row>
                      <Col sm={12}>

                      <Tree tree={treeData} updateTree={this.updateTree}></Tree>
                      </Col>
                    </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={this.handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
        
      </div>
      
    );
  }
}