import React, { Component } from 'react'
import { Button, Form, Row, Col, Card, Tabs, Tab, Spinner} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import State from '../../components/home/State';
import Range from '../../components/home/Range';
import RangeNext from '../../components/home/RangeNext';
import UserService from '../../services/user.service';
import RangeCom from '../../components/home/RangeCom';

export default class MainView extends Component  {
    constructor(props){
        super(props);
        this.state = {
            idUser: props.idUser,
            loadingState: true,
            isLoadedState : false,
            noDataState: false,
            objectDashState: {},
            loadingScore: true,
            isLoadedScore : false,
            noDataScore: false,
            objectDashScore: {},
            loadingScoreCom: true,
            isLoadedScoreCom : false,
            noDataScoreCom: false,
            objectDashScoreCom: {},
            loadingRange: true,
            isLoadedRange : false,
            noDataRange: false,
            objectDashRange: {},
            isResidual: 0,
        }

        // this.getDashboard = this.getDashboard.bind(this);
        this.getInfoState = this.getInfoState.bind(this);
        // this.getInfoScore = this.getInfoScore.bind(this);
        this.getInfoRange = this.getInfoRange.bind(this);
        this.getInfoResidual = this.getInfoResidual.bind(this);
        this.getInfoCompuesto = this.getInfoCompuesto.bind(this);
    }

    componentDidMount(){
        // this.getDashboard();
        if(this.state.idUser > 0){
            this.getInfoState();
        
            // this.getInfoScore();
            this.getInfoResidual();
            this.getInfoCompuesto();
            this.getInfoRange();
        }
        
    }

    componentWillReceiveProps(props){
        if(props.idUser > 0){
            this.getInfoState();
        
            // this.getInfoScore();
            this.getInfoResidual();
            this.getInfoCompuesto();
            this.getInfoRange();
        }
    }

    async getInfoState(){
        let dashboard = await UserService.getInfoState(this.state.idUser);
        if(dashboard !== undefined && dashboard !== null){
            if(dashboard.status !== 1) {
                console.log(dashboard);
                this.setState({
                    objectDashState: this.state.objectDashState = {},
                    loadingState: this.state.loadingState = false,
                    isLoadedState: this.state.isLoadedState = false,
                    noDataState: this.state.noDataState = true
                });
            } else {
               if(dashboard.objModel.dashboard !== null){
                    this.setState({
                        objectDashState: this.state.objectDashState = dashboard.objModel,
                        loadingState: this.state.loadingState = false,
                        isLoadedState: this.state.isLoadedState = true,
                        noDataState: this.state.noDataState = false
                    });
               } else{
                    this.setState({
                        objectDashState: this.state.objectDashState = {},
                        loadingState: this.state.loadingState = false,
                        isLoadedState: this.state.isLoadedState = false,
                        noDataState: this.state.noDataState = true
                    });
               }
                
            }
        } else {
            this.setState({
                objectDashState: this.state.objectDashState = {},
                loadingState: this.state.loadingState = false,
                isLoadedState: this.state.isLoadedState = false,
                noDataState: this.state.noDataState = true
            });

        }
    }

    async getInfoScore(){
        let dashboard = await UserService.getInfoScore(this.state.idUser);
    
        if(dashboard !== undefined && dashboard !== null){
            if(dashboard.status !== 1) {
           
                this.setState({
                    objectDashScore: this.state.objectDashScore = {},
                    loadingScore: this.state.loadingScore = false,
                    isLoadedScore: this.state.isLoadedScore = false,
                    noDataScore: this.state.noDataScore = true
                });
            } else {
               if(dashboard.objModel.dashboard !== null){
                    this.setState({
                        objectDashScore: this.state.objectDashScore = dashboard.objModel,
                        loadingScore: this.state.loadingScore = false,
                        isLoadedScore: this.state.isLoadedScore = true,
                        noDataScore: this.state.noDataScore = false
                    });
               } else{
                    this.setState({
                        objectDashScore: this.state.objectDashScore = {},
                        loadingScore: this.state.loadingScore = false,
                        isLoadedScore: this.state.isLoadedScore = false,
                        noDataScore: this.state.noDataScore = true
                    });
               }
                
            }
        } else {
            this.setState({
                objectDashScore: this.state.objectDashScore = {},
                loadingScore: this.state.loadingScore = false,
                isLoadedScore: this.state.isLoadedScore = false,
                noDataScore: this.state.noDataScore = true
            });

        }
    }
    
    async getInfoResidual(){
        let dashboard = await UserService.getInfoResidual(this.state.idUser);
    
        if(dashboard !== undefined && dashboard !== null){
            if(dashboard.status !== 1) {
           
                this.setState({
                    objectDashScore: this.state.objectDashScore = {},
                    loadingScore: this.state.loadingScore = false,
                    isLoadedScore: this.state.isLoadedScore = false,
                    noDataScore: this.state.noDataScore = true
                });
            } else {
               if(dashboard.objModel.dashboard !== null){
                    this.setState({
                        objectDashScore: this.state.objectDashScore = dashboard.objModel,
                        loadingScore: this.state.loadingScore = false,
                        isLoadedScore: this.state.isLoadedScore = true,
                        noDataScore: this.state.noDataScore = false
                    });
               } else{
                    this.setState({
                        objectDashScore: this.state.objectDashScore = {},
                        loadingScore: this.state.loadingScore = false,
                        isLoadedScore: this.state.isLoadedScore = false,
                        noDataScore: this.state.noDataScore = true
                    });
               }
                
            }
        } else {
            this.setState({
                objectDashScore: this.state.objectDashScore = {},
                loadingScore: this.state.loadingScore = false,
                isLoadedScore: this.state.isLoadedScore = false,
                noDataScore: this.state.noDataScore = true
            });

        }
    }

    async getInfoCompuesto(){
        let dashboard = await UserService.getInfoCompuesto(this.state.idUser);
    
        if(dashboard !== undefined && dashboard !== null){
            if(dashboard.status !== 1) {
           
                this.setState({
                    objectDashScoreCom: this.state.objectDashScoreCom = {},
                    loadingScoreCom: this.state.loadingScoreCom = false,
                    isLoadedScoreCom: this.state.isLoadedScoreCom = false,
                    noDataScoreCom: this.state.noDataScoreCom = true
                });
            } else {
               if(dashboard.objModel.dashboard !== null){
                    this.setState({
                        objectDashScoreCom: this.state.objectDashScoreCom = dashboard.objModel,
                        loadingScoreCom: this.state.loadingScoreCom = false,
                        isLoadedScoreCom: this.state.isLoadedScoreCom = true,
                        noDataScoreCom: this.state.noDataScoreCom = false
                    });
               } else{
                    this.setState({
                        objectDashScoreCom: this.state.objectDashScoreCom = {},
                        loadingScoreCom: this.state.loadingScoreCom = false,
                        isLoadedScoreCom: this.state.isLoadedScoreCom = false,
                        noDataScoreCom: this.state.noDataScoreCom = true
                    });
               }
                
            }
        } else {
            this.setState({
                objectDashScoreCom: this.state.objectDashScoreCom = {},
                loadingScoreCom: this.state.loadingScoreCom = false,
                isLoadedScoreCom: this.state.isLoadedScoreCom = false,
                noDataScoreCom: this.state.noDataScoreCom = true
            });

        }
    }


    async getInfoRange(){
        let dashboard = await UserService.getInfoRange(this.state.idUser);
    
        if(dashboard !== undefined && dashboard !== null){
            
            if(dashboard.status !== 1) {
                
                this.setState({
                    objectDashRange: this.state.objectDashRange = {},
                    loadingRange: this.state.loadingRange = false,
                    isLoadedRange: this.state.isLoadedRange = false,
                    noDataRange: this.state.noDataRange = true
                });
            } else {
               if(dashboard.objModel.dashboard !== null){
                    this.setState({
                        objectDashRange: this.state.objectDashRange = dashboard.objModel,
                        loadingRange: this.state.loadingRange = false,
                        isLoadedRange: this.state.isLoadedRange = true,
                        noDataRange: this.state.noDataRange = false
                    });
               } else{
                    this.setState({
                        objectDashRange: this.state.objectDashRange = {},
                        loadingRange: this.state.loadingRange = false,
                        isLoadedRange: this.state.isLoadedRange = false,
                        noDataRange: this.state.noDataRange = true
                    });
               }
                
            }
        } else {
            this.setState({
                objectDashRange: this.state.objectDashRange = {},
                loadingRange: this.state.loadingRange = false,
                isLoadedRange: this.state.isLoadedRange = false,
                noDataRange: this.state.noDataRange = true
            });

        }
    }

    async getDashboard(){
        let dashboard = await UserService.getDashBoard(this.state.idUser);
    
        if(dashboard !== undefined && dashboard !== null){
            if(dashboard.status !== 1) {
                //console.log(dashboard);
                this.setState({
                    objectDash: this.state.objectDash = {},
                    loading: this.state.loading = false,
                    isLoaded: this.state.isLoaded = false,
                    noData: this.state.noData = true
                });
            } else {
               if(dashboard.objModel.dashboard !== null){
                    this.setState({
                        objectDash: this.state.objectDash = dashboard.objModel.dashboard,
                        loading: this.state.loading = false,
                        isLoaded: this.state.isLoaded = true,
                        noData: this.state.noData = false
                    });
               } else{
                    this.setState({
                        objectDash: this.state.objectDash = {},
                        loading: this.state.loading = false,
                        isLoaded: this.state.isLoaded = false,
                        noData: this.state.noData = true
                    });
               }
                
            }
        }
    }
    selectTab = (e) => {
        if(e === "compuesto") {
            this.setState({
                isResidual: this.state.isResidual = 0
            });
        } else if(e === "residual"){
            this.setState({
                isResidual: this.state.isResidual = 1
            });
        }
    }
    render(){
        const{ loadingState, isLoadedState, noDataState, objectDashState, loadingScore,
            isLoadedScore, noDataScore, objectDashScore, loadingScoreCom,
            isLoadedScoreCom, noDataScoreCom, objectDashScoreCom, loadingRange, isLoadedRange,
            noDataRange, objectDashRange, isResidual } = this.state;
         
        return(

            <div>
                <Row>
                    <Col sm={3}>
                        {loadingState && <div>
                            <Spinner animation="border" role="status">
                                {/* <span className="sr-only">Cargando...</span> */}
                            </Spinner><p>Cargando ...</p>
                            </div>}
                        {isLoadedState && 
                            <State dash={objectDashState}></State>
                        }
                        {noDataState && 
                            <div>
                                <Form.Label>Ocurrió un problema al consultar información de Estado.</Form.Label>
                                <br></br>
                                <Form.Label>Inténtelo más tarde.</Form.Label>
                                </div>
                        }
                    </Col>
                    <Col sm={6}>
                    <Tabs className="custom-tabs-main" defaultActiveKey="compuesto" id="uncontrolled-tab-example"
                            onSelect={e => {this.selectTab(e)}}>
                        <Tab eventKey="compuesto" title="Compuesto">
                            {loadingScoreCom && <div>
                                <Spinner animation="border" role="status">
                                    {/* <span className="sr-only">Cargando...</span> */}
                                </Spinner><p>Cargando ...</p>
                                </div>}
                            {isLoadedScoreCom && 
                                <RangeCom  dash={objectDashScoreCom}></RangeCom>
                            }
                            {noDataScoreCom && 
                                <div>
                                    <Form.Label>Ocurrió un problema al consultar información de Puntos.</Form.Label>
                                    <br></br>
                                    <Form.Label>Inténtelo más tarde.</Form.Label>
                                    </div>
                            }
                        </Tab>
                        <Tab eventKey="residual" title="Residual">
                            {loadingScore && <div>
                                <Spinner animation="border" role="status">
                                    {/* <span className="sr-only">Cargando...</span> */}
                                </Spinner><p>Cargando ...</p>
                                </div>}
                            {isLoadedScore && 
                                <Range  dash={objectDashScore}></Range>
                            }
                            {noDataScore && 
                                <div>
                                    <Form.Label>Ocurrió un problema al consultar información de Puntos.</Form.Label>
                                    <br></br>
                                    <Form.Label>Inténtelo más tarde.</Form.Label>
                                    </div>
                            }

                        </Tab>
                       
                    </Tabs>
                       
                    </Col>
                    <Col sm={3}>
                        
                        {loadingRange && <div>
                            <Spinner animation="border" role="status">
                                {/* <span className="sr-only">Cargando...</span> */}
                            </Spinner><p>Cargando ...</p>
                            </div>}
                        {isLoadedRange && 
                            <RangeNext  dash={objectDashRange} 
                                        isResidual={isResidual}></RangeNext>
                        }
                        {noDataRange && 
                            <div>
                                <Form.Label>Ocurrió un problema al consultar información de Rango.</Form.Label>
                                <br></br>
                                <Form.Label>Inténtelo más tarde.</Form.Label>
                                </div>
                        }

                    </Col>
                </Row>
            </div>
            
        );
    }
}