import React, { Component } from 'react';
import { Form, Table, Button, Modal, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BsArrowBarUp } from 'react-icons/bs'
import CSVReader from 'react-csv-reader'

import UserService from '../../services/user.service';
import Validation from '../../components/utils/Validation';

export default class Schedule extends Component {

    constructor(props){
        super(props);
        this.state = {
            iduser: props.iduser, //14000
            total: 0,
            registers: [],
            loading: false,
            noData: false,
            noDataMessage: "",
            showModal: false,
            registerModal: [],
            loadingModal: false,
            noDataModal: false,
            noDataMes: "",
            editCascade: false,
            editCasExchange: true, 
            editCasQuoteUsd: false,
            editCasNextExp: true,
            calculateCheck: true,
            lastSuscription: undefined,
            selectSuscription: undefined,
            listSuscription: []
        }
    }

    componentDidMount(){
        this.getRegister();
    }

    async getRegister () {
        
        let response = await UserService.getLastSchedule(this.state.iduser);

        if(response !== undefined ){
            if(response.status !== 1) {
                //console.log(response);
                this.setState({
                    registers: this.state.registers = [],
                    loading: this.state.loading = false,
                    noData: this.state.noData = true,
                    noDataMesssage : this.state.noDataMessage = "Ocurrió un problema mientras obteniamos los registros. Inténtelo más tarde.",
                    total: this.state.total = 0
                });
            } else {
                if(response.objModel.listPaySchedulesJSONDetailPacked.length > 0) {

                    let registers = [];
                    let total = 0 ;

                    for(let i = 0; i < response.objModel.listPaySchedulesJSONDetailPacked.length; i++){
                        //amortization and percent
                        response.objModel.listPaySchedulesJSONDetailPacked[i].checkCalculate = this.state.calculateCheck;
                        total += response.objModel.listPaySchedulesJSONDetailPacked[i].quote;
                        response.objModel.listPaySchedulesJSONDetailPacked[i].payDate = Validation.convertDateToStringEx(response.objModel.listPaySchedulesJSONDetailPacked[i].payDate);
                        response.objModel.listPaySchedulesJSONDetailPacked[i].nextExpiration = Validation.convertDateToStringEx(response.objModel.listPaySchedulesJSONDetailPacked[i].nextExpiration);
                        registers.push(response.objModel.listPaySchedulesJSONDetailPacked[i])

                    }

                    total = Math.round((total + Number.EPSILON) * 100) / 100
                    // Get list of suscription
                    let listFamily  = response.objModel.familyPackageLastSuscription.packages;
                    // Get current suscription
                    let lastSuscription = response.objModel.lastSuscriptionUser;
                    
                    let result = listFamily.filter(obj => {
                        return obj.id === lastSuscription.idPackage
                    })

                    if(result.length === 1) {
                        lastSuscription.package = result[0]
                    }
                    

                    this.setState({
                        registers: this.state.registers = response.objModel.listPaySchedulesJSONDetailPacked,
                        loading: this.state.loading = false,
                        noData: this.state.noData = false,
                        noDataMesssage : this.state.noDataMessage = "",
                        total: this.state.total = total,
                        listSuscription:  this.state.listSuscription = listFamily,
                        lastSuscription: this.state.lastSuscription = lastSuscription,
                        selectSuscription: this.state.selectSuscription = lastSuscription
                    });
                } else {
                    this.setState({
                        registers: this.state.registers = response.objModel.listPaySchedulesJSONDetailPacked,
                        loading: this.state.loading = false,
                        noData: this.state.noData = true,
                        noDataMesssage : this.state.noDataMessage = "No hay registros para mostrar.",
                        total: this.state.total = 0
                    });
                }
               
            }
        }
        
    }

  
    // Handle modal 
    onclickResumen = (e, id) => {
        e.preventDefault();
        this.handleShow();
        this.setState({
            loadingModal: this.state.loadingModal = true
        });
        this.getResumen(id);
    }

    handleItem = (e, field, idx) => {
        // //console.log(e.target.value);
        let registers = this.state.registers;
        let register = registers[idx];

        if(register !== undefined) {
            register[field] = e.target.value.trim()
        }

        registers[idx] = register;

        this.setState({
            registers: this.state.registers = registers
        });

        
    };
    // Handle cuote descripcion
    onBlurDes = (e, field, id) => {
        
        if(this.state.editCascade) {
            let registers = this.state.registers;
            let description = registers[id][field].trim();
            let list = description.split(" ");

            //convert number
            let des = list.slice(0, -1).join(" ");
            let num = list.slice(-1)[0];
            
            if(!Number.isNaN(Number(num))) {
                num = Number(num);
                for(let i = id; i < registers.length; i ++)
                {
                    registers[i][field] = des + " " + num;
                    num +=1;
                    
                }
                this.setState({
                    registers: this.state.registers = registers
                });
            } else {
                for(let i = id; i < registers.length; i ++)
                {
                    registers[i][field] = description
                    
                }
                this.setState({
                    registers: this.state.registers = registers
                });
            }
            
        }
        

        
    };

    // Handle day onblur expiration onblur
    addMonths = (date, months, day) => {
        var d = date.getDate();
        date.setMonth(date.getMonth() + +months);
        let flag = false;
        if (date.getDate() != d) {
            date.setDate(0);
            flag = true;
            
        }
        
        if(!flag && day > d ) {
            
            //set in the last day
            let lastdate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            if(day < lastdate.getDate()) {
               date =  new Date(lastdate.getFullYear(), lastdate.getMonth(), day);
               
            } else {
                date = lastdate;
            }
           
        }
        return date;
    }

    handleItemNext = (e, field, idx) => {

        let register =  Object.assign({}, this.state.registers[idx]);
        console.log("dste exp")
        
        // update if date is valida
        let stringdate = register[field].trim();
        let date = new Date(stringdate + "T00:00:00");
        let date1 = new Date(stringdate + "T00:00:00");
        let day = date.getDate();
        let registers = this.state.registers;
        
        if( Validation.convertDateToStringEx(date).length > 0) {
            if(this.state.editCasNextExp){
                for(let i = idx; i < registers.length; i ++)
                {
                    registers[i][field] = Validation.convertDateToStringEx(date)
                    date = this.addMonths(date1, 1, day )
                }
            }
         
 
        }


        this.setState({
            registers: this.state.registers = registers
        });

        
    };


    handleItemVerif = (e, field, id) => {
        // //console.log(e.target.value);
        let register =  Object.assign({}, this.state.registers[id]);
        // Chanhe value
        register[field] = e.target.value

        // Chnage amortization

        let exchange =  Number(register.dollarExchange);
        let dollar =  Number(register.quoteUsd);
        let total = (exchange > 0)? dollar*exchange:0;
        total = Math.round((total + Number.EPSILON) * 100) / 100

        register.quote = total;

        let registers = this.state.registers;
        registers[id] = register;
        
        this.setState({
            registers: this.state.registers = registers
        });
       
            
        
    };


    handleItemExchange = (e, field, id) => {
        // //console.log(e.target.value);
        let exchange = e.target.value;

        if(this.state.editCasExchange) {
            // Change registers are below 
            let registers = this.state.registers;

            for(let i = id; i < registers.length ; i++){

                registers[i].dollarExchange = exchange;
                let dollar =  Number(registers[i].quoteUsd);
                let total = (Number(exchange) > 0)? dollar*Number(exchange):0;
                total = Math.round((total + Number.EPSILON) * 100) / 100

                registers[i].quote = total;
                registers[i].amortization = total;
            }
            this.setState({
                registers: this.state.registers = registers
            });
        } else {
            // only change the register
            // change  value
            let register =  Object.assign({}, this.state.registers[id]);
            register[field] = exchange;

            
            // Chnage type
            let exchange =  Number(register.dollarExchange);
            let dollar =  Number(register.quoteUsd);
            let total = (exchange > 0)? dollar*exchange:0;
            total = Math.round((total + Number.EPSILON) * 100) / 100

            register.quote = total;
            register.amortization = total;

            let registers = this.state.registers;
            registers[id] = register;
            
            this.setState({
                registers: this.state.registers = registers
            });
        }
        
       
            
        
    };

    /**
     * Change value of quote
     * @param {*} e 
     * @param {*} field 
     * @param {*} id 
     */
    handleItemQuoteUsd = (e, field, id) => {

        let quoteUsd = e.target.value;

        if(this.state.editCasQuoteUsd) {
            // Change registers are below 
            let registers = this.state.registers;

            for(let i = id; i < registers.length ; i++){

                registers[i].quoteUsd = quoteUsd;
                
                let exchange =  Number(registers[i].dollarExchange);
                let total = (exchange > 0)? Number(quoteUsd)*exchange:0;
                total = Math.round((total + Number.EPSILON) * 100) / 100

                registers[i].quote = total;
                registers[i].amortization = total;
            }
            this.setState({
                registers: this.state.registers = registers
            });
        } else {
            // only change the register
            // change  value
            let register =  Object.assign({}, this.state.registers[id]);
            register[field] = quoteUsd;

            
            // Chnage type
            let exchange =  Number(register.dollarExchange);
            let dollar =  Number(register.quoteUsd);
            let total = (exchange > 0)? dollar*exchange:0;
            total = Math.round((total + Number.EPSILON) * 100) / 100

            register.quote = total;
            register.amortization = total;

            let registers = this.state.registers;
            registers[id] = register;
            
            this.setState({
                registers: this.state.registers = registers
            });
        }
            
        
    };

    handleItemId = (e, field, id) => {
        // //console.log(e.target.value);
        if(id === 0 ){ 
            let registers = this.state.registers;
            let i = 0;

            let numCorr = Number( e.target.value);
            for(i = 0; i < registers.length; i ++)
            {
                if(i === id){
                    registers[i][field] = numCorr
                } else {
                    registers[i][field] = numCorr
                }
                numCorr += 1;
            }

            this.setState({
                registers: this.state.registers = registers
            });
        } else {

            let register =  Object.assign({}, this.state.registers[id]);
            let i = 0;

            register.idMembershipDetail = Number( e.target.value);

            let registers = this.state.registers;
            registers[id] = register;
            
            this.setState({
                registers: this.state.registers = registers
            });
        }
        

        
    };

    handleClose = () => {
        this.setState({
            showModal : this.state.showModal = false,
            loadingModal: this.state.loadingModal = false,
            registerModal: this.state.registerModal = [],
            noDataModal: this.state.noDataModal = false,
            noDataMes: this.state.noDataMes = ""
        });
    }

    handleShow= () => {
        this.setState({
            showModal : this.state.showModal = true
        });
    }

    // Modal details
    onclickDetails = (e, id) => {
        e.preventDefault();
      
    }

    validateItem(item) {
        let temp = {};
        if(!Number.isNaN(Number(item.idMembershipDetail))) {
            temp.idMembershipDetail = Number(item.idMembershipDetail) ;
        } else {
            alert("idMembershipDetail: " + item.idMembershipDetail)
            return undefined;
        }

        if(item.quoteDescription.length > 0) {
            temp.quoteDescription = item.quoteDescription;
        } else {
            alert("quoteDescription: " + item.quoteDescription)
            return undefined;
        }

        if(Validation.convertDateToStringEx(item.nextExpiration).length > 0) {
            temp.nextExpiration = new Date(item.nextExpiration) ;
        } else {
            alert("nextExpiration: " + item.nextExpiration)
            return undefined;
        }

        if(!Number.isNaN(Number(item.dollarExchange))) {
            temp.dollarExchange = Number(item.dollarExchange);
        } else {
            alert("dollarExchange: " + item.dollarExchange)
            return undefined;
        }

        if(!Number.isNaN(Number(item.quoteUsd))) {
            temp.quoteUsd = Number(item.quoteUsd);
        } else {
            alert("quoteUsd:" +  item.quoteUsd)
            return undefined;
        }

        if(!Number.isNaN(Number(item.quote))) {
            temp.quote = Number(item.quote);
        } else {
            alert("quote: " + item.quote)
            return undefined;
        }

        if(!Number.isNaN(Number(item.amortization))) {
            temp.amortization = Number(item.amortization);
        } else {
            alert("amortization: " + item.amortization)
            return undefined;
        }

        if(!Number.isNaN(Number(item.capitalBalance))) {
            temp.capitalBalance = Number(item.capitalBalance);
        } else {
            alert("capitalBalance: " +  item.capitalBalance)
            return undefined;
        }

        if(!Number.isNaN(Number(item.percent))) {
            temp.percent = Number(item.percent);
        } else {
            alert("percent:" + item.percent)
            return undefined;
        }

        if(!Number.isNaN(Number(item.interested))) {
            temp.interested = Number(item.interested);
        } else {
            alert("interested: " + item.interested)
            return undefined;
        }
// "ticketImage": "70565635_0",
        if(!Number.isNaN(Number(item.verif))) {
            temp.verif = Number(item.verif);
        } else {
            alert("verif: " + item.verif)
            return undefined;
        }
        
        // "nroOperacion": "0",
        // "obs": "0",
        if(!Number.isNaN(Number(item.isQuoteInitial))) {
            temp.isQuoteInitial = Number(item.isQuoteInitial);
        } else {
            alert("isQuoteInitial: " + item.isQuoteInitial)
            return undefined;
        }

        if(item.idPayMethod !== null && item.idPayMethod.length > 0) {
            temp.idPayMethod = item.idPayMethod + "";
            // if(!Number.isNaN(Number(item.idPayMethod))) {
            //     temp.idPayMethod = item.idPayMethod + "";
            // } else {
            //     alert("idPayMethod: " + item.idPayMethod)
            //     return undefined;
            // }
        } else {
            // temp.idPayMethod = "";
        }
        
        if(item.payDate.trim().length === 0 ){
            // temp.payDate = "1900-01-01";
        } else if(Validation.convertDateToStringEx(item.payDate.trim()).length > 0) {
            temp.payDate = item.payDate ;
        } else {
            alert("Pay Date: " + item.payDate)
            return undefined;
        }

        if(item.pts.length === 0 ){
            temp.pts = 0;
        } else if(!Number.isNaN(Number(item.pts))) {
            temp.pts = Number(item.pts) ;
        } else {
            alert("Puntos: " + item.pts)
            return undefined;
        }

        if(item.nroOperacion === null) {
            temp.nroOperacion = "";
        } else {
            temp.nroOperacion = item.nroOperacion;
        }

        temp.ticketImage = item.ticketImage;
        temp.cuentaEmpresaNroOperacion = item.cuentaEmpresaNroOperacion;
        temp.obs = item.obs;
        return temp;
       
    }
    save = async(e) => {
        // console.log(this.state.registers)

        let temp =  this.state.registers;
        let registers = [];
        for(let i=0; i < temp.length ; i ++) {
            let register = this.validateItem(temp[i]);
            if(register === undefined){
                return;
            }
    
            registers.push(register);
        }

        let data = {
            IdUser: this.state.iduser,
            PayScheduleJSONs: registers
        }
        // Verify if  suscripction is changed
        if(this.state.lastSuscription.package.id === this.state.selectSuscription.package.id) {
            data.FlagUpdatePackage = 0;
            data.Package = this.state.lastSuscription.package
        } else { 
            data.FlagUpdatePackage = 1;
            data.Package = this.state.selectSuscription.package
        }
       
        let response = await UserService.modifySchedule(this.state.iduser, data);

        if(response !== undefined ){
            if(response.status === 1) {
               alert("Los datos han sido modificados correctamente.")
            } else {
                alert("Ocurrio un error." + response.description)
               
            }
        }
    }
    deleteItem = (e, idx) => {
        let registers = this.state.registers
        registers.splice(idx, 1)
        this.setState({ registers: this.state.registers = registers})
    }

    addRegister = (e) => {
        e.preventDefault()

        let list = this.state.registers;

        let register = Object.assign({}, list[list.length - 1]);
        register.idMembershipDetail = 0;
        register.quoteDescription = "";
        register.nextExpiration = "";
        register.capitalBalance = 0;
        register.percent = 0;
        register.interested = 0;
        register.ticketImage = "";
        register.verif = 0;
        register.nroOperacion = "";
        register.obs = "";
        register.isQuoteInitial = 0;
        register.idPayMethod = "0";
        register.payDate = "";
        register.pts = "0"

        list.push(register);
        this.setState({
            registers: this.state.registers = list
        });
    }

    addRegisterUp = (e, idx) => {
        
        e.preventDefault()
  
        let register =  Object.assign({}, this.state.registers[idx]);
        let list = this.state.registers;

        let tempUp = list.slice(0, idx);
        let tempAbove = list.slice(idx);
        

        register.idMembershipDetail = 0;
        register.quoteDescription = "";
        register.nextExpiration = "";
        // register.dollarExchange = 0;
        // register.quoteUsd = 0;
        // register.quote = 0;
        // register.amortization = 0;
        register.capitalBalance = 0;
        register.percent = 0;
        register.interested = 0;
        register.ticketImage = "";
        register.verif = 0;
        register.nroOperacion = "";
        register.obs = "";
        register.isQuoteInitial = 0;
        register.idPayMethod = "0";
        register.payDate = "";
        register.pts = "0"
        
        let all = tempUp;
        all.push(register);
        all = all.concat(tempAbove)
        
        this.setState({
            registers: this.state.registers = all
        });

    }

    loadCSV = (data, fileInfo) => {
        // console.log(data)

        let registers = [];

        for (let i = 1; i < data.length;  i++) {
            let array = data[i]; // each list have 24 register convert to obje
            let register = {};
            if(array.length  === 24){
                register.id = array[0];
                register.idSuscription = array[1];
                register.idPackage = array[2];
                register.package = array[3];
                register.idFamilia = array[4];
                register.familyPackage = array[5];
                register.idMembershipDetail = array[6];
                register.quoteDescription = array[7];
                register.nextExpiration = array[8];
                register.dollarExchange = array[9];
                register.quoteUsd = array[10];
                register.quote = array[11];
                register.amortization = array[12];
                register.capitalBalance = array[13];
                register.percent = array[14];
                register.interested = array[15];
                register.ticketImage = array[16];
                register.verif = array[17];
                register.nroOperacion = array[18];
                register.obs = array[19];
                register.isQuoteInitial = array[20];
                register.idPayMethod = array[21];
                register.payDate = array[22];
                register.pts = array[23];

                registers.push(register);
            }
        }

        this.setState({
            registers: this.state.registers = registers
        });
    }

    // Event header
    onExchange = () => {
        // //console.log(e.target.value);
        let registers = this.state.registers;
        // get firsrt exchange
        let exchange = Number(registers[0].dollarExchange);
        if(!Number.isNaN(exchange)) {
            for(let i = 0; i < registers.length; i ++)
            {   
                registers[i].dollarExchange = exchange;
             
                let dollar =  Number(registers[i].quoteUsd);
                dollar = (!Number.isNaN(dollar))? dollar:0;

                let total = (exchange > 0)? dollar*exchange:0;
                total = Math.round((total + Number.EPSILON) * 100) / 100

                registers[i].quote = total;
                registers[i].amortization = total;

                
            }

            this.setState({
                registers: this.state.registers = registers
            });
        }
        
    }

    onQuote = () => {
        // //console.log(e.target.value);
        let registers = this.state.registers;
        // get firsrt exchange
        let quoteUsd = Number(registers[0].quoteUsd);
        if(!Number.isNaN(quoteUsd)) {
            for(let i = 0; i < registers.length; i ++)
            {   
                registers[i].quoteUsd = quoteUsd;
             
                let exchange =  Number(registers[i].dollarExchange);
                exchange = (!Number.isNaN(exchange))? exchange:0;

                let total = quoteUsd*exchange;
                total = Math.round((total + Number.EPSILON) * 100) / 100

                registers[i].quote = total;
                registers[i].amortization = total;

                
            }

            this.setState({
                registers: this.state.registers = registers
            });
        }
        
    }

    calculate = () => {

        let registers = this.state.registers;
        let totalQuote = 0;
        registers.forEach(a =>  totalQuote += (a.checkCalculate)? a.quote : 0);
        // console.log(totalQuote);
        totalQuote = Math.round((totalQuote + Number.EPSILON) * 100)/100;

        let acumulate = 0;
        for(let i = 0; i < registers.length; i ++)
        {   
            if(registers[i].checkCalculate){
                registers[i].capitalBalance = Math.round((totalQuote - acumulate + Number.EPSILON) * 100)/100;
                acumulate += registers[i].quote;
                acumulate = Math.round((acumulate + Number.EPSILON) * 100)/100;

                let percent = acumulate/totalQuote;
                percent = Math.round((percent + Number.EPSILON) * 100)/100;

                registers[i].percent = percent;
            
            
            }
            
            
        }
        this.setState({
            registers: this.state.registers = registers,
            total : this.state.total = totalQuote
        });
    }

    // Handle cascade
    handleCascade = (e, field) => {
        this.setState({
            [field]: this.state[field] = !this.state[field]
        });
    }

    handleCascadeExchange = (e, field) => {
        this.setState({
            [field]: this.state[field] = !this.state[field]
        });
    }

    handleCascadeExpiration = (e, field) => {
        this.setState({
            [field]: this.state[field] = !this.state[field]
        });
    }

    handleCascadeQuoteUsd = (e, field) => {
        this.setState({
            [field]: this.state[field] = !this.state[field]
        });
    }

    /**
     * Handle all checks
     * @param {*} e 
     * @param {*} field 
     */
    handleCheck = (e, field) => {
        let flag = !this.state[field];
        this.setState({
            [field]: this.state[field] = flag
        });

        let registers = this.state.registers;

        for(let i = 0; i < registers.length ; i++){

            registers[i].checkCalculate = flag;
        }
        this.setState({
            registers: this.state.registers = registers
        });

    }

    /**
     * Handle only check using idx
     * @param {*} e 
     * @param {*} field 
     * @param {*} idx 
     */
    handleCheckItem = (e, field, idx) => {
        // only change the register
            // change  value
            let register =  Object.assign({}, this.state.registers[idx]);
            register[field] = !register[field];

            let registers = this.state.registers;
            registers[idx] = register;
            
            this.setState({
                registers: this.state.registers = registers
            });
    }

    handleSelect = (e) => {
        let id = Number(e.target.value);

        let result = this.state.listSuscription.filter(obj => {
            return obj.id === id
        })

        let obj = Object.assign({}, this.state.selectSuscription);
        obj.package = result[0];
       
        if(result.length === 1) {
            this.setState({
                selectSuscription: this.state.selectSuscription = obj
            });
        }
    }
    render() {
        
        const { loading, registers, noData, noDataMessage, total,editCascade, editCasExchange, editCasQuoteUsd, editCasNextExp,
            calculateCheck,
            loadingModal, noDataModal, showModal, noDataMes, registerModal,
            lastSuscription, listSuscription , selectSuscription} =  this.state;
        
            return(
            <div  className="home-container">
                {/* <Row style={{paddingBottom: 20}}>
                    <Col sm={12}>
                        <CSVReader onFileLoaded={(data, fileInfo) => this.loadCSV(data, fileInfo)} />
    
                    </Col>
                </Row> */}
                <Row>
                    <Col sm={4}>
                        {lastSuscription === undefined && 
                            <Form.Text style={{marginTop: ".5em"}}><b>Suscripción actual:</b>  #</Form.Text>
                        }
                        {lastSuscription !== undefined && 
                            <Form.Text  style={{marginTop: ".5em", fontSize: 12}}><b>Suscripción actual: </b>{lastSuscription.package.name}</Form.Text>
                        }
                    </Col>
                    <Col sm={4}>
                        <Form inline>
                        <Form.Label className="mr-2">Migrar a: </Form.Label>
                        <Form.Control as="select" defaultValue={'DEFAULT'}
                                    style={{fontSize: 12, paddingLeft: 2}}
                                    onChange={e => this.handleSelect(e)}>
                                    <option value="DEFAULT" disabled>Seleccione una opción</option>
                                    {listSuscription.map((elem) =>     (
                                        <option key={elem.id} value={elem.id}>{elem.name}</option>
                                    ))}
                        </Form.Control>
                        </Form>
                        
                    </Col>
                </Row>
                {selectSuscription !== undefined && 
                    <Row>
                        <Col sm={4}>
                            <Form.Label>Total (USD): {selectSuscription.package.price} </Form.Label>
                        </Col>
                    </Row>
                }
                
                <Row style={{textAlign: 'right'}}>
                    <Col sm={12}>
                    <Button size="sm" variant="dark" onClick={(e) => {this.addRegister(e)}}>+</Button>
                    </Col>
                </Row>
               
                <Row>
                    <Col sm={12}>
                        <Table className="table-schedule" style={{ display: 'block', overflowX: 'auto'}}>
                    <thead className="table-headsch">
                        <tr>
                            <th></th>
                            <th > </th>
                            <th>
                                <Form.Check type='checkbox' onChange={e => this.handleCascade(e, "editCascade")}
                                        checked={editCascade}
                                        label="Editar en cascada">
                                </Form.Check> 
                            </th>
                            <th>
                                <Form.Check type='checkbox' onChange={e => this.handleCascadeExpiration(e, "editCasNextExp")}
                                        checked={editCasNextExp}
                                        label="Editar en cascada">
                                </Form.Check> 
                            </th>
                            <th>
                                <Form.Check type='checkbox' onChange={e => this.handleCascadeExchange(e, "editCasExchange")}
                                        checked={editCasExchange}
                                        label="Editar en cascada">
                                </Form.Check> 
                            </th>
                            <th>
                                <Form.Check type='checkbox' onChange={e => this.handleCascadeQuoteUsd(e, "editCasQuoteUsd")}
                                        checked={editCasQuoteUsd}
                                        label="Editar en cascada">
                                </Form.Check> 
                            </th>
                            <th></th>
                            <th></th>
                            <th  colSpan={3}>
                                <Button size="sm" variant="secondary" onClick={e => this.calculate()}>Calcular</Button>
                            </th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th> </th>
                            <th> </th>
                            <th></th>
                            <th> </th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Descripcion</th>
                            <th >IdMeship Detail</th>
                            <th>Quote Description </th>
                            {/* <th>InitialDate</th>
                            <th>ActivateForm</th>
                            <th>ActiveUntil</th> */}
                            <th>Next Expiration</th>
                            <th>Dollar Exchange</th>
                            <th>Quote Usd</th>
                            <th>Quote</th>
                            <th>Amortization</th>
                            <th style={{background:"#beceab"}}>
                                <Form.Check type='checkbox' onChange={e => this.handleCheck(e, "calculateCheck")}
                                        checked={calculateCheck}
                                        label="">
                                </Form.Check>
                            </th>
                            <th style={{background:"#beceab"}}>Capital Balance</th>
                            <th style={{background:"#beceab"}}>Percent</th>
                            <th>Interested</th>
                            <th>TicketImage</th>
                            <th>Verif</th>
                            <th>nroOperacion socio</th>
                            <th>nroOperacion cuenta empresa</th>
                            <th>obs</th>
                            <th>isQuote Initial</th>
                            <th>idPay Method</th>
                            <th>pay Date</th>
                            <th>Pts.</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody >
                        {!loading && !noData && 
                            registers.map((item, idx) => {
                                return(
                                <tr key={idx}>
                                    <td>
                                        <Form.Label>{item.familyPackage} / {item.package}</Form.Label>
                                    </td>
                                    <td><Form.Control   style={{fontSize:10, width:'55px'}}
                                        value={item.idMembershipDetail}
                                        onChange={e => this.handleItemId(e, 'idMembershipDetail', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'130px'}}
                                        value={item.quoteDescription}
                                        onChange={e => this.handleItem(e, 'quoteDescription', idx)}
                                        onBlur={e => this.onBlurDes(e, 'quoteDescription', idx)}
                                    ></Form.Control></td>
                                   
                                    <td><Form.Control  style={{fontSize:10, width:'125px'}}
                                        value={item.nextExpiration}
                                        onChange={e => this.handleItem(e, 'nextExpiration', idx)}
                                        onBlur={e => this.handleItemNext(e, 'nextExpiration', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'70px'}}
                                        value={item.dollarExchange}
                                        onChange={e => this.handleItemExchange(e, 'dollarExchange', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'70px'}}
                                        value={item.quoteUsd}
                                        onChange={e => this.handleItemQuoteUsd(e, 'quoteUsd', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'70px'}}
                                        value={item.quote}
                                        // onChange={e => this.handleItem(e, 'quote', idx)}
                                    ></Form.Control></td>
                                   
                                    <td><Form.Control  style={{fontSize:10, width:'70px'}}
                                        value={item.amortization}
                                        onChange={e => this.handleItem(e, 'amortization', idx)}
                                    ></Form.Control></td>
                                     <td>
                                        <Form.Check type='checkbox' onChange={e => this.handleCheckItem(e, "checkCalculate", idx)}
                                                checked={item.checkCalculate}
                                                label="">
                                        </Form.Check>
                                    </td>
                                    <td><Form.Control  style={{fontSize:10, width:'70px'}}
                                        value={item.capitalBalance}
                                        onChange={e => this.handleItem(e, 'capitalBalance', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'70px'}}
                                        value={item.percent}
                                        onChange={e => this.handleItem(e, 'percent', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'70px'}}
                                        value={item.interested}
                                        onChange={e => this.handleItem(e, 'interested', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'130px'}}
                                        value={item.ticketImage}
                                        onChange={e => this.handleItem(e, 'ticketImage', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'55px'}}
                                        value={item.verif}
                                        onChange={e => this.handleItem(e, 'verif', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'125px'}}
                                        value={item.nroOperacion}
                                        onChange={e => this.handleItem(e, 'nroOperacion', idx)}
                                    ></Form.Control></td>

                                    <td><Form.Control  style={{fontSize:10, width:'125px'}}
                                        value={item.cuentaEmpresaNroOperacion}
                                        onChange={e => this.handleItem(e, 'cuentaEmpresaNroOperacion', idx)}
                                    ></Form.Control></td>
                                   
                                    <td><Form.Control  style={{fontSize:10, width:'130px'}}
                                        value={item.obs}
                                        onChange={e => this.handleItem(e, 'obs', idx)}
                                    ></Form.Control></td>
                                    <td><Form.Control  style={{fontSize:10, width:'55px'}}
                                        value={item.isQuoteInitial}
                                        onChange={e => this.handleItem(e, 'isQuoteInitial', idx)}
                                    ></Form.Control></td>

                                    <td><Form.Control  style={{fontSize:10, width:'55px'}}
                                        value={item.idPayMethod}
                                        onChange={e => this.handleItem(e, 'idPayMethod', idx)}
                                    ></Form.Control></td>

                                    <td><Form.Control  style={{fontSize:10, width:'150px'}}
                                        value={item.payDate}
                                        onChange={e => this.handleItem(e, 'payDate', idx)}
                                    ></Form.Control></td>

                                    <td><Form.Control  style={{fontSize:10, width:'60px'}}
                                        value={item.pts}
                                        onChange={e => this.handleItem(e, 'pts', idx)}
                                    ></Form.Control></td>

                                    <td style={{fontSize: 15}}
                                                    onClick={e => this.deleteItem(e, idx)}>
                                                    <RiDeleteBinLine ></RiDeleteBinLine></td>

                                    <td>
                                        <Button onClick={e => this.addRegisterUp(e, idx)}><BsArrowBarUp></BsArrowBarUp></Button>
                                    </td>
                                    
                                </tr>
                                )
                            })
                        }
                    </tbody>
                    {loading && 
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <Spinner animation="border" variant="dark"></Spinner>
                                    <p>Cargando registros...</p>
                                </div>
                            </Col>
                        </Row>
                    }
                    {!loading && noData && 
                        <Row>
                            <Col sm={12}>
                                <Form.Label>{noDataMessage}</Form.Label>
                            </Col>
                        </Row>
                    }
                </Table>
                </Col>
                </Row>
                <Row>
                    <Col sm={12} style={{textAlign: 'right'}}>
                        <Button onClick={e => this.save(e)}>Guardar</Button>
                    </Col>
                </Row>
                {/* <Row className="row justify-content-between">
                    <Col ms={4}>
                            <Button variant="secondary"
                                >Descargar</Button>
                        </Col>
                        <Col style={{textAlign: 'right'}}>
                        <Button onClick={e => this.save(e)}>Guardar</Button>
                        </Col>
                </Row> */}
                {/* Modal */}
                <Modal 
                    show={showModal} 
                    onHide={this.handleClose}
                    size="lg"
                    style={{fontSize:12}}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        {loadingModal && 
                            <Row>
                                <Col sm={12}>
                                    <div>
                                        <Spinner animation="border" variant="dark"></Spinner>
                                        <p>Cargando registros...</p>
                                    </div>
                            </Col>
                            </Row>
                        }
                        {!loadingModal && noDataModal && 
                            <Row>
                                <Col sm={12}>
                                    <Form.Label>{noDataMes}</Form.Label>
                                </Col>
                            </Row>
                        }
                        {!loadingModal && !noDataModal &&
                            <Table responsive>
                                <thead className="table-head">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Tipo de Comisión</th>
                                        <th>Nivel</th>
                                        <th>Fecha</th>
                                        <th>Puntos</th>
                                        <th>Porcentage</th>
                                        <th>Monto</th>
                                        <th>Por Estado</th>
                                        <th>Por Nivel</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registerModal.map((item , idx) => {
                                        return(
                                            <tr key={idx}>
                                                <td>{item.name}</td>
                                                <td>{item.typeComission}</td>
                                                <td>{item.Level}</td>
                                                <td>{item.date}</td>
                                                <td>{item.points}</td>
                                                <td>{item.percent}</td>
                                                <td>$ {item.mount}</td>
                                                <td>{item.perState}</td>
                                                <td>{item.PerLevel}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        }
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={this.handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}