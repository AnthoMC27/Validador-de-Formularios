//Patrones RegEx
const regex = {
	nombre : /\b[aA-zZ áéíóú]+\b/g,
	texto : /\b[aA-zZ0-9 áéíóú \-:.,/()]+\b/g,
	numero : /[0-9]/g,
	numero_f : /[0-9\.]/g,
	correo : /^([aA-zZ0-9]+@[aA-zZ0-9]+\.[aA-zZ]{2,})$/g,
	numero_tlf : /^(\d{4}-\d{3}-\d{4})/g,
	fecha : /^(\d{4}-\d{2}-\d{2})/g,
	hora : /^(\d{2}:\d{2})/g
}
//
function uvv4 (datos) {
	const ids = Object.keys(datos);
	const valores = Object.values(datos);
	let new_values = {};
	let errors = {};
	let privilegio = {};
	ids.forEach((ID,indexOf) => {
		const {estado,tipo} = isEmpty(valores[indexOf].valor);
		if (estado === true) {
			let {values,error,tipo} = verificar(valores[indexOf],ID);
			if (values) {
				new_values[ID] = values;
				errors[ID] = error;
				privilegio[ID] = tipo;
			} else {
				errors[ID] = error;
				privilegio[ID] = tipo;
			}
		} else {
			let {values, error} = verifyPrivi(valores[indexOf],ID);
			if (values) {
				new_values[ID] = values;
				privilegio[ID] = error;
			} else {
				errors[ID] = error;
				privilegio[ID] = error;
			}
		}
	});
	messages(errors,privilegio);
	let {cleanErrors} = removeUndefined(errors);
	if (cleanErrors.length > 0) {
		return {"values":undefined, "error": cleanErrors, "tipo":privilegio};
	} else {
		return {"values":new_values, "error": cleanErrors, "tipo":privilegio};
	}
}

function verificar (settings,ID) {
	switch (typeof settings.valor) {
		case "string":
			var {values, error, tipo} = verifyType(settings,ID);
			return {"values":values, "error":error, "tipo":tipo};
			break;
		case "number":
			if (Number(settings.valor)) {
				var {values, error, tipo} = verifyType(settings,ID);
				return {values, error, tipo};
			} else {
				var {values, error} = verifyPrivi(settings,ID);
				return {"values": values, "error": "No hay datos Introducidos o Son Invalidos", "tipo": error};
			}
			break;
		case "object":
			var {values, error, tipo} = procesar_objeto(settings,ID);
			return {values, error, tipo};
			break;
		default:
			console.warn("No Encontrado o No Verificado");
			break;
	}
}

function verifyType (settings,ID) {
	const datos = settings.valor;
	const tipo = settings.tipo;
	const nombre_per = settings.nombre_per;
	if (typeof datos === "number") {
		let clean_data = limpiar_datos(datos.toString());
		let datos_validos = clean_data.match(regex[tipo]).join("");
		let decision = comparador(clean_data,datos_validos);
		if (decision ===false ) {
			let {error} = verifyPrivi(settings,ID);
			return {"values":undefined, "error": failMessage(nombre_per), "tipo": error};
		} else {
			if (datos_validos.includes(".")) {				
				return {"values": parseFloat(clean_data), "error": undefined, "tipo":"Positivo"};
			} else {
				return {"values": parseInt(clean_data), "error": undefined, "tipo":"Positivo"};
			}
		}
	} else {
		let clean_data = limpiar_datos(settings.valor);
		if (clean_data.match(regex[tipo]) === null) {
			let {values,error} = verifyPrivi(settings,ID);
			return {"values": undefined, "error": failMessage(nombre_per), "tipo": "Negativo"};
		} else {
			let datos_validos = clean_data.match(regex[tipo]).join(" ");
			let decision = comparador(clean_data,datos_validos);
			if (decision === false) {
				let {values,error} = verifyPrivi(settings,ID);
				return {"values": values, "error": failMessage(nombre_per), "tipo": "Negativo"};
			} else {
				return {"values": clean_data, "error": undefined, "tipo":"Positivo"};
			}
		}
	}
}

function procesar_objeto (settings,ID) {
	let new_data = Object.values(settings.valor);
	let data_array = [];
	let errors = [];
	let privilegio = [];
	new_data.forEach((valores)=>{
		settings.valor = valores;
		let {values, error, tipo} = verificar(settings,ID);
		if (values) {
			data_array.push(values);
			errors.push(error);
			privilegio.push(tipo);
		} else {
			data_array.push(values);
			errors.push(error);
			privilegio.push(tipo);
		}
	});
	let valores_cad = data_array.join(",");
	if (privilegio.includes("Negativo")) {
		return {"values": undefined, "error": failMessage(settings.nombre_per), "tipo": "Negativo"};	
	} else {
		return {"values":valores_cad, "error": undefined, "tipo": privilegio[0]};
	}
}

function limpiar_datos (datos) {
	if (typeof datos === "number") {
		const clean_data = datos;
		return clean_data;
	} else {
		const clean_data = datos.replace(/\s+/g, ' ').trim();
		return clean_data;
	}
}

function comparador (datos,datos_limpios) {
	let longitud_neta = length_data(datos);
	let longitud_limpia = length_data(datos_limpios);
	if (longitud_neta!=longitud_limpia) {
		return false;
	} else {
		return true;
	}
}

function length_data (datos) {
	let {estado,tipo} = isEmpty(datos);
	if (estado === true) {
		const length_datos = datos.split("").length;
		return length_datos;
	} else {
		const length_datos = 0;
		return length_datos;
	}
}

function verifyPrivi (settings,ID) {
	let apodo = settings.nombre_per;
	switch (settings.privi) {
		case "required":
			return {"values": undefined, "error": `El Elemento ${apodo} es Requerido`};
			break;
		case "optional":
			return {"values": "Opcional","error": `El Elemento ${apodo} es Opcional`};
			break;
		default:
			console.log("Ninguna Opción Válida");
			break;
	}
}

function isEmpty (datos) {
	switch (typeof datos) {
		case "string":
			if (datos.trim() === "") {
				return {"estado":false, "tipo": "string"};
			} else {
				return {"estado":true, "tipo": "string"};
			}
			break;
		case "number":
			if (!datos) {
				return {"estado":false, "tipo": "number"};
			} else {
				return {"estado":true, "tipo": "number"};
			}
			break;
		case "array":
			if (datos.length === 0) {
				return {"estado":false, "tipo": "array"};
			} else {
				return {"estado":true, "tipo": "array"};
			}
			break;
		case "object":
			if (Object.keys(datos).length === 0) {
				return {"estado":false, "tipo": "object"};
			} else {
				return {"estado":true, "tipo": "object"};
			}
			break;
		default:
			console.log("Ningun Tipo Esperado");
			break;
	}
}

function messages (errors,tipo) {
	let Fallo = /(Requerido)|(Opcional)|(Positivo)|(Negativo)/g;
	let IDS = Object.keys(tipo);
	let message = Object.values(errors);
	let tipos = Object.values(tipo);
	$(`#messages`).html("");
	IDS.forEach((id,indexOf)=>{
		if (message[indexOf] === undefined) {
			
		} else {
			$(`#messages`).append(`<p class='error' onclick='close_this(this)'>${message[indexOf]}</p>`);
		}
		let similars = tipos[indexOf].match(Fallo).join("");
		switch (similars) {
			case "Requerido":
				$(`#${id}`).css("border-color",'#FF1E33');
				break;
			case "Opcional":
				$(`#${id}`).css("border-color",'#4D4D4D');
				break;
			case "Positivo":
				$(`#${id}`).css("border-color",'#31FF27');
				break;
			case "Negativo":
				$(`#${id}`).css("border-color",'#FF1E33');
				break;
			default:
				console.log("Nothing is Working");
				break;
		}
	});
}

function failMessage (element) {
	return `Falta algún dato o estás usando Caracteres no permitidos en ${element}`;
}

function removeUndefined (data) {
	let errors = Object.values(data);
	let purifiedErrors = [];
	errors.forEach((error,indexOf) => {
		if (error === undefined) {
			
		} else {
			purifiedErrors.push(error);
		}
	});
	return {"cleanErrors": purifiedErrors};
}

function close_this (element) {
 	$(element).remove();
}