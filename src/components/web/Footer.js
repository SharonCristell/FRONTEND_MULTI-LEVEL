import React, { Component } from 'react';
import facebook from '../../images/icons/facebook.png';
import youtube from '../../images/icons/youtube.png';


export default class Footer extends Component {


    render() {
        return(
            
                <footer id="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 copyright">
                                <strong>&copy; 2020 InClub, Todos los derechos reservados</strong>.
                            </div>
                            <div className="col-lg-6 social">
                                    <ul className="social-icons">
                                        <li><a className="facebook" href="https://www.facebook.com/"><img src={facebook}></img></a></li>
                                        <li><a className="youtube" href="https://www.youtube.com/"><img src={youtube}></img></a></li>   
                                    </ul>    
                            </div>
                        </div>
                    </div>
                </footer>
        )
    }
}