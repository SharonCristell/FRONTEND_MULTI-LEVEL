import React , { Component } from 'react';

class StateFul extends Component {
    constructor(props){
        super(props);
        this.state = {
            title = 'Iniciar sesión'
        }
    }
    render() {
        return (
        <h1>{this.state.title}</h1>
        );
    }
}
export default StateFul;