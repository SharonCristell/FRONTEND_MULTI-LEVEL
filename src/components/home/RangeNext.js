import React, { Component } from 'react';
import  { Form, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import imgDefault from '../../images/assets/socio.png';
import imgSocio from '../../images/assets/socio.png';
import imgPlata from '../../images/assets/plata.png';
import imgOro from '../../images/assets/oro.png';
import imgZafiro from '../../images/assets/zafiro.png';
import imgRuby from '../../images/assets/ruby.png';
import imgEsmeralda from '../../images/assets/zafiro.png';
import imgDiamante from '../../images/assets/diamante.png';
import imgDnegro from '../../images/assets/dnegro.png';
import imgDazul from '../../images/assets/dazul.png';
import imgDcorona from '../../images/assets/dcorona.png';
import imgDimperial from '../../images/assets/dimperial.png'

import imageDefault from '../../images/noimage.jpg'

export default class RangeNext extends Component{
    constructor(props){
        super(props);
        this.state = {
            imgMax: imgDefault,
            imgRangeAct : imgDefault,
            imgRangeNext: imgDefault,
            imgMaxCom: imgDefault,
            imgRangeActCom : imgDefault,
            imgRangeNextCom: imgDefault,
            imgs: {
                Socio: imgSocio,
                Plata: imgPlata,
                Oro: imgOro,
                Zafiro: imgZafiro,
                Ruby: imgRuby,
                Esmeralda: imgEsmeralda,
                Diamante: imgDiamante,
                DiamanteNegro: imgDnegro,
                DiamanteAzul: imgDazul,
                DiamanteCorona: imgDcorona,
                DiamanteImperial: imgDimperial
            }
        }

    }
    componentWillReceiveProps(props){
        this.setState({
            isResidual:  this.state.isResidual = props.isResidual
        });
    }

    componentDidMount() {
        let dash = this.props.dash;
        this.setState({
            isResidual:  this.state.isResidual = this.props.isResidual
        });
        //console.log(dash)
        // Rango actual
        if(this.props.dash.nameRangoActualResidual !== null){
            let nameRangeAct = dash.nameRangoActualResidual.replace(/\s/g, '');
            this.setState({
                imgRangeAct : this.state.imgRangeAct = this.state.imgs[nameRangeAct]
            });
            
        } else {
            this.setState({
                imgRangeAct : this.state.imgRangeAct = imageDefault
            });
            
        }

        if(this.props.dash.nameRangoActualCompuesto !== null){
            let nameRangeAct = dash.nameRangoActualCompuesto.replace(/\s/g, '');
            this.setState({
                imgRangeActCom : this.state.imgRangeActCom = this.state.imgs[nameRangeAct]
            });
            
        } else {
            this.setState({
                imgRangeActCom : this.state.imgRangeActCom = imageDefault
            });
            
        }

        // Rango maximo
        if(this.props.dash.nameRangoMaximoResidual !== null){
            let name = dash.nameRangoMaximoResidual.replace(/\s/g, '');
            this.setState({
                imgMax : this.state.imgMax = this.state.imgs[name]
            });
            
        }else {
            this.setState({
                imgMax : this.state.imgRangeAct = imageDefault
            });
            
        }
        if(this.props.dash.nameRangoMaximoCompuesto !== null){
            let name = dash.nameRangoMaximoCompuesto.replace(/\s/g, '');
            this.setState({
                imgMaxCom : this.state.imgMaxCom = this.state.imgs[name]
            });
            
        }else {
            this.setState({
                imgMax : this.state.imgRangeAct = imageDefault
            });
            
        }

        // Proximo rango
        if(this.props.dash.nameProxRangeResidual !== null) {
             let name = dash.nameProxRangeResidual.replace(/\s/g, '');
            this.setState({
                imgRangeNext : this.state.imgRangeNext = this.state.imgs[name]
            });
        }else {
            this.setState({
                imgRangeNext : this.state.imgRangeAct = imageDefault
            });
            
        }

        if(this.props.dash.nameProxRangeCompuesto !== null) {
            let name = dash.nameProxRangeCompuesto.replace(/\s/g, '');
           this.setState({
               imgRangeNextCom : this.state.imgRangeNextCom = this.state.imgs[name]
           });
       }else {
           this.setState({
               imgRangeNextCom : this.state.imgRangeNextCom = imageDefault
           });
           
       }
        
    }
    render(){
        const {imgMax, imgRangeAct, imgRangeNext, imgMaxCom, imgRangeActCom, imgRangeNextCom, isResidual} = this.state;
        return(
            <div >
                {isResidual === 0 &&
                    <Form >
                    <Form.Label className="content-title">Avance de Rango</Form.Label>
                    <br></br>
                    <Form.Label className="range-title">Compuesto</Form.Label>
                    
                        <div className="range-img">
                            <p className="range-title"><b>MÁXIMO LOGRO: </b></p>
                            <img src={imgMaxCom}></img>
                        </div>
                        <div  className="range-img">
                            <p className="range-title"><b>RANGO ACTUAL:</b></p>
                            <img src={imgRangeActCom}></img>
                        </div>
                        <div  className="range-img">
                            <p className="range-title"><b>PRÓXIMO RANGO:</b></p>
                            <img src={imgRangeNextCom}></img>
                        </div>
                    </Form>
                }
                {isResidual === 1 &&
                    <Form >
                        <Form.Label className="content-title">Avance de Rango</Form.Label>
                        <br></br>
                        <Form.Label className="range-title">Residual</Form.Label>
                        
                            <div className="range-img">
                                <p className="range-title"><b>MÁXIMO LOGRO: </b></p>
                                <img src={imgMax}></img>
                            </div>
                            <div  className="range-img">
                                <p className="range-title"><b>RANGO ACTUAL:</b></p>
                                <img src={imgRangeAct}></img>
                            </div>
                            <div  className="range-img">
                                <p className="range-title"><b>PRÓXIMO RANGO:</b></p>
                                <img src={imgRangeNext}></img>
                            </div>
                    </Form>
                }
            </div>
        );
    }
}