import React, { Component } from 'react';
import AuthService from '../../services/auth.service';
import UtilsService from '../../services/utils.service';
import { Image, Navbar, Nav, NavDropdown, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//chatBot
import { BsCreditCard, BsBellFill, BsQuestionSquareFill } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa'
import ChatBotIntech from "../../components/chatbot/ChatBot";


import creditCard from '../../images/icons/creditCard.png';
import history from  '../navigation/history';
import logo_nav from '../../images/navologo.png';
import Avatar from '@material-ui/core/Avatar';
import '../styles/Custom.css';

// // Production
// const link = 'https://inclub.world';

// Test
const link = 'https://inresorttest.web.app'

export default class NavBar extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showLogout: false,
      showAccount: false,
      navExpanded: false,
      showGuest: false,
      exchange: 0.00, 
      user: "",
      password: ""
    }
    
  }

  componentDidMount(){
    this.getExchange();
  }

  getExchange = async() => {

    let response = await UtilsService.getExchanges();
    if(response !== undefined){
      console.log(response)
      if(response.status === 1) {
        this.setState({
          exchange: this.state.exchange = response.objModel.venta
        });
      }
    } 
  }
  /**
   * Redirect to path
   * @param {*} e 
   * @param {*} path 
   */
  OnClicked = (e, path) => {
    history.push(path);
    this.setState({
      navExpanded: this.state.navExpanded = false,
    })
  }

  handleHome = (e) => {
    let currentLocation = window.location;
    //console.log(currentLocation);
    if(currentLocation.pathname.includes("home")) {
      window.location.reload();
    } else {
      history.push("/home");
    }
  }

  // Handle modal logout
  handleClose = (e) => {
    this.setState({
      showLogout : false
    });
  }

  handleShow = (e) => {
    e.preventDefault();
    this.setState({
      showLogout : true
    });
  }

  onCloseSession = (e) => {
    e.preventDefault();
    AuthService.logout();
    this.setState({
      showLogout : false
    });
    history.push("/home-in");
  }

  //  LoginGuest 
  OnClickGuest = async(e) => {
    e.preventDefault();

    let data = {
      username : this.state.user,
      password : this.state.password
    }
    // Load services
    let response = await AuthService.loginAdmin(data);
    if(response !== undefined && response.access_Token !== null) {
      this.setState({
        showGuest: false,
        user: "",
        password: ""
      });

      // redireect new page sha512
      let idUser = response.idUser;
      let field = "6f1e7dc9b9c43fb7dd2ff99b7a6bc0cb5607e8b03d5a97ae3004685338a7f1821ec146da4567500bd97fb2e851df1a1b99361a7ff2366b7700ebc856d702cb69";
      let url = link + "/guest?" + field + "=" + idUser;
      window.open(url, "_blank")
    } else {
        this.setState({
          showGuest: false,
          user: "",
          password: ""
        });
        alert("Ocurrió un problema. Inténtelo más tarde.")
    }

  }

  handleShowGuest = (e) => {
    e.preventDefault();
    this.setState({
      showGuest : true
    });
  }

  handleCloseGuest = (e) => {
   
    this.setState({
      showGuest : false,
      use: "",
      password: ""
    });
  }

  handleChange = (e, field) => {
    
    let value = e.target.value;
    this.setState({
        [field]: this.state[field] = value
    });
   
  };

  ///// End guest


  setNavExpanded = (expanded) => {
   
    this.setState({ 
      navExpanded: this.state.navExpanded = expanded 
    });
  }


  // Handle modal account
  handleCloseAccount = (e) => {
      this.setState({
      showAccount : false
    });
  }
  handleShowAccount = (e) => {
  
    this.setState({
      showAccount : true
    });
  }

  
  render(){
    // //console.log("Navbar");
    const isLogged = AuthService.getIsLogged();
    const name = AuthService.getName();
    const idUser = AuthService.getCurrentIdUser();
    const defaultPreview = AuthService.getPicture();

    // TODO implement to master
    let issuperUser = false;
    if(Number(idUser) === 12853) {
      issuperUser = true;
    }
    const { navExpanded } = this.state;
    

    
  return (
    <div>
      <Navbar bg="light" expand="lg" 
          onToggle={this.setNavExpanded}
          expanded={navExpanded} >
        <Navbar.Brand href="" onClick={e => this.handleHome(e)}><Image src={logo_nav} style={{width:"100px"}}></Image></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {isLogged && <Navbar.Collapse id="basic-navbar-nav"style={{ textAlign: "right"}}>
          <Nav className="justify-content-end" style={{ width: "100%" }}>
            <NavDropdown title={name} id="basic-nav-dropdown">
              <NavDropdown.Item href="" onClick={e => this.OnClicked(e, "/profile")}>Mi Cuenta</NavDropdown.Item>
              <NavDropdown.Item href=""  onClick={(e) => this.handleShow(e)}>Cerrar sesión</NavDropdown.Item>
              <NavDropdown.Divider />
              {/* <NavDropdown.Item onClick={e => this.handleShowAccount(e)}>Información de Empresa</NavDropdown.Item>
              <NavDropdown.Divider /> */}
              {issuperUser && 
                <NavDropdown.Item href="" onClick={e => this.handleShowGuest(e)}>Ver perfil de socio</NavDropdown.Item>
              }
            </NavDropdown>
            
            <Avatar alt="" src={defaultPreview} />

            <div style={{ borderRadius: "50%", width: 40, height: 40, textAlign: 'center', marginLeft: 3, background: '#bdbdbd'}}
                  onClick={e => this.handleShowAccount(e)}>
              <Image src={creditCard} style={{ width: 24, height: 24, display: 'inline-block', marginTop: 8}}></Image>
            </div>
        
          

          </Nav>
          <ChatBotIntech username={idUser} user_id={name}/>
          </Navbar.Collapse>
        }
        {!isLogged && 
            <Navbar.Collapse id="basic-navbar-nav"style={{ textAlign: "right"}}>
            <Nav className="justify-content-end" style={{ width: "100%" }}>
              <Nav.Link href=""  onClick={e => this.OnClicked(e, "/home-in")} >Home</Nav.Link>
              <Nav.Link href="" onClick={e => this.OnClicked(e, "/portfolio")}>Portafolio</Nav.Link>
              <Nav.Link href="" onClick={e => this.OnClicked(e, "/register-in")}>Registrarme</Nav.Link>
              <Button variant="warning" style={{ color: "#FFFF"}} 
                onClick={e => this.OnClicked(e, "/sign-in")} 
                className="ml-4 mr-2"
                size="sm">Iniciar sesión</Button>

            </Nav>
          </Navbar.Collapse>
        }
      </Navbar>
      {/* Modal  cerrar sesion */}
      <Modal show={this.state.showLogout} onHide={this.handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Cerrar sesión</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group>
                  ¿Desea cerrar su sesión?
              </Form.Group>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="primary" size="sm" onClick={(e) => this.onCloseSession(e)}>
              Aceptar
          </Button>
          <Button variant="secondary" size="sm" onClick={(e) => this.handleClose(e)}>
              Cancelar
          </Button>
          </Modal.Footer>
      </Modal>
      {/* Modal cuenta*/}
      <Modal show={this.state.showAccount} onHide={(e) => this.handleCloseAccount(e)}
          style={{fontSize: 12}}>
          <Modal.Header closeButton>
          <Modal.Title>Información de empresa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group >
                  <Form.Label>Razón Social: </Form.Label>
                  <p>VALLE ENCANTADO SAC</p>
              
                  <Form.Label>Ruc:</Form.Label>
                  <p>20601460271 </p>
              </Form.Group>

              <Form.Group >
                  <Form.Label>Cuenta Corriente Soles BCP: </Form.Label>
                  <p>191-2606708-0-82</p>
             
                  <Form.Label>Cuenta Corriente Dólares BCP: </Form.Label>
                  <p>191-2616687-1-90</p>
              </Form.Group>
              <Form.Group >
                  <Form.Label>Cuenta Corriente Soles INTERBANK:</Form.Label>
                  <p>200-3002538987</p>
            
                  <Form.Label>Cuenta Corriente Dólares INTERBANK:</Form.Label>
                  <p>200-3002538994</p>
              </Form.Group>
              <hr></hr>
              <Form.Group >
                <p ><b>Tipo de cambio : </b>{this.state.exchange}</p>
              </Form.Group>
            </Form>             
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={(e) => this.handleCloseAccount(e)}>
              Cerrar
          </Button>
          </Modal.Footer>
      </Modal>

      {/* Modal guest*/}
      <Modal show={this.state.showGuest} onHide={(e) => this.handleCloseGuest(e)}>
          <Modal.Header closeButton>
          <Modal.Title>Ver perfil de socio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Usuario</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese usuario" 
                                    onChange={e => {this.handleChange(e, 'user')}}/>
                    </Form.Group>
                  </Form>
                  <Form>
                    <Form.Group>
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control type="password" placeholder="Ingrese contraseña" 
                                    onChange={e => {this.handleChange(e, 'password')}}/>
                    </Form.Group>
                  </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="success" onClick={(e) => this.OnClickGuest(e)}>
              Ingresar
          </Button>
          </Modal.Footer>
      </Modal>
    </div>
  );
  }
}