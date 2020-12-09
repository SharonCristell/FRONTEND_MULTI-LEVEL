import React, { Component } from 'react';
import  { Form, Row, Col, Tab, Tabs} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../../views/styles/CustomTabs.css';

export default class Range extends Component{
    constructor(props){
        super(props);
        this.state = {
            points: {
                rama1: "0",
                rama2: "0",
                rama3: "0",
                directo: "0",
            },
            pointsNextRes:{
                    rama1: "0",
                    porc1: 0,
                    rama2: "0",
                    porc2: "0",
                    rama3: 0,
                    porc3: 0,
                    directo: "0",
                
            },
            pointsActRes:{
                rama1: "0",
                porc1: 0,
                rama2: "0",
                porc2: "0",
                rama3: 0,
                porc3: 0,
                directo: "0",
            
        },
            pointTotPending: "0",
            pointDirPending: "0"
        }
    }

    componentDidMount() {
        let data = this.props.dash;
        let points = data.pointsResidual;
        let tempPoints = {};

        points.forEach( elem => {
            if(elem.name === "Rama 1") {
                tempPoints.rama1 = elem.totalRama;
            } else if(elem.name === "Rama 2") {
                tempPoints.rama2 = elem.totalRama;
            } else if(elem.name === "Rama 3") {
                tempPoints.rama3 = elem.totalRama;
            }
        });
        tempPoints.directo =  data.volumenDirectoResidual;

        // Next range
        if(this.props.dash.pointsResidualProxRango != null){
            let tempPointsRes = {};
            this.props.dash.pointsResidualProxRango.forEach( elem => {
                if(elem.name === "Rama 1") {
                    tempPointsRes.rama1 = elem.totalRama;
                    tempPointsRes.porc1 = elem.porcentajeAcumulado;
                } else if(elem.name === "Rama 2") {
                    tempPointsRes.rama2 = elem.totalRama;
                    tempPointsRes.porc2 = elem.porcentajeAcumulado;
                } else if(elem.name === "Rama 3") {
                    tempPointsRes.rama3 = elem.totalRama;
                    tempPointsRes.porc3 = elem.porcentajeAcumulado;
                }
            });
            tempPointsRes.directo = data.volumenDirectoResidualProxRango;
            this.setState({
                pointsNextRes: this.state.pointsNextRes = tempPointsRes,
            });
        }
        // Current 
        if(this.props.dash.pointsResidualRangoActual != null){
            let tempPointsRes = {};
            this.props.dash.pointsResidualRangoActual.forEach( elem => {
                if(elem.name === "Rama 1") {
                    tempPointsRes.rama1 = elem.totalRama;
                    tempPointsRes.porc1 = elem.porcentajeAcumulado;
                } else if(elem.name === "Rama 2") {
                    tempPointsRes.rama2 = elem.totalRama;
                    tempPointsRes.porc2 = elem.porcentajeAcumulado;
                } else if(elem.name === "Rama 3") {
                    tempPointsRes.rama3 = elem.totalRama;
                    tempPointsRes.porc3 = elem.porcentajeAcumulado;
                }
            });
            tempPointsRes.directo = data.volumenDirectoResidualRangoActual;
            this.setState({
                pointsActRes: this.state.pointsActRes = tempPointsRes,
            });
        }
        this.setState({
            points: this.state.points = tempPoints,
            pointTotPending: this.state.pointTotPending = this.props.dash.pointsTotalesPendientesResidual,
            pointDirPending: this.state.pointDirPending= this.props.dash.pointsDirectosPendientesResidual
        });
    }
    render(){
        const {points, pointsNextRes, pointsActRes, pointTotPending, pointDirPending} = this.state;
        return(
            <div>
                <Form >
                    <Form.Label className="content-title">Puntos Totales </Form.Label>
                    <Row>
                        <Col sm={3}>
                            <div className="box-container-range">
                                    <p className="box-title">Volumen</p>
                                    <p className="box-title">Rama 1</p>
                                    <p className="class-state"><b>{points.rama1}</b>&nbsp;pts</p>
                              
                            </div>
                        </Col>
                        <Col sm={3}>
                            <div className="box-container-range">
                                <div>
                                    <p className="box-title">Volumen</p>
                                    <p className="box-title">Rama 2</p>
                                    <p className="class-state"><b>{points.rama2}</b>&nbsp;pts</p>
                                </div>
                            </div>
                        </Col>
                        <Col sm={3}>
                            <div className="box-container-range">
                                <div>
                                    <p className="box-title">Volumen</p>
                                    <p className="box-title">Rama 3</p>
                                    <p className="class-state"><b>{points.rama3}</b>&nbsp;pts</p>
                                </div>
                            </div>
                        </Col>
                        <Col sm={3}>
                            <div className="box-container-range">
                                <div>
                                    <p className="box-title">Volumen Directo</p>
                                
                                    <p className="class-state"><b>{points.directo}</b>&nbsp;pts</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <Form>
                    <Tabs className="custom-tabs-main" defaultActiveKey="nextrange" id="uncontrolled-tab-example">
                        <Tab eventKey="current" title="Rango Actual">
                            <Row>
                                <Col sm={3}>
                                    <div className="box-container-range">
                                        <div>
                                            <p className="box-title">Volumen</p>
                                            <p className="box-title">Rama 1</p>
                                            <p className="class-state"><b>{pointsActRes.rama1}</b>&nbsp;pts</p>
                                            <p className="class-progress">{pointsActRes.porc1} %</p>
                                            <progress max="100" value={pointsActRes.porc1}></progress>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="box-container-range">
                                        <div>
                                            <p className="box-title">Volumen</p>
                                            <p className="box-title">Rama 2</p>
                                            <p className="class-state"><b>{pointsActRes.rama2}</b>&nbsp;pts</p>
                                            <p className="class-progress">{pointsActRes.porc2} %</p>
                                            <progress max="100" value={pointsActRes.porc2}></progress>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="box-container-range">
                                        <div>
                                            <p className="box-title">Volumen</p>
                                            <p className="box-title">Rama 3</p>
                                            <p className="class-state"><b>{pointsActRes.rama3}</b>pts</p>
                                            <p className="class-progress">{pointsActRes.porc3} %</p>
                                            <progress max="100" value={pointsActRes.porc3}></progress>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="box-container-range">
                                        <div>
                                            <p className="box-title">Volumen Directo</p>
                                        
                                            <p className="class-state"><b>{pointsActRes.directo}</b>pts</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                
                        </Tab>
                        <Tab eventKey="nextrange" title="Próximo Rango">
                            
                                    <Row>
                                        <Col sm={3}>
                                            <div className="box-container-range">
                                                <div>
                                                    <p className="box-title">Volumen Rama 1</p>
                                                
                                                    <p className="class-state"><b>{pointsNextRes.rama1}</b>&nbsp;pts</p>
                                                    <p className="class-progress">{pointsNextRes.porc1} %</p>
                                                    <progress max="100" value={pointsNextRes.porc1}></progress>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className="box-container-range">
                                                <div>
                                                    <p className="box-title">Volumen Rama 2</p>
                                                
                                                    <p className="class-state"><b>{pointsNextRes.rama2}</b>&nbsp;pts</p>
                                                    <p className="class-progress">{pointsNextRes.porc2} %</p>
                                                    <progress max="100" value={pointsNextRes.porc2}></progress>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className="box-container-range">
                                                <div>
                                                    <p className="box-title">Volumen Rama 3</p>
                                                
                                                    <p className="class-state"><b>{pointsNextRes.rama3}</b>&nbsp;pts</p>
                                                    <p className="class-progress">{pointsNextRes.porc2} %</p>
                                                    <progress max="100" value={pointsNextRes.porc2}></progress>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className="box-container-range">
                                                <div>
                                                    <p className="box-title">Volumen Directo</p>
                                                
                                                    <p className="class-state"><b>{pointsNextRes.directo}</b>&nbsp;pts</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                
                               
                        </Tab>
                    </Tabs>
                </Form>
                <br></br>
                <Form>
                    <Row>
                        <Form.Label className="content-footer">Puntos Totales Pendientes:&nbsp;</Form.Label>
                        <Form.Label className="content-footer"><b>{pointTotPending}</b></Form.Label>
                        <Form.Label className="content-footer">&nbsp;ptos</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label className="content-footer">Puntos Directos Pendientes:&nbsp;</Form.Label>
                        <Form.Label className="content-footer"><b>{pointDirPending}</b></Form.Label>
                        <Form.Label className="content-footer">&nbsp;ptos</Form.Label>
                    </Row>

                </Form>
            </div>
        );
        
    }
}
