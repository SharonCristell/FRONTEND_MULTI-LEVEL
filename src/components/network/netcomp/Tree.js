import React, { Component } from 'react';

import '../../../views/styles/tree.css'
import { Button, Row, Col, Modal } from 'react-bootstrap';

export default class Tree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tree: props.tree,
            temp: props.tree,
            showAll: false,
            showChild: true,
            showModal: false,
        }
    }

    componentWillMount(){
        // Data from registerPaymentView
        if(this.props.tree !== undefined){
            this.setState({
                tree: this.state.tree = this.props.tree
            });
            // console.log("tree")
            // console.log(this.props.tree)
        } else {
            this.setState({
                tree: this.state.tree = []
            });
        }
    }

    buildChild = (arrayChildren, showChild) => {
        let tags = [];
        if(showChild && arrayChildren.length > 0){
            //Add lines 
            tags.push(<tr className="lines"><td colSpan={arrayChildren.length *2}><div className="downLine"></div></td></tr>)

            //add lines to connect child 
            let count = arrayChildren.length*2;
            let rows = [];
            for (let i = 0; i < count; i++) {
                let c = "leftLine topLine";
                if(i === 0) {
                    c = "rightLine"
                } else if(i === count - 1){
                    c = "leftLine"
                } else if (i%2 === 0) {
                    c = "rightLine topLine"
                }
                rows.push(<td  className={c}></td>);
            }
            tags.push(<tr className="lines">{rows}</tr>);
        
        
            //Add nodes
            tags.push(
                <tr className="nodes">
                    {arrayChildren.map( (elem, idx) => {
                        let span = elem.children.length;
                        if(idx !== 0) {
                            // elem.children = []
                            span = 1;
                        }
                        return (
                        <td colSpan={2}>
                            <table>
                                <>
                                <tr>
                                    {/* <td>
                                        
                                    </td> */}
                                    <td colSpan={elem.children.length*2}>
                                        <div className="node" 
                                            onClick={e => this.onClickNode(e, elem)}
                                            onDoubleClick={e => this.onDblClick(e, elem)}>
                                             <div className="title" style={{background:(elem.colorState !== undefined)? elem.colorState:''}}>
                                                    {elem.title}
                                            </div>
                                            <div className="content">
                                                {elem.state}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                {/* if have children */}
                                {elem.children.length > 0 && this.buildChild(elem.children, elem.showChild)}
                                </>
                            </table>
                        </td>
                    )})}
                </tr>
            );
        }
        
        return tags;
        
    }

    // call service to update tree
    updateTree = (e) => {

        // update data tree
        if(this.props.updateTree) {
            this.props.updateTree()
        }
    }
    showAll = (e) => {
        // console.log("showall")
        let origin = this.state.tree;
        let children = this.updateNode(origin[0].children, -1, true);
        origin[0].children = children;

        this.setState({
            tree: this.state.tree = origin
        });

    }

    hideAll = (e) => {
        // let tree = this.state.tree;
        
        // for(let i = 0; i < tree[0].children.length; i++) {
        //     tree[0].children[i].showChild  = false;
        //     tree[0].children[i].children = this.updateNode(tree[0].children[i].children, tree[0].children[i].idHijo, false);

        // }

        // this.setState({
        //     tree: this.state.tree = tree
        // });
        let origin = this.state.tree;
        let children = this.updateNode(origin[0].children, -1, false);
        origin[0].children = children;

        this.setState({
            tree: this.state.tree = origin
        });

    }

    onClickNode = (e, item) => {
       
        // find node and set showchildren in true
        let id = item.idsocio;
        let show = !item.showChild;
        let origin = this.state.tree;
        let children = this.updateNode(origin[0].children, id, show);
        origin[0].children = children;

        this.setState({
            tree: this.state.tree = origin
        });
    }

    onDblClick = (e, item) => {
        
        // find node and set showchildren in true
        let id = item.idsocio;
        let showChild = true;
        let origin = this.state.tree;
        let children = this.updateNode(origin[0].children, id, false);
        origin[0].children = children;

        this.setState({
            tree: this.state.tree = origin
        });
    }

    updateNode = (childrenNode, id, value) => {

        let isFound = false;
        // verify id node
        for(let i = 0; i < childrenNode.length; i++) {
            if(id === -1){
                childrenNode[i].showChild = value;
            } else if(childrenNode[i].idsocio === id){
                childrenNode[i].showChild = value;
                isFound = true;
            }
        }
        // Find into childrens for each node
        if(!isFound) {
            for(let i = 0; i < childrenNode.length; i++) {
                this.updateNode(childrenNode[i].children, id, value)
            }
        }
       return childrenNode;
    }

    

    render() {
        const { tree, showChild  } = this.state;
        return(
            <div>
                
                <div className="chart-btn">
                    <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Col sm={12} style={{textAlign: 'end'}}>
                            <Button variant="secondary" size="sm"
                                className="mb-2"
                                onClick={e => {this.updateTree(e)}}>Actualizar</Button>
                        {/* </Col>
                        <Col sm={2} style={{textAlign: 'end'}}> */}
                            <Button variant="secondary" size="sm"
                                className="mb-2 mr-2  ml-2"
                                onClick={e => {this.showAll(e)}}>Mostrar todos</Button>
                        {/* </Col>
                        <Col sm={2} style={{textAlign: 'end'}}> */}
                            <Button variant="secondary" size="sm"
                                className="mb-2"
                                onClick={e => {this.hideAll(e)}}>Ocultar todos</Button>
                            
                        </Col>
                    </Row>
                    
                </div>

                <div className="chart-container">
                
                    <div style={{transform:"scale(0.8)"}}>
                    <div className="orgchart l2r">
                        <table>
                            {tree.map((item) => {
                                return(
                                <>
                                    <tr >
                                        <td colSpan={item.children.length*2}>
                                            <div className="node" >
                                                <div className="title" style={{background:(item.colorState !== undefined)? item.colorState:''}}>
                                                    {item.title}
                                                </div>
                                                <div className="content">
                                                    {/* <p>contenido</p> */}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* if have children */}
                                    {item.children.length > 0 && this.buildChild(item.children, showChild)}
                                </>
                            )})
                            }
                        </table>
                    </div>
                    </div>
                </div>

                
            </div>
            
        );
    }
}