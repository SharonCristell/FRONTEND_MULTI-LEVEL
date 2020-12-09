import React, { Component } from 'react';

import history from '../../views/navigation/history';


export default class FooterMenu extends Component {


    OnClicked = (e, path) => {
        history.push(path);
    }

    render(){
        return(
            <section id="footer-menu">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 content">
                                <a className="menu" onClick={e => this.OnClicked(e, "/portfolio")}>Sobre nosotros</a>
                            </div>
                            <div className="col-lg-4 content">
                                <a className="menu"  onClick={e => this.OnClicked(e, "/portfolio")}>Política de privacidad</a>
                            </div>
                            <div className="col-lg-4 content">
                                <a className="menu" onClick={e => this.OnClicked(e, "/portfolio")}>Términos y Condiciones</a>
                            </div>

                        </div>
                    </div>
                </section>
                
        )
    }
}