import React, { Component } from 'react';
import {Form, Row, Col, Card, Table, Spinner, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


import Tree from '../network/netcomp/Tree';
import 'react-sortable-tree/style.css'; 

import  { BsFillSquareFill } from 'react-icons/bs';

import AuthService from '../../services/auth.service';
import  UserService from '../../services/user.service';
import '../../views/styles/Custom.css';

const colorActiveNew = "#8bc34a"; // Activo(nuevo o migración)
const colorActive = "#2c43c3"; // Activo
const colorPending ="#ec8c1e"; // Pendiente
const colorAfter ="#f11e45"; // Pagar después
const colorInactive ="#9e9e9e"; //Inactivo

export default class NetResidual extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: [],
      stateTree: false,
      loading: true,
      noDataTree: false,
      treeData: [],
      message: "",
      loadUpliners: false
    };
  }

  componentDidMount(){
    this.getTree();
  }

  getChildren = (temp, item, nivel) => {
    let children = [];
    let arrayLevel = temp[nivel];
    let team = "SI";
    let levelChild = nivel + 1
    if(arrayLevel !== undefined){
      for(let i = 0; i < arrayLevel.length; i++){
        let register = arrayLevel[i];
        if(register.idsocio === item.idsocio) {
          if( register.idHijo > 0){
           
            let status = this.getState(register.estadoHijo);
            
            if(register.team.toUpperCase().includes("NO") ) {
              team = "NO";
            }
            children.push({
              id: register.idHijo,
              idsocio: register.idHijo,
              title: register.nombreHijo,
              state: status.state,
              colorState: status.colorState,
              showChild: false,
              nivel: levelChild,
              children: [],
              team: register.team
            })
          }
        }
      }
    }
    
    // Get each children 
    let x;
    for(x=0; x < children.length; x++){
      
      let values = this.getChildren(temp, children[x], nivel + 1);
      children[x].children = values[0];
      children[x].team = values[1];
    }


    return [children, team];
  }

  getMainChildren = (temp, nivel) => {
    // console.log("residual")
    let children = []
    let idsChildren = [];
    let idsNodeNo = []
    
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
          temp[i].team = temp[i].team;
          temp[i].nivel = temp[i].nivel;
          if(temp[i].team !== null && temp[i].team.toUpperCase().includes("NO")) {
            idsNodeNo.push(temp[i].idsocio)
          }
          // temp[i].children = [];
          children.push(temp[i]);
        } else {
          //Validate team
          if(temp[i].team.toUpperCase().includes("NO") && !idsNodeNo.includes(temp[i].id)) {
            // find child and set NO
            for(let j=0; j < children.length ; j++) {
              if(temp[i].id === children[j].id) {
                children[j].team = "NO";
              }
            }
          }
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
    let x;
    for(x=0; x < children.length; x++){
      
      let values = this.getChildren(arrayLevel, children[x], nivel);
      children[x].children = values[0];
      children[x].team = values[1];

    }

    return children;
  }  

  getState = (idState) => {

  
     // Verify state
     let data = {
       state: "",
       colorState: ""
     };
     if(idState === 0 ) {
      // Inactivo
      data.state = "Inactivo"
      data.colorState = colorInactive
      
    } else if(idState === 1 ) {
      // Patrocinados directos
      data.state = "Activo"
      data.colorState = colorActive
      
    }  else if(idState === 2 ) {
      // Socios activos
      data.state = "Pendiente"
      data.colorState = colorPending
      
    }  else if(idState === 3 ) {
      // Activos nuevos
      data.state = "Activo"
      data.colorState = colorActiveNew
      
    } else if(idState === 4 ) {
      // socio con deuda
      data.state = "Pago despues"
      data.colorState = colorAfter
      
    } 
    
    return data;
  }

  async getTree() {
    if(this.props.type === 'residual') {
      let treeResponse = await UserService.getResidualTree();
      if(treeResponse !== null && treeResponse !== undefined){
        if(treeResponse.status === 1){
          // console.log(treeResponse)
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
            state: "Activo",
            colorState: colorActive
          };
          
          let mainChildren = this.getMainChildren(temp, nivel);
          tree.children = mainChildren;
          // console.log("tree")

          this.setState({
            treeData: this.state.treeData = [tree],
            stateTree: true,
            loading: false,
            noDataTree: false,
            message: "",
            loadUpliners: false
          });

          // Set tree to parent usin props
          if (this.props.setTree) {
            this.props.setTree([tree], 'treeResidual');
          }
        } else {
          this.setState({
            tree: [],
            stateTree: false,
            loading: false,
            noDataTree: true,
            message: "",
            loadUpliners: false
          });
        }
      } else {
        this.setState({
          tree: [],
          stateTree: false,
          loading: false,
          noDataTree: true,
          message: "",
          loadUpliners: false
        });
      }
    }
  }

  /**
   * Update data
   */
  updateTree = (message, loaded) => {

    // console.log(message)
    this.setState({
      loading: this.state.loading = true,
      message: message,
      loadUpliners: this.state.loadUpliners = loaded
    });
    this.getTree();
  }

  render() {
    const { treeData, stateTree, noDataTree, loading } = this.state;
    // console.log(this.state.loadUpliners)
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
        {loading && <div>
          <Spinner animation="border" variant="dark">
          </Spinner>
          <p>Cargando árbol residual.</p>
          </div>
        }
        {!loading && stateTree && <div>
            
            {/* Load tree */}
            <Row style={{paddingTop: 30}}>
                <Col sm={12} style={{textAlign: 'left'}}>
                  <div>
                    <Tree tree={treeData} updateTree={this.updateTree}></Tree>
                  </div>
                </Col>
            </Row>
        </div>
        }

        {!loading && noDataTree && <Form.Label>No podemos mostrar su red. Consulte acerca de su red.</Form.Label>}
        <Modal
                show={this.state.loadUpliners}
                aria-labelledby="contained-modal-title-vcenter"
                backdrop="static"
                centered>
                <Modal.Body>
                    <div style={{textAlign: 'center'}}>
                        <Spinner size="sm" animation="border" variant="dark">
                        </Spinner>
                        <Form.Label>&nbsp; {this.state.message}...</Form.Label>
                    </div>
                </Modal.Body>
            </Modal>
      </div>

    );
  }
}