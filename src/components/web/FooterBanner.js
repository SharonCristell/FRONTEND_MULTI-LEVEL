import React, { Component } from 'react';

import isotipo from '../../images/icons/iso_inclub.png'

import history from '../../views/navigation/history';

export default class FooterBanner extends Component {


    OnClicked = (e, path) => {
        history.push(path);
    
    }

    render(){
        return(
            <section id="footer-main">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 footer-img">
                            <img src={isotipo}></img>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <h3 className="cta-title">¡Únete a InClub ahora!</h3>
                            <p className="cta-text">¡Comienza a invertir y alcanza tu libertad financiera!</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <a className="btn-register" onClick={e => this.OnClicked(e, "/register-in")}>Registrarme</a>
                        </div>
                    </div>

                </div>
            </section>
        )
    }
}