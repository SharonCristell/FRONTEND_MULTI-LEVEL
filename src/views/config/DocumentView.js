import React from 'react';
import { Form, Table, Button, Modal, Row, Col, Spinner } from 'react-bootstrap';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import UtilService from '../../services/utils.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTable from "react-table";
import Validation from '../../components/utils/Validation';

import logoKeOla from '../../images/KeOlaPdf.jpg';
import logoInClub from '../../images/InClubPdf.png';
import logoIntech from '../../images/InTechPdf.png';
import ribera_low from '../../images/logos_low/ribera_low.png';
import ribera_high from '../../images/logos_low/ribera_high.png';
import inresorts_low from '../../images/logos_low/inresorts_low.png';
import packages from '../../images/logos_low/package_low.png';
import RCI from '../../images/logos_low/RCI.png';


import jsPDF from "jspdf";
import "jspdf-autotable";

export default class DocumentView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            discountPlan: [
                { benefits: "Articulos en la tienda Keola", free: "0%", classic: "10%", gold: "10%", platinum: "15%", elite: "20%", premium: "30%", infinite: "40%" },
            ],

            personalAccount: [
                { benefits: "DURACION", free: "30", classic: "30", gold: "30", platinum: "30", elite: "30", premium: "30", infinite: "30" },
                { benefits: "RENOVACION AUTOMATICA con HISTORIAL", free: "-", classic: "SI", gold: "SI", platinum: "SI", elite: "SI", premium: "SI", infinite: "SI" },
                { benefits: "UBICACION LISTADOS", free: "INFERIOR 2°", classic: "INFERIOR 1°", gold: "MEDIA 3°", platinum: "  MEDIA      2°", elite: "MEDIA   1°", premium: "SUPERIOR 2°", infinite: "SUPERIOR 1°" },
                { benefits: "ROTACION DE IMÁGENES", free: "-", classic: "-", gold: "-", platinum: "SI", elite: "SI%", premium: "SI", infinite: "SI" },
                { benefits: "DESTAQUE EN LISTADO", free: "-", classic: "-", gold: "-", platinum: "SI", elite: "SI", premium: "SI", infinite: "SI" },
                { benefits: "LIBRE DE PUBLICIDAD", free: "-", classic: "-", gold: "SI", platinum: "SI", elite: "SI", premium: "SI", infinite: "SI" },
                { benefits: "CARGO DE VENTA", free: "GRATIS", classic: "GRATIS", gold: "GRATIS", platinum: "GRATIS", elite: "GRATIS", premium: "GRATIS", infinite: "GRATIS" },
                { benefits: "CANTIDAD DE ANUNCIOS Y/O ARTICULOS EN PARALELO", free: "1", classic: "5", gold: "10", platinum: "15", elite: "20", premium: "25", infinite: "30" },
            ],

            businessAccount: [
                { benefits: "CANTIDAD TIENDAS", free: "1", classic: "1", gold: "2", platinum: "3", elite: "4", premium: "5", infinite: "6" },
                { benefits: "UBICACION LISTADOS", free: "INFERIOR 2°", classic: "INFERIOR 1°", gold: "MEDIA 3°", platinum: "  MEDIA      2°", elite: "  MEDIA   1°", premium: "SUPERIOR 2°", infinite: "SUPERIOR 1°" },
                { benefits: "REPOSTERÍA", free: "-", classic: "SI", gold: "SI", platinum: "SI", elite: "SI", premium: "SI", infinite: "SI" },
                { benefits: "INTEGRACIÓN TIENDA ONLINE PROPIA BÁSICA", free: "-", classic: "-", gold: "-", platinum: "-", elite: "SI", premium: "SI", infinite: "-" },
                { benefits: "INTEGRACIÓN TIENDA ONLINE PROPIA BÁSICA", free: "-", classic: "-", gold: "-", platinum: "-", elite: "-", premium: "-", infinite: "SI" },
                { benefits: "LIBRE DE PUBLICIDAD", free: "-", classic: "SI", gold: "SI", platinum: "SI", elite: "SI", premium: "SI", infinite: "SI" },
                { benefits: "CANTIDAD DE PRODUCTOS CATALOGO", free: "25", classic: "50", gold: "100", platinum: "ILIMITADO", elite: "ILIMITADO", premium: "ILIMITADO", infinite: "ILIMITADO" },
                { benefits: "CARGO DE VENTA", free: "GRATIS", classic: "GRATIS", gold: "GRATIS", platinum: "GRATIS", elite: "GRATIS", premium: "GRATIS", infinite: "GRATIS" },
            ],

            affiliation: [
                { membershipType: "TIPO DE MEMBRESIA", type1: "1 Membresia", type2: "2 Membresias", type3: "3 Membresias" },
                { membershipType: "CLASSIC", type1: "MINI", type2: "MINI", type3: "MINI" },
                { membershipType: "GOLD", type1: "MINI", type2: "EXPERIENCE", type3: "EXPERIENCE+MINI" },
                { membershipType: "PLATINUM", type1: "EXPERIENCE", type2: "LIGHT", type3: "STANDARD" },
                { membershipType: "ELITE", type1: "EXPERIENCE+MINI", type2: "STANDARD", type3: "-" },
                { membershipType: "PREMIUM", type1: "LIGHT", type2: "-", type3: "-" },
                { membershipType: "INFINITE", type1: "STANDARD", type2: "-", type3: "-" },
            ],
            regaliaDirecta: [
                { comision: "% Comisión", point1: "585", point2: "270", point3: "175", point4: "85" },
                { comision: "20%", point1: "386.1", point2: "178.1", point3: "115.5", point4: "56.1" },
            ],
            regaliaRapido: [
                { comision: "% Comisión", point1: "585", point2: "270", point3: "175", point4: "85" },
                { comision: "10%", point1: "193.0", point2: "89.1", point3: "57.7", point4: "28.0" },
            ],
            regaliaEquipo: [
                { comision: "% Comisión", nivel: "Nivel", point1: "585", point2: "270", point3: "175", point4: "85" },
                { comision: "10%", nivel: "2°", point1: "193.0", point2: "89.1", point3: "57.7", point4: "28.0" },
                { comision: "5%", nivel: "3°", point1: "96.5", point2: "44.5", point3: "28.8", point4: "14.0" },
                { comision: "4%", nivel: "4°", point1: "77.2", point2: "35.6", point3: "23.1", point4: "11.2" },
                { comision: "3%", nivel: "5°", point1: "57.9", point2: "26.7", point3: "17.3", point4: "8.4" },
                { comision: "2%", nivel: "6°", point1: "38.6", point2: "17.8", point3: "11.5 ", point4: "5.6" },
                { comision: "1%", nivel: "7°", point1: "19.3", point2: "8.9", point3: "5.7", point4: "2.8" },
            ],
            regaliaResidual: [
                { nivel: "1°", comision: "10.50", totalActive: "4", strongBranch: "1", strong2Branch: "1", weakBranch: "1", weak2Branch: "1" },
                { nivel: "2°", comision: "10.25", totalActive: "1", strongBranch: "4", strong2Branch: "4", weakBranch: "2", weak2Branch: "2" },
                { nivel: "  ", comision: "10.25", totalActive: "2", strongBranch: " ", strong2Branch: " ", weakBranch: "", weak2Branch: " " },
                { nivel: "3°", comision: "10.00", totalActive: "3", strongBranch: "1", strong2Branch: "1", weakBranch: "5", weak2Branch: "5" },
                { nivel: "  ", comision: " ", totalActive: "0", strongBranch: "0", strong2Branch: "0", weakBranch: " ", weak2Branch: " " },
                { nivel: "  ", comision: " ", totalActive: "7", strongBranch: "2", strong2Branch: "2", weakBranch: "1", weak2Branch: "1" },
                { nivel: "4°", comision: "9.75", totalActive: "7", strongBranch: "2", strong2Branch: "2", weakBranch: "1", weak2Branch: "1" },
                { nivel: "  ", comision: " ", totalActive: "2", strongBranch: "4", strong2Branch: "4", weakBranch: "2", weak2Branch: "2" },
                { nivel: "5°", comision: "9.50", totalActive: "1", strongBranch: "6", strong2Branch: "6", weakBranch: "3", weak2Branch: "3" },
                { nivel: "  ", comision: " ", totalActive: "8", strongBranch: "0", strong2Branch: "0", weakBranch: "0", weak2Branch: "0" },
                { nivel: "  ", comision: " ", totalActive: "0", strongBranch: "0", strong2Branch: " ", weakBranch: " ", weak2Branch: " " },
                { nivel: "6°", comision: "9.25", totalActive: "4", strongBranch: "1", strong2Branch: "1", weakBranch: "7", weak2Branch: "7" },
                { nivel: "  ", comision: " ", totalActive: "3", strongBranch: "4", strong2Branch: "4", weakBranch: "2", weak2Branch: "2" },
                { nivel: "  ", comision: " ", totalActive: "2", strongBranch: "4", strong2Branch: "4", weakBranch: " ", weak2Branch: " " },

            ],

            vacationalPeriod: [
                { id: "_____", unity: "_____", type: "_____", maxCapacity: "_____", numberType: "_____", use: "_____", yearinWeeks: "_____", property: "_____", season: "_____" },
                { id: "_____", unity: "_____", type: "_____", maxCapacity: "_____", numberType: "_____", use: "_____", yearinWeeks: "_____", property: "_____", season: "_____" },
                { id: "_____", unity: "_____", type: "_____", maxCapacity: "_____", numberType: "_____", use: "_____", yearinWeeks: "_____", property: "_____", season: "_____" }
            ],

            id: 0,
            user: {
                idNationality: "",
                name: "",
                lastname: "",
                birthdate: "",
                gender: "",
                nroDocument: "",
                districtAddress: "",
                address: "",
                username: "",
                civilState: "",
                email: "",
                phone: "",



            },
            userMod: {

            },
            loading: true,
            suscription: [],
            schedule: [],
            schedules: [],
            loadSuscription: false,
            message: false,
            showModal: false,
            idSuscription: 0,
            userPackage: "",
            packageQuote: "",
            creationDate: "",
            quotePrice: "",
            initialQuote: "",
            pricetotalLetter: "",
            price: "",
            familyPackage: [],
            idFamilyPackage: 0,
            idNextItem: "",
            obj:

            {
                id: 0,
                package: {
                    name: "Kit de Inicio",
                    idFamilyPackage: 50,
                    nameFamilyPackage: "INCLUB",
                    creationDate: "",

                }
            },
            count:0,
            nationalities: [],
            userNationality:"",
        }
        //this.getCountries = this.getCountries.bind(this);
        
    }
    componentDidMount() {
        this.getSuscription();


        let user = AuthService.getCurrentUserInfo();
        if (user !== undefined) {
            let userInfo = {
                idNationality: user.idNationality,
                name: user.name,
                lastname: user.lastname,
                birthdate: user.birthdate,
                gender: user.gender,
                nroDocument: user.nroDocument,
                districtAddress: user.districtAddress,
                address: user.address,
                username: user.username,
                civilState: user.civilState,
                email: user.email,
                phone: user.nroTelf,

            }
            
            this.setState({
                user: this.state.user = userInfo,
                id: this.state.id = user.id,
                loaded: true
            });
        } else {
            this.setState({
                user: this.state.user = {},
                id: this.state.id = 0,
                loaded: false
            });
        }
   

    }

    async getSuscription() {
        // //console.log("my pay");
        let suscriptions = await UserService.getSuscription();
        if (suscriptions !== undefined && suscriptions !== null) {
            if (suscriptions.status !== 1) {

                this.setState({
                    suscription: this.state.suscription = [],
                    loadSuscription: this.state.loadSuscription = true,
                    loading: this.state.loading = false,
                    

                });
                
            } else {

                this.setState({
                    suscription: this.state.suscription = suscriptions.objModel,
                    loadSuscription: this.state.loadSuscription = true,
                    loading: this.state.loading = false,
                    count:this.state.count = this.state.suscription.length,

                });
                this.getCountries();
            }
        }


    }
    async getCountries() {

        let response = await UtilService.getResidences();
        if (response !== null && response !== undefined) {

            let objs = response.objModel
          
            objs.forEach(elem => {

                if (elem.idCountry == this.state.user.idNationality) {
                    this.setState({
                        userNationality: this.state.userNationality = elem.name,
                       
        
                    });               
                }
                

            });
            console.log(this.state.userNationality);
            
        }

    }

    getResumen = (e, idSuscription) => {


        this.state.suscription.map((item, idx) => {
            // console.log(idSuscription)
            if (item.id === idSuscription) {
                // console.log(idSuscription)
                this.setState({
                    userPackage: this.userPackage = item.package.name,
                    packageQuote: this.packageQuote = item.package.quotes,
                    creationDate: this.packagecreationDate = Validation.convertDateToString(item.creationDate),
                    initialQuote: this.initialQuote = item.package.initialPrice,
                    quotePrice: this.quotePrice = item.package.quoteprice,
                    price: this.price = item.package.price,
                    pricetotalLetter: this.pricetotalLetter = item.package.pricetotalletter,
                    schedules: this.schedules = item.payScheduleJson,
                    idFamilyPackage: this.idFamilyPackage = item.package.idFamilyPackage,


                });
            }
        }


        );
        

        if (this.state.schedules !== undefined && this.state.schedules !== null) {

            this.setState({
                showModal: true,
            });

        } else {
            this.setState({
                showModal: false
            });
            alert("Tuvimos un error al obtener la información. Inténtelo más tarde.")
        }

    }




    handleClose = () => {
        this.setState({
            showModal: false
        });
    }
    handleShow = () => {
        this.setState({
            showModal: true
        });
    }

    getRegister = () => {

        let tags = "";

        if (this.state.count==this.state.suscription.length) {
            this.state.suscription.push(this.state.obj)
           }

        if (this.state.suscription.length > 0) {
                tags = this.state.suscription.map((item, idx) => (

                    <tr key={item.id}>

                        <td>{idx + 1}</td>
                        <td>{item.package.nameFamilyPackage}</td>
                        <td>{item.package.name} </td>
                        <td> {Validation.convertDateToString(new Date(item.creationDate))}</td>
                        <td>
                            <Button variant="info" size="sm" onClick={e => this.getResumen(e, item.id)}>Ver Documentos</Button>
                        </td>

                    </tr>

                ));

        };

        return tags;
    }


    jsPdfGenerator = () => {

        const unit = 'pt';
        const size = 'A4';
        const orientation = 'portrait';

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const img = new Image;

        doc.setFontSize(12);

        const title = "PLAN DE DESCUENTOS";
        const headers = [["BENEFICIOS", "GRATUITA $0", "CLASSIC $5", "GOLD $15", "PLATINIUM $30", "ELITE   $45", "PREMIUM $60", "INFINITE $90"]]

        const data = this.state.discountPlan.map(elt => [elt.benefits, elt.free, elt.classic, elt.gold, elt.platinum, elt.elite, elt.premium, elt.infinite]);

        let content = {
            startY: 450,
            head: headers,
            body: data,
            styles: { halign: 'center' },
        };

        const title2 = "CUENTA PUBLICITARIA PERSONAL";

        const data2 = this.state.personalAccount.map(elt => [elt.benefits, elt.free, elt.classic, elt.gold, elt.platinum, elt.elite, elt.premium, elt.infinite]);

        let content2 = {
            startY: 560,
            head: headers,
            body: data2,
            styles: { halign: 'center' }
        };

        const title3 = "CUENTA PUBLICITARIA NEGOCIOS";


        const data3 = this.state.businessAccount.map(elt => [elt.benefits, elt.free, elt.classic, elt.gold, elt.platinum, elt.elite, elt.premium, elt.infinite]);
        let content3 = {
            startY: 240,
            head: headers,
            body: data3,
            styles: { halign: 'center' }
        };

        const title4 = "Tabla de Afiliacion InResorts (Beneficio de duplicacion de Acciones Keola)";
        const headers4 = [["                    ", "", "KEOLA", ""]];

        const data4 = this.state.affiliation.map(elt => [elt.membershipType, elt.type1, elt.type2, elt.type3]);

        let content4 = {
            startY: 600,
            head: headers4,
            body: data4,
            styles: { halign: 'center' }
        };

        if (this.state.idFamilyPackage === 2) {
            doc.addImage(ribera_low, 210, 10, 140, 90);

        }
        else {
            doc.addImage(logoIntech, 20, 5, 120, 70);
            doc.addImage(logoKeOla, 200, 5, 120, 70);
            doc.addImage(logoInClub, 430, 5, 120, 70);


        };

        doc.setFontSize(16);
        doc.setFont("Arial");
        doc.text('                                    ACLARA:                ', 90, 120)
        doc.setFont('Arial');
        doc.setFontSize(15);
        doc.text('Que el contrato ' + this.state.user.username + ' a nombre del Sr.(a) ' + this.state.user.name + " " + this.state.user.lastname + " identificado", 40, 170)
        doc.text('con DNI ' + this.state.user.nroDocument + ' podrá hacer uso de los beneficios de su membresía ' + this.state.userPackage, 40, 185)
        doc.text('una vez cancelado el valor de la cuota inicial, según sus especificaciones de su contrato.', 40, 200)


        doc.setFont('Arial');
        doc.setFontSize(13);
        if (this.state.idFamilyPackage === 2) {
            doc.text('Lo cual activa sus beneficios de la siguiente manera:', 40, 230)

            doc.text('        * Club Resort                        OK al 100%', 40, 260)
            doc.text('        * Ribera del Río Travel            OK al 100%', 40, 275)
            doc.text('        * RCI                                     Vigente a Partir del Pago de la sexta Cuota', 40, 290)
            doc.text('        * Duplicar acciones como socio fundador', 40, 305)
            doc.text('                                               ----------------------------------         ', 70, 370)
            doc.addImage(ribera_low, 265, 371, 70, 45);
            doc.setFontSize(8);
            doc.text('                                                                      RUC: 20601460271                    ', 130, 430)
            doc.setFontSize(10);
            doc.text('CORREOS:     servicioalcliente@cieneguillariberadelrio.com', 170, 460);
            doc.text('pagos@cieneguillariberadelrio.com', 250, 480);
            doc.text('reservas@cieneguillariberadelrio.com', 250, 500);
        }
        else {
            doc.text('Activa sus beneficios según los plazos indicados en contrato de la siguiente manera:', 40, 230)
            doc.text('        - Plan Descuentos: 10% hasta 40% en la Tienda Keola ', 40, 245)
            doc.text('        - Plan Publicitario: Personal y Negocios ' + this.state.userPackage, 40, 260)
            doc.text('        - En caso de hacerse socio de un Desarrollo Hotelero de inResorts, durante el', 40, 275)
            doc.text('          primer año, se DUPLICARIAN las acciones adquiridas de Keola según la Tabla', 40, 290)
            doc.text('          de afiliación a inResorts adjunta en este documento.', 40, 305)



        };
        if (this.state.idFamilyPackage === 1) {


            doc.setFont('Arial');
            doc.setFontSize(13);
            doc.text(title, marginLeft, 440);
            doc.setFontSize(10);
            doc.autoTable(content);

            doc.setFont('Arial');
            doc.setFontSize(10);
            doc.text('* Duracion de uso de paquete anual', 40, 530)


            doc.setFontSize(13);
            doc.text(title2, marginLeft, 550);
            doc.setFontSize(10);
            doc.autoTable(content2);
            doc.setFont('Arial');
            doc.setFontSize(10);

            doc.text('* Duracion de uso de paquete mensual', 40, 150)

            doc.setFont('Arial');
            doc.setFontSize(9);
            doc.text('Si vendes productos usados, podras publicar en gratuito hasta alcanzar las 20 ventas en el ultimo año.', 60, 170)
            doc.text('Si vendes productos nuevos, podras publicar en gratuito hasta alcanzar las 5 ventas en el ultimo año.', 60, 180)
            doc.text('Si republicas una publicacion gratuita ,no acumulara las visitas ni la venta del anterior.', 60, 190)
            doc.text('Si eres KeolaTop o usuario profesional de KEOLAPago solo podras publicar en Classic,Gold o Platinium.', 60, 200)

            doc.setFont('Arial');
            doc.setFontSize(13);
            doc.text(title3, marginLeft, 230);
            doc.autoTable(content3);

            doc.setFont('Arial');
            doc.setFontSize(10);
            doc.text('* Duracion de uso de paquete 1 mes', 40, 570)

            doc.setFont('Arial');
            doc.setFontSize(13);
            doc.text(title4, marginLeft, 590);

            doc.autoTable(content4);
            doc.setFontSize(10);
            doc.text('* Para darse la duplicación de acciones de KeOla, la nueva membresía de inresorts debe haberse completado el pago al 100%', 40, 780);
            doc.setFont('Arial');


            doc.autoTable(content4);

            doc.setFontSize(10);
            doc.text('CORREOS: servicioalcliente@keola.club o pagos@keola.club', 170, 800);
            doc.text('pagos@keola.club', 250, 820);
            doc.setFont('Arial');

        }


        doc.save("CER" + this.state.user.username + ".pdf")
    }

    jsPdfGenerator2 = () => {

        const unit = 'pt';
        const size = 'A4';
        const orientation = 'portrait';

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const img = new Image;


        if (this.state.idFamilyPackage === 2) {

            doc.addImage(ribera_low, 20, 5, 120, 70);
            doc.setFontSize(12);
            doc.setFont('Arial', "bold");
            doc.text('CONTRATO DE PRESTACION DE SERVICIOS', 160, 110)
            doc.setFont('Arial', "normal");
            doc.setFontSize(11);

            doc.text('Valle Encantado S.A.C. identificada con RUC 20601460271, domiciliada en Mz. <<B>> Lote 72, tercera', 30, 140)
            doc.text('Etapa Cieneguilla, Provincia de Lima y Departamento de Lima, a quien en adelante se le denominará el PRESTADOR;', 30, 150)
            doc.text('y de la otra parte.', 30, 160)

        }
        else {
            doc.addImage(logoIntech, 20, 5, 120, 70);
            doc.addImage(logoKeOla, 200, 5, 120, 70);
            doc.addImage(logoInClub, 430, 5, 120, 70);
            doc.setFontSize(12);
            doc.setFont('Arial', "bold");
            doc.text('CONTRATO DE PRESTACION DE SERVICIOS CON OPCION A PARTICIPACION', 60, 80)
            doc.setFont('Arial', "normal");
            doc.setFontSize(11);
            doc.text('Conste por el presente documento que se extiende por duplicado, el CONTRATO DE PRESTACION DE SERVICIOS', 30, 110)
            doc.text('CON OPCION A PARTICIPACIÓN que celebran:', 30, 120)
            doc.text('De una parte, Valle Encantado S.A.C. identificada con RUC 20601460271, domiciliada en Mz. <<B>> Lote 72, tercera', 30, 140)
            doc.text('Etapa Cieneguilla, Provincia de Lima y Departamento de Lima, a quien en adelante se le denominará el PRESTADOR;', 30, 150)
            doc.text('y de la otra parte.', 30, 160)


        };




        doc.text('Nombres y Apellidos :     ', 30, 180)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.name, 170, 180)
        doc.text(this.state.user.lastname, 300, 180)
        doc.setFont('Arial', "normal")
        doc.text('DNI:  ', 30, 200)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.nroDocument, 100, 200)
        doc.setFont('Arial', "normal")
        doc.text('Estado Civil: ', 300, 200)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.civilState, 400, 200)
        doc.setFont('Arial', "normal")

        doc.text('Domicilio: ', 30, 220)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.address, 100, 220)
        doc.setFont('Arial', "normal")
        doc.text('Distrito: ', 30, 240)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.districtAddress, 100, 240)
        doc.setFont('Arial', "normal")

        doc.text('A quien en adelante se le denominará  <<EL AFILIADO>>	.', 30, 260)
        doc.text('Co-Afiliado ', 30, 280)
        doc.text('Nombres y Apellidos: ', 30, 290)
        doc.text('DNI: ', 30, 300)
        doc.text('El presente contrato de prestación de servicios, se celebra bajo los siguientes términos y condiciones:', 30, 325)



        doc.setFont('Arial', 'bold');
        doc.setFontSize(10);
        doc.text('PRIMERO: OBJETO.       ', 30, 350)
        doc.text('____________________', 30, 351)

        if (this.state.idFamilyPackage === 2) {
            doc.setFont('Arial', 'normal');
            doc.text('En virtud del presente contrato, EL PRESTADOR suministra a EL AFILIADO, los SERVICIOS de Ribera del Río Club', 30, 370)
            doc.text('Resort, con sujeción al <<Plan de Beneficios>> y al <<Reglamento General de Servicios>> , adicionalmente abre la', 30, 380)
            doc.text('posibilidad de Participación accionarial de Ribera del Rio Club Resort, en la medida del cumplimiento de las', 30, 390)
            doc.text('condiciones establecidas en la Cláusula Setimo:Acciones de acuerdo al tipo de membresía seleccionada', 30, 400)

            doc.text('Membresía:', 30, 440)

            doc.text('Experience', 85, 440)
            if (this.state.userPackage == "Experience") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(140, 430, 15, 15, "FD");

            doc.text('Light', 170, 440)
            if (this.state.userPackage == "Light") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(200, 430, 15, 15, "FD");

            doc.text('Standard', 230, 440)
            if (this.state.userPackage == "Standard") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(290, 430, 15, 15, "FD");

            doc.text('Mini', 320, 440)
            if (this.state.userPackage == "Mini") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(350, 430, 15, 15, "FD");

            doc.text('Vitalicia', 380, 440)
            if (this.state.userPackage == "Vitalicia") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(430, 430, 15, 15, "FD");

            doc.text('Premium', 460, 440)
            if (this.state.userPackage == "Premium") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(510, 430, 15, 15, "FD");

            doc.setFont('Arial', 'normal');
            doc.text('El presente contrato tendrá una duración DE 2 AÑOS, iniciando el', 30, 480)
            doc.setFont('Arial', 'bold');
            doc.text('01/01/2023', 350, 480)
            doc.setFont('Arial', 'normal')
            doc.text('hasta el', 510, 480)
            doc.setFont('Arial', 'bold');
            doc.text('31/12/2024', 30, 490)
            doc.setFont('Arial', 'normal')
            doc.text('fecha pactada con EL AFILIADO, Ribera del Río Club Resort, no se hace responsable por el tiempo que EL', 85, 490)
            doc.text('AFILIADO no haga uso del Club y sus beneficios, durante la vigencia de la Membresía.', 30, 500)

            doc.setFont('Arial', 'bold');
            doc.text('TERCERO: VALOR Y FORMA DE PAGO.     ', 30, 520)
            doc.text('_______________________________________', 30, 521)
            doc.setFont('Arial', 'normal');
            doc.text('EL AFILIADO se obliga a realizar el pago de la membresía escogida al momento de suscribirse al presente contrato valor de', 30, 540)
            doc.text(this.state.pricetotalLetter, 30, 550)
            doc.text('Este pago le confiere el derecho al uso de las instalaciones de Ribera del Río Club Resort bajo los términos y condiciones', 30, 570)
            doc.text('establecidas en el presente documento.', 30, 580)

            console.log(this.state.packageQuote)
            doc.text('Al Contado', 120, 650)
            if (this.state.packageQuote == "1") {
                doc.setFillColor(0, 0, 0);

            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(100, 640, 15, 15, "FD");

            doc.text('6 Cuotas - Cada cuota de', 120, 670)
            if (this.state.packageQuote == "6") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 240, 670)

            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(100, 660, 15, 15, "FD");

            doc.text('12 Cuotas - Cada cuota de', 120, 690)
            if (this.state.packageQuote == "12") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 240, 690)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(100, 680, 15, 15, "FD");

            doc.text('24 Cuotas - Cada cuota de', 120, 710)
            if (this.state.packageQuote == "24") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 240, 710)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(100, 700, 15, 15, "FD");

            doc.text('36 Cuotas Cada cuota de', 340, 650)
            if (this.state.packageQuote == "36") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 450, 650)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(320, 640, 15, 15, "FD");

            doc.text('48 Cuotas Cada cuota de', 340, 670)
            if (this.state.packageQuote == "48") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 450, 670)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(320, 660, 15, 15, "FD");


            doc.text('60 Cuotas Cada cuota de', 340, 690)
            if (this.state.packageQuote == "60") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 450, 690)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(320, 680, 15, 15, "FD");

            doc.text('Otros', 340, 710)

            if (this.state.packageQuote == "") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 450, 710)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(320, 700, 15, 15, "FD");
        }
        else {
            doc.setFont('Arial', 'normal');
            doc.text('En virtud del presente contrato, EL PRESTADOR suministra a EL AFILIADO, los SERVICIOS descritos en el   <<Plan', 30, 390)
            doc.text('de Beneficios>> de KEOLA NETWORKS SA, Aplicativo Móvil de la propiedad del PRESTADOR, adicionalmente', 30, 400)
            doc.setFont('Arial', "bold");
            doc.text('abre la posibilidad de Participación accionarial de KEOLA NETWORKS SA,', 30, 410)
            doc.setFont('Arial', "normal")
            doc.text('según las condiciones establecidas', 365, 410)
            doc.text('en la Cláusula Quinta y Setima, de acuerdo con el tipo de membresía seleccionada.', 30, 420)


            doc.text('Membresía:', 30, 440)

            doc.text('CLASIC', 100, 440)
            if (this.state.userPackage == "Clasic") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(140, 430, 15, 15, "FD");

            doc.text('GOLD', 170, 440)
            if (this.state.userPackage == "Gold") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(200, 430, 15, 15, "FD");

            doc.text('PLATINIUM', 230, 440)
            if (this.state.userPackage == "Platinium") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(290, 430, 15, 15, "FD");

            doc.text('ELITE', 320, 440)
            if (this.state.userPackage == "Elite") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(350, 430, 15, 15, "FD");

            doc.text('PREMIUM', 380, 440)
            if (this.state.userPackage == "Premium") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(430, 430, 15, 15, "FD");

            doc.text('INFINITE', 460, 440)
            if (this.state.userPackage == "Infinite") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }

            doc.text('Al Contado', 120, 650)
            if (this.state.packageQuote == "1") {
                doc.setFillColor(0, 0, 0);

            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(100, 640, 15, 15, "FD");

            doc.text('3 Cuotas - Cada cuota de', 120, 670)
            if (this.state.packageQuote == "3") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 240, 670)

            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(100, 660, 15, 15, "FD");

            doc.text('6 Cuotas - Cada cuota de', 120, 690)
            if (this.state.packageQuote == "6") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 240, 690)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(100, 680, 15, 15, "FD");

            doc.text('9 Cuotas Cada cuota de', 340, 650)
            if (this.state.packageQuote == "9") {
                doc.setFillColor(0, 0, 0);
                doc.text(String("$ "+this.state.quotePrice), 450, 650)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(320, 640, 15, 15, "FD");

            doc.text('12 Cuotas Cada cuota de', 340, 670)
            if (this.state.packageQuote == "12") {
                doc.setFillColor(0, 0, 0);
                doc.rect(320, 660, 15, 15, "FD");
                doc.text(String("$ "+this.state.quotePrice), 450, 670)
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(320, 660, 15, 15, "FD");


            doc.text('Otros ', 340, 690)
            if (this.state.packageQuote == "") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(320, 680, 15, 15, "FD");

            doc.setFont('Arial', 'bold');
            doc.text('SEGUNDO: DURACIÓN.       ', 30, 460)
            doc.text('_______________________', 30, 461)
            doc.setFont('Arial', 'normal');
            doc.text('La prestacion de servicios, brindada por el presente contrato tendrá una duración DE 1 AÑO, iniciando el', 30, 480)
            doc.setFont('Arial', 'bold');
            doc.text('01/04/2021', 455, 480)
            doc.setFont('Arial', 'normal')
            doc.text('hasta el', 510, 480)
            doc.setFont('Arial', 'bold');
            doc.text('31/03/2022', 30, 490)
            doc.setFont('Arial', 'normal')
            doc.text('fecha pactada con EL AFILIADO, el PRESTADOR, no se hace responsable por el tiempo que EL AFILIADO no', 85, 490)
            doc.text('haga uso del beneficio, durante la vigencia de la Membresía.', 30, 500)



            doc.setFont('Arial', 'bold');
            doc.text('TERCERO: VALOR Y FORMA DE PAGO.     ', 30, 520)
            doc.text('_______________________________________', 30, 521)
            doc.setFont('Arial', 'normal');
            doc.text('EL AFILIADO se obliga a realizar el pago de la membresía escogida al momento de suscribirse al presente contrato valor de', 30, 540)
            doc.text(this.state.pricetotalLetter, 30, 550)
            doc.text('Este pago le confiere el derecho al uso de los servicios de KEOLA NETWORKS SA, descritos en el <<Plan de Beneficios>>,', 30, 570)
            doc.text('bajo los términos y condiciones establecidas en el presente documento.', 30, 580)

        };




        doc.setFont('Arial', 'bold');
        doc.text('CUARTO: FINANCIAMIENTO. ', 30, 610)
        doc.text('_____________________________', 30, 611)
        doc.setFont('Arial', 'normal')
        doc.text('El AFILIADO podrá realizar el financiamiento del valor de su membresía en: ', 30, 630)



        doc.setFont('Arial', 'normal')
        doc.text('El Pago de La Cuota Inicial', 30, 725)
        doc.setFont('Arial', 'bold');
        doc.text(String("$ "+this.state.initialQuote), 145, 725)
        doc.setFont('Arial', 'normal');
        doc.text('   , se realiza al suscribirse el presente contrato y las cuotas se pagarán según cronograma adjunto.', 165, 725)

        doc.setFont('Arial', 'bold');
        doc.setFontSize(13);
        doc.text('- Cuenta Corriente Soles BCP                         191-2606708-0-82', 100, 740)
        doc.text('- Cuenta Corriente Dólares BCP                     191-2616687-1-90 ', 100, 755)
        doc.text('- Cuenta Corriente Soles INTERBANK          200-3002538987', 100, 770)
        doc.text('- Cuenta Corriente Dólares INTERBANK      200-3002538994', 100, 785)
        doc.setFont('Arial', 'normal')
        doc.setFontSize(10);
        doc.text('En el caso de incumplimiento del cronograma de pagos, EL AFILIADO, tendrá las siguientes alternativas', 30, 800)
        doc.text('1.- Solicitar periodo de gracias por 3 meses.', 30, 810)
        doc.text('2.- Realizar un traspaso de la membresía a un Tercero.', 30, 820)


        if (this.state.idFamilyPackage === 2) {

            doc.addPage();
            doc.addImage(ribera_low, 20, 5, 120, 70);
            doc.setFont('Arial', 'normal')
            doc.setFontSize(10);
            doc.text('3.- Aplicar a liquidación, manejando aquí 2 opciones: Opción 1: Servicios, donde se devuelve al 100% el dinero en servicios', 30, 80)
            doc.text('que brinda el Hotel (Alojamiento, Alquiler de Espacios, Fulldays). Opción 2: Liquidación Efectivo, opción donde se', 30, 90)
            doc.text('descontará a lo pagado a la fecha, los gastos de ventas y administrativos (equivalentes a 55% del valor total de la ', 30, 100)
            doc.text('membresía). Esta Liquidación se ejecutará, después de la fecha de entrega del proyecto.', 30, 110)
            doc.text('Otro si: ', 30, 120)
            doc.text('En caso de incumplimiento de pago de las cuotas del financiamiento, según fechas estipuladas en el cronograma se ', 30, 130)
            doc.text('procederá a la suspensión de los beneficios según Plan de Beneficio ANEXO 1 como sigue:', 30, 140)
            doc.text('a) Atraso de UNA (1) CUOTA MENSUAL, se procederá a la suspensión de los beneficios de descuentos.', 30, 150)
            doc.text('b) Atraso de DOS (2) CUOTAS MENSUALES, se procederá a la suspensión de los beneficios de Club, Plan Vacacional y Alojamiento.', 30, 160)
            doc.text('c) Atraso de TRES (3) CUOTAS MENSUALES, se procederá a la disolución del presente contrato y aplicar a Liquidación.', 30, 170)

            doc.setFont('Arial', 'bold');
            doc.text('QUINTO: Mantenimiento.', 30, 190)
            doc.text('______________________', 30, 191)
            doc.setFont('Arial', 'normal')
            doc.text('5.1. EL AFILIADO, acepta y confirma que está informado del pago anual, por concepto de mantenimiento, el mismo que', 30, 210)
            doc.text('podrá variar, según lo determine y justifique la administración (incremento costo vida, inflación, valor dinero en el tiempo).', 30, 220)
            doc.text('5.3. El no uso de los servicios de Ribera del Río Club Resort no exonera de este pago al titular. En caso de incumplimiento, EL', 30, 230)
            doc.text('AFILIADO quedará inhabilitado temporalmente hasta regularizar el pago', 30, 240)
            doc.text('5.4. Esta operación no requiere estado de cuenta previo para su cancelación. Puede ser abonado en la cuenta corriente del', 30, 250)
            doc.text('Banco BCP identificándose con su número de afiliado y/o pago directo en alguna oficina del Club.', 30, 260)
            doc.text('5.5. El pago por concepto de mantenimiento corresponde a: $ 199.', 30, 270)
            doc.text('En caso de incumplimiento de pago de las cuotas del mantenimiento, se procederá a la suspensión de los beneficios (según', 30, 280)
            doc.text('Plan de Beneficios ANEXO 1, no se habilitará el USO, hasta la subsanación del pago ó pagos pendientes.', 30, 290)

            doc.setFont('Arial', 'bold');
            doc.text('SEXTO: Renovación y UPGRADES.', 30, 310)
            doc.text('_______________________________', 30, 311)
            doc.setFont('Arial', 'normal')
            doc.text('EL PRESTADOR asegura disponibilidad de membresía para UPGRADES. Teniendo en consideración las siguientes condiciones:', 30, 330)
            doc.text('6.1. El Precio de la renovación, tendrá un % descuento respecto del precio vigente a la fecha de renovación. Este será de acuerdo', 30, 340)
            doc.text('a las tasas vigentes en el momento', 30, 350)
            doc.text('6.2. EL AFILIADO al optar por la renovación, acepta las condiciones y normas vigentes a dicha fecha.', 30, 360)
            doc.text('6.3. UPGRADES. El afiliado durante los primeros 60 meses puede ir migrando entre membresías, desde la EXPERIENCE hasta', 30, 370)
            doc.text('a VITALICIA. Para la cual lo que habrá de pagar es la diferencia del valor entre las membresías más la tasa de UPGRADE', 30, 380)
            doc.text('MIGRACION MEMBRESIA DE MAYOR VALOR vigente en el momento.', 30, 390)
            doc.text('6.4. El número de membresías será determinado en función a la ocupabilidad, poniendo el Resort a disposición de sus ', 30, 400)
            doc.text('AFILIADOS el 25% de su capacidad instalada anual.', 30, 410)

            doc.setFont('Arial', 'bold');
            doc.text('SETIMO: OPCION A PARTICIPACIÓN DE ACCIONES.', 30, 430)
            doc.text('___________________________________________________', 30, 431)
            doc.setFont('Arial', 'normal')
            doc.text('7.1 Al cumplimiento del pago del 100% del valor de la membresía adquirida, la cual debe haber sido pagada cumpliendo las ', 30, 450)
            doc.text('fechas de pago, considerando los 3 Bonos Comodines. Otorgaran a EL AFILIADO un Certificado de Acciones Vitalicias, según  ', 30, 460)
            doc.text('corresponda el tipo de membresía adquirida. En el caso de Membresías Light hacia adelante, EL AFILIADO, se hará acreedor', 30, 470)
            doc.text('de dicho Certificado de Acciones Vitalicias, por segmentos, siendo equivalente cada segmento a una parte proporcional de ', 30, 480)
            doc.text('acciones en función al monto total. Las acciones son múltiplos enteros, no fracciones.', 30, 490)
            doc.text('7.2. La entrega del Certificado de Acciones Vitalicias, se realizará a la fecha del cumplimiento de pago de la Membresía. En', 30, 500)
            doc.text('el caso de Membresías Light en adelante, se irán entregando Certificados Parciales, en función al cumplimiento de los segmentos.', 30, 510)
            doc.text('Dichos certificados, serán legalizados Notarialmente. Y serán inscritos en Registros Públicos a la fecha de entrega del Resort al 100%', 30, 520)
            doc.text('7.3. El número de acciones correspondientes varían según el tipo de membresía adquirida:', 30, 530)

            doc.text('Experience', 70, 560)
            if (this.state.userPackage == "Experience") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(140, 550, 15, 15, "FD");

            doc.text('Light', 170, 560)
            if (this.state.userPackage == "Light") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(200, 550, 15, 15, "FD");

            doc.text('Standard', 230, 560)
            if (this.state.userPackage == "Standard") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(290, 550, 15, 15, "FD");

            doc.text('Mini', 320, 560)
            if (this.state.userPackage == "Mini") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(350, 550, 15, 15, "FD");

            doc.text('Vitalicia', 380, 560)
            if (this.state.userPackage == "Vitalicia") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(430, 550, 15, 15, "FD");

            doc.text('Premium', 460, 560)
            if (this.state.userPackage == "Premium") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(510, 550, 15, 15, "FD");

            doc.text('7.4. El AFILIADO declara y acepta, conocer que el incumplimiento de pago al 100% del contrato de prestación de servicios ', 30, 580)
            doc.text('y/o el incumplimiento de pago puntual según fecha; le quitan el derecho de posesión de las acciones según ', 30, 590)
            doc.text('correspondieran. Así como también, los beneficios sujetos a cualquier campaña promocional aplicable.', 30, 600)
            doc.text('7.5. Ribera del Rio Club Resort, pone a circulación 60,000 acciones, de las cuales serán puestas a disposición de los socios ', 30, 610)
            doc.text('del Sistema de Membresías el 40% de las mismas, los socios tendrán derecho a una participación de las utilidades del ', 30, 620)
            doc.text('Resort directamente proporcional al numero de acciones adquiridas.', 30, 630)

            doc.setFont('Arial', 'bold');
            doc.text('OCTAVO: DERECHOS DEL USUARIO.', 30, 650)
            doc.text('____________________________________', 30, 651)
            doc.setFont('Arial', 'normal')
            doc.text('8.1. Identificación. A las 48 horas de realizado el pago de la cuota de ingreso, se actualizará en sistema el núcleo familiar del ', 30, 670)
            doc.text('AFILIADO. Los cuales, para poder hacer uso y beneficio de la membresía, sólo deberán mostrar su Documento de Identidad', 30, 680)
            doc.text('(DNI, Carnet de Extranjería).', 30, 690)
            doc.text('8.2. Kit de Bienvenida. Cada AFILIADO, después de formalizar su sistema de pago, recibe el Kit en un plazo de 15 días útiles. ', 30, 700)
            doc.text('El Kit incluye: Carta de Bienvenida donde se condigna su número de afiliado, Cronograma de Pagos (caso hubiese ', 30, 710)
            doc.text('fraccionado), Estatutos y Reglamento de Ribera del Río Club Resort. Este Kit de Bienvenida únicamente será entregado en ', 30, 720)
            doc.text('alguna de nuestras oficinas previa coordinación con el titular o vía correo electrónico según prefiera EL AFILIADO.', 30, 730)
            doc.text('8.3. Uso de áreas deportivas y juegos de mesa. LOS AFILIADOS, dejando previamente su DNI o algún Documento de ', 30, 750)
            doc.text('Identidad, disponen del uso gratuito de los servicios de entretenimiento deportivo y juegos de mesa, no incluye ', 30, 760)
            doc.text('concesiones. Todos estos activos están sujetos a disponibilidad, horarios y buen estado.', 30, 770)
            doc.text('8.4. Desacuerdo Varios: Todos los AFILIADOS tendrán derecho a revocar el contrato durante el primer año, de no estar de acuerdo', 30, 790)
            doc.text('del Río Club Resort, los mismos que se encuentran especificados en el Anexo: Plan de Beneficios', 30, 800)
            doc.text('8.5. Invitados.', 30, 820)

            doc.addPage();
            doc.addImage(ribera_low, 20, 5, 120, 70);
            doc.setFont('Arial', 'normal')
            doc.setFontSize(10);
            doc.text('8.5.1. Cada AFILIADO tiene derecho a un número de invitados mensuales (ver detalle en el Plan de Beneficios).', 30, 80)
            doc.text('8.5.2. Los invitados adicionales deberán pagar por su ingreso según tarifario vigente. En el caso de eventos y reservas, la', 30, 90)
            doc.text('cantidad de invitados puede variar de acuerdo a las condiciones convenidas con el AFILIAD', 30, 100)
            doc.text('8.5.3. Se aplicarán restricciones en fines de semana largos y/o feriados.', 30, 120)
            doc.text('8.6. Beneficiarios Adicionales. Todos los AFILIADOS tendrán derecho a adicionar hasta 3 personas en el núcleo familiar y/o', 30, 140)
            doc.text('Beneficiarios directos. Realizando el pago correspondiente según lo indique el plan tarifario vigente. Este pago está ', 30, 150)
            doc.text('especificado en el anexo: Plan de Beneficios.', 30, 160)
            doc.text('8.7. Plan Vacacional. Todos los AFILIADOS tendrán beneficios vacacionales a través de RCI (ID y Pass) y Ribera del Río Travel,', 30, 180)
            doc.text('durante toda la vigencia del programa de prestación de servicios. Se describe a detalle en el anexo: Plan de Beneficios. El ', 30, 190)
            doc.text('inicio de uso de estos beneficios se indica en el anexo: Certificado de Prestación de Servicios. ', 30, 200)
            doc.text('8.8. Acciones. Al cumplimiento del pago del 100% del valor de la membresía adquirida, la cual debe haber sido pagada', 30, 220)
            doc.text('cumpliendo las fechas de pago, considerando los 3 Bonos Comodines. Harán acreedor a EL AFILIADO de un Certificado de ', 30, 230)
            doc.text('Acciones Vitalicias, según corresponda el tipo de membresía adquirida. Esta entrega se realizara a la fecha de entrega del  ', 30, 240)
            doc.text('Resort al 100%.', 30, 250)
            doc.text('8.9. Desacuerdo Varios: Todos los AFILIADOS tendrán derecho a revocar el contrato durante el primer año, de no estar de ', 30, 270)
            doc.text('acuerdo con los avances del desarrollo, su administracion, o cualquier situation por la cual no desee seguir formando parte ', 30, 280)
            doc.text('del Club como Socio. Ante lo cual la empresa, les devolvera el 100% de sus aportes en servicios de descuento vacacional y', 30, 290)
            doc.text('descuento en disfrute de servicios en el Club, y dejar sin efecto este contrato. ', 30, 300)
            doc.text('8.10. Incumplimiento Pacto Entrega: Todos los AFILIADOS tendrán derecho a una vez cumplido el plazo de entrega del  ', 30, 320)
            doc.text('proyecto (31/12/2022), si este no fuese entregado conforme, poder reclamar al 100% de sus aportes, y dejar sin efecto este ', 30, 330)
            doc.text('contrato. Ribera del Río Club Resort, se compromete a poner a su disposición esta cantidad en cheque bancario. Sólo aplica', 30, 340)
            doc.text('para los AFILIADOS, que hayan cancelado al 100% del monto de su membresía. Los afiliados que no hayan cancelado la ', 30, 350)
            doc.text('totalidad se aplicará según Cláusula CUARTA', 30, 360)


            doc.setFontSize(10);

            doc.setFont('Arial', 'bold');
            doc.text('NOVENO: OBLIGACIONES DEL USUARIO.', 30, 380)
            doc.text('_________________________________________', 30, 381)
            doc.setFont('Arial', 'normal')
            doc.text('9.1. EL AFILIADO declara responsabilizarse por los daños que éste, su cónyuge, hijos, hijas e invitados pudieran causar a las ', 30, 400)
            doc.text('instalaciones de Ribera del Río Club Resort ya sea por dolo, culpa leve o culpa inexcusable.', 30, 410)
            doc.text('9.2. EL AFILIADO reconoce que Ribera del Río Club Resort a través de su administración podrá imponer a los afiliados las ', 30, 430)
            doc.text('sanciones que constan en el Reglamento de Ribera del Río Club Resort.', 30, 440)
            doc.text('9.3. EL AFILIADO declara conocer las disposiciones contenidas en el Reglamento de Ribera del Río Club Resort y que lo ha ', 30, 460)
            doc.text('leído previamente a la suscripción del presente documento, sin más constancia que la firma puesta al pie, quedando ', 30, 470)
            doc.text('suscrito a sus términos y condiciones aceptando los procedimientos y sanciones que éste contempla.', 30, 480)
            doc.text('9.4. EL AFILIADO declara y acepta que Ribera del Río Club Resort podrá modificar su Reglamento, así como podrá expedir', 30, 500)
            doc.text('otras normas, reglamentos y políticas que tengan por finalidad mejorar el uso de las instalaciones de Ribera del Río Club ', 30, 510)
            doc.text('Resort por parte de los afiliados y público en general, los cuales están obligados a respetarlas desde la fecha en que estas ', 30, 520)
            doc.text('sean comunicadas.', 30, 530)
            doc.text('9.5. Acciones. EL AFILIADO declara y acepta conocer que el incumplimiento de pago al 100% del contrato de prestación de', 30, 550)
            doc.text('servicios y/o el incumplimiento de pago puntual según fecha; le quitan el derecho de posesión de las acciones que le ', 30, 560)
            doc.text('correspondieran', 30, 570)
            doc.setFont('Arial', 'bold');
            doc.text('DECIMO: Terminación.', 30, 590)
            doc.text('______________________', 30, 591)
            doc.setFont('Arial', 'normal')
            doc.text('Este contrato queda resuelto de manera automática una vez finalizado el periodo de la membresía contratado. En caso de', 30, 610)
            doc.text('incumplimiento de cualquier obligación del presente contrato y del Reglamento por parte de EL AFILIADO, Ribera del Río  ', 30, 620)
            doc.text('Club Resort podrá resolverlo de manera automática y sin lugar a devolución de dinero.', 30, 630)

            doc.setFont('Arial', 'bold');
            doc.text('DECIMO PRIMERO: Cesión.', 30, 650)
            doc.text('_________________________', 30, 651)
            doc.setFont('Arial', 'normal')
            doc.text('EL AFILIADO puede ceder, transferir o donar, parcial o totalmente cualquier servicio y/u obligaciones bajo este contrato, con', 30, 670)
            doc.text('el solo llenado de los formatos correspondientes.', 30, 680)
            doc.setFont('Arial', 'bold');

            doc.text('DECIMO SEGUNDO: Resolución Unilateral.', 30, 710)
            doc.text('______________________________________', 30, 711)
            doc.setFont('Arial', 'normal')
            doc.text('Podrán resolver unilateralmente el contrato, mediante una comunicación por escrito y bajo cargo de entrega, dentro de los', 30, 730)
            doc.text('cinco (5) días calendarios siguiente suscrito el contrato; para lo cual no es necesaria una expresión de causa,con lo cual ', 30, 740)
            doc.text('acepta pagar el 55% del valor total de la membresía adquirida (correspondiente a los gastos de ventas y administrativos al', 30, 750)
            doc.text('igual como se indica en la cláusula cuarta en caso de financiamiento), por concepto de penalidad, devolviéndose el saldo en ', 30, 760)
            doc.text('el caso que lo hubiera, en un plazo no menor de 45 días ni mayor de 60 días, sin que se genere ningún tipo de interés', 30, 770)
            doc.text('compensatorio o moratorio ni de cualquier tipo. La devolución total procederá en el caso que la autoridad competente ', 30, 780)
            doc.text('disponga en los plazos indicados previa demostración objetiva y fehaciente por parte de EL AFILIADO según lo previsto en el', 30, 790)
            doc.text('articulo N° 59 de la ley N°29571.', 30, 800)

            doc.addPage();
            doc.addImage(ribera_low, 20, 5, 120, 70);

            doc.setFontSize(10);
            doc.setFont('Arial', 'bold');

            doc.text('DECIMO TERCERO: Normas Adicionales', 30, 90)
            doc.text('______________________________________', 30, 91)
            doc.setFont('Arial', 'normal')
            doc.text('Ribera del Río Club Resort, se reserva el derecho a modificar, adicionar y/o complementar normas. Todas estas ', 30, 110)
            doc.text('modificaciones adicionales y demás estarán en vigor al día siguiente de su publicación. El incumplimiento de las mismas', 30, 120)
            doc.text('dará lugar a la cancelación de los derechos de EL AFILIADO, como también en los casos en que comportamiento sea', 30, 130)
            doc.text('considerado molesto, perturbador, inmoral o fraudulento, sin derecho a devolución del monto pagado.', 30, 140)
            doc.setFont('Arial', 'bold');

            doc.text('DECIMO TERCERO: Normas Adicionales', 30, 160)
            doc.text('__________________________________', 30, 161)
            doc.setFont('Arial', 'normal')
            doc.text('EL AFILIADO, tiene la posibilidad de cambiar a sus beneficiarios de manera anual, con el solo llenado de los formatos ', 30, 180)
            doc.text('correspondientes.', 30, 190)

            doc.setFont('Arial', 'bold');

            doc.text('Directos', 30, 210)
            doc.text('________', 30, 211)
            doc.setFont('Arial', 'normal')
            doc.text('Nombre: __________________________________________ Grado de Parentesco: __________', 30, 230)
            doc.text('Nombre: __________________________________________ Grado de Parentesco: __________', 30, 250)
            doc.text('Nombre: __________________________________________ Grado de Parentesco: __________', 30, 270)

            doc.setFont('Arial', 'bold');

            doc.text('Adicionales', 30, 290)
            doc.text('____________', 30, 291)
            doc.setFont('Arial', 'normal')
            doc.text('Nombre: __________________________________________ Grado de Parentesco: __________', 30, 310)
            doc.text('Nombre: __________________________________________ Grado de Parentesco: __________', 30, 330)
            doc.text('Nombre: __________________________________________ Grado de Parentesco: __________', 30, 350)

            doc.setFont('Arial', 'bold');

            doc.text('DECIMO QUINTO: Manejo de datos Personales', 30, 370)
            doc.text('__________________________________________', 30, 371)
            doc.setFont('Arial', 'normal')
            doc.text('EL AFILIADO, autoriza a Ribera del Río Club Resort, el uso de los datos consignados en el presente contrato para fines de ', 30, 390)
            doc.text('comunicación y promoción de los productos y servicios que éste ofrece', 30, 400)

            doc.setFont('Arial', 'bold');

            doc.text('DECIMO SEXTO: Estipulaciones Anteriores', 30, 420)
            doc.text('_______________________________________', 30, 421)
            doc.setFont('Arial', 'normal')
            doc.text('Las partes contratantes manifiestan que el presente contrato constituye un acuerdo completo y total acerca de su objeto y  ', 30, 440)
            doc.text('reemplaza cualquier otro acuerdo verbal o escrito celebrado con anterioridad. ', 30, 450)
            doc.text('Para constancia se firma en dos (2) ejemplares del mismo tenor, el día', 30, 510)
            doc.setFont('Arial', 'bold');
            doc.text(this.state.creationDate, 330, 510)
            doc.setFont('Arial', 'normal');
            doc.text('_________________________                                           ____________________________', 60, 580)
            doc.text('        EL AFILIADO                                                                         DIRECTOR', 60, 600)
            doc.text('Nombres y Apellidos:', 80, 630)
            doc.setFont('Arial', 'bold');
            doc.text(this.state.user.name + ' ' + this.state.user.lastname, 80, 640)
            doc.setFont('Arial', 'normal')
            doc.text('Nombres y Apellidos:', 300, 630)
            doc.setFont('Arial', 'bold');
            doc.text('Omar Fernando Urteaga Cabrera', 300, 640)









        }
        else {
            doc.addPage();
            doc.addImage(logoIntech, 20, 5, 120, 70);
            doc.addImage(logoKeOla, 200, 5, 120, 70);
            doc.addImage(logoInClub, 430, 5, 120, 70);
            doc.setFont('Arial', 'normal')
            doc.setFontSize(10);
            doc.text('En el caso de incumplimiento del cronograma de pagos, EL AFILIADO, tendrá las siguientes alternativas', 30, 90)
            doc.text('1.- Suspensión de los beneficios (según Plan de Beneficios ANEXO 1) y además al pago de moras y penalidades como sigue:', 30, 100)
            doc.text('a) Atraso de UNA (1) CUOTA y (2) CUOTAS MENSUALES, 1% de la cuota mensual, por día de atraso.', 60, 110)
            doc.text('b) Atraso de TRES (3) CUOTAS MENSUALES, se procederá a la disolución del presente contrato y aplicar a Liquidación.', 60, 120)
            doc.text('2.-Realizar un traspaso de la membresía a un Tercero. ', 30, 130)
            doc.text('3.-Aplicar a liquidación, donde se devuelve al 100% el dinero en servicios que brinda el Aplicativo ( Paquetes Publicitarios para', 30, 140)
            doc.text('Personas y/o empresas).', 30, 150)

            doc.setFont('Arial', 'bold');
            doc.text('QUINTO: PLAN DE POSICIONAMIENTO.', 30, 180)
            doc.text('_______________________________________', 30, 181)
            doc.setFont('Arial', 'normal')
            doc.text('EL AFILIADO se compromete con la compañía a ayudar con el posicionamiento del aplicativo móvil, haciendo ello a través de la', 30, 190)
            doc.text('invitación gratuita de usuarios y comercios, quienes puedan usar las funcionalidades y beneficios del aplicativo totalmente gratis', 30, 200)
            doc.text('contribuyendo así al posicionamiento del aplicativo. En virtud de ello, recibe el precio promocional, indicado en el Artículo', 30, 210)
            doc.text('TERCERO: Valor y Forma de Pago, el cual corresponde al 50% su valor valor real.', 30, 220)
            doc.text('5.1. Cuota de Posicionamiento según Tipo de Membresia: Clasic: 33 usuarios y 2 Comercios; Gold: 100 usuarios y 6 Comercios,', 30, 230)
            doc.text('Platinium: 200 usuarios y 12 Comercios, Elite: 300 usuarios y 18 Comercios, Premium: 400 usuarios y 24 Comercios; y Infinite: 600', 30, 240)
            doc.text('usuarios y 36 Comercios Gratuitos, eso si 100% verificados y con documento de identidad único.', 30, 250)
            doc.text('5.2. En el caso que EL AFILIADO, no pueda lograr el numero de usuarios y comercios gratuitos establecido según su tipo de', 30, 260)
            doc.text('contrato se procederán de las 2 siguientes maneras:', 30, 270)
            doc.text('5.2.1. Hacer el pago correspondiente proporcionalmente por la cantidad de usuarios y comercios pendientes. En donde el costo', 50, 280)
            doc.text('por cada usuario y comercio pendiente será el siguiente: usuario: USD $ 1.5, comercio USD $ 7.5, con dicho monto, el área', 50, 290)
            doc.text('comercial de la compañía se hará cargo y a la vez mostrará fehacientemente al socio el cumplimiento de la atracción de dichos', 50, 300)
            doc.text('usuarios.', 50, 310)
            doc.text('5.2.2. De no efectivizar la opcion 5.2.1. El Afiliado recibira acciones correspondientes al 25% de lo ofrecido originalmente por la', 50, 320)
            doc.text('membresia adquirida.', 50, 330)
            doc.setFont('Arial', 'bold');
            doc.text('SEXTO: UPGRADES.', 30, 350)
            doc.text('___________________', 30, 351)
            doc.setFont('Arial', 'normal')
            doc.text('EL PRESTADOR asegura disponibilidad de membresía para UPGRADES. Teniendo en consideración las siguientes condiciones:', 30, 370)
            doc.text('6.1. El Precio del UPGRADE, será de acuerdo a las tasas vigentes en el momento. ', 30, 380)
            doc.text('6.2. El afiliado durante los primeros 90 días puede migrar entre membresías, desde la CLASIC hasta la INFINITE. Para lo cual', 30, 390)
            doc.text('lo que habrá de pagar es la diferencia del valor entre las membresías más la tasa de UPGRADE (COSTO DE MIGRACION DE', 30, 400)
            doc.text('MEMBRESIA) vigente en el momento.', 30, 410)
            doc.text('6.3. El número de membresías será determinado en función a la cantidad total de acciones disponibles', 30, 420)

            doc.setFont('Arial', 'bold');
            doc.text('SETIMO: OPCION A PARTICIPACIÓN DE ACCIONES.', 30, 440)
            doc.text('___________________________________________________', 30, 441)
            doc.setFont('Arial', 'normal')
            doc.text('7.1. El Prestador, indica la creación de una nueva Razón Social: KEOLA NETWORKS SA, empresa donde se constituirán los socios', 30, 460)
            doc.text('del Aplicativo KEOLA NETWORKS, hoy propiedad de el PRESTADOR. ', 30, 470)
            doc.text('7.2. Al cumplimiento del pago del 100% del valor de la membresía adquirida, la cual debe haber sido pagada cumpliendo las', 30, 480)
            doc.text('fechas de pago. Se otorgará a EL AFILIADO un <<Certificado de Acciones Vitalicias>>, según corresponda el tipo de membresía', 30, 490)
            doc.text('adquirida.', 30, 500)
            doc.text('7.3. La entrega del <<Certificado de Acciones Vitalicias>>, se realizará a la fecha del cumplimiento de pago de la Membresía.', 30, 510)
            doc.text('En el caso de Membresías, dichos certificados, serán legalizados Notarialmente. Y serán inscritos en Registros Públicos a la', 30, 520)
            doc.text('fecha de la colocación total de las acciones de KEOLA NETWORKS SA, dichos gastos corren a cuenta del cliente.', 30, 530)
            doc.text('7.4. El número de acciones correspondientes varían según el tipo de membresía adquirida:', 30, 540)

            doc.text('CLASIC', 100, 560)
            if (this.state.userPackage == "Clasic") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(140, 550, 15, 15, "FD");

            doc.text('GOLD', 170, 560)
            if (this.state.userPackage == "Gold") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(200, 550, 15, 15, "FD");

            doc.text('PLATINIUM', 230, 560)
            if (this.state.userPackage == "Platinium") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(290, 550, 15, 15, "FD");

            doc.text('ELITE', 320, 560)
            if (this.state.userPackage == "Elite") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(350, 550, 15, 15, "FD");

            doc.text('PREMIUM', 380, 560)
            if (this.state.userPackage == "Premium") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(430, 550, 15, 15, "FD");

            doc.text('INFINITE', 460, 560)
            if (this.state.userPackage == "Infinite") {
                doc.setFillColor(0, 0, 0);
            }
            else {
                doc.setFillColor(255, 255, 255);

            }
            doc.rect(510, 550, 15, 15, "FD");
            doc.text('7.5. El AFILIADO declara y acepta, conocer que el incumplimiento de pago al 100% del contrato de prestación de servicios y/o el', 30, 580)
            doc.text('incumplimiento de pago puntual según fecha; le quitan el derecho de posesión de las acciones según correspondieran. Así como', 30, 590)
            doc.text('también, los beneficios sujetos a cualquier campaña promocional aplicable.', 30, 600)
            doc.text('7.6. KEOLA NETWORKS SA, se constituirá con 25,000,000,000 acciones, de las cuales serán puestas a disposición de los socios del', 30, 610)
            doc.text('Sistema de Membresías el 70% de las mismas, los socios tendrán derecho a una participación de las utilidades de KEOLA', 30, 620)
            doc.text('NETWORKS SA directamente proporcional al número de acciones adquiridas.', 30, 630)

            doc.setFont('Arial', 'bold');
            doc.text('OCTAVO: DERECHOS DEL USUARIO.', 30, 650)
            doc.text('____________________________________', 30, 651)
            doc.setFont('Arial', 'normal')
            doc.text('8.1. Identificación. Entre 24h a 48 horas de realizado el pago de la cuota de ingreso, se actualizará en sistema al AFILIADO.', 30, 670)
            doc.text('8.2. Kit de Bienvenida. Cada AFILIADO, después de formalizar su sistema de pago, recibe el Kit en un plazo de 15 días útiles.', 30, 680)
            doc.text('El Kit incluye: Carta de Bienvenida donde se consigna su número de afiliado, Cronograma de Pagos (caso hubiese fraccionado),', 30, 690)
            doc.text('Estatutos y Reglamento de KEOLA NETWORKS SA. Este Kit de Bienvenida únicamente será entregado en alguna de nuestras oficinas', 30, 700)
            doc.text('previa coordinación con el titular o vía correo electrónico según prefiera EL AFILIADO.', 30, 710)
            doc.text('8.3. Acciones. Al cumplimiento del pago del 100% del valor de la membresía adquirida, la cual debe haber sido pagada cumpliendo', 30, 720)
            doc.text('las fechas de pago. Harán acreedor a EL AFILIADO de un <<Certificado de Acciones Vitalicias>>, según corresponda el tipo de', 30, 730)
            doc.text('membresía adquirida. Esta entrega se realizará a la fecha de la colocación total de las acciones de KEOLA NETWORKS SA.', 30, 740)
            doc.text('8.4. Desacuerdo Varios: Todos los AFILIADOS tendrán derecho a revocar el contrato durante el primer año, de no estar de acuerdo', 30, 750)
            doc.text('con los avances del desarrollo, su administración, o cualquier situación por la cual no desee seguir formando parte de KEOLA', 30, 760)
            doc.text('NETWORKS SA como Socio. Ante lo cual la empresa, les devolvera el 100% de sus aportes en servicios de publicidad dentro del', 30, 770)
            doc.text('aplicativo de Keola Networks, y dejar sin efecto este contrato.', 30, 780)

            doc.addPage();

            doc.addImage(logoIntech, 20, 5, 120, 70);
            doc.addImage(logoKeOla, 200, 5, 120, 70);
            doc.addImage(logoInClub, 430, 5, 120, 70);


            doc.setFontSize(10);

            doc.setFont('Arial', 'bold');
            doc.text('NOVENO: OBLIGACIONES DEL USUARIO.', 30, 80)
            doc.text('_________________________________________', 30, 81)
            doc.setFont('Arial', 'normal')
            doc.text('9.1. EL AFILIADO reconoce que el PRESTADOR a través de su administración podrá imponer a los afiliados las sanciones que', 30, 100)
            doc.text('constan en el Reglamento de KEOLA NETWORKS.', 30, 110)
            doc.text('9.2. EL AFILIADO declara conocer las disposiciones contenidas en el Reglamento de KEOLA NETWORKS y que lo ha leído', 30, 120)
            doc.text('previamente a la suscripción del presente documento, sin más constancia que la firma puesta al pie, quedando suscrito', 30, 130)
            doc.text('a sus términos y condiciones aceptando los procedimientos y sanciones que éste contempla.', 30, 140)
            doc.text('9.3. EL AFILIADO declara y acepta que el PRESTADOR podrá modificar su Reglamento, así como podrá expedir otras normas,', 30, 150)
            doc.text('reglamentos y políticas que tengan por finalidad mejorar las condiciones para los afiliados y público en general, los', 30, 160)
            doc.text('cuales están obligados a respetarlas desde la fecha en que estas sean comunicadas.', 30, 170)
            doc.text('9.4. Acciones. EL AFILIADO declara y acepta conocer que el incumplimiento de pago al 100% del contrato de prestación de servicios', 30, 180)
            doc.text('y/o el incumplimiento de pago puntual según fecha; le quitan el derecho de posesión de las acciones que le correspondieran.', 30, 190)

            doc.setFont('Arial', 'bold');
            doc.text('DECIMO: TERMINACIÓN.', 30, 210)
            doc.text('_________________________', 30, 211)
            doc.setFont('Arial', 'normal')
            doc.text('Este contrato queda resuelto de manera automática una vez finalizado el periodo de la membresía contratado. En caso de', 30, 230)
            doc.text('incumplimiento de cualquier obligación del presente contrato y del Reglamento por parte de EL AFILIADO, El Prestador podrá', 30, 240)
            doc.text('resolverlo de manera automática y sin lugar a devolución de dinero.', 30, 250)

            doc.setFont('Arial', 'bold');
            doc.text('DECIMO PRIMERO: CESIÓN.', 30, 270)
            doc.text('____________________________', 30, 271)
            doc.setFont('Arial', 'normal')
            doc.text('EL AFILIADO puede ceder, transferir o donar, parcial o totalmente cualquier servicio y/u obligaciones bajo este contrato, ', 30, 290)
            doc.text('con el solo llenado de los formatos correspondientes.', 30, 300)

            doc.setFont('Arial', 'bold');
            doc.text('DECIMO SEGUNDO: RESOLUCIÓN UNILATERAL.', 30, 320)
            doc.text('_________________________________________________', 30, 321)
            doc.setFont('Arial', 'normal')
            doc.text('Podrán resolver unilateralmente el contrato, mediante una comunicación por escrito y bajo cargo de entrega, dentro de los cinco', 30, 340)
            doc.text('(5) días calendarios siguiente suscrito el contrato; para lo cual no es necesaria una expresión de causa, con lo cual acepta', 30, 350)
            doc.text('pagar el 55% del valor total de la membresía adquirida (correspondiente a los gastos de ventas y administrativos al igual como se', 30, 360)
            doc.text('indica en la cláusula cuarta en caso de financiamiento), por concepto de penalidad, devolviéndose el saldo en el caso que lo', 30, 370)
            doc.text('hubiera, en un plazo no menor de 45 días ni mayor de 60 días, sin que se genere ningún tipo de interés compensatorio o moratorio', 30, 380)
            doc.text('ni de cualquier tipo. La devolución total procederá en el caso que la autoridad competente disponga en los plazos indicados previa', 30, 390)
            doc.text('demostración objetiva y fehaciente por parte de EL AFILIADO según lo previsto en el articulo N° 59 de la ley N°29571.', 30, 400)

            doc.setFont('Arial', 'bold');
            doc.text('DECIMO TERCERO: NORMAS ADICIONALES.', 30, 420)
            doc.text('____________________________________________', 30, 421)
            doc.setFont('Arial', 'normal')
            doc.text('El Prestador, se reserva el derecho a modificar, adicionar y/o complementar normas. Todas estas modificaciones adicionales y', 30, 440)
            doc.text('demás estarán en vigor al día siguiente de su publicación. El incumplimiento de las mismas dará lugar a la cancelación de los', 30, 460)
            doc.text('derechos de EL AFILIADO, como también en los casos en que comportamiento sea considerado molesto, perturbador, inmoral o,', 30, 470)
            doc.text('fraudulento sin derecho a devolución del monto pagado.', 30, 480)

            doc.setFont('Arial', 'bold');
            doc.text('DECIMO CUARTO: MANEJO DE DATOS PERSONALES.', 30, 500)
            doc.text('_____________________________________________________', 30, 501)
            doc.setFont('Arial', 'normal')
            doc.text('EL AFILIADO, autoriza a el PRESTADOR, el uso de los datos consignados en el presente contrato para fines de comunicación y', 30, 520)
            doc.text('promoción de los productos y servicios que éste ofrece.', 30, 530)

            doc.setFont('Arial', 'bold');
            doc.text('DECIMO QUINTO: ESTIPULACIONES ANTERIORES.', 30, 550)
            doc.text('__________________________________________________', 30, 551)
            doc.setFont('Arial', 'normal')
            doc.text('Las partes contratantes manifiestan que el presente contrato constituye un acuerdo completo y total acerca de su objeto y reemplaza', 30, 570)
            doc.text('cualquier otro acuerdo verbal o escrito celebrado con anterioridad. ', 30, 580)
            doc.text('Para constancia se firma en dos (2) ejemplares del mismo tenor, el día', 30, 610)
            doc.setFont('Arial', 'bold');
            doc.text(this.state.creationDate, 330, 610)
            doc.setFont('Arial', 'normal');
            doc.text('_________________________                                           ____________________________', 60, 680)
            doc.text('        EL AFILIADO                                                                         DIRECTOR', 60, 700)
            doc.text('Nombres y Apellidos:', 80, 730)
            doc.setFont('Arial', 'bold');
            doc.text(this.state.user.name + ' ' + this.state.user.lastname, 80, 740)
            doc.setFont('Arial', 'normal')
            doc.text('Nombres y Apellidos:', 300, 730)
            doc.setFont('Arial', 'bold');
            doc.text('Omar Fernando Urteaga Cabrera', 300, 740)

        }
        doc.save("CON" + this.state.user.username + ".pdf")
    }
    jsPdfGenerator3 = () => {

        const unit = 'pt';
        const size = 'A4';
        const orientation = 'portrait';

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const img = new Image;

        doc.setFontSize(12);

        const title = "";
        const headers = [["N°", "Vencimiento", "Capital", "Amortizacion", "Interes", "Cuota"]];

        const data = this.state.schedules.map(elt => [elt.quoteDescription, Validation.convertDateToString(elt.nextExpiration), (Math.round(((elt.capitalBalance / elt.dollarExchange) + Number.EPSILON) * 100) / 100) + " USD", (Math.round(((elt.amortization / elt.dollarExchange) + Number.EPSILON) * 100) / 100) + " USD", elt.interested + " USD", (Math.round(((elt.quote / elt.dollarExchange) + Number.EPSILON) * 100) / 100) + " USD"]);

        let content = {
            startY: 260,
            head: headers,
            body: data,
            styles: { halign: 'center' },
        };



        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('                    CRONOGRAMA DE PAGOS                        ', 160, 30)
        doc.setFont('Arial', "normal");

        doc.setFontSize(11);
        doc.text('Código:', 30, 60)
        doc.text(this.state.user.username, 70, 60)
        doc.text('Nombres del Cliente:     ', 30, 75)
        doc.text(this.state.user.name, 130, 75)
        doc.text(this.state.user.lastname, 250, 75)
        doc.text('DNI:  ', 30, 90)
        doc.text(this.state.user.nroDocument, 70, 90)
        doc.text('Correo Electrónico: ', 30, 105)
        doc.text(this.state.user.email, 120, 105)
        doc.text('Teléfono de Contacto: ', 30, 120)
        doc.text(this.state.user.phone, 140, 120)
        doc.text('Producto: Memebresía ', 30, 135)
        doc.text(this.state.userPackage, 140, 135)

        doc.text('Importe de la Membresía: ', 30, 170)
        doc.text(String(this.state.price), 170, 170)
        doc.text('% Financiamiento: ', 300, 170)
        doc.text('91.86%', 400, 170)
        doc.text('Importe Financiado: ', 30, 185)
        doc.text(String(this.state.price - this.state.quotePrice), 170, 185)
        doc.text('Cuotas a Pagar:', 300, 185)
        doc.text(String(this.state.packageQuote), 400, 185)
        doc.text('Cantidad Total a Pagar: ', 30, 200)
        doc.text(String(this.state.price - this.state.quotePrice), 170, 200)
        doc.text('Tasa Efectiva Anual:', 300, 200)
        doc.text('0%', 400, 200)
        doc.text('Monto total de Interes: ', 30, 215)
        doc.text('0.00 USD', 170, 215)
        doc.text('Periodicidad:', 300, 215)
        doc.text('Mensual', 400, 215)
        doc.text('Fecha Emision Cronograma: ', 30, 230)
        doc.text(this.state.creationDate, 170, 230)



        doc.setFont('Arial');
        doc.setFontSize(13);
        doc.text(title, marginLeft, 250);
        doc.setFontSize(10);
        doc.autoTable(content);


        doc.setFont('Arial');
        doc.text('Este Cronograma se elabora bajo el supuesto cumpliento de pagos de las cuotas en las fechas indicadas.', 50, 650)
        doc.text('Cualquier alteracion en los pagos o en las condiciones del financiamiento,deja sin efecto este documento.', 50, 665)
        doc.text('El atraso de una cuota mensual por mas de 8 días generará una penalidad de S/.30 soles.', 50, 680)
        doc.text('Si tuviera alguna consulta sirvase comunicarse con su asesor de membresías o a la línea de atención al cliente (01)-434-9481.', 50, 695)

        doc.setFont('Arial', 'normal');
        doc.setFontSize(13);
        doc.text('                                       _________________________          ', 70, 730)
        doc.text('                                       Omar Urteaga Cabrera', 70, 745)
        doc.text('                                       Gerente General', 70, 760)
        doc.text('                                       Ribera del Rio Club Resort', 70, 775)



        doc.save("CRO" + this.state.user.username + ".pdf")
    }
    jsPdfGenerator4 = () => {

        const unit = 'pt';
        const size = 'A4';
        const orientation = 'portrait';

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const img = new Image;

        doc.setFontSize(12);

        doc.setFontSize(17);
        doc.setFont('Arial', "bold");
        doc.text('Anexo 1                     ', 30, 50)
        doc.setLineWidth(1);
        doc.line(30, 55, 90, 55);

        doc.setFont('Arial', "normal");

        doc.addImage(ribera_low, 70, 50, 120, 70);
        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('PLAN DE BENEFICIOS', 250, 120)
        doc.setLineWidth(1);
        doc.line(430, 125, 200, 125);
        doc.setFontSize(12);
        doc.text('Todos los planes incluyen para el socio y sus beneficiarios, disfrutar ilimitadamente', 60, 150)
        doc.text('nuestras instalaciones los 365 días del año.', 60, 160)
        doc.text('Piscinas:', 60, 185)
        doc.setFont('Arial', "normal");
        doc.text('1 piscina bebes, 1 para niños de 6 a 12 años y 1 para adultos.', 120, 185)
        doc.setFont('Arial', "bold");
        doc.text('Áreas deportivas: ', 60, 195)
        doc.setFont('Arial', "normal");
        doc.text('2 canchitas de fulbito, 2 de vóley y 2 multiusos.', 160, 195)
        doc.setFont('Arial', "bold");
        doc.text('Área  de  Juegos Infantiles: ', 60, 205)
        doc.setFont('Arial', "normal");
        doc.text('Inflables, camas elásticas, resbaladeras, columpios, laberintos,', 210, 205)
        doc.text('muros de escalar, entre otros.', 60, 215)
        doc.setFont('Arial', "bold");
        doc.text('Sala de Juegos: ', 60, 225)
        doc.setFont('Arial', "normal");
        doc.text('Fulbito de mano, tenis de mesa, billas, tiro al sapo y más.', 140, 225)
        doc.setFont('Arial', "bold");
        doc.text('Salones   de   Recepciones:', 60, 235)
        doc.setFont('Arial', "normal");
        doc.text('4 salones de recepciones para eventos con capacidad hasta para 250 personas.', 200, 235)
        doc.setFont('Arial', "bold");
        doc.text('Restaurantes: ', 60, 245)
        doc.setFont('Arial', "normal");
        doc.text('1 Buffet y 1 A la Carta,', 140, 245)
        doc.setFont('Arial', "bold");
        doc.text('Bar y Karaoke. ', 260, 245)
        doc.setFont('Arial', "bold");
        doc.text('Spa, Sauna y Gimnasio', 60, 255)
        doc.text('Estacionamiento Privado:', 60, 265)
        doc.setFont('Arial', "normal");
        doc.text('Amplias playas de estacionamiento con capacidad para más de 200 vehículos', 200, 265)
        doc.setFont('Arial', "bold");
        doc.text('Áreas Verdes y Áreas de Reposo:', 60, 275)
        doc.setFont('Arial', "normal");
        doc.text('Mas de 2500 m2 de área verde', 240, 275)
        doc.setFont('Arial', "bold");
        doc.text('libre WIFI Gratis', 60, 285)
        doc.setFontSize(12);
        doc.text('Planes de Membresías', 250, 305)
        doc.setLineWidth(1);
        doc.line(430, 310, 200, 310);
        doc.setFont('Arial', "normal");
        doc.setFontSize(13);
        doc.text('Hotel y Apartamentos', 260, 330)
        doc.setFont('Arial', "bold");
        doc.text('Membresía Clásica (Todos los beneficios son renovables anualmente)', 60, 350)
        doc.setFontSize(12);
        doc.text('Beneficios Club', 60, 370)
        doc.setFont('Arial', "normal");
        doc.text('Beneficiarios:', 60, 380)
        doc.setLineWidth(1);
        doc.line(60, 381, 120, 381);
        doc.text('Titular, más cónyuge + hijos menores a 18 años (ó titular +3 beneficiarios edad indistinta)', 140, 380)
        doc.text('Invitados:', 60, 390)
        doc.setLineWidth(1);
        doc.line(60, 391, 105, 391);
        doc.text('4 Pases libres para invitados x mes (acumulable x2, 2 veces por año en día de semana*)', 130, 390)
        doc.setFont('Arial', "bold");
        doc.text('Beneficios Descuentos', 60, 405)
        doc.setFont('Arial', "normal");
        doc.text('Restaurante y Bar: 20%, Servicios Spa, Salas de Cumpleaños Infantiles y Salas de Recepciones: 25%,', 60, 415)
        doc.text('Alojamiento Adicional: 30% y Invitados Adicionales: 40%.', 60, 425)
        doc.setFont('Arial', "bold");
        doc.text('Beneficios Alojamiento (*)', 60, 435)
        doc.setFont('Arial', "normal");
        doc.text('Estándar Resort:', 60, 450)
        doc.setLineWidth(1);
        doc.line(60, 451, 140, 451);
        doc.setFont('Arial', "normal");
        doc.text('2 Noches de alojamiento en Fin de semana: Viernes y Sábado 3pm-12 pm y 4', 150, 450)
        doc.text('Noches de alojamiento en Semana: Domingo a Jueves 3pm- 12pm. Todo ello equivalente a 40', 60, 460)
        doc.text('Puntos de Alojamiento Anual.', 60, 470)

        doc.setFont('Arial', "bold");
        doc.setFontSize(13);
        doc.text('Vacaciones:', 60, 500)
        doc.setFontSize(12);
        doc.text('RCI (****)', 60, 520)
        doc.setLineWidth(1);
        doc.line(60, 521, 130, 521);
        doc.setFont('Arial', "normal");
        doc.text('* Semanas de Intercambio Vacacional desde $ 359 (**) (Temporada Alta / Media / Baja)', 60, 530)
        doc.text('* Semanas de Escape desde $ 299 (***) (Temporada Media / Baja)', 60, 540)
        doc.text('* Mas de 4500 Desarrollos en más de 110 Países. flexibilidad para viajar y posibilidad de', 60, 550)
        doc.text('de traspasar,regalar o ceder beneficios a un tercero.', 60, 560)

        doc.setFont('Arial', "bold");
        doc.setFontSize(12);
        doc.text('Vive ahora travel', 60, 590)
        doc.setLineWidth(1);
        doc.line(60, 591, 160, 591);

        doc.setFont('Arial', "normal");
        doc.text('* Agencia de Viaje EXCLUSIVA PARA SOCIOS, adquiere todo para tus vacaciones Nacionales e', 60, 600)
        doc.text('Internacionales Boletos de Avión, Noches de hotel, Paquetes armados y mucho más...', 60, 610)
        doc.text('directamente tomados de las Operadoras Turísticas más importantes.', 60, 620)
        doc.setFont('Arial', "bold");
        doc.text('Mejor Precio Garantizado.', 400, 620)

        doc.setFont('Arial', "bold");
        doc.setFontSize(12);
        doc.text('Durante el Desarrollo: ', 60, 640)
        doc.setFont('Arial', "normal");
        doc.text('El Afiliado y sus beneficiarios podrán hacer uso gratuito de las instalaciones', 195, 640)
        doc.text('para FULL DAY todos los fines de semana y feriados (sin reserva). Inclusive Teniendo 4 veces al año', 60, 650)
        doc.text('la Zona de Camping y Parrilla TOTALMENTE GRATIS para uso del Titular y sus Beneficiarios directos', 60, 660)
        doc.text('(bajo reserva). Con la posibilidad de poder llevar invitados los cuales tendrán el beneficio de pago al 50%.', 60, 670)

        doc.text('Adicionalmente también tendrán descuentos en Restaurante (10%), Servicios (20%) y Zona de', 60, 690)
        doc.text('Camping y Parrilla Extras (50%)', 60, 700)

        doc.setFont('Arial', "bold");
        doc.setFontSize(12);
        doc.text('Beneficiarios Adicionales:', 60, 720)
        doc.setFont('Arial', "normal");
        doc.text('El afiliado podrá adherir a su membresía hasta 3 beneficiarios adicionales.', 200, 720)
        doc.text('El costo de cada uno de ellos será USD$ 50 por año.', 60, 730)

        doc.setFont('Arial', "bold");
        doc.addImage(inresorts_low, 60, 740, 100, 60);
        doc.setFontSize(12);
        doc.text('                                     ___________________________________________          ', 100, 770)
        doc.text('                                       El Afiliado', 110, 785)
        doc.text('                                       Nombres Y Apellidos', 110, 795)

        doc.setFont('Arial', 'normal');
        doc.setFontSize(9);
        doc.text('(**) No disponible ni feriados, ni semana larga. (**) Beneficio activo desde Inauguración del Resort.', 100, 810)
        doc.text('(***) Sujeto a cambios que RCI podría realizar en el tiempo. (****) Afiliación por 1 año, luego de ello,', 100, 820)
        doc.text('el socio puede decidir permanecer en el Club Internacional bajo un costo anual extra.', 100, 830)


        doc.save("PLAN_DE_BENEFICIOS_INRESORTS.pdf")
    }

    jsPdfGenerator5 = () => {

        const unit = 'pt';
        const size = 'A4';
        const orientation = 'portrait';

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const img = new Image;

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('PAGARÉ CODIGO:  ' + this.state.user.username, 200, 60)
        doc.text('POR UN VALOR DE ( ' + this.state.pricetotalLetter + ' )', 70, 80)
        doc.text('( ' + this.state.price + ' USD) ESTE VALOR ES EL SALDO A FINANCIAR', 150, 100)
        doc.setFont('Arial', "normal");

        doc.setFontSize(11);
        doc.setFont('Arial', "normal")
        doc.text('Yo ', 30, 120)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.name + "   " + this.state.user.lastname, 50, 120)
        doc.setFont('Arial', "normal")
        doc.text('identificado(a) con DNI Nº ', 270, 120)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.nroDocument, 400, 120)
        doc.setFont('Arial', "normal")
        doc.text('con domicilio y residencia en ', 30, 130)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.address, 200, 130)
        doc.setFont('Arial', "normal")
        doc.text('Me comprometo a pagar incondicionalmente a VALLE ENCANTADO S.A.C la suma de ', 30, 140)
        doc.setFont('Arial', "bold");
        doc.text(this.state.pricetotalLetter + "           ( " + this.state.price + "      USD )", 30, 150)
        doc.setFont('Arial', "normal")
        doc.text('El pago de dichas cuotas se realizará en Soles a razón del cambio oficial vigente a la fecha en que se efectúe éste.', 30, 160)
        doc.text('En caso de mora y mientras ella subsista pagaré intereses moratorios a la tasa máxima establecida para el periodo', 30, 170)
        doc.text('correspondiente. De igual manera me obligo a pagar todos los gastos y costos de la cobranza judicial.', 30, 180)
        doc.text('En el evento en que el deudor no pague en el plazo estipulado una o más cuotas, el tenedor de este ', 30, 190)
        doc.text('título podrá declarar vencidos todos los plazos de esta obligación y pedir su inmediato pago total o ', 30, 200)
        doc.text('el pago del saldo.', 30, 210)
        doc.text('También acepto que ', 30, 220)
        doc.setFont('Arial', "bold");
        doc.text('VALLE ENCANTADO S.A.C, ', 130, 220)
        doc.setFont('Arial', "normal")
        doc.text('declare de plazo vencido la obligación a la que se refiere', 280, 220)
        doc.text('este pagaré y exigir su pago total en el evento en que sea perseguido judicialmente. El recibo de abono de parciales', 30, 230)
        doc.text('no implica novación y cualquier pago que se efectúe se imputará primero a gastos, penalidades, y por último a capital.', 30, 240)
        doc.text('El suscriptor de este pagaré hace constatar que la obligación de pagarla indivisiblemente y solidariamente subsiste', 30, 250)
        doc.text('en caso de o prórrogas o de cualquier modificación a lo estipulado. El deudor declara que la suma que debe conforme', 30, 260)
        doc.text('a este pagaré, no estará sujeta ni a deducción ni a descuentos de cualquier naturaleza, incluyendo sin limitación', 30, 270)
        doc.text('cualquier impuesto que pueda gravar su pago, por lo tanto, en caso de existir alguna de estas deducciones o', 30, 280)
        doc.text('descuentos, el deudor deberá aumentar la suma a pagar de tal manera que el tenedor reciba siempre el valor estipulado', 30, 290)
        doc.text('del pagaré.El deudor acepta desde ahora el endoso, cesión o transferencia', 30, 300)
        doc.text('que de este pagaré a VALLE ENCANTADO S.A.C. todos los gastos e impuestos relacionados con la suscripción', 30, 310)
        doc.text('de este pagaré serán por cuenta del deudor. ', 30, 320)
        doc.text('Todos los pagos que deban hacerse según este pagaré serán hechos exclusivamente en Soles, a la ', 30, 330)
        doc.setFont('Arial', "bold");
        doc.text('Cuenta Recaudadora Soles BCP N° 191-2606708-0-82', 30, 340)
        doc.setFont('Arial', "normal")
        doc.text('en su oficina central ubicada en ', 295, 340)

        doc.text('Av. Guardia Civil 1321 oficina 602 Surquillo o en Ribera del Río Club Resort ubicada en Mz. B Lt. 72.', 30, 350)
        doc.text('Tercera Etapa - Cieneguilla.', 30, 360)
        doc.text('Todos los cálculos de intereses se efectuarán sobre la base de un año de trescientos sesenta (360) días, en', 30, 370)
        doc.text('cada caso por el número de días efectivamente transcurridos (incluyendo el primer día, pero excluyendo el', 30, 380)
        doc.text('último día) durante el pazo por el cual deban pagarse tale intereses. Si cualquiera de las fechas de pago', 30, 390)
        doc.text('de principal o intereses antes indicadas coincidiera con un día no hábil, se entenderá que el pago respectivo', 30, 400)
        doc.text('deberá ser efectuado el día hábil inmediatamente siguiente.Cualquier referencia en este pagaré al agente', 30, 410)
        doc.text('deberá entenderse efectuada a cualquier tenedor del mismo, sea que lo adquiera por endoso o de otro modo.', 30, 420)
        doc.text('En caso de mora, no será necesario requerimiento alguno para que el Cliente incurra en la misma, de acuerdo', 30, 430)
        doc.text('a lo establecido en el artículo 1333 inciso 1 del Código Civil Peruano. En dicho caso, durante todo el', 30, 440)
        doc.text('periodo el cliente pagara a una tasa equivalente al máximo de interés permitido por la ley, por concepto', 30, 450)
        doc.text(' de interés moratorio.', 30, 460)
        doc.text('De conformidad con lo establecido por el artículo 158.2 concordante con el artículo 52° de la Ley de Títulos', 30, 470)
        doc.text('Valores, este pagaré no requerirá ser protestado por la falta de pago de cualquiera de las cuotas para', 30, 480)
        doc.text('ejercitar las acciones derivadas del mismo. Adicionalmente, el cliente se obliga incondicionalmente a pagar', 30, 490)
        doc.text('al Agente todos los gastos en que éste incurra en razón de incumplimiento, obligándose a pagar sobre éstos', 30, 500)
        doc.text('el mismo interés  moratorio pactado en este pagaré. Asimismo, el cliente acepta las renovaciones y prórrogas', 30, 510)
        doc.text('de vencimiento de este pagaré que el agente considere conveniente efectuar, ya sea por su importe parcial', 30, 520)
        doc.text('o total, aun cuando no hayan sido comunicadas al cliente. Dichas modificaciones serán anotadas en este mismo', 30, 530)
        doc.text('instrumento o en hoja anexa, sin que sea necesaria la suscripción de tal instrumento. ', 30, 540)
        doc.text('Este pagare se devolverá a su cancelación total. Queda expresamente establecido que el domicilio del cliente es', 30, 550)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.address + ' ' + this.state.user.districtAddress, 30, 560)
        doc.setFont('Arial', "normal")


        doc.text('lugar a donde se dirigirán todas las comunicaciones y notificaciones derivadas de este pagaré.', 30, 570)
        doc.text('Queda establecido que las obligaciones contenidas en este pagaré, constituyendo el presente acuerdo pacto', 30, 580)
        doc.text('en contrario a lo dispuesto por el artículo 1233° del Código Civil', 30, 590)
        doc.text('Este pagaré se regirá bajo las leyes de la República del Perú.', 30, 600)
        doc.text('Cualquier acción o procedimiento legal relacionado con y derivado del presente pagaré podrá ser iniciado', 30, 610)
        doc.text('ante los órganos judiciales del Cercado de Lima, Lima, Perú. El cliente renuncia a la', 30, 620)
        doc.text('urisdicción de cualquier otro tribunal que pudiere corresponderle por cualquier otra razón.', 30, 630)
        doc.text('En constancia de lo anterior, se firma el presente pagaré el día', 30, 640)
        doc.setFont('Arial', "bold");
        doc.text(this.state.creationDate, 340, 640)
        doc.setFont('Arial', "normal")

        doc.text('en la ciudad de Lima,El Deudor.', 600, 650)


        doc.setFont('Arial', 'normal');
        doc.setFontSize(13);
        doc.text('                                       _________________________          ', 70, 700)
        doc.text('                                               FIRMA', 70, 715)
        doc.text('                                                DNI: ', 70, 730)
        doc.setFont('Arial', 'bold');
        doc.text(this.state.user.nroDocument, 300, 730)

        doc.save("PAG" + this.state.user.username + ".pdf")
    }
    jsPdfGenerator6 = () => {

        const unit = 'pt';
        const size = 'A4';
        const orientation = 'portrait';

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const img = new Image;


        const headers = [["            ", "         ", "Puntos ", "           ", "            "]];

        const data = this.state.regaliaDirecta.map(elt => [elt.comision, elt.point1, elt.point2, elt.point3, elt.point4]);

        let content = {
            startY: 735,
            head: headers,
            body: data,
            styles: { halign: 'center' }
        };

        const headers2 = [["            ", "         ", "Puntos ", "           ", "            "]];

        const data2 = this.state.regaliaRapido.map(elt => [elt.comision, elt.point1, elt.point2, elt.point3, elt.point4]);

        let content2 = {
            startY: 105,
            head: headers2,
            body: data2,
            styles: { halign: 'center', fontSize: 8 }
        };

        const headers3 = [["            ", "         ", "Puntos ", "           ", "            "]];

        const data3 = this.state.regaliaEquipo.map(elt => [elt.comision, elt.nivel, elt.point1, elt.point2, elt.point3, elt.point4]);

        let content3 = {
            startY: 190,
            head: headers3,
            body: data3,
            styles: { halign: 'center', fontSize: 8 }
        };

        const headers4 = [["  ", "% Comisión por socio Activo ", "Total Activos", "Rama Poder ", "Rama Poder", "Rama Débil", "Rama Débil"]];

        const data4 = this.state.regaliaResidual.map(elt => [elt.nivel, elt.comision, elt.totalActive, elt.strongBranch, elt.strong2Branch, elt.weakBranch, elt.weak2Branch]);

        let content4 = {
            startY: 485,
            head: headers4,
            body: data4,
            styles: { halign: 'center', fontSize: 8 }
        };


        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.setFontSize(14);
        doc.setFont('Arial', "bold");
        doc.text('PLAN DE COMPENSACION INRESORTS', 160, 80)


        doc.setFontSize(12);
        doc.text('A. GLOSARIO', 60, 100)
        doc.text('Es de suma importancia el entendimiento de los términos que explicaremos a continuación para que', 30, 120)
        doc.text('desarrolles al máximo tu negocio y a su vez puedas hacer una correcta duplicación en tu organización.', 30, 135)

        doc.text('Socio de la Red:', 30, 170)
        doc.setFont('Arial', "normal");
        doc.text('Persona que se asocia a InResorts mediante la compra de uno de los paquetes de afiliación', 120, 170)
        doc.text('vigentes, para desarrollar el negocio de redes de mercadeo mediante la plataforma de bienestar que la', 30, 185)
        doc.text('compañía ofrece. Al asociarse se obtiene una posición en la genealogía  de la red y un Código personal', 30, 200)
        doc.text('como Socio Independiente inResorts, que le permitirá consumir disfrutar de los beneficios que brinda la', 30, 215)
        doc.text('Compañía, tener un paquete de acciones y a su vez, registrar a nuevos Socios a la Compañía y a su organización.', 30, 230)

        doc.setFont('Arial', "bold");
        doc.text('Puntos:', 30, 265)
        doc.setFont('Arial', "normal");
        doc.text('Todos los productos de la Compañía tienen asociado, además de un conjunto de precios', 70, 265)
        doc.text('correspondientes a cada país, un puntaje único y universal, el cuál es usado para el cálculo de los', 30, 280)
        doc.text('Volúmenes de Construcción y para las Comisiones de Regalías por niveles. ', 30, 295)

        doc.setFont('Arial', "bold");
        doc.text('Pago Cuota Financiamiento:', 30, 325)
        doc.setFont('Arial', "normal");
        doc.text('Luego de un mes calendario desde su afiliación y posteriormente mes a mes', 190, 325)
        doc.text('durante el tiempo que hallan planificado su financiamiento harán el pago mensual de su cuota de', 30, 340)
        doc.text('financiamiento el solo realizar este pago de manera puntual permitirá a los miembros de la comunidad', 30, 355)
        doc.text('inResorts, mantenerse Activos en el Sistema de Recomendación.', 30, 370)

        doc.setFont('Arial', "bold");
        doc.text('Pago Cuota Fraccionamiento: ', 30, 415)
        doc.setFont('Arial', "normal");
        doc.text('Luego de un mes calendario desde su afiliación y posteriormente mes a mes', 190, 415)
        doc.text('durante el tiempo que hallan planificado el pago de la Membresia, el socio hara el pago mensual', 30, 430)
        doc.text('puntual permitirá a los miembros de la comunidad inResorts, mantenerse Activos en el Sistema de', 30, 445)
        doc.text('Recomendación.', 30, 460)

        doc.setFont('Arial', "bold");
        doc.text('Socio Activo:', 30, 490)
        doc.setFont('Arial', "normal");
        doc.text('Es aquel Socio que ha realizado su Pago de cuota de financiamiento y se encuentra dentro del', 100, 490)
        doc.text('periodo de vigencia del mismo. El Socio Activo acumulará los volúmenes y regalías que su', 30, 505)
        doc.text('organización generen.', 30, 520)


        doc.setFont('Arial', "bold");
        doc.text('Socio Inactivo:', 30, 555)
        doc.setFont('Arial', "normal");
        doc.text('El Socio cae en la situación de Inactivo al día siguiente del vencimiento de pago de', 120, 555)
        doc.text('financiamiento. El Socio Inactivo no acumula volúmenes para rangos ni comisiona de', 30, 570)
        doc.text('lo generado en su Organización durante los días que permaneció Inactivo', 30, 585)


        doc.setFont('Arial', "bold");
        doc.text('Socio Comprimido:', 30, 615)
        doc.setFont('Arial', "normal");
        doc.text('El Socio Inactivo será comprimido y eliminado de la genealogía de la red 3 meses', 140, 615)
        doc.text('calendario después de su último pago de financiamiento ó desde que se afilió a la Compañía.', 30, 630)
        doc.text('Un socio comprimido puede volver a activarse con el pago de su cuota de financiamiento sin', 30, 645)
        doc.text(' embargo este al comprimirse ha perdido su genealogía, podrá volver a escoger Patrocinador y Upline.', 30, 660)

        doc.setFont('Arial', "bold");
        doc.text('Cliente Preferente:', 30, 695)
        doc.setFont('Arial', "normal");
        doc.text('Un socio al desactivarse, podrá disfrutar de algunos beneficios y descuentos. Es ', 140, 695)
        doc.text('considerado cliente preferente, el status después de comprimido.', 30, 710)

        doc.setFont('Arial', "bold");
        doc.text('Amortización:', 30, 740)
        doc.setFont('Arial', "normal");
        doc.text('Son los pagos de capital que el Socio Activo puede realizar adicionalmente a su cuota de pago', 110, 740)
        doc.text('de financiamiento y que gozan de una exoneración de los intereses.', 30, 755)

        doc.setFont('Arial', "bold");
        doc.text('Ciclo Personal:', 30, 790)
        doc.setFont('Arial', "normal");
        doc.text('Se inicia desde el día que te asocias a inResorts y termina un día antes de cumplirse un mes', 115, 790)
        doc.text('calendario y así sucesivamente mes tras mes.', 30, 805)

        doc.addPage();

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('Periodos de Negocio:', 30, 80)
        doc.setFont('Arial', "normal");
        doc.text('* Primer Periodo: Corre desde el día 1, hasta el día 15.', 60, 100)
        doc.text('* Segundo Periodo: Corre del día 16 al último día del mes.', 60, 120)

        doc.setFont('Arial', "bold");
        doc.text('Patrocinador:', 30, 155)
        doc.setFont('Arial', "normal");
        doc.text('Socio que te asoció a inResorts (a la Red)', 120, 155)

        doc.setFont('Arial', "bold");
        doc.text('Patrocinado:', 30, 190)
        doc.setFont('Arial', "normal");
        doc.text('Socio que tú asocias a inResorts', 120, 190)

        doc.setFont('Arial', "bold");
        doc.text('Upline:', 30, 225)
        doc.setFont('Arial', "normal");
        doc.text('Socio que se encuentra arriba tuyo en la red que no siempre es', 75, 225)
        doc.text('el Patrocinador, es decir tu podrías patrocinar a una hermana, pero colocarla debajo de tu mamá.', 30, 240)
        doc.text('En este caso el Patrocinador es el que gana el bono de inicio (comisión por el paquete de inicio).', 30, 255)


        doc.setFont('Arial', "bold");
        doc.text('Línea de Poder:', 30, 290)
        doc.setFont('Arial', "normal");
        doc.text('Es el volumen de tu línea de mayor producción hasta el infinito.', 120, 290)

        doc.setFont('Arial', "bold");
        doc.text('Línea Debil:', 30, 325)
        doc.setFont('Arial', "normal");
        doc.text('Es el volumen de tu línea de menor producción hasta el infinito.', 100, 325)


        doc.setFont('Arial', "bold");
        doc.text('Volumen de Rango:', 30, 360)
        doc.setFont('Arial', "normal");
        doc.text('Es el volumen generado, según la configuración que demanda cada', 140, 360)
        doc.text('Rango. Aquí se puede aprovechar el volumen hasta el infinito.', 30, 375)

        doc.setFont('Arial', "bold");
        doc.text('Volumen Comisionable:', 30, 410)
        doc.setFont('Arial', "normal");
        doc.text('Es el volumen acumulado durante los días que el Socio se encuentra Activo', 150, 410)
        doc.text('* Afiliaciones', 60, 425)
        doc.text('* Pago de cuota de fraccionamiento y/o financiamiento', 60, 435)
        doc.text('* Amortizaciones', 60, 445)
        doc.text('Cada una de ellas genera sus porcentajes correspondientes de acuerdo', 30, 455)
        doc.text('a sus correspondientes Tablas de Regalías según el cuadro de Plan de Pagos.', 30, 470)

        doc.setTextColor(255, 0, 0);
        doc.setFont('Arial', "bold");
        doc.text('NOTA IMPORTANTE:', 30, 495)
        doc.setFont('Arial', "normal");
        doc.text('Si el Socio NO se activa perderá lo generado dentro de los días que se', 160, 495)
        doc.text('mantenga INACTIVO.', 30, 510)
        doc.setTextColor(0, 0, 0);
        doc.text('Ejemplo: Si al socio le tocaba activarse el día 13 y no lo hace hasta el día 16, perderá lo', 30, 535)
        doc.text('generado entre el día 13 al día 16.', 30, 550)


        doc.setFont('Arial', "bold");
        doc.text('Colocación:', 30, 585)
        doc.setFont('Arial', "normal");
        doc.text('Es la acción de asociar a un nuevo Socio y no posicionarlo como frontal tuyo sino colocarlo en', 95, 585)
        doc.text('alguna posición de tu organización. En este caso tu comisionarás la compra de u afiliación (Paquete de Inicio)', 30, 600)
        doc.text('como si fuese tu frontal el primer mes y también paga a la red hacia arriba desde tu frontalidad durante el', 30, 615)
        doc.text('Periodo de Negocio en el que fue asociado. En los posteriores periodos de negocio, el pago de cuota de', 30, 630)
        doc.text('financiamiento y/o fraccionamiento y amortizaciones que aquel socio paga a la red desde su posición de', 30, 645)
        doc.text('colocación hacia arriba y el volumen de puntos también se genera desde la posición de colocación hacia arriba.', 30, 660)


        doc.setFont('Arial', "bold");
        doc.text('B. FORMAS DE GANAR:', 30, 680)
        doc.text('1. REGALIAS POR AFILIACIÓN', 40, 695)
        doc.text('1.1.Regalías por Recomendación Directa:', 60, 710)
        doc.setFont('Arial', "normal");
        doc.text('Como Socio de inResorts cobraras el 20% sobre los puntos.', 280, 710)
        doc.text('generados por cada nuevo socio que patrocines de manera directa a la organización.', 60, 725)

        doc.setFont('Arial');
        doc.autoTable(content);

        doc.addPage();

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('1.2.Regalías por arranque Rápido: ', 60, 80)
        doc.setFont('Arial', "normal");
        doc.text('Todos los Nuevos socios y Nuevos proyectos, tienen 12 meses de', 250, 80)
        doc.text('Arranque Rápido. Este beneficio aplica sobre tus patrocinados directos, de los cuales cobraras', 60, 90)
        doc.text('el 10% EXTRA sobre los puntos generados por cada nuevo socio que patrocines.', 60, 100)

        doc.setFontSize(11);
        doc.setFont('Arial');
        doc.autoTable(content2);
        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('1.3.Regalías por Recomendación de Equipo: ', 60, 175)
        doc.setFont('Arial', "normal");
        doc.text('Como Socio de inResorts cobraras un porcentaje', 290, 175)
        doc.text('de los pagos por afiliación de un nuevo socio, en tu organización, hasta el nivel número 7.', 60, 185)
        doc.setFontSize(11);
        doc.setFont('Arial');
        doc.autoTable(content3);

        doc.setFont('Arial', "normal");
        doc.setFontSize(10);
        doc.text('Rango Socio Inversor - Activa 3 Niveles de Profundidad.', 60, 355)
        doc.text('Rango Plata - Activa 4 Niveles de Profundidad', 60, 365)
        doc.text('Rango Oro - Activa 5 Niveles de Profundidad.', 60, 375)
        doc.text('Rango Zafiro - Activa 6 Niveles de Profundidad.', 60, 385)
        doc.text('Rango Esmeralda - Activa 7 Niveles de Profundidad.', 60, 395)
        doc.text('Rango Diamante - Activa 7 Niveles de Profundidad.', 60, 405)
        doc.text('Rango Diamante Negro - Activa 7 Niveles de Profundidad.', 60, 415)
        doc.text('Rango Diamante Azul - Activa 7 Niveles de Profundidad.', 60, 425)
        doc.text('Rango Doble Diamante - Activa 7 Niveles de Profundidad.', 60, 435)
        doc.text('Rango Triple Diamante - Activa 7 Niveles de Profundidad.', 60, 445)
        doc.text('Rango Diamante Corona - Activa 7 Niveles de Profundidad.', 60, 455)


        doc.setFont('Arial', "bold");
        doc.setFontSize(12);
        doc.text('2. REGALIAS POR RESIDUALES. Por pago de Cuotas de Fraccionamiento, Financiamiento y', 30, 470)
        doc.text('Amortizaciones:', 30, 480)
        doc.setFont('Arial');
        doc.autoTable(content4);

        doc.addPage();

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.setFontSize(10);
        doc.setFont('Arial', "normal");
        doc.text('Rango Plata - Requiere 4 Socios Activos, pagando su cuota de fraccionamiento. Por cada', 60, 80)
        doc.text('uno se Ganará $ 10.50', 60, 90)
        doc.text('Rango Oro - Requiere 12 Socios Activos, pagando su cuota de fraccionamiento. Por cada', 60, 100)
        doc.text('uno se Ganará $ 10.25', 60, 110)
        doc.text('Rango Zafiro - Requiere 30 Socios Activos, pagando su cuota de fraccionamiento. Por cada', 60, 120)
        doc.text('uno se Ganará $ 10.00', 60, 130)
        doc.text('Rango Ruby - Requiere 72 Socios Activos, pagando su cuota de fraccionamiento. Por cada', 60, 140)
        doc.text('uno se Ganará $ 9.75', 60, 150)
        doc.text('Rango Esmeralda - Requiere 180 Socios Activos, pagando su cuota de fraccionamiento. Por', 60, 160)
        doc.text('uno se Ganará $ 9.50', 60, 170)
        doc.text('Rango Diamante - Requiere 432 Socios Activos, pagando su cuota de fraccionamiento. Por', 60, 180)
        doc.text('cada uno se Ganará $ 9.25', 60, 190)
        doc.text('Rango Diamante Negro - Requiere 1,080 Socios Activos, pagando su cuota de fraccionamiento.', 60, 200)
        doc.text('Por cada uno se Ganará $ 9.00', 60, 210)
        doc.text('Rango Diamante Azul - Requiere 2,592 Socios Activos, pagando su cuota de fraccionamiento.', 60, 220)
        doc.text('Por cada uno se Ganará $ 8.75', 60, 230)
        doc.text('Rango Doble Diamante - Requiere 6,480 Socios Activos, pagando su cuota de fraccionamiento.', 60, 240)
        doc.text('Por cada uno se Ganará $ 8.50', 60, 250)
        doc.text('Rango Triple Diamante - Requiere 15,552 Socios Activos, pagando su cuota de fraccionamiento.', 60, 260)
        doc.text('Por cada uno se Ganará $ 8.25', 60, 270)
        doc.text('Rango Diamante Corona - Requiere 38,880 Socios Activos, pagando su cuota de fraccionamiento.', 60, 280)
        doc.text('Por cada uno se Ganará $ 8.00', 60, 290)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('3. REGALIAS PREMIOS Y VIAJES. ', 30, 315)
        doc.setFont('Arial', "normal");
        doc.text('Estos se otorgan al Socio de inResorts que repita un rango por 3', 235, 315)
        doc.text('periodos mensuales, en un lapso de 12 periodos. En caso algún Socio de inResorts califique a un rango', 30, 330)
        doc.text('sin haber calificado a rangos previos los posibles Bonos de Logro de dichos rangos previos serán pagados', 30, 345)
        doc.text('en las comisiones del siguiente periodo de negocio siempre cuando el Socio recalifique de rango o', 30, 360)
        doc.text('califique al rango previo cuyo Bono Logro no haya sido cobrado.', 30, 375)
        doc.setTextColor(0, 0, 255);
        doc.text('El pago del Bono siempre se pagará en el cierre de MES.', 30, 390)
        doc.setTextColor(0, 0, 0);

        doc.setFont('Arial', "bold");
        doc.text('Para Lograr los Bonos de logro de Rango debes de cumplir:', 60, 425)
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Gift Card $ 100:', 60, 440)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de PLATA logrando un Volumen de Rango de 340 puntos', 180, 440)
        doc.text('en un mes. Estar mínimo afiliado a un paquete EXPERIENCE.', 60, 455)

        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Gift Card $ 300: ', 60, 470)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el l Rango de ORO logrando un Volumen de Rango de 1020 puntos', 180, 470)
        doc.text('en un mes. Estar mínimo afiliado a un paquete LIGTH', 60, 485)

        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Tour Nacional (Valorizado en $750):', 60, 500)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de ZAFIRO logrando un', 280, 500)
        doc.text('Volumen de Rango de 2550 puntos en un mes. Estar mínimo afiliado a un paquete STANDARD.', 60, 515)

        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Auto (Valorizado en $ 2250):', 60, 530)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de RUBY logrando un Volumen de', 250, 530)
        doc.text('Rango de 6,120 puntos en un mes. Tener 4 Socios en la Red que tengan el Rango Plata, cada', 60, 545)
        doc.text('uno en una línea distinta, estos socios pueden ser directos o indirectos. Estar mínimo', 60, 560)
        doc.text('afiliado a un paquete VITALICIO', 60, 575)


        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Tour Mundo (Valorizado en $ 4,550):', 60, 590)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de ESMERALDA logrando un', 290, 590)
        doc.text('Volumen de Rango de 15,300 puntos en un mes. Tener 4 Socios en la Red que tengan el Rango Oro,', 60, 605)
        doc.text('cada uno en una línea distinta, estos socios pueden ser directos o indirectos. Estar mínimo ', 60, 620)
        doc.text(' afiliado a un paquete VITALICIO.', 60, 635)


        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Auto (Valorizado en $ 11,500):', 60, 650)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de DIAMANTE logrando un Volumen', 250, 650)
        doc.text('de Rango de 36,720 puntos en un mes. Tener 4 Socios en la Red que tengan  el Rango Zafiro y, cada', 60, 665)
        doc.text('cada uno en una línea distinta, estos socios pueden ser directos o indirectos. Estar mínimo ', 60, 680)
        doc.text(' afiliado a un paquete VITALICIO.', 60, 695)


        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Departamento (Valorizado en $ 30,000):', 60, 710)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de DIAMANTE NEGRO,', 300, 710)
        doc.text('logrando un Volumen de Rango de 91,800 puntos en un mes. Tener 4 Socios en la Red que tengan el Rango', 60, 725)
        doc.text('Ruby, cada uno en una línea distinta, estos socios pueden ser directos o indirectos. Estar mínimo', 60, 740)
        doc.text('afiliado a un paquete VITALICIO.', 60, 755)

        doc.addPage();

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);
        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Cash (Valorizado en $ 70,000):', 60, 80)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de DIAMANTE AZUL logrando un', 260, 80)
        doc.text('Volumen de Rango de 220,320 puntos en un mes. Tener 4 Socios en la Red que tengan el Rango', 60, 95)
        doc.text('Esmeralda, cada uno en una línea distinta, estos socios pueden ser directos o indirectos. Estar mínimo', 60, 110)
        doc.text('afiliado a un paquete VITALICIO.', 60, 125)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Casa (valorizado en $ 150,000): ', 60, 140)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de DOBLE DIAMANTE logrando un', 260, 140)
        doc.text('Volumen de Rango de 550,800 puntos en un mes. Tener 4 Socios en la Red que tengan el Rango', 60, 155)
        doc.text('Diamante, cada uno en una línea distinta, estos socios pueden ser directos o indirectos. Estar mínimo', 60, 170)
        doc.text('afiliado a un paquete VITALICIO.', 60, 185)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Porche + Casa Playa (valorizado en $ 350,000):', 60, 200)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de TRIPLE', 340, 200)
        doc.text('DIAMANTE logrando un Volumen de Rango de 1,321,920 puntos en un mes. Tener 4 Socios en la Red', 60, 215)
        doc.text('que tengan el Rango Diamante Negro, cada uno en una línea distinta, estos socios pueden ser directos', 60, 230)
        doc.text('o indirectos. Estar mínimo afiliado a un paquete VITALICIO.', 60, 245)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono FERRARI + CASH 4500,000 (valorizado $ 750,000):', 60, 260)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Repetir 3 veces el Rango de DIAMANTE', 360, 260)
        doc.text('IMPERIAL, logrando un Volumen de Rango de 3,324,800 puntos en un mes. Tener 4 Socios en la Red', 60, 275)
        doc.text('que tengan el Rango Diamante Azul, cada uno en una línea distinta, estos socios pueden ser directos', 60, 290)
        doc.text('o indirectos. Estar mínimo afiliado a un paquete VITALICIO.', 60, 305)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('4. REGALIAS DE AUTO Y CASA:', 30, 340)
        doc.setFont('Arial', "normal");
        doc.text('se otorga al Socio de inResorts que califiquen a los Rangos que otorgan como', 230, 340)
        doc.text('premios: Autos y Casas. Luego de lo cual, por mantener el Rango, se asignará un pago Mensual.', 60, 355)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Auto 750:', 60, 390)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Se otorgará después de haber obtenido el Auto de Premio, repitiendo el Rango Ruby', 150, 390)
        doc.text('y Esmeralda (Mensualmente son 750 soles), hasta que se culmine el pago del auto.', 60, 405)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Auto 1500:', 60, 420)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Se otorgará después de haber obtenido el Auto de Premio, repitiendo el Rango', 150, 420)
        doc.text('Diamante (Mensualmente son 1500 soles), hasta que se culmine el pago del auto.', 60, 435)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Casa 4500:', 60, 450)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Se otorgará después de haber obtenido el Departamento de Premio, repitiendo el', 150, 450)
        doc.text('Rango Diamante Negro y Azul (Mensualmente son 4500 soles), hasta que se culmine el pago del', 60, 465)
        doc.text('departamento. Al llegar al Rango Diamante Azul se otorga un BONO CASH por $ 70,000. Este debe', 60, 480)
        doc.text('ser usado para amortiguar la deuda del Departamento al 100%.', 60, 495)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(255, 0, 0);
        doc.text('Bono Casa 7500:', 60, 510)
        doc.setTextColor(0, 0, 0);
        doc.setFont('Arial', "normal");
        doc.text('Se otorgará después de haber obtenido la Casa de Premio, repitiendo el Rango', 150, 510)
        doc.text('Doble y Triple Diamante (Mensualmente son 7500 soles), hasta que se culmine el pago de la CASA. Al', 60, 525)
        doc.text('legar al Rango Diamante IMPERIAL se otorga un BONO CASH por $ 500,000. Este debe ser usado', 60, 540)
        doc.text('para amortiguar la deuda de la Casa al 100%.', 60, 5655)

        doc.addPage();
        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('C. PAQUETES DE INICIO ', 30, 80)
        doc.text('Tenemos 6 paquetes de Inicio: ', 30, 95)
        doc.setFont('Arial', "normal");
        doc.addImage(packages, 70, 100, 450, 300);
        doc.text('Los mismo que irán variando su valor, en función el desarrollo vaya avanzando en ejecución.', 30, 415)

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('Descuento de protección PAYOUT:', 30, 445)
        doc.setFont('Arial', "normal");
        doc.text('El Payout es la proporción de comisiones y bonos que se pueden pagar como porcentaje de la de la Red,', 30, 460)
        doc.text('en el caso de inResorts el plan tiene como disposición pagar hasta un 50% ya que Afiliación total o el', 30, 475)
        doc.text('Volumen total de pagos de financiamiento y amortizaciones que se realicen dentro de no ser así', 30, 490)
        doc.text('financieramente este podría colapsar, para lo cual se establece el siguiente procedimiento. ', 30, 505)
        doc.setTextColor(255, 0, 0);

        doc.text('Se dividirá el excedente entre todos los socios activos de la Red que tengan comisiones, este descuento', 30, 520)
        doc.text('se hará PROPORCIONALMENTE A LAS COMISIONES ', 30, 535)
        doc.setTextColor(0, 0, 0);
        doc.text('La empresa se reserva el derecho a modificar las escalas de incentivos en cualquier momento,', 30, 570)
        doc.text('y sin previo aviso, segúnloestime conveniente. Dedarse cambios, estossecomunicarán  con una', 30, 585)
        doc.text('antelaciónde a lo menos un mes a su entrada en vigencia.', 30, 600)

        doc.save("PLAN_COMPENSACION_INRESORTS.pdf")
    }
    jsPdfGenerator7 = () => {

        const unit = 'pt';
        const size = 'A4';
        const orientation = 'portrait';

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const img = new Image;
        const headers = [["ID del Desarrollo", "Número de Unidad", "Tipo de Unidad /Capacidad", "Capacidad Maxima", "Semana Minimo", "Tipo de Número", "Uso No. de (Anual Par, Anual Non)", "Años de Semanas", "Propiedad", "Temporada"]];

        const data = this.state.vacationalPeriod.map(e => [e.id, e.unity, e.type, e.maxCapacity, e.numberType, e.use, e.yearinWeeks, e.property, e.season]);

        let content = {
            startY: 385,
            head: headers,
            body: data,
            styles: { fontSize: 6 },
        };

        doc.addImage(RCI, 20, 15, 120, 70);

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.setTextColor(0, 0, 0);
        doc.text('CONTRATO DE SUSCRIPCIÓN Y MEMBRESÍA AL PROGRAMA RCI® WEEKS', 130, 60)
        doc.setDrawColor(255, 0, 0);
        doc.setLineWidth(3);
        doc.line(30, 85, 550, 85);
        doc.setFont('Arial', "normal");

        doc.setFontSize(8);
        doc.text('RCI Argentina Inc., Sucursal Argentina', 30, 100)
        doc.text('Nombre del Desarrollo _______________________ Resort ID# _________________ Fecha:___________', 30, 115)
        doc.text('Nombre del Propietario #1', 30, 130)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.name, 170, 130)
        doc.text(this.state.user.lastname, 300, 130)
        doc.setFont('Arial', "normal");
        doc.text('Nombre del Copropietario #2', 30, 145)
        doc.text('Fecha de Nacimiento #1', 30, 160)
        doc.setFont('Arial', "bold");
        doc.text(Validation.convertDateToString(this.state.user.birthdate), 150, 160)
        doc.setFont('Arial', "normal");
        doc.text('Fecha de Nacimiento #2: ________________ ', 300, 160)

        doc.text('Nacionalidad #1:___________________ ', 30, 175)
        doc.text('Nacionalidad #2:___________________ ', 300, 175)

        doc.text('Los Co-Propietarios que no vivan en el mismo domicilio deberán llenar y firmar un ', 30, 190)
        doc.text('Contrato de Suscripción y Membresía y pagar la Cuota Anual por separado.', 30, 205)
        doc.text('Dirección.', 30, 220)
        doc.setFont('Arial', "bold");
        doc.text(this.state.user.address, 100, 220)
        doc.setFont('Arial', "normal");
        doc.text('País:', 30, 235)
        doc.setFont('Arial', "bold");
        doc.text(this.state.userNationality, 100, 235)


        doc.setFont('Arial', "normal");

        doc.text('Ciudad:', 200, 235)
        doc.setFont('Arial', "bold");

        doc.text(this.state.user.districtAddress, 270, 235)
        doc.setFont('Arial', "normal");

        doc.text('Teléfono Casa: ', 30, 250)
        doc.setFont('Arial', "bold");

        doc.text(this.state.user.phone, 100, 250)
        doc.setFont('Arial', "normal");

        doc.text('Teléfono Oficina #1 ____________________ ', 200, 250)

        doc.text('Correo Electrónico #1 ', 30, 265)
        doc.setFont('Arial', "bold");

        doc.text(this.state.user.email, 150, 265)
        doc.setFont('Arial', "normal");

        doc.text('Correo Electrónico #2 ', 300, 265)

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(3);
        doc.line(60, 275, 550, 275);

        doc.text('Soy o he sido Socio RCI®     Si', 30, 290)
        doc.rect(170, 280, 15, 15);
        doc.text('No', 190, 290)
        doc.rect(210, 280, 15, 15);
        doc.text('Actualmente soy Socio RCI®     Si', 230, 290)
        doc.rect(380, 280, 15, 15);
        doc.text('No', 410, 290)
        doc.rect(430, 280, 15, 15);
        doc.text('He recibido mi ejemplar del Directorio de Desarrollos Afiliados RCI               Si', 30, 305)
        doc.rect(340, 295, 15, 15);
        doc.text('No', 390, 305)
        doc.rect(410, 295, 15, 15);

        doc.text('ID del Socio # _______                 Nombre del Desarrollo _____________', 30, 320)

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(3);
        doc.line(60, 330, 550, 330);

        doc.text('INFORMACIÓN DEL PERIODO VACACIONAL ADQUIRIDO', 150, 345)
        doc.text('Por favor, llene los siguientes datos, los compradores de tiempo flotante deberán indicar: tipo de unidad, capacidad, número de semanas', 30, 360)
        doc.text('y el color de la temporada, de acuerdo a la clasificación de colores preestablecida por RCI para su Desarrollo.', 30, 375)

        doc.autoTable(content);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(3);
        doc.line(60, 470, 550, 470);
        doc.setFontSize(8);

        doc.text('El Socio RCI® acepta y entiende que el Poder de Intercambio del Depósito es el Valor que RCI otorga a: (i) los Períodos Vacacionales de los Socios en el momento que', 30, 490)
        doc.text('éste realiza el Depósito en el Sistema de Intercambio RCI; y (ii) una Combinación de Depósitos. El Poder de Intercambio del Depósito puede variar de Depósito a Depósito y', 30, 500)
        doc.text('de tiempo en tiempo, de conformidad con lo señalado en los presentes Términos y Condiciones.Para determinar el Poder de Intercambio del Depósito y el Poder de', 30, 510)
        doc.text('Intercambio del Inventario RCI considerará los siguientes componentes:', 30, 520)
        doc.text('*La oferta, demanda, clasificación de grupo y uso del Período Vacacional Depositado y el Desarrollo Afiliado y la región geográfica donde se encuentra ubicado el Período', 30, 535)
        doc.text('Vacacional Depositado', 30, 545)
        doc.text('*La temporada del Período Vacacional Depositado', 30, 555)
        doc.text('*El tamaño y tipo de Unidad Depositada (es decir, número de recámaras, tipo de cocina y Ocupación Máxima/Privada de la Unidad física).', 30, 565)
        doc.text('*Los Resultados de la Tarjeta de Comentarios del Desarrollo Afiliado. Las Tarjetas de Comentarios son solicitadas por RCI a los Socios RCI con el objeto de obtener', 30, 575)
        doc.text('información de cada Desarrollo Afiliado que participa en el Programa de Intercambio.', 30, 585)
        doc.text('* El número de días corridos a transcurrir entre la fecha del Depósito y fecha de inicio del Período Vacacional Depositado. De conformidad con lo señalado en los Términos', 30, 595)
        doc.text('y Condiciones al realizar el Depósito de su Semana, el Poder de Intercambio del Depósito será Confirmado, el cual puede variar de Depósito en Depósito y de año en año;', 30, 605)
        doc.text('información complementaria como la gráfica Reporte de Actividad del Programa RCI Weeks la encontrará en www.rci.com o contacte a su Guía Vacacional.', 30, 615)
        doc.text('El Socio RCI® reconoce y acepta que el servicio que reciba como consecuencia de la firma de este Contrato de Suscripción y Membresía se suministrará por el Centro de', 30, 630)
        doc.text('Atención en la región/país que corresponda a su domicilio, servicio que se proporcionará vía telefónica durante horarios de atención a través de Guías Vacacionales que', 30, 640)
        doc.text('hablen su mismo idioma. Asimismo el Socio RCI® reconoce y acepta que (i) el Centro de Atención que le corresponde es el señalado en el los Términos y Condiciones de la', 30, 650)
        doc.text('Membresía RCI®, y (ii) que las cuotas que deba pagar por los servicios que solicite de acuerdo con lo previsto en los Términos y Condiciones de la Membresía RCI® serán', 30, 660)
        doc.text('cobradas conforme a las cuotas vigentes y aplicables que correspondan a dicha oficina RCI regional. El Socio RCI® acepta y ratifica sujetarse a los Términos y Condiciones', 30, 670)
        doc.text('de la Membresía RCI® publicados en www.rci.com; y expresamente emite su consentimiento y entendimiento del contenido y alcance de los mismos al realizar y/o solicitar', 30, 680)
        doc.text('cualquier Depósito, Intercambio y/o servicio derivado de su Membresía. El Socio RCI® acepta y entiende que los términos y condiciones de su Membresía han sido', 30, 690)
        doc.text('impresos en distintas versiones e idiomas, asimismo acepta que los Términos y Condiciones de la Membresía RCI® vigentes y aplicables según su país de residencia se', 30, 700)
        doc.text('encuentran disponibles en www.rci.com. Los Socios RCI® cuya residencia no sea norteamericana y/o canadiense, se sujetarán a la versión en español de estos términos y', 30, 710)
        doc.text('condiciones. Asimismo los Socios RCI® cuya residencia sea norteamericana y/o canadiense se sujetarán a los términos y condiciones vigentes y aplicables por RCI, LLC', 30, 720)

        doc.setDrawColor(255, 0, 0);
        doc.setLineWidth(3);
        doc.line(20, 735, 160, 735);



        doc.setFont('Arial', "normal");
        doc.text("Uso del Desarrollo", 20, 745)
        doc.text("# Años __________Monto___________", 20, 755)
        doc.text("Nueva Venta", 20, 765)
        doc.rect(70, 760, 10, 10);
        doc.text("Conversión", 100, 765)
        doc.rect(140, 760, 10, 10);
        doc.text("SS", 20, 775)
        doc.rect(40, 770, 10, 10);
        doc.text("FDI", 85, 775)
        doc.rect(110, 770, 10, 10);
        doc.text("Signature Selections) (First Day Incentive)", 20, 790)
        doc.text("DBW", 20, 800)
        doc.rect(50, 795, 10, 10);
        doc.text("(Developer Bonus Week)", 20, 815)

        doc.setDrawColor(255, 0, 0);
        doc.setLineWidth(3);
        doc.line(20, 825, 160, 825);

        doc.setDrawColor(0, 0, 0);

        doc.setFont('Arial', "bold");
        doc.text("Membresía RCI®/ Autorización de Pago", 250, 745)
        doc.setFont('Arial', "normal");
        doc.text('Acepto que la vigencia inicial de mi Membresía RCI® será por: 1', 200, 765)
        doc.rect(420, 755, 10, 10);
        doc.text("2", 440, 765)
        doc.rect(450, 755, 10, 10);
        doc.text("3", 470, 765)
        doc.rect(490, 755, 10, 10);
        doc.text("5", 510, 765)
        doc.rect(530, 755, 10, 10);
        doc.text("años", 550, 765)

        doc.text('Fecha y Aclaración del Socio RCI® ______________________________', 250, 775)
        doc.text('Acepto y declaro haber recibido una copia completa de Términos y Condiciones de la Membresía RCI®', 250, 790)
        doc.text('Fecha y Aclaración del Copropietario _____________________________________________', 250, 805)

        doc.save("RCI" + this.state.user.username + ".pdf")
    }
    jsPdfGenerator8 = () => {

        const unit = 'pt';
        const size = 'A4';
        const orientation = 'portrait';

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const img = new Image;

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.setFontSize(12);
        doc.setFont('Arial', "bold");
        doc.text('Reglamento de Ética y Manual de Imagen Corporativa', 120, 80)
        doc.setFont('Arial', "normal");

        doc.setFontSize(11);
        doc.text('Primera Edición', 30, 95)
        doc.text('Lima, Perú.', 30, 110)
        doc.text('Derechos Reservados ©. Prohibida la reproducción por cualquier medio, total o parcial.', 30, 125)
        doc.text('Diseño y Contenido sujeto a Actualización. Válido para la Gestión 2018', 30, 140)

        doc.setFont('Arial', "bold");
        doc.text('Introducción', 30, 165)
        doc.setFont('Arial', "normal")
        doc.text('El Sistema de Venta Multinivel de inRestors está basado en el desarrollo de las buenas prácticas', 30, 180)
        doc.text('transparencia y honestidad. El entendimiento relacionado a cómo debe comportarse una persona', 30, 195)
        doc.text('en determinadas situaciones, es la razón fundamental para contar con un Código de Ética al', 30, 210)
        doc.text('interior de la institución.', 30, 225)
        doc.text('Toda conducta humana afecta a nuestro entorno y, por ello, es necesario reglamentar principios', 30, 245)
        doc.text('que permitan al individuo actuar bajo ciertas normas que regulen su conducta; en este caso', 30, 260)
        doc.text('específico, dentro del Sistema Multinivel de inResorts.', 30, 275)

        doc.text('Un Código de Ética permite que los individuos alcancen los más altos estándares dentro de un', 30, 295)
        doc.text('determinado comportamiento o acción. En ese sentido, este instrumento ayudará a obtener la', 30, 310)
        doc.text('excelencia de todas las personas y permitirá que una cultura empresarial funcione mejor como un todo.', 30, 325)

        doc.setFont('Arial', "bold");
        doc.text('Objetivo General', 30, 345)
        doc.setFont('Arial', "normal")
        doc.text('El presente Código de Ética tiene como objetivo unificar y fortalecer las relaciones humanas de los', 30, 365)
        doc.text('Asesores de Inversión Independientes (En adelante Networkers) con las prácticas y objetivos que', 30, 380)
        doc.text('cumplen con los más altos estándares morales y profesionales.', 30, 395)
        doc.text('El ejercicio de los principios que se desarrollan a continuación en el presente Código de Ética', 30, 415)
        doc.text('fortalecerá y fomentará una cultura de honestidad, transparencia y legalidad en las relaciones de', 30, 430)
        doc.text('los Networkers con los clientes. De esta manera, los Networkers comparten el compromiso', 30, 445)
        doc.text('enarbolado en el presente Código, y lo observan en cada una de las actividades que desarrollan.', 30, 460)

        doc.setFont('Arial', "bold");
        doc.text('Definición de Multinivel', 30, 485)
        doc.setFont('Arial', "normal")
        doc.text('El multinivel es una estrategia de marketing para la comercialización de bienes o servicios en la', 30, 505)
        doc.text('que los Networkers no solo son retribuidos, por las ventas que ellos mismos generan sino también', 30, 520)
        doc.text('por lo que generan sus equipos en varios niveles descendentes.', 30, 535)

        doc.setFont('Arial', "bold");
        doc.text('Definición de Networker', 30, 560)
        doc.setFont('Arial', "normal")
        doc.text('Es un Inversionista Independiente que realiza trabajos de atracción y prospección de clientes y', 30, 580)
        doc.text('nuevos Agentes Inversionistas, conforme a las reglas de ética de acuerdo a los principios', 30, 595)
        doc.text('contemplados en el presente Código de Ética, ejerciendo sus actividades de forma independiente,', 30, 610)
        doc.text('no existiendo por ende relación de dependencia laboral con inResorts, esto de manera privada o', 30, 625)
        doc.text('(empresas o grupos independientes), quienes a cambio de su actividad le reintegran una comisión', 30, 640)
        doc.text('económica acordada previamente por ambas partes.', 30, 655)


        doc.setFont('Arial', "bold");
        doc.text('Definición de Patrocinador Y UPLINE.', 30, 680)
        doc.setFont('Arial', "normal")
        doc.text('Patrocinador, es la persona que lo invito a la compañía. UPline, es la persona debajo de la cual un', 30, 700)
        doc.text('nuevo networker se va situra en la estructura multinivel, el Patrocinador puede ser la misma', 30, 715)
        doc.text('persona que sea tu UPLINE.', 30, 730)

        doc.setFont('Arial', "bold");
        doc.text('Presentación del Código de Ética del Sistema Multinivel.', 30, 755)
        doc.setFont('Arial', "normal")
        doc.text('Muchos temas y situaciones a los que se enfrentan diariamente los Networkers pueden situarse', 30, 775)
        doc.text('en las llamadas zonas grises, sobre las cuales pueden existir opiniones diversas, lo que dificulta la', 30, 790)
        doc.text('toma de decisión.', 30, 805)
        doc.addPage();

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.text('La correcta implementación y difusión de un Código de Ética en el Sistema Multinivel en el que se', 30, 80)
        doc.text('desenvuelven, es una forma de clarificar y unificar criterios y políticas empresariales, y es como', 30, 95)
        doc.text('una guía que facilita su trabajo, permitiendo alcanzar los objetivos de la organización, en línea con', 30, 110)
        doc.text('sus intereses económicos individuales, principios y valores.', 30, 125)

        doc.setFont('Arial', "bold");
        doc.text('Normas Éticas que rigen el que hacer del Networker inResort', 30, 150)
        doc.text('1.- PRIMERA REGLA', 30, 175)
        doc.text('TODA PERSONA QUE COMPRE UNO O MÁS PRODUCTOS O SERVICIOS DE INRESORTS (Que', 30, 190)
        doc.text('formen parte de la red de comercialización del Sistema Multinivel) TIENE LA POSIBILIDAD', 30, 205)
        doc.text('OPCIONAL (NO ES OBLIGATORIO) DE REALIZAR EL NEGOCIO.', 30, 220)
        doc.setFont('Arial', "normal")
        doc.text('Si usted recibe algún servicio o compra algún producto de una empresa que sea de inResorts, y a', 30, 235)
        doc.text('su vez compra un Kit de Inicio del Negocio, este le brindara un código, con el cual pueda', 30, 250)
        doc.text('desarrollar el negocio de comercialización de los productos y servicios de inResorts.', 30, 265)

        doc.setFont('Arial', "bold");
        doc.text('2.- SEGUNDA REGLA', 30, 285)
        doc.text('LOS NETWORKERS NO PUEDEN RECIBIR DINERO DE LOS CLIENTES:', 30, 305)
        doc.setFont('Arial', "normal")
        doc.text('Entendido que el trabajo del Networker es contactar al cliente con la empresa, NO PUEDEN NI', 30, 330)
        doc.text('DEBEN RECIBIR DINERO. Si un cliente quiere pagar en efectivo uno o más productos o servicios al', 30, 345)
        doc.text('contado, adelantar cuotas o pagar la cuota inicial de su compra, debe apersonarse por la sección', 30, 360)
        doc.text('Caja en las oficinas de InResorts ó hacerlo a través de las oficinas de las entidades financieras', 30, 375)
        doc.text('habilitadas para tal efecto.', 30, 390)

        doc.text('EN CASO DE INCUMPLIR ESTA NORMA DE ÉTICA, Y COMO PRIMERA LLAMADA DE ATENCIÓN, EL', 30, 425)
        doc.text('NETWORKER SERÁ PASIBLE A UNA SANCIÓN DE 1 MES, pena que incluye el bloqueo de su código,', 30, 440)
        doc.text('con lo cual se verá imposibilitado de vender y ganar comisiones.', 30, 455)

        doc.text('En caso de reincidir, SERÁ SANCIONADO CON 6 MESES del Sistema Multinivel, y si es que existiera', 30, 475)
        doc.text('una tercera ocasión, la empresa prescindirá de sus servicios como vendedor externo de forma vitalicia.', 30, 490)

        doc.text('Si el dinero que recibe el Networker es extraviado o utilizado en otros fines que nada tienen que', 30, 510)
        doc.text('ver con el pago o cancelación del o los productos o servicios, automáticamente se le quitará su', 30, 525)
        doc.text('Multinivel de inResorts y SE LE INICIARÁ UN JUICIO PENAL POR LOS DELITOS TIPIFICADOS EN LAS', 30, 540)
        doc.text('DIVERSAS LEGISLACIONES DEL PAÍS EN EL QUE HUBIESE SIDO COMETIDO EL ILÍCITO.', 30, 555)

        doc.setFont('Arial', "bold");
        doc.text('3.- TERCERA REGLA', 30, 575)
        doc.setFont('Arial', "normal")
        doc.text('NINGÚN NETWORKER, A TIEMPO DE VENDER LOS PRODUCTOS DE INRESORTS, ESTÁ AUTORIZADO', 30, 590)
        doc.text('A MODIFICAR LOS PRECIOS ESTABLECIDOS POR LA EMPRESA', 30, 605)

        doc.text('El Networker solo podrá subir el precio cuando haya pagado la totalidad del costo del mismo y', 30, 620)
        doc.text('este sea de su propiedad o cuando quiera traspasar la deuda de él a otra persona mediante una', 30, 635)
        doc.text('cesión de derechos', 30, 650)
        doc.text('EN CASO DE INCUMPLIR ESTA NORMA DE ÉTICA, EL NETWORKER SERÁ EXPULSADO DEL SISTEMA', 30, 675)
        doc.text('MULTINIVEL.', 30, 690)

        doc.setFont('Arial', "bold");
        doc.text('4.- CUARTA REGLA', 30, 710)
        doc.setFont('Arial', "normal")
        doc.text('QUEDA TOTALMENTE PROHIBIDO QUE UN CÓDIGO MIGRE DE UN EQUIPO A OTRO. Si una persona', 30, 730)
        doc.text('ingresa al Multinivel bajo el código de un Networker, por ningún concepto podrá migrar de la', 30, 745)

        doc.text('estructura de ese Networker, salvo en las siguientes excepciones:', 30, 760)
        doc.text('A- Puede migrar un código de un equipo a otro cuando exista un caso de contravención por parte', 30, 780)
        doc.text('del Networker titular del código bajo el cual ingreso al multinivel, entendiéndose como', 30, 795)


        doc.addPage();

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.text('contravención al acto que va en contra de lo legalmente establecido y que, por lo tanto, puede', 30, 80)
        doc.text('fectar a las personas que se encuentran bajo su estructura.', 30, 95)
        doc.text('B- También podrá un código migrar de un grupo a otro cuando se trate de parentescos por', 30, 115)
        doc.text('consanguinidad, como ser el caso de que una persona en condición de hija, no sabía o no se había', 30, 130)
        doc.text('dado cuenta que su padre, madre o hermanos ya eran parte del Multinivel, por lo tanto', 30, 145)
        doc.text('automáticamente migra y se sitúan bajo el liderazgo del familiar más antiguo en el negocio, No ES', 30, 160)
        doc.text('OBLIGATORIO, es opcional en el entendido que los padres, hijos y hermanos deberian estar juntos.', 30, 175)
        doc.text('C- Si a un cliente le presentaron el Multinivel de InResorts, mediante cenas de negocios o', 30, 195)
        doc.text('presentaciones personales del mismo, de manera reciente, y luego el cliente es atendido', 30, 210)
        doc.text('nuevamente, pero por otro Networker vendedor en un lapso no mayor a los 15 días desde la', 30, 225)
        doc.text('última presentación, el cliente le corresponde al que le invitó primero y, por lo tanto, puede', 30, 240)
        doc.text('realizarse la migración del código bajo el patrocinio correcto.', 30, 255)

        doc.setFont('Arial', "bold");
        doc.text('5.- QUINTA REGLA', 30, 275)
        doc.setFont('Arial', "normal")

        doc.text('SI UNA PERSONA DEJA DE TENER UNA INVERSION ACTIVA QUE LE VINCULA A INRESORTS, A LOS 3', 30, 295)
        doc.text('MESES DE ELLO, AUTOMÁTICAMENTE PIERDE SU CODIGO, SU RED Y ESTE ES DADO DE BAJA.', 30, 310)
        doc.text('SI QUISIERA REINCORPORARSE, tendrá que hacerlo a través de su patrocinador inicial, pero si el', 30, 330)
        doc.text('Networker quiere hacerlo con otra persona que no sea la que le vendió inicialmente, TIENE QUE', 30, 345)
        doc.text('ESPERAR 6 MESES PARA REINTEGRARSE AL NEGOCIO (180 días), computable a partir del día que', 30, 360)
        doc.text('fue dado de baja', 30, 375)

        doc.text('Luego de reincorporarse, la persona ya no recupera su estructura de vendedores en el Multinivel,', 30, 395)
        doc.text('pues esta migra de forma vertical ascendente a su patrocinador inmediato.', 30, 410)
        doc.text('no prohíbe la venta a terceros de sus productos o servicios adquiridos en InResorts, simplemente', 30, 425)
        doc.text('representa que para que una persona cuente con un código en su Sistema Multinivel, debe', 30, 440)
        doc.text('mantener por los menos una inversión en un producto o servicio activo bajo su nombre.', 30, 455)

        doc.setFont('Arial', "bold");
        doc.text('6.- SEXTA REGLA', 30, 475)
        doc.setFont('Arial', "normal")


        doc.text('Si una persona decide retirarse del negocio o no mantiene activo una inversión por mas de 3', 30, 495)
        doc.text('meses con Inresorts, todo su equipo de trabajo pasa a su UPLINE de negocio, por lo tanto, LAS', 30, 510)
        doc.text('CADENAS MIGRAN VERTICALMENTE Y NO DE FORMAHORIZONTAL', 30, 525)

        doc.setFont('Arial', "bold");
        doc.text('7.- SETIMA REGLA', 30, 555)
        doc.setFont('Arial', "normal")


        doc.text('SI UNA PERSONA DECIDE DEJAR LA ACTIVIDAD COMERCIAL (NO VENDER MÁS), NO PIERDE SU', 30, 575)
        doc.text('PRODUCTO O SERVICIO.', 30, 590)
        doc.text('Cualquier persona que tenga sus cuotas al día tiene el derecho a gozar de su producto o servicio', 30, 620)
        doc.text('que haya comprado en inResorts y una vez cancelada la suma total tiene el derecho a realizar con', 30, 635)

        doc.text('ello, lo que estime conveniente, dentro de los límites legales pertinentes.', 30, 650)
        doc.text('EL ÚNICO INCONVENIENTE DE DEJAR LA ACTIVIDAD COMERCIAL ES LA PÉRDIDA DE SU RED DE', 30, 670)
        doc.text('NETWORKERS, Y NO ASÍ LA PÉRDIDA DEL PRODUCTO O SERVICIO COMPRADO.', 30, 685)

        doc.setFont('Arial', "bold");
        doc.text('8.- OCTAVA REGLA', 30, 705)
        doc.setFont('Arial', "normal")


        doc.text('EL COMPORTAMIENTO DEL NETWORKER DEBE REGIRSE CONFORME A LAS SIGUIENTES PREMISAS', 30, 725)
        doc.text('8.2. Nunca anteponer el beneficio propio al del cliente', 30, 740)
        doc.text('8.3. No mentir para lograr una venta.', 30, 755)
        doc.text('8.4. Ser honesto; la honestidad crea confianza.', 30, 770)
        doc.text('8.5. Ser íntegro', 30, 785)
        doc.text('8.6. Tratar a todos los clientes por igual, con respeto y educación.', 30, 800)


        doc.addPage();

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);

        doc.text('8.7. Regirse de acuerdo a las disposiciones legales municipales, estatales y federales del país en e', 30, 80)
        doc.text('que se desarrollen sus actividades como Networker, así como por las estipuladas en el presente', 30, 95)
        doc.text('Código de Ética.', 30, 105)


        doc.setFont('Arial', 'bold');
        doc.text('9.- NOVENA REGLA', 30, 120)
        doc.setFont('Arial', 'normal')
        doc.text('ESTÁ PROHIBIDA CUALQUIER PROMOCIÓN ADICIONAL, INCENTIVO, PREMIO, BONO, ETC., QUE', 30, 140)
        doc.text('QUIERA HACER CUALQUIER CO-PROPIETARIO PARA CON SU GRUPO DE TRABAJO, ORIENTADO A LA', 30, 155)
        doc.text('VENTA DE PRODUCTOS O SERVICIOS.', 30, 170)
        doc.text('La única manera de que esto suceda es teniendo la autorización expresa y por escrito de algún', 30, 190)
        doc.text('funcionario jerárquico de inResorts.', 30, 205)

        doc.setFont('Arial', 'bold');
        doc.text('10.- DÉCIMA REGLA', 30, 225)
        doc.setFont('Arial', 'normal')
        doc.text('INRESORTS NO EMITIRÁ NINGÚN TIPO DE CERTIFICADO DE TRABAJO A NINGÚN NETWORKERR, ya', 30, 245)
        doc.text('que no existe ningún tipo de dependencia laboral directa con la empresa, toda vez que un', 30, 260)
        doc.text('Networker es una persona que realiza trabajos de manera autónoma e independiente a inResorts.', 30, 275)

        doc.setFont('Arial', 'bold');
        doc.text('11.- DÉCIMO PRIMERA REGLA', 30, 295)
        doc.setFont('Arial', 'normal')
        doc.text('UN MATRIMONIO, AL COMPRAR UN PRODUCTO O SERVICIO DE INRESORTS puede tener un código', 30, 315)
        doc.text('mixto y en caso de desearlo también pueden adquirir un código extra a nombre de uno de los dos.', 30, 330)
        doc.text('(En caso de que esto suceda desaparece del código mixto el nombre del que tenga el segundo código).', 30, 345)

        doc.text('En caso de que la pareja gane algún premio, bono o cheque solo será entregado al titular y no a la', 30, 365)
        doc.text('segunda persona registrada en el código mixto.', 30, 380)

        doc.setFont('Arial', 'bold');
        doc.text('12.- DÉCIMO SEGUNDA REGLA', 30, 400)
        doc.setFont('Arial', 'normal')
        doc.text('TODA PERSONA QUE QUIERA COMPRAR UN PRODUCTO O SERVICIO EN INRESORTS, ES LIBRE DE', 30, 420)
        doc.text('HACERLO. INRESORTS NO DISCRIMINA a personas de diferentes clases sociales, preferencia sexual', 30, 445)
        doc.text('raza o credo religioso. Es muy respetuoso de la normativa jurídica que rige la vida institucional del país', 30, 460)

        doc.text('Los únicos requisitos es que la persona sea mayor de edad (o legalmente constituida en el caso de', 30, 475)
        doc.text('personas jurídicas), que en caso de ser extranjeros su situación migratoria se encuentre regular en', 30, 490)
        doc.text('el país, que no tenga problemas con la justicia y que el origen de sus recursos económicos sean lícitos.', 30, 505)

        doc.setFont('Arial', 'bold');
        doc.text('13.- DÉCIMO TERCERA REGLA', 30, 525)
        doc.setFont('Arial', 'normal')
        doc.text('UNA PERSONA SÓLO PODRÁ REGISTRARSE CON AQUEL NETWORKER QUE LE PROMOCIONÓ LA', 30, 545)
        doc.text('OPORTUNIDAD DE NEGOCIO, entendiéndose esta última como:', 30, 560)
        doc.text('Presentaciones en la oficina, cena de negocios o presentación personal CON REGISTRO DE', 30, 580)
        doc.text('INSCRIPCIÓN (que detalle el nombre de la persona que asiste, el nombre de quien lo invitó y su', 30, 595)
        doc.text('número de teléfono). También es considerado como prueba un video o foto en una presentación.', 30, 610)
        doc.text('SI NO HUBIERA REGISTRO O EVIDENCIAS, NO SERÁ CONSIDERADA UNA PRESENTACIÓN.', 30, 625)

        doc.text('A la persona que se realizó la promoción del negocio, algún producto o algún servicio de inResorts', 30, 645)
        doc.text('no se podrá registrar con otra ajena al primero que le presentó hasta pasado 15 días calendarios.', 30, 660)

        doc.text('Si volviera pasado los 15 días a una nueva presentación, podrá ingresar bajo el patrocinio de otra', 30, 675)
        doc.text('persona (en este caso el segundo que lo invitó).', 30, 690)

        doc.text('El seguimiento que el patrocinador haga a un prospecto de cliente, contempla redes sociales. Es decir que', 30, 710)
        doc.text('se validará el seguimiento por correo electrónico, Whatsapp, Facebook, Viber, Line, y otra similar.', 30, 725)

        doc.addPage();

        doc.addImage(ribera_low, 20, 5, 120, 60);
        doc.addImage(inresorts_low, 200, 5, 120, 60);
        doc.addImage(logoInClub, 430, 5, 120, 60);


        doc.setFont('Arial', 'bold');
        doc.text('14.- DÉCIMO CUARTA REGLA', 30, 80)
        doc.setFont('Arial', 'normal')
        doc.text('QUEDA TERMINANTEMENTE PROHIBIDA LA MANIPULACIÓN DE UNA PERSONA PARA DESVIARLA', 30, 100)
        doc.text('A OTRO CÓDIGO VENDEDOR, DÁNDOLE DINERO COMO PRÉSTAMO O REGALÁNDOLE EL MONTO', 30, 115)
        doc.text('DE SU CUOTA INICIAL.', 30, 130)


        doc.text('Si un patrocinador invita a una persona a una presentación y el líder de otro equipo le da dinero a ésta para', 30, 150)
        doc.text('la cuota inicial con la finalidad de tenerlo bajo su estructura, SERÁ PASIBLE A UNA SANCIÓN DE UN', 30, 165)
        doc.text('MES, pena que incluye el bloqueo de su código, con lo cual se verá imposibilitado de vender comisiones.', 30, 180)

        doc.setFont('Arial', 'bold');
        doc.text('15.- DÉCIMO QUINTA REGLA', 30, 200)
        doc.setFont('Arial', 'normal')
        doc.text('CON EXCEPCIÓN DE ACTIVIDADES DE MULTINIVEL EN OTROS EMPRESAS PARA LA VENTA DE', 30, 220)
        doc.text('BIENES Y O SERVICIOS SIMILARES A LOS COMERCIALIZADOS POR INRESORTS, LOS NETWORKERS', 30, 235)

        doc.text('PUEDEN REALIZAR CUALQUIER TIPO DE ACTIVIDAD COMERCIAL O LABORAL AJENA AL NEGOCIO DE', 30, 250)
        doc.text('INRESORTS, siempre y cuando no utilice las instalaciones de la empresa para realizar la misma. En', 30, 265)
        doc.text('el caso de que una persona ingresara o provenga de otro sistema multinivel y utilice sus relaciones', 30, 280)
        doc.text('personales para invitar al mismo a uno o más de los ASESORES DE INVERSION INDEPENDIENTE de', 30, 295)
        doc.text('InResorts, ya sea de forma directa o indirecta, será considerado como acto de deslealtad,', 30, 310)
        doc.text('quedando expulsado automáticamente del negocio, perdiendo su código, red, además', 30, 325)
        doc.text('inhabilitarse permanentemente de participar en el negocio de Multinivel de inResorts', 30, 340)
        doc.text('manteniendo únicamente el bien o servicio adquirido.', 30, 355)

        doc.text('En caso que una persona desee abandonar la comercialización de los productos del Sistema', 30, 375)
        doc.text('Multinivel de inResorts y quiera comenzar actividades en otra empresa de multinivel, deberá', 30, 390)
        doc.text('presentar una carta al departamento de Atención al Cliente anunciando su retiro. En caso de que', 30, 405)
        doc.text('no lo haga y sea sorprendido invitando personas a formar parte de su nueva empresa, inResorts se', 30, 420)
        doc.text('reserva el derecho de hacer pública la expulsión de su persona.', 30, 435)
        doc.text('Si el Networker, es un líder de inResorts o rango Esmeralda en adelante; no puede participar de', 30, 450)
        doc.text('otro multinivel, por ética y liderazgo.', 30, 465)










        doc.save("Reglamento_de_Ética_inResorts.pdf")
    }





    render() {
        const { suscription, loading, loadSuscription, message, loadModal } = this.state;
        return (
            <div>
                {loading &&
                    <div>
                        <Spinner animation="border" variant="dark">
                        </Spinner>
                        <p>Cargando la información de contratos.</p>
                    </div>}
                <Table responsive>
                    <thead className="table-head">
                        <tr>
                            <th>N° Ítem</th>
                            <th>Tipo de Paquete de Suscripción</th>
                            <th>Producto o Servicio adquirido</th>
                            <th>Fecha de adquisición</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getRegister()}

                    </tbody>
                </Table>
                <Modal
                    size="lg"
                    show={this.state.showModal}
                    onHide={this.handleClose}
                    style={{ fontSize: 12 }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Documentos Generados</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <br></br>
                        <Row><Col>
                            <Table responsive>
                                <thead className="table-head">
                                    <tr>
                                        <th>N° Item</th>
                                        <th>Tipo de Documento</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {this.state.idFamilyPackage === 1 &&
                                    <tbody>


                                        <tr>
                                            <td>1°</td>
                                            <td>Certificado</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator}>Ver Documento</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2°</td>
                                            <td>Contrato</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator2}>Ver Documento</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3°</td>
                                            <td>Cronograma de Pago</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator3}>Ver Documento</Button>
                                            </td>
                                        </tr>


                                    </tbody>

                                }
                                {this.state.idFamilyPackage === 2 &&


                                    <tbody>
                                        <tr>
                                            <td>1°</td>
                                            <td>Certificado</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator}>Ver Documento</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2°</td>
                                            <td>Contrato</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator2}>Ver Documento</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3°</td>
                                            <td>Cronograma de Pago</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator3}>Ver Documento</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4°</td>
                                            <td>Plan de Beneficios</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator4}>Ver Documento</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>5°</td>
                                            <td>Pagaré</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator5}>Ver Documento</Button>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>6°</td>
                                            <td>Contrato de RCI</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator7}>Ver Documento</Button>
                                            </td>
                                        </tr>


                                    </tbody>

                                }
                                {this.state.idFamilyPackage === 50 &&

                                    <tbody>


                                        <tr>
                                            <td>1°</td>
                                            <td>Plan de Compensación Inresorts</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator6}>Ver Documento</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>8°</td>
                                            <td>Reglamento de Ética</td>
                                            <td>
                                                <Button variant="info" size="sm" onClick={this.jsPdfGenerator8}>Ver Documento</Button>
                                            </td>
                                        </tr>

                                    </tbody>

                                }

                            </Table>
                        </Col></Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cerrar
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}