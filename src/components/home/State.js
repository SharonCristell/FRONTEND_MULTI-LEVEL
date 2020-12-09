import React, { Component } from 'react';
import {Form, Row, Col} from 'react-bootstrap';
import { GoCalendar } from 'react-icons/go';
import { FaCheck } from 'react-icons/fa';

import icon from '../../images/icons/calendar.png';

export default class State extends Component{
    constructor(props){
        super(props);
        this.state = {
            state: "Activo",
            dayPeriod: "3 días",
            period: "24 / 07",
            dayPeriodN: "3 días",
            periodN: "24 / 07"
        };
    }
    
    componentDidMount() {
        let dash = this.props.dash;
        let date = new Date(dash.cycleUser.endDate);
        let dformat =(( "00" + (date.getDate())).slice(-2) + "/"  + ("00" + (date.getMonth()+1)).slice(-2) + "/"  +  date.getFullYear());
        let dateEmp = new Date(dash.cycleEmpresa.endDate);
        let dformatEmp =(( "00" + (dateEmp.getDate())).slice(-2) + "/"  + ("00" + (dateEmp.getMonth()+1)).slice(-2) + "/"  +  dateEmp.getFullYear());
        
        // SESSION STORAGE Save state
        sessionStorage.setItem("stateuser", dash.stateUserName);

        this.setState({
            state: this.state.state = dash.stateUserName,
            dayPeriod: this.state.dayPeriod = dash.cycleUser.diasRestantes + " días",
            period: this.state.period = dformat, 
            dayPeriodN: this.state.dayPeriodN = dash.cycleEmpresa.diasRestantes + " días",
            periodN: this.state.periodN = dformatEmp
        });
    }
    render(){
        const {state, dayPeriod, period, dayPeriodN, periodN} = this.state;
        // const dash = this.props.dash;
        // //console.log(dash);
        return(
            <div>
                <Form.Label className="content-title">Estado del socio</Form.Label>
                <div className="box-container-active">
                        <div className="box-icon">
                            <FaCheck size={20}></FaCheck>
                        </div>
                        <p className="class-state"><b>{state}</b></p>
                </div>
                <div className="box-container">
                    <div className="box-icon-state">
                        {/* <img src={icon}></img> */}
                    </div>
                    <div>
                    <img src={icon}></img>
                        <div>
                            <p className="title-state">{dayPeriod}</p>
                            <p className="subtitle-state">Mi ciclo &nbsp;{period}</p>
                        </div>
                    </div>
                </div>

                <div className="box-container">
                    <div className="box-icon-state">
                        {/* <img src={icon}></img> */}
                    </div>
                    <div>
                        <img src={icon}></img>
                        <p className="title-state">{dayPeriodN}</p>
                        <p className="subtitle-state">Ciclo de la empresa &nbsp;{periodN}</p>
                    </div>
                </div>
                
            </div>
        );
    }
}