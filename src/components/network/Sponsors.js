import React, { Component } from 'react';
import { Form, Table, Spinner, Pagination, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Validation from '../utils/Validation';
import UserService from '../../services/user.service';


export default class Sponsor extends Component {

    constructor(props){
        super(props);
        this.state = {
            sponsors: [],
            emptyList: true,
            message: "No hay registros para mostrar.",
            loading: false,
            date: "04 de agosto del 2020",
            activePage: 1,
            messageDate: "",
            txtSearch: "",
            typeSponsor: "1",
            idBranch: '-1',
            showBranch: false,
            branchCount: 5,
            numberBranch: "",
            init: "",
            end: "",
            messageDateInit: "",
            messageDateEnd: "",
            totalPages: 1,
            page: 1,
            size: 30,
            totalRegister: 0
        }

        // this.getRegister = this.getRegister.bind(this);
    }

    componentDidMount() {
        // this.getNumberBranch();
    }

    async getNumberBranch() {

        let response = await UserService.getNumberBranch();
        if(response !== undefined) {
            if(response.status === 1) {
                this.setState({
                    branchCount: this.state.branchCount = response.objModel
                });
            } else {
                this.setState({
                    branchCount: this.state.branchCount = 3
                });
            }
        } else {
            this.setState({
                branchCount: this.state.branchCount = 3
            });
        }
    }

    // async getRegister() {
    //     let response = await UserService.getSponsors();
    //     if(response !== undefined && response !== null){
    //         if(response.status !== 1) {
    //             //console.log(response);
    //             this.setState({
    //                 sponsors: this.state.sponsors = [],
    //                 emptyList: this.state.emptyList = true,
    //                 loading: this.state.loading = false,
    //                 message: this.state.message = "Se ha producido un error. Inténtelo más tarde."
    //             });
    //         } else {
    //             if(response.objModel.length > 0){
    //                 this.setState({
    //                     sponsors: this.state.sponsors = response.objModel,
    //                     emptyList: this.state.emptyList = false,
    //                     loading: this.state.loading = false,
    //                     message: this.state.mesagge = ""
    //                 });
    //             } else {
    //                 this.setState({
    //                     sponsors: this.state.sponsors = [],
    //                     emptyList: this.state.emptyList = true,
    //                     loading: this.state.loading = false,
    //                     message: this.state.mesagge = "No hay registros para mostrar."
    //                 });
    //             }
               
    //         }
    //     }
        

    // }

    handlePageChange = (e, field) => {
        let value = Number(e.target.value);
        this.setState({
            [field]: this.state[field] = value,
            loading: true,
            sponsors: [],
            emptyList: true,
        });

        // Call to  services
        
        let parameter = this.getParameter();
        if(parameter !== undefined) {
            this.getSearchResults(parameter);
        }
    }

    handleSizeChange = (e, field) => {
        let value = Number(e.target.value);
       
        this.setState({
            size: this.state.size = value,
            page: this.state.page = 1,
            loading: true,
            sponsors: [],
            emptyList: true,
        });

        // Call to  services
        
        let parameter = this.getParameter();
        if(parameter !== undefined) {
            this.getSearchResults(parameter);
        }
    }


    handleChange = (e, field) => {
     
        let value = e.target.value;
     
        this.setState({
            [field]: this.state[field] = value,
            page: this.state.page = 1,
            sponsors: this.state.sponsors =  [],
        })

        if(field === 'idBranch') {
            if(value === '6') {
                this.setState({
                    showBranch: this.state.showBranch = true
                }) 
            } else {
                this.setState({
                    showBranch: this.state.showBranch = false
                }) 
            }
        }
    }

     /**
     * Method to handle the selected dates
     * @param {*} e 
     * @param {*} field 
     */
    handledate = (e, field, message) => {
        let value  = e.target.value;
        this.setState({
            [message]   : this.state[message] = "",
            [field]     : this.state[field] = value,
            page: this.state.page = 1,
            sponsors: this.state.sponsors =  []
        });
    };
    
    onBlurDate = (e, field, fieldMessage) => {
        // Validate date
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        let date = e.target.value;
        if(date.length > 0){
            let correct = date.match(regEx);
            if (correct) {
                this.setState({
                    [fieldMessage]: this.state[fieldMessage] = ""
                });
            } else {
                this.setState({
                    [fieldMessage]  : this.state[fieldMessage] = "Ingrese una fecha válida.",
                    [field]         : this.state[field] = ""
                });
            }
        }

    }
    /**
     * Event to search 
     * @param {*} e 
     */
    search = (e) => {
        // console.log(this.state)
        this.setState({
            loading: true,
            sponsors: [],
            emptyList: true,
        });
        let parameter = this.getParameter();
        if(parameter !== undefined) {
            this.getSearchResults(parameter);
        }
        

    }

    getParameter = () => {
        let data = {};

        //Add search by name and type
        if(this.state.txtSearch.trim().length > 0) {
            data.FlagSearchText = 1;
            data.TextSearch     = this.state.txtSearch;
            data.DataTypeSearchPartner = Number(this.state.typeSponsor);
        } else {
            data.FlagSearchText = 0;
            data.TextSearch     = "";
            data.DataTypeSearchPartner = 0;
        }

        // Add flag to search branch
        if(Number(this.state.idBranch) >= 0) {
            if(Number(this.state.idBranch) === 6) {
                if(!isNaN(Number(this.state.numberBranch)) && Number(this.state.numberBranch) > 0) {
                    data.FlagSearchRame = 1;
                    data.ValueFilterBranch = Number(this.state.numberBranch);
                } else {
                    alert("Seleccione o ingrese un de rama.");
                    return undefined;
                }
            } else {
                data.FlagSearchRame = 1;
                data.ValueFilterBranch = Number(this.state.idBranch);
            }
            
        } else {
            data.FlagSearchRame = 0;
            data.ValueFilterBranch = Number(this.state.idBranch);
        }

        // Add filter of date
        if(this.state.init.length > 0 && this.state.end.length > 0){
            data.FlagSearchDate = 1;
            data.StartDate = this.state.init;
            data.EndDate = this.state.end;
        } else {
            data.FlagSearchDate = 0;
            // data.StartDate = "";
            // data.EndDate = "";
        }
        data.SizeList = this.state.size;
        data.NroPage = this.state.page;

        return data;
    }
    
    getSearchResults = async(parameter) => {
        
        let response = await UserService.getSponsorsSearch(parameter);
        if(response !== undefined && response !== null){
            if(response.status !== 1) {
                //console.log(response);
                this.setState({
                    sponsors: this.state.sponsors = [],
                    emptyList: this.state.emptyList = true,
                    loading: this.state.loading = false,
                    message: this.state.message = "Se ha producido un error. Inténtelo más tarde."
                });
            } else {
                let object = response.objModel;
                if(object.partners.length > 0){
                    this.setState({
                        sponsors: this.state.sponsors = object.partners,
                        emptyList: this.state.emptyList = false,
                        loading: this.state.loading = false,
                        message: this.state.mesagge = "",
                        totalPages: this.state.totalPages = object.totalPages,
                        totalRegister: this.state.totalRegister = object.totalPartnerList
                    
                    });
                } else {
                    this.setState({
                        sponsors: this.state.sponsors = [],
                        emptyList: this.state.emptyList = true,
                        loading: this.state.loading = false,
                        message: this.state.mesagge = "No hay registros para mostrar.",
                        totalPages: this.state.totalPages = 1,
                        page: this.state.page = 1,
                        totalRegister:  this.state.totalRegister = 0
                    });
                }
               
            }
        } else {
            this.setState({
                sponsors: this.state.sponsors = [],
                emptyList: this.state.emptyList = true,
                loading: this.state.loading = false,
                message: this.state.message = "Se ha producido un error. Inténtelo más tarde."
            });
        }
    }

    render(){
        const { sponsors, activePage, page, size, totalPages, showBranch, branchCount, numberBranch, totalRegister } = this.state;
        // console.log(branchCount)
        
        let optionPages = [];
        for(let i = 0; i < totalPages; i++) {
            optionPages.push(<option value={i+1}>{i+1}</option>)
        }

        let branchesList = [];
        branchesList.push(<option value="-1">Todos</option>)

        for(let i = 0; i < branchCount && i < 3; i++) {
            branchesList.push(<option value={i+1}>Rama {i+1}</option>)
        }
        branchesList.push(<option value="0">Sin posicionar</option>)
        // if(branchCount >= 5) {
        //     branchesList.push(<option value="6">Otro</option>)
        // }
        
        return(
            <div style={{padding: 30}}>
                <Form.Group>
                    {/* <p>Información actualizada al: <b>{this.state.date}</b></p> */}
                </Form.Group>
                <div className="search">
                    <h1 className="search-title">Buscador</h1>
                    <Row>
                        <Col sm={4} >
                            <Form.Group>
                                <Form.Label> Ingrese campo de búsqueda: </Form.Label>
                                <Form.Control required type="text" placeholder="Buscar por ..."
                                    onChange={e => this.handleChange(e, "txtSearch")} />
                                <Form.Label style={{fontSize: 9}}>( Nombre, apellido, usuario o número documento)</Form.Label>
                            </Form.Group>
                        </Col>
                        <Col sm={7} >
                            <Form.Group>
                                <Form.Label> Buscar como:</Form.Label>
                                <div style={{paddingTop: 8}}>
                                    <Form.Check inline 
                                                id={0}
                                                value="1"
                                                name="typeSponsor"
                                                label="Usuario" 
                                                type='radio' 
                                                onChange={e => this.handleChange(e, "typeSponsor")}
                                                checked={this.state.typeSponsor === "1"} />
                                    <Form.Check inline 
                                                id={1} 
                                                value="2"
                                                name="typeSponsor"
                                                label="Patrocinador" 
                                                type='radio'
                                                onChange={e => this.handleChange(e, "typeSponsor")}
                                                checked={this.state.typeSponsor === "2"}/>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label htmlFor="selectBranch">
                                        Rama:
                                </Form.Label>
                                <Form inline>
                                    <Form.Control
                                        as="select"
                                        id="selectBranch"
                                        defaultValue={'-1'}
                                        onChange={e => {this.handleChange(e, 'idBranch')}} 
                                    >
                                    {branchesList}
                                    </Form.Control>
                                    <Form.Control style={{display: (showBranch )? 'inline':'none', width: 90}}
                                        type="number"
                                        min="0"
                                        onChange={e => {this.handleChange(e, 'numberBranch')}} 
                                        className="my-2 ml-sm-2"
                                        placeholder="Rama"
                                    />
                                </Form>
                                {/* <Form.Text>Total ramas: {branchCount}</Form.Text> */}
                            </Form.Group>
                        </Col>
                        <Col sm={4} className="div-disabled">
                            <Form.Label>
                                    Desde :
                            </Form.Label>
                             <Form.Control type="date"
                                    onChange={e => this.handledate(e, "init", "messageDateInit")}
                                    onBlur={e => this.onBlurDate(e, "init", "messageDateInit")}></Form.Control>
                            <Form.Text className="textAlert">{this.state.messageDateInit}</Form.Text>
                        </Col>
                        <Col sm={4} className="div-disabled" >
                            <Form.Label >
                                    Hasta :
                            </Form.Label>
                            <Form.Control type="date" 
                                    onChange={e => this.handledate(e, "end", "messageDateEnd")}
                                    onBlur={e => this.onBlurDate(e, "end", "messageDateEnd")}></Form.Control>
                            <Form.Text className="textAlert">{this.state.messageDateEnd}</Form.Text>
                        </Col>
                    </Row>
                    
                    <Row style={{textAlign: 'right'}}>
                        <Col sm={12}>
                            <Button variant="secondary"
                                    size="sm"
                                    onClick={e => {this.search(e)}}>Buscar</Button>
                        </Col>
                    </Row>
                    
                </div>
                {/* Paginador */}
                <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Form inline>
                                <Form.Label>Mostrando del {size*(page - 1) + 1} al {(size * page > totalRegister)? totalRegister:size * page} de {totalRegister} registros. &nbsp;&nbsp;|</Form.Label>
                                {/* Page */}
                                <Form.Label className="my-1 ml-3 -mr-2" htmlFor="selectCount">
                                    Página:
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    className="my-2 ml-2 mr-1"
                                    id="selecPages"
                                    defaultValue={"1"}
                                    value={page}
                                    style={{fontSize: 10}}
                                    onChange={e => {this.handlePageChange(e, 'page')}} 
                                >
                                    {optionPages}
                                </Form.Control>
                                <Form.Label className="my-1  mr-sm-2" htmlFor="selectCount">
                                    de {totalPages}. 
                                </Form.Label>
                                {/* Per page */}
                                <Form.Label className="my-1 ml-2" htmlFor="selectCount">
                                    Por página: 
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
                                
                            </Form>
                </Row>
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
                    <Row>
                        <Col sm={12}>
                            <Table responsive>
                                <thead className="table-head">
                                    <tr>
                                        <th></th>
                                        <th>Usuario</th>
                                        <th>Nombre</th>
                                        <th>Documento</th>
                                        <th>Fecha de registro</th>
                                        <th>Estado</th>
                                        <th>Nivel Patrocinio</th>
                                        <th>Nivel Residual</th>
                                        <th>Rama</th>
                                        <th>Patrocinador</th>
                                        <th>Puntos de Equipo</th>
                                        <th>Punto individuales</th>
                                        <th>Activo hasta</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { sponsors.map(function(item, idx) {
                                            let date = "";
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{size*(page - 1) + 1 + idx}</td>
                                                        <td>{item.userName}</td>
                                                        <td>{item.name} {item.lastName}</td>
                                                        <td>{item.nroDocument}</td>
                                                        <td>{Validation.convertDateToString(item.createDate)}</td>
                                                        <td>{item.stateText}</td>
                                                        <td>{item.nivelPatrocinio}</td>
                                                        <td>{item.nivelResidual}</td>
                                                        <td>{item.branch}</td>
                                                        <td>{item.nameSponsor} {item.lastnameSponsor}</td>
                                                        <td>{item.groupPoints}</td>
                                                        <td>{item.ptosIndividuales}</td>
                                                        <td>{Validation.convertDateToString(item.nextExpiration)}</td>
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