import React from "react";
import { Form, Row , Col, Spinner } from 'react-bootstrap';
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
// import Car from "../assets/img/car.jpg";
// import Spinner from "./Spinner";

const CLIENT = {
  sandbox:
    'AYVe_-N4JVIlVCGkNSA_fWK6bvof5jQWQp4ASSkDq_YohtBebxHYWCMuI2GhdqvAGlgsVoA5vN8MLk2i',
  production:
    "AYfPhcYfqHQrWxh_819JLMSgNevBqrZM26HM_YmQ8WsJZsV7D25zjtWjUsRqq5ex0bdKd3DGi5xw7xDn"
};

// Test
const CLIENT_ID = CLIENT.sandbox;

// // Production
// const CLIENT_ID = CLIENT.production;

let PayPalButton = null;
class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
      loading: true,
      paid: false,
      error: false,
      exchange: props.exchange,
      typeExchange: 0,
      typeExchangeDes: "Dólares",
      type_code: "USD",
      idBank: 3,
      typePays: [],
      mount: props.mount,
      comision: 0,
      total: 0,
      loadingPayment: false
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      // this.setState({ loading: false, showButtons: true });
    }

    if(this.props.typeBank != undefined){
      let types = this.props.typeBank;
      types.forEach((item, idx) => {
          if(item.idTipoPago === this.state.idBank){
              this.setState({
                  typePays: this.state.typePays= item.subTipoPagos
              });
          }
      });

    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const scriptJustLoaded =
      !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

    if (scriptJustLoaded) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver("react", {
          React,
          ReactDOM
        });
        // this.setState({ loading: false, showButtons: true });
      }
    }
    this.forceUpdate();
  }
  createOrder = (data, actions) => {

    if(this.state.typeExchange !== 0){
      this.setState({
        loadingPayment: this.state.loadingPayment = true,
      });
      let objItem = {
          purchase_units: [
            {
              description: this.props.description,
              amount: {
                currency_code: this.state.type_code,
                // value: 0.01
                value: this.state.total
              }
            }
          ]
        };
      // //console.log(objItem);
      return actions.order.create(objItem);
    } else {
      alert("Seleccione un tipo de moneda.");
    }
  };

  onApprove = (data, actions) => {
    // //console.log(actions.order);
    actions.order.capture().then(details => {
      if(details.error !== undefined) {
        this.setState({ 
          showButtons: false, 
          paid: false, 
          error: true,
          loadingPayment: false
        });

        if(this.props.eventPay) {
          this.props.eventPay(false, "isPaid");
        }
      } else {
        
        const paymentData = {
          payerID: data.payerID,
          orderID: data.orderID,
          details: details
        };
        // Get paypal idTransaccion
        let idTransaccion = details.purchase_units[0].payments.captures[0].id;
        // //console.log("Payment Approved: ", paymentData);
        // console.log(idTransaccion)
        this.setState({ 
          showButtons: false, 
          paid: true, 
          error: false,
          loadingPayment:  false
        });
        if(this.props.eventPay) {
          // if(paymentData.details.status === "COMPLETED") {
          // https://developer.paypal.com/docs/api/orders/v2/
          // CREATED. The order was created with the specified context.
          // SAVED. The order was saved and persisted. The order status continues to be in progress until a capture is made with final_capture = true for all purchase units within the order.
          // APPROVED. The customer approved the payment through the PayPal wallet or another form of guest or unbranded payment. For example, a card, bank account, or so on.
          // VOIDED. All purchase units in the order are voided.
          // COMPLETED. The payment was authorized or the authorized payment was captured for the order.

          this.props.eventPay(true, "isPaid");
          this.props.eventPay(this.state.total, "mountPaid");
          this.props.eventPay(paymentData.details.create_time, "creationDate");
          this.props.eventPay(paymentData.details.update_time, "modificationDate");
          // this.props.eventPay(paymentData.details.id, "idTransaction");
          this.props.eventPay(idTransaccion, "idTransaction");
          this.props.eventPay(paymentData.details.intent, "intent");
          this.props.eventPay(paymentData.details.status, "status");

          // Save paypal paymente 
          if(this.props.savePaypal){
            this.props.savePaypal();
          }

          //save from shop
          if(this.props.registerBuy){
            
            this.props.eventPay(this.state.mount, "amountPaid");
            this.props.eventPay(1, "typePay");
            this.props.registerBuy();
            this.props.close();
          }
          // }
          // else {

          // }
        }
      }
      
    });
  };

  onError = (err) => {
    this.setState({ 
      showButtons: false, 
      paid: false, 
      error: true ,
      loadingPayment: false
    });
    if(this.props.eventPay) {
      this.props.eventPay(false, "isPaid");
    }
  }
  onCancel = (data) => {
    //console.log(data);
    this.setState({ 
      loadingPayment: this.state.loadingPayment = false,
      showButtons: this.state.showButtons = true, 
    });
    if(this.props.eventPay) {
      this.props.eventPay(false, "isPaid");
    }
    
  };

  // Handle exchange
  handleExchange = (e) => {
    let value = Number(e.target.value);
    // 1 -> dolar
    // 2 -> soles
    if(value === 1) {
      let comision = this.state.typePays[0].dolares;
       // Values default monen is dolars
       let temp = this.state.typePays[0].dolares + this.state.mount;
       let total = temp/(1 - this.state.typePays[0].porcentajeTasa/100);
       total = Math.round((total + Number.EPSILON) * 100) / 100
 
       let tasa = total * this.state.typePays[0].porcentajeTasa/100;
       //round
       tasa = Math.round((tasa + Number.EPSILON) * 100) / 100;
       
        this.setState({
            typeExchange: this.state.typeExchange = 1,
            typeExchangeDes: "Dólares",
            type_code: "USD",
            comision : this.state.comision = comision,
            tasa: tasa,
            total: total,
            showButtons: true
        });
    } else if(value === 2) {
      let comision = this.state.typePays[0].soles;
      let total = this.state.mount*this.state.exchange + comision;
        this.setState({
            typeExchange: this.state.typeExchange = 2,
            typeExchangeDes: "Soles",
            type_code: "PEN",
            comision : this.state.comision = comision,
            total: this.state.total = total,
            tasa: 0,
            showButtons: true
        });
    }
}

  // register event 
  registerBuy = () => {

    if(this.props.registerBuy){
      this.props.registerBuy()
    }
  }
  render() {
    const { showButtons,
            paid, 
            error, 
            typeExchange, 
            tasa,
            comision, 
            total,
            loadingPayment } = this.state;

    return (
      <div className="main" style={{fontSize: 12}}>
        <Row>
          <Col sm={12}>
            <Form.Label>1.- Seleccione el tipo de maneda</Form.Label>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
                  <Form.Label className="textAlert" style={{fontSize: 10}}>* Los pagos a través de este medio tienen una COMISIÓN.</Form.Label>
              </Col>
          </Row>
          <Row>
              <Col sm={4}>
                      <Form.Label column sm={4}>
                      <b>Moneda:</b>
                      </Form.Label>
              </Col>
              <Col sm={6}>
                          <Form.Control as="select" style={{fontSize: 12}}
                                  defaultValue={'0'}
                                  onChange={e => this.handleExchange(e)}>
                                      <option value="0" disabled>Seleccione</option>
                                      <option value="1" >Dólares</option>
                                      {/* <option value="2" >Soles</option> */}
                          </Form.Control>
                      </Col>
          </Row>
          {/* Dolares */}
          {typeExchange === 1 &&
            <Row style={{paddingTop: 15}}>
              <Col sm={3}>
                  <Form.Label ><b>Monto $:</b> {this.state.mount}</Form.Label>
              </Col>
              <Col sm={3}>
                  <Form.Label><b>Tasa $ :</b> {tasa}</Form.Label>
              </Col>
              <Col sm={3} >
                <Form.Label><b>Comisión $ :</b> {comision}</Form.Label>
              </Col>
              <Col sm={3} >
                  <Form.Label><b>TOTAL $ :</b> {total}</Form.Label>
              </Col>
          </Row>
          }
          {/* Soles */}
          {typeExchange === 2 &&
            <Row style={{paddingTop: 15}}>
              <Col sm={3} >
                  <Form.Label><b>Tipo de Cambio:</b> {this.state.exchange}</Form.Label>
              </Col>
              <Col sm={3}>
                  <Form.Label ><b>Monto S/ :</b> {this.state.mount*this.state.exchange}</Form.Label>
              </Col>
              <Col sm={3}>
                  <Form.Label><b>Tasa S/ :</b> {tasa}</Form.Label>
              </Col>
              <Col sm={3}>
                  <Form.Label><b>Comisión S/ :</b> {comision}</Form.Label>
              </Col>
              <Col sm={3}>
                  <Form.Label><b>TOTAL S/ :</b> {total}</Form.Label>
              </Col>
          </Row>
          }
        <hr></hr>
        <Row>
          <Col sm={12}>
            <Form.Label>2.- Seleccione una opción: </Form.Label>
          </Col>
        </Row>
         {loadingPayment && <div style={{textAlign: 'center'}}>
                        <Spinner size="sm" animation="border" variant="dark">
                        </Spinner>
                        <Form.Label>&nbsp; Espere ...</Form.Label>
                    </div>
        }
        {showButtons && (
          <div>
            <PayPalButton
              createOrder={(data, actions) => this.createOrder(data, actions)}
              onApprove={(data, actions) => this.onApprove(data, actions)}
              onError={(err) => this.onError(err)}
              onCancel={(data) => this.onCancel(data)}
            />
          </div>
        )}
       
        {paid && (
          <div className="main" style={{fontSize: 14, color:'green'}}>
              Su pago ha sido registrado con éxito.
          </div>
        )}

        {error && (
          <div className="main"  style={{fontSize: 14, color:'main'}}>
              Su pago no ha sido procesado. Inténtelo más tarde.
          </div>
        )}
      </div>
    );
  }
}


 export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)(PaypalButton);
