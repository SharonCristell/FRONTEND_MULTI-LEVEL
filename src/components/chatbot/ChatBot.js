import React, { useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import axios from "axios";

const theme = {
  background: "#f7f7f7",
  // fontFamily: "Roboto",
  headerBgColor: "#142d47",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#ee7521",
  botFontColor: "#fff",
  userBubbleColor: "#8eddea",
  userFontColor: "#4a4a4a",

};

let info = JSON.parse(sessionStorage.getItem("info"));
if(info != undefined){
localStorage.setItem("userDNI", info.nroDocument);
}else{
  localStorage.setItem("userDNI", "");
}
localStorage.setItem("userOption", 7);
function ChatBotIntech(props) {
  const avatar =
    "https://image.freepik.com/vector-gratis/perfil-avatar-hombre-icono-redondo_24640-14044.jpg";
  var info = JSON.parse(sessionStorage.getItem("info"));
  var nroDocument = "";
  if(info != undefined){
      nroDocument = info.nroDocument;
    }
  const [mainUser, setMainUser] = useState(parseInt(props.username));
  const [userDNI, setUserDNI] = useState(nroDocument);
  const [userSponsorDNI, setUserSponsorDNI] = useState("");
  const [userSponsorName, setUserSponsorName] = useState("");
  const [userSponsorDNINew, setUserSponsorDNINew] = useState("");
  const [changeData, setchangeData] = useState("");
  const [userSponsorMembresia, setUserMembresia] = useState("");
  const [userSponsorMembresiaNew, setUserMembresiaNew] = useState("");
  const [userDatoValue, setUserDatoValue] = useState("");
  const [registerDate, setRegisterDate] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userOption, setUserOption] = useState("");
  const [comment, setComment] = useState("");
  const [valid, setValid] = useState(false);
  const [validMessage, setValidMessage] = useState("");

  

  const proxyurl = "";

  // // Production
  // const URL = proxyurl + 'https://api.inresorts.club';

  // Test
  const URL = "http://45.66.156.160:60";

  const firstClean = (val) => {
    localStorage.setItem("userOption", 7);
    localStorage.setItem("userSponsorName", "");
    localStorage.setItem("changeUserName", "");
    localStorage.setItem("userSponsorDNI", "");
    localStorage.setItem("changeUserDNI", "");
    localStorage.setItem("changeName", "");
    localStorage.setItem("changeLastName", "");
    localStorage.setItem("changeNationality", "");
    localStorage.setItem("changeTypeOfDocument", "");
    localStorage.setItem("changeDNI", "");
    localStorage.setItem("changeDateOfBirthdate", "");
    localStorage.setItem("changeSex", "");
    localStorage.setItem("changeEmail", "");
    localStorage.setItem("changeCivilState", "");
    localStorage.setItem("changeAddress", "");
    localStorage.setItem("changeCity", "");
    localStorage.setItem("changeCountry", "");
    localStorage.setItem("changeTelef", "");
    localStorage.setItem("fecha_afiliacion", "");
    localStorage.setItem("fecha_pago_ultima_cuota", "");
    localStorage.setItem("comment", "");
    localStorage.setItem("userEmail", "");
    localStorage.setItem("userDNI", nroDocument);
    localStorage.setItem("membresia_actual", "");
    localStorage.setItem("membresia_nueva", "");
    localStorage.setItem("fecha_migracion", "");
    localStorage.setItem("meses_gracia", "");
    localStorage.setItem("nro_cuotas", "");
    localStorage.setItem("cuota_faltante", "");
    localStorage.setItem("dni_coafiliado_eliminar", "");
    localStorage.setItem("nombre_coafiliado_eliminar", "");
    localStorage.setItem("nombre_nuevo_titular", "");
    localStorage.setItem("documento_nuevo_titular", "");
    localStorage.setItem("fecha_nacimiento_nuevo_titular", "");
    localStorage.setItem("pais_ciudad_nacionalidad_nuevo_titular", "");
    localStorage.setItem("direccion_celular_nuevo_titular", "");
    
    return val;
  };

  const emailIsValid = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

 var validador = "";

  var generateTicket = async () => {
    
    let obj = {
      nameUserModify: localStorage.getItem("changeUserName"),
      dniUserRequesting: localStorage.getItem("userSponsorDNI"),
      dniUserModify: localStorage.getItem("changeUserDNI"),
      memberCurrent: localStorage.getItem("membresia_actual"), 
      memberNew: localStorage.getItem("membresia_nueva"),
      nameNew: localStorage.getItem("changeName"),
      lastName: localStorage.getItem("changeLastName"),
      nationalityNew: localStorage.getItem("changeNationality"),
      typeDoc: localStorage.getItem("changeTypeOfDocument"),
      DNI: localStorage.getItem("changeDNI"),
      birthdate: localStorage.getItem("changeDateOfBirthdate"),
      sex: localStorage.getItem("changeSex"),
      email: localStorage.getItem("changeEmail"),
      civilS: localStorage.getItem("changeCivilState"),
      address: localStorage.getItem("changeAddress"),
      city: localStorage.getItem("changeCity"),
      country: localStorage.getItem("changeCountry"),
      telef: localStorage.getItem("changeTelef")


    }

    console.log(obj);
    
    let dataObj = {
      idUser: mainUser,
      nroDocument: localStorage.getItem("userDNI"),
      idTypeOfTicket: parseInt(localStorage.getItem("userOption")),
      newValue : JSON.stringify(obj),
      
      obv: localStorage.getItem("comment"),
      email: localStorage.getItem("userEmail")
    };
  
    console.log("dataObj: ", dataObj);

    axios
      .post(URL + "/api/Ticket/generateticket", dataObj, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res + " creado ticket");
        firstClean();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendAfter = () => {
    setTimeout(() => {
      generateTicket();
    }, 1000);
  };

  const validateDNI =  (value) => {

    let usernameObj = {
      username: value,
    };

    axios
      .post(URL + "/api/User/availableuser/", usernameObj, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("res: ", res)
        if(res.data.objModel == 2) {
          validador = "Existe";
          setValidMessage("Existe");
          console.log("valid", validador);
        } else if(res.data.objModel == 1){
          validador = "No se puede";
          setValidMessage("No se puede");
          console.log("valid", validador);
        }
        else {
          setValidMessage("No existe");
         validador = "No existe";
          console.log("valid", validador);
          localStorage.setItem("userDNI", "");
        }
        
      })


  };



  const steps = [
    {
      id: "1",
      message: `Bienvenido ${props.user_id} a tu asistente virtual, ¿En qué te podemos ayudar?`,
      trigger: "2",
    },
    {
      id: "2",
      message: `¿Deseas consultar datos de tu cuenta o de otro usuario?`,
      trigger: () => firstClean("3"),
    },
    {
      id: "3",
      options: [
        { value: 1, label: `Mi cuenta (${props.username})`, trigger: "4" },
        { value: 2, label: "Otro usuario", trigger: "5" },
      ],
    },
    {
      id: "4",
      message: "¿Genial, en que podemos ayudarte?",
      
      trigger: "7",
    },
    {
      id: "5",
      message: "Por favor indica el Número de documento del usuario",
      trigger: "5-a",
    },
    {
      id: "5-a",
      user: true,
      validator: (value) => {
        localStorage.setItem("userDNI", value);
        console.log(localStorage.getItem("userDNI"));
        validateDNI(value);
        return true;
      },
      trigger: () => validador.toString() == "Existe" ? "6" : "6no",
      metadata: { id: "firstUserDni" },
    },
    {
      id: "6",
      message:
        "perfecto, el número de documento es {previousValue}, en que te puedo ayudar?",
      trigger: 7,
      end: false,
    },
    {
      id: "6no",
      message:
        "Lo sentimos, este usuario no existe o no se puede modificar" ,
      trigger: 5,
      end: false,
    },
    {
      id: "7",
      options: [
        {
          value: 1,
          label: `Modificar patrocinador`,
          trigger: "1aC3",
          onClick: () => setUserOption(1),
        },
        {
          value: 2,
          label: "Modificar membresía",
          trigger: "2a",
          onClick: () => setUserOption(2),
        },
        {
          value: 3,
          label: "Corregir datos",
          trigger: "3adv",
          onClick: () => setUserOption(3),
        },
        /*{
          value: 4,
          label: "Actualizar cronogramas",
          trigger: "4a",
          onClick: () => setUserOption(4),
        },*/
        /*{
          value: 5,
          label: "Eliminar co-afiliado",
          trigger: "5a",
          onClick: () => setUserOption(5),
        },*/
        /*{
          value: 6,
          label: "Traspaso de membresía",
          trigger: "6a",
          onClick: () => setUserOption(6),
        },*/
        {
          value: 7,
          label: "Aparezco inactivo",
          trigger: "final",
          onClick: () => setUserOption(7),
        },
        /*{
          value: 8,
          label: "Un socio no aparece en mi lista",
          trigger: "8a",
          onClick: () => setUserOption(8),
        },*/
        /*{
          value: 9,
          label: "No se ha actualizado mi migración",
          trigger: "9a",
          onClick: () => setUserOption(9),
        },*/
        /*{
          value: 10,
          label: "Solicitud de periodo de gracia",
          trigger: "10a",
          onClick: () => setUserOption(10),
        },*/
      ],
    },

    //FINAL FLUJO Seleccion

    {
      id: "1aC3",
      message:
        "Indica el DNI de tu patrocinador correcto",
      trigger: "1b",
    },
    {
      id: "1b",
      user: true,
      validator: (value) => {
        setUserSponsorDNINew(value);
        setUserOption(1);
        localStorage.setItem("changeUserDNI", value);
        localStorage.setItem("userOption", 1);
        return true;
      },
      trigger: "1c",
    },
    {
      id: "1c",
      message:
        "Tu nuevo patrocinador tiene el número de documento: {previousValue}, indicanos su nombre completo",
      trigger: "1d",
    },
    {
      id: "1d",
      user: true,
      validator: (value) => {
        setUserSponsorName(value);
        localStorage.setItem("changeUserName", value);
        return true;
      },
      trigger: "1e",
    },
    {
      id: "1e",
      message:
        "Has solicitado cambiar tu patrocinador a: {previousValue}, ¿es correcta esta información?",
      trigger: "1f",
    },
    {
      id: "1f",
      options: [
        { value: 1, label: "Es correcto", trigger: "final" },
        { value: 2, label: "No es correcto, volver a corregir", trigger: "1aC3" },
      ],
    },

    //FINAL FLUJO 1

    //INICIO FLUJO 2

    {
      id: "2a",
      message:
        "Indica por favor en nombre de la membresía que deseas cambiar (actual)",
      trigger: "2b",
    },
    {
      id: "2b",
      user: true,
      validator: (value) => {
        setUserMembresia(value);
        setUserOption(2);
        localStorage.setItem("membresia_actual", value);
        localStorage.setItem("userOption", 2);
        return true;
      },
      trigger: "2c",
    },
    {
      id: "2c",
      message: "Indica el nombre de la membresía que deseas",
      trigger: "2d",
    },
    {
      id: "2d",
      user: true,
      validator: (value) => {
        setUserMembresiaNew(value);
        localStorage.setItem("membresia_nueva", value);
        return true;
      },
      trigger: "2e",
    },
    {
      id: "2e",
      message:
        "Has solicitado cambiar tu membresía a: {previousValue}, ¿es correcta esta información?",
      trigger: "2f",
    },
    {
      id: "2f",
      options: [
        { value: 1, label: "Es correcto", trigger: "final" },
        { value: 2, label: "No es correcto, volver a corregir", trigger: "2a" },
      ],
    },

    //FINAL FLUJO 2

    {
      id: "3a",
      message:
        "Por favor indica el número de documento de identidad del socio a modificar",
      trigger: "3b",
    },
    {
      id: "3b",
      user: true,
      validator: (value) => {
        setUserDNI(value);
        return true;
      },
      trigger: "3c",
    },
    {
      id: "3c",
      message:
        "El número de documento que ingresaste es {previousValue}, ahora por favor seleciona el dato que deseas modificar: ",
      trigger: "3adv",
    },
    {
      id: "3adv",
      message: `Solo se puede editar 3 datos, en caso de más, se considerará según el orden de vista.`,
      trigger: "3d",
    },
    {
      id: "3d",
      options: [
        { value: 1, label: "Nombre", trigger: "3eNombre" },
        { value: 2, label: "Apellido", trigger: "3eApellido" },
        { value: 3, label: "Nacionalidad", trigger: "3eNacionalidad" },
        {
          value: 4,
          label: "Tipo de documento de identidad (ej. DNI)",
          trigger: "3eTipodocumento",
        },
        {
          value: 5,
          label: "Número de documento de identidad",
          trigger: "3eNroDocumento",
        },
        {
          value: 6,
          label: "Fecha de nacimiento",
          trigger: "3eFechaNacimiento",
        },
        { value: 13, label: "Sexo", trigger: "3eSexo" },
        { value: 8, label: "Estado civil", trigger: "3eEstadoCivil" },
        {
          value: 7,
          label: "Correo electrónico",
          trigger: "3eCorreoElectronico",
        },
        { value: 11, label: "País", trigger: "3ePais" },
        { value: 10, label: "Ciudad", trigger: "3eCiudad" },
        { value: 9, label: "Dirección", trigger: "3eDireccion" },
        { value: 12, label: "Número de celular", trigger: "3eNroCelular" },
      ],
    },
    {
      id: "3eNombre",
      message: "Por favor indica a continuación el nuevo nombre",
      trigger: "3fNombre",
    },
    {
      id: "3fNombre",
      user: true,
      validator: (value) => {
        setUserOption(3); 
        localStorage.setItem("changeName", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gNombre",
    },

    {
      id: "3eApellido",
      message: "Por favor indica a continuación el nuevo apellido",
      trigger: "3fApellido",
    },
    {
      id: "3fApellido",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeLastName", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gApellido",
    },
    {
      id: "3eNacionalidad",
      message: "Por favor indica a continuación la nueva nacionalidad",
      trigger: "3fNacionalidad",
    },
    {
      id: "3fNacionalidad",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeNationality", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gNacionalidad",
    },
    {
      id: "3eTipodocumento",
      message:
        "Por favor indica a continuación el nuevo tipo de documento (ej DNI)",
      trigger: "3fTipodocumento",
    },
    {
      id: "3fTipodocumento",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeTypeOfDocument", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gTipo",
    },
    {
      id: "3eNroDocumento",
      message:
        "Por favor indica a continuación el nuevo número del documento de identidad",
      trigger: "3fNroDocumento",
    },
    {
      id: "3fNroDocumento",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeDNI", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gDocumento",
    },

    {
      id: "3eFechaNacimiento",
      message: "Por favor indica a continuaciónla nueva fecha de nacimiento",
      trigger: "3fFechaNacimiento",
    },
    {
      id: "3fFechaNacimiento",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeDateOfBirthdate", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gFecha",
    },

    {
      id: "3eCorreoElectronico",
      message: "Por favor indica a continuación el nuevo correo electrónico",
      trigger: "3fCorreoElectronico",
    },
    {
      id: "3fCorreoElectronico",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeEmail", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gEmail",
    },
    {
      id: "3eSexo",
      message: "Por favor indica a continuación el nuevo sexo",
      trigger: "3fSexo",
    },
    {
      id: "3fSexo",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeSex", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gSexo",
    },

    {
      id: "3eEstadoCivil",
      message: "Por favor indica a continuación el nuevo Estado civil",
      trigger: "3fEstadoCivil",
    },
    {
      id: "3fEstadoCivil",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeCivilState", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gEstado",
    },
    {
      id: "3eDireccion",
      message: "Por favor indica a continuación la nueva dirección",
      trigger: "3fDireccion",
    },
    {
      id: "3fDireccion",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeAddress", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gDireccion",
    },

    {
      id: "3eCiudad",
      message: "Por favor indica a continuación la nueva Ciudad",
      trigger: "3fCiudad",
    },
    {
      id: "3fCiudad",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeCity", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gCiudad",
    },

    {
      id: "3ePais",
      message: "Por favor indica a continuación el nuevo Pais",
      trigger: "3fPais",
    },
    {
      id: "3fPais",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeCountry", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gPais",
    },
    {
      id: "3eNroCelular",
      message: "Por favor indica a continuación el nuevo número de celular",
      trigger: "3fNroCelular",
    },
    {
      id: "3fNroCelular",
      user: true,
      validator: (value) => {
        setUserOption(3);
        localStorage.setItem("changeTelef", value);
        localStorage.setItem("userOption", 3);
        return true;
      },
      trigger: "3gTelefono",
    },
    {
      id: "3gNombre",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hNombre",
    },
    {
      id: "3gApellido",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hApellido",
    },
    {
      id: "3gNacionalidad",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hNacionalidad",
    },
    {
      id: "3gTipo",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hTipo",
    },
    {
      id: "3gDocumento",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hDocumento",
    },
    {
      id: "3gFecha",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hFecha",
    },
    {
      id: "3gSexo",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hSexo",
    },
    {
      id: "3gEstado",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hEstado",
    },
    {
      id: "3gEmail",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hEmail",
    },
    {
      id: "3gPais",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hPais",
    },
    {
      id: "3gCiudad",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hCiudad",
    },
    {
      id: "3gDireccion",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hDireccion",
    },
    {
      id: "3gTelefono",
      message:
        "Has indicado el valor {previousValue}, ¿es correcta esta información?",
      trigger: "3hTelefono",
    },
    {
      id: "3hNombre",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eNombre" },
      ],
    },
    {
      id: "3hApellido",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eApellido" },
      ],
    },
    {
      id: "3hNacionalidad",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eNacionalidad" },
      ],
    },
    {
      id: "3hTipo",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eTipodocumento" },
      ],
    },
    {
      id: "3hDocumento",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eNroDocumento" },
      ],
    },
    {
      id: "3hFecha",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eFechaNacimiento" },
      ],
    },
    {
      id: "3hSexo",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eSexo" },
      ],
    },
    {
      id: "3hEstado",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eEstadoCivil" },
      ],
    },
    {
      id: "3hEmail",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eCorreoElectronico" },
      ],
    },
    {
      id: "3hPais",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3ePais" },
      ],
    },
    {
      id: "3hCiudad",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eCiudad" },
      ],
    },
    {
      id: "3hDireccion",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eDireccion" },
      ],
    },
    {
      id: "3hTelefono",
      options: [
        { value: 1, label: "Si, es correcto", trigger: "3i" },
        { value: 2, label: "No, deseo corregir el dato", trigger: "3eNroCelular" },
      ],
    },
    {
      id: "3i",
      message: "¿Deseas modificar otro dato?",
      trigger: "3j",
    },
    {
      id: "3j",
      options: [
        { value: 1, label: "Si, quiero corregir otro dato", trigger: "3d" },
        {
          value: 2,
          label: "No, ya he terminado con los datos a corregir",
          trigger: "final",
        },
      ],
    },
    {
      id: "4a",
      options: [
        {value: 1, label: "Actualizar pago de cuotas", trigger: "4a1"},
        {value: 2, label: "Actualizar Migración", trigger: "4a2"}
      ]
    },
    {
      id: "4a1",
      message: "En total he pagado la INICIAL + número de cuotas: ",
      trigger: "4a1a"
    },
    {
      id: "4a1a",
      user: true,
      validator: (value) => {
        localStorage.setItem("nro_cuotas", value);
        localStorage.setItem("userOption", 4);
        return true;
      },
      trigger: "4a1b"
    },
    {
      id: "4a1b",
      message: "Indica el número de cuota que no te aparece en tu cronograma",
      trigger: "4a1c"
    },
    {
      id: "4a1c",
      user: true,
      validator: (value) => {
        localStorage.setItem("cuota_faltante", value);
        localStorage.setItem("userOption", 4);
        return true;
      },
      trigger: "final"
    },
    {
      id: "4a2",
      message: "Indica la membresía que figura en tu Back Office: ",
      trigger: "4a2a"
    },
    {
      id: "4a2a",
      user: true,
      validator: (value) => {
        localStorage.setItem("membresia_actual", value);
        localStorage.setItem("userOption", 4);
        return true;
      },
      trigger: "4a2b"
    },
    {
      id: "4a2b",
      message: "Indica a qué membresía migraste: ",
      trigger: "4a2c"
    },
    {
      id: "4a2c",
      user: true,
      validator: (value) => {
        localStorage.setItem("membresia_nueva", value);
        localStorage.setItem("userOption", 4);
        return true;
      },
      trigger: "4a2d"
    },
    {
      id: "4a2d",
      message: "Indica la fecha en la que solicitaste tu migración",
      trigger: "4a2e"
    },
    {
      id: "4a2e",
      user: true,
      validator: (value) => {
        localStorage.setItem("fecha_migracion", value);
        localStorage.setItem("userOption", 4);
        return true;
      },
      trigger: "final"
    },
    {
      id: "5a",
      message: "Indica el DNI del co-afiliado a eliminar: ",
      trigger: "5a1"
    },
    {
      id: "5a1",
      user: true,
      validator: (value) => {
        localStorage.setItem("dni_coafiliado_eliminar", value);
        localStorage.setItem("userOption", 5);
        return true;
      },
      trigger: "5a2"
    },
    {
      id: "5a2",
      message: "Indica el nombre completo del co-afiliado a eliminar: ",
      trigger: "5a3"
    },
    {
      id: "5a3",
      user: true,
      validator: (value) => {
        localStorage.setItem("nombre_coafiliado_eliminar", value);
        return true;
      },
      trigger: "5a4"
    },
    {
      id: "5a4",
      message: "indica el motivo de la eliminación: ",
      trigger: "5a5"
    },
    {
      id: "5a5",
      user: true,
      validator: (value) => {
        localStorage.setItem("motivo_eliminacion_coafiliado", value);
        return true;
      },
      trigger: "final"
    },
    {
      id: "6a",
      message: "Indica el número de documento de identidad de la persona a la que deseas traspasar la membresía: ",
      trigger: "6a1"
    },
    {
      id: "6a1",
      user: true,
      validator: (value) => {
        localStorage.setItem("changeUserDNI", value);
        localStorage.setItem("userOption", 6);
        return true;
      },
      trigger: "6a2"
    },
    {
      id: "6a2",
      message: "Indica la membresía actual: ",
      trigger: "6a3"
    },
    {
      id: "6a3",
      user: true,
      validator: (value) => {
        localStorage.setItem("membresia_actual", value);
        return true;
      },
      trigger: "6a5"
    },
    {
      id: "6a5",
      message: "Indica nombres y apellidos completos del nuevo titular",
      trigger: "6a6"
    },
    {
      id: "6a6",
      user: true,
      validator: (value) => {
        localStorage.setItem("nombre_nuevo_titular", value);
        return true;
      },
      trigger: "6a7"
    },
    {
      id: "6a7",
      message: "Indica el tipo y número de documento de identidad del nuevo titular: ",
      trigger: "6a8"
    },
    {
      id: "6a8",
      user: true,
      validator: (value) => {
        localStorage.setItem("documento_nuevo_titular", value);
        return true;
      },
      trigger: "6a9"
    },
    {
      id: "6a9",
      message: "Indica la fecha de nacimiento del nuevo titular: ",
      trigger: "6a10"
    },
    {
      id: "6a10",
      user: true,
      validator: (value) => {
        localStorage.setItem("fecha_nacimiento_nuevo_titular", value);
        return true;
      },
      trigger: "6a11"
    },
    {
      id: "6a11",
      message: "Indique por favor la Nacionalidad, País y Ciudad de residencia (separados por comas)",
      trigger: "6a12"
    },
    {
      id: "6a12",
      user: true,
      validator: (value) => {
        localStorage.setItem("pais_ciudad_nacionalidad_nuevo_titular", value);
        return true;
      },
      trigger: "6a13"
    },
    {
      id: "6a13",
      message: "Indica la dirección y número de celular del nuevo titular: ",
      trigger: "6a14"
    },
    {
      id: "6a14",
      user: true,
      validator: (value) => {
        localStorage.setItem("direccion_celular_nuevo_titular", value);
        return true;
      },
      trigger: "final"
    },
    {
      id: "7a",
      message: "Indica por favor la fecha de tu afiliación:",
      trigger: "7b"
    },
    {
      id: "7b",
      user: true,
      validator: (value) => {
        localStorage.setItem("fecha_afiliacion", value);
        localStorage.setItem("userOption", 7);
        return true;
      },
      trigger: "7c"
    },
    {
      id: "7c",
      message: "Indica la fecha de pago de tu última cuota:",
      trigger: "7d"
    },
    {
      id: "7d",
      user: true,
      validator: (value) => {
        localStorage.setItem("fecha_pago_ultima_cuota", value)
        return true;
      },
      trigger: "final"
    },
    {
      id: "8a",
      message: "Indica por favor el documento de identidad del socio que no figura en tu lista: ",
      trigger: "8b"
    },
    {
      id: "8b",
      user: true,
      validator: (value) => {
        localStorage.setItem("changeUserDNI", value)
        localStorage.setItem("userOption", 8);
        return true;
      },
      trigger: "8c"
    },
    {
      id: "8c",
      message: "Indica el nombre completo del socio: ",
      trigger: "8d"
    },
    {
      id: "8d",
      user: true,
      validator: (value) => {
        localStorage.setItem("changeUserName", value)
        return true;
      },
      trigger: "8e"
    },
    {
      id: "8e",
      message: "Indica la fecha en la que inscribiste al socio: ",
      trigger: "8f"
    },
    {
      id: "8f",
      user: true,
      validator: (value) => {
        localStorage.setItem("fecha_afiliacion", value)
        return true;
      },
      trigger: "final"
    },
    {
      id: "9a",
      message: "Indica por favor tu membresía actual: ",
      trigger: "9b"
    },
    {
      id: "9b",
      user: true,
      validator: (value) => {
        localStorage.setItem("membresia_actual", value)
        localStorage.setItem("userOption", 9);
        return true;
      },
      trigger: "9c"
    },
    {
      id: "9c",
      message: "¿A qué membresía has solicitado migrar?",
      trigger: "9d"
    },
    {
      id: "9d",
      user: true,
      validator: (value) => {
        localStorage.setItem("membresia_nueva", value)
        return true;
      },
      trigger: "9e"
    },
    {
      id: "9e",
      message: "indica la fecha de solicitud de migración",
      trigger: "9f"
    },
    {
      id: "9f",
      user: true,
      validator: (value) => {
        localStorage.setItem("fecha_migracion", value)
        return true;
      },
      trigger: "final"
    },
    {
      id: "10a",
      message: "Indica tu membresía actual: ",
      trigger: "10b"
    },
    {
      id: "10b",
      user: true,
      validator: (value) => {
        localStorage.setItem("membresia_actual", value)
        return true;
      },
      trigger: "10c"
    },
    {
      id: "10c",
      message: "Indica tu última fecha de pago",
      trigger: "10d"
    },
    {
      id: "10d",
      user: true,
      validator: (value) => {
        localStorage.setItem("fecha_pago_ultima_cuota", value)
        return true;
      },
      trigger: "10e"
    },
    {
      id: "10e",
      message: "¿A cuantos meses deseas solicitar el periodo de gracia?",
      trigger: "10f"
    },
    {
      id: "10f",
      options: [
        {value: 1, label: "1 mes", trigger: "10fa1"},
        {value: 2, label: "2 meses", trigger: "10fa2"},
        {value: 3, label: "3 meses", trigger: "10fa3"},
      ]
    },
    {
      id: "10fa1",
      message: "Has solicitado 1 mes de gracia, escribe la palabra ´CORRECTO´ para confirmar",
      trigger: "10fa1-2"
    },
    {
      id: "10fa1-2",
      user: true,
      validator: (value) => {
        localStorage.setItem("meses_gracia", "1");
        localStorage.setItem("userOption", 10);
        return true;
      },
      trigger: "final"
    },
    {
      id: "10fa2",
      message: "Has solicitado 2 meses de gracia, recuerda que para este periodo se cobrará una comisión, escribe la palabra ´CORRECTO´ para confirmar",
      trigger: "10fa2-2"
    },
    {
      id: "10fa2-2",
      user: true,
      validator: (value) => {
        localStorage.setItem("meses_gracia", "2");
        localStorage.setItem("userOption", 10);
        return true;
      },
      trigger: "final"
    },
    {
      id: "10fa3",
      message: "Has solicitado 3 meses de gracia, recuerda que para este periodo se cobrará una comisión, escribe la palabra ´CORRECTO´ para confirmar",
      trigger: "10fa3-2"
    },
    {
      id: "10fa3-2",
      user: true,
      validator: (value) => {
        localStorage.setItem("meses_gracia", "3");
        localStorage.setItem("userOption", 10);
        return true;
      },
      trigger: "final"
    },

    {
      id: 12,
      options: [
        /* eslint-disable */
        {
          value: 1,
          label: "Datos correctos, enviar",
          trigger: "final",
        },
        { value: 2, label: "Datos incorrectos, reiniciar", trigger: "1" },
      ],
    },
    {
      id: "final",
      message: "¿Deseas agregar una nota adicional a tu solicitud?",
      trigger: "final-note",
    },
    {
      id: "final-note",
      options: [
        { value: 1, label: "Si", trigger: "finalSendUser" },
        { value: 2, label: "no, no es necesario", trigger: "finalA" },
      ],
    },
    {
      id: "finalSendUser",
      user: true,
      validator: (value) => {
        if (value.length > 200) {
          return "El contenido de la excede los 200 caracteres, por favor escribe una nota más corta";
        } else {
          setComment(value);
          localStorage.setItem("comment", value);
          return true;
        }
      },
      trigger: "finalA",
    },
    {
      id: "finalSend",
      message:
        "Se ha creado correctamente tu solicitud, recibirás respuesta dentro de las siguientes 24 a 48 horas",
      trigger: "final2",
    },
    {
      id: "finalA",
      message:
        "Por favor indica a que correo deseas recibir la respuesta de tu solicitud",
      trigger: "finalA2",
    },
    {
      id: "finalA2",
      user: true,
      validator: (value) => {
        if (emailIsValid(value)) {
          setUserEmail(value);
          localStorage.setItem("userEmail", value);
          sendAfter();
          return true;
        } else {
          return "Correo incorrecto, por favor verifica";
        }
      },
      trigger: "finalSend",
    },
    {
      id: "final2",
      message:
        "Recuerda que los datos deben ser correctos para poder proceder correctamente con tu solicitud. ¿Deseas realizar alguna otra consulta?",
      trigger: "final3",
    },
    {
      id: "final3",
      options: [
        { value: 1, label: "Si, deseo realizar otra solicitud", trigger: "2" },
        { value: 2, label: "No, ya he terminado", trigger: "final4" },
      ],
    },
    {
      id: "final4",
      message:
        "Gracias por usar nuestro asistente virtual, esperamos haberte ayudado.",
      trigger: "final5",
    },
    {
      id: "final5",
      options: [
        {
          value: 1,
          label: "si tienes alguna otra consulta, click aquí",
          trigger: "2",
        },
      ],
    },
  ];

  const sendAll = (value) => {
    console.log("SENDED ALL");
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        floating={true}
        botAvatar={avatar}
        headerTitle={"Asistente Inclub"}
        placeholder={"Selecciona la opción de tu consulta..."}
        //speechSynthesis={{ enable: true, lang: 'es' }}

        steps={steps}
      />
    </ThemeProvider>
  );
}

export default ChatBotIntech;