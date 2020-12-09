import React, { Component } from 'react';
import flyer from '../../images/flyer/flyer1.jpg';
import flyerPlata from '../../images/flyer/flyer_plata.jpeg';
import flyerOro from '../../images/flyer/flyer_oro.jpeg';
import flyerEsmeralda from '../../images/flyer/flyer_esmeralda.jpeg';
import flyerRuby from '../../images/flyer/flyer_ruby.jpeg';
import flyerZafiro from '../../images/flyer/flyer_zafiro.jpeg';

import '../styles/Flyer.css';

import avatar from '../../images/flyer/img_avatar.png';

export default class FlyerView extends Component {

    render(){
        return(
            <div>
                <img src={flyerPlata} className="flyer"></img>
                <img src={avatar} className="avatar-flyer"></img>
            </div>
        )
    }
}