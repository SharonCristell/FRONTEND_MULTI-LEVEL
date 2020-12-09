import React, { Component } from 'react';
import  { Form, Row, Col, Tab, Tabs} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../../views/styles/CustomTabs.css';

export default class RangeCom extends Component{
    constructor(props){
        super(props);
        this.state = {
            points: {
                rama1: "0",
                rama2: "0",
                rama3: "0",
                directo: "0",
            },
            pointsNextCom:{
                    rama1: "0",
                    porc1: 0,
                    rama2: "0",
                    porc2: "0",
                    rama3: 0,
                    porc3: 0,
                    directo: "0",
                
            },
            pointsActCom:{
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
        let points = data.pointsCompuesto;
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
        tempPoints.directo =  data.volumeDirectCompuesto;

        // Next range
        if(this.props.dash.pointsCompuestoProxRango != null){
            
            let tempPointsRes = {};
            this.props.dash.pointsCompuestoProxRango.forEach( elem => {
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
            tempPointsRes.directo = data.volumeDirectCompuestoProxRango;
            this.setState({
                pointsNextCom: this.state.pointsNextCom = tempPointsRes,
            });
        }
        // Current 
        if(this.props.dash.pointsCompuestoRangoActual != null){
            let tempPointsRes = {};
            this.props.dash.pointsCompuestoRangoActual.forEach( elem => {
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
            tempPointsRes.directo = data.volumeDirectCompuestoRangoActual;
            this.setState({
                pointsActCom: this.state.pointsActCom = tempPointsRes,
            });
        }
        this.setState({
            points: this.state.points = tempPoints,
            pointTotPending: this.state.pointTotPending = this.props.dash.pointsTotalesPendientesCompuesto,
            pointDirPending: this.state.pointDirPending= this.props.dash.pointsDirectosPendientesCompuesto
        });
    }
    render(){
        const {points, pointsNextCom, pointsActCom, pointTotPending, pointDirPending} = this.state;
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
                    <Tabs className="custom-tabs-main" defaultActiveKey="nextRangeCom" id="uncontrolled-tab-example">
                        <Tab eventKey="currentCom" title="Rango Actual">
                            <Row>
                                <Col sm={3}>
                                    <div className="box-container-range">
                                        <div>
                                            <p className="box-title">Volumen</p>
                                            <p className="box-title">Rama 1</p>
                                            <p className="class-state"><b>{pointsActCom.rama1}</b>&nbsp;pts</p>
                                            <p className="class-progress">{pointsActCom.porc1} %</p>
                                            <progress max="100" value={pointsActCom.porc1}></progress>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="box-container-range">
                                        <div>
                                            <p className="box-title">Volumen</p>
                                            <p className="box-title">Rama 2</p>
                                            <p className="class-state"><b>{pointsActCom.rama2}</b>&nbsp;pts</p>
                                            <p className="class-progress">{pointsActCom.porc2} %</p>
                                            <progress max="100" value={pointsActCom.porc2}></progress>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="box-container-range">
                                        <div>
                                            <p className="box-title">Volumen</p>
                                            <p className="box-title">Rama 3</p>
                                            <p className="class-state"><b>{pointsActCom.rama3}</b>pts</p>
                                            <p className="class-progress">{pointsActCom.porc3} %</p>
                                            <progress max="100" value={pointsActCom.porc3}></progress>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="box-container-range">
                                        <div>
                                            <p className="box-title">Volumen Directo</p>
                                        
                                            <p className="class-state"><b>{pointsActCom.directo}</b>pts</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                
                        </Tab>
                        <Tab eventKey="nextRangeCom" title="Próximo Rango">
                            
                                    <Row>
                                        <Col sm={3}>
                                            <div className="box-container-range">
                                                <div>
                                                    <p className="box-title">Volumen Rama 1</p>
                                                
                                                    <p className="class-state"><b>{pointsNextCom.rama1}</b>&nbsp;pts</p>
                                                    <p className="class-progress">{pointsNextCom.porc1} %</p>
                                                    <progress max="100" value={pointsNextCom.porc1}></progress>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className="box-container-range">
                                                <div>
                                                    <p className="box-title">Volumen Rama 2</p>
                                                
                                                    <p className="class-state"><b>{pointsNextCom.rama2}</b>&nbsp;pts</p>
                                                    <p className="class-progress">{pointsNextCom.porc2} %</p>
                                                    <progress max="100" value={pointsNextCom.porc2}></progress>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className="box-container-range">
                                                <div>
                                                    <p className="box-title">Volumen Rama 3</p>
                                                
                                                    <p className="class-state"><b>{pointsNextCom.rama3}</b>&nbsp;pts</p>
                                                    <p className="class-progress">{pointsNextCom.porc3} %</p>
                                                    <progress max="100" value={pointsNextCom.porc3}></progress>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className="box-container-range">
                                                <div>
                                                    <p className="box-title">Volumen Directo</p>
                                                
                                                    <p className="class-state"><b>{pointsNextCom.directo}</b>&nbsp;pts</p>
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
