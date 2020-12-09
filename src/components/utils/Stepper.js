import React, { Component } from 'react';
import '../../views/styles/Stepper.css'

export default  class Stepper extends Component {

    constructor(props){
        super(props);

        this.state = {
            numStep: props.numStep,
            active: props.active
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
        this.setState({ 
            active: nextProps.active,
            numStep: nextProps.numStep
        });
       
    }

    componentWillUpdate
    render (){
        const { numStep, active } = this.state;
        let items = [];
        let width = 100/numStep;

        for(let i=0; i < numStep; i ++) {
            if(active > i) {
                items.push(<li key={i} className="active" style={{width: width + '%'}}> Paso {i + 1}</li>)
            } else {
                items.push(<li key={i} style={{width: width + '%'}}>Paso {i + 1}</li>)
            }
        }

        return(
            <div className="contentProgress">
                <ul className="progressbar">
                    {items}
                </ul>
            </div>
        )
    }
}