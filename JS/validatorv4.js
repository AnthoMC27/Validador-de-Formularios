//Patrones RegEx
const texto_largo = /\b[aA-zZ0-9 áéíóú \-:.,/()]+\b/g;
const numero_entero = /[0-9]/g;
const numero_flotante = /[0-9\.]/g;
const nombre_un = /\b[aA-zZ áéíóú]+\b/g;
const correo_elec = /^([aA-zZ0-9]+@[aA-zZ0-9]+\.[aA-zZ]{2,})$/g;
const num_tlf = /^(\d{4}-\d{3}-\d{4})/g;
const tiempo_n = /^(\d{2}:\d{2})/g;
const fecha_n = /^(\d{4}-\d{2}-\d{2})/g;
const regex = {
	nombre : nombre_un,
	texto : texto_largo,
	numero : numero_entero,
	numero_f : numero_flotante,
	correo : correo_elec,
	numero_tlf : num_tlf,
	fecha : fecha_n,
	hora : tiempo_n
}
//
function ultimate_validator_v4 (datos) {
	console.log(datos);
	let cont = -1; 
	const ids = Object.keys(datos);
	const valores = Object.values(datos);
	let new_values = {};
	let errors = {};
	let privilegio = {};
	ids.forEach((ID) => {
		cont++;
		console.log(valores[cont].valor);
		let {estado,tipo} = is_Empty(valores[cont].valor);
		console.log(`El elemento: ${ID} es ${estado}, y su Tipo es: ${tipo} || false, si está vacío`);
		if (estado === true) {
			console.log("Verdadero, pase pa lante Rey");
			let {values,error,tipo} = verificar(valores[cont],ID);
			if (Object.values(values).length > 0) {
				new_values[ID] = values;
				errors[ID] = error;
				privilegio[ID] = tipo;
				console.log(values);
			} else {
				errors[ID] = error;
				privilegio[ID] = tipo;
			}
		} else {
			console.log("Falso, Directo A Dirección");
			let {values, error} = verificar_privi(valores[cont],ID);
			if (values) {
				new_values[ID] = values;
				privilegio[ID] = error;
			} else {
				console.log("Algo Muy malo pasa");
				errors[ID] = error;
				privilegio[ID] = error;
			}
		}
	});
	console.log("Valores");
	console.log(new_values);
	console.log("Errores");
	console.log(errors);
	console.log("Privilegios/Estados");
	console.log(privilegio);
	messages(errors,privilegio);
	if (Object.keys(errors).length > 0) {

	} else {
		return {"values":new_values, "error":errors, "tipo":privilegio};
	}	
}

function verificar (settings,ID) {
	console.log(`Verificando: ${settings.valor} del Elemento ${ID} y su Tipo es: ${typeof settings.valor}`);
	switch (typeof settings.valor) {
		case "string":
			var {values, error, tipo} = verificar_tipo(settings,ID);
			return {values, error, tipo};
			break;
		case "number":
			if (Number(settings.valor)) {
				var {values, error, tipo} = verificar_tipo(settings,ID);
				return {values, error, tipo};
			} else {
				var {values, error} = verificar_privi(settings,ID);
				return {"values": values, "error": "No hay datos introducidos o Son Invalidos", "tipo": error};
			}
			break;
		case "object":
			var {values, error, tipo} = procesar_objeto(settings,ID);
			console.log(values);console.log(error);console.log(tipo);
			return {values, error, tipo};
			break;
		default:
			console.warn("No Encontrado o No Verificado");
			break;
	}
}

function verificar_tipo (settings,ID) {
	console.log(`Verificando Tipos: ${settings.valor} de ${ID}`);
	const datos = settings.valor;
	const tipo = settings.tipo;
	const nombre_per = settings.nombre_per;
	if (typeof datos === "number") {
		let clean_data = limpiar_datos(datos.toString());
		let datos_validos = clean_data.match(regex[tipo]).join("");
		console.log(`Datos Válidos: ${datos_validos} Datos Limpios: ${clean_data} Tipo: ${typeof clean_data} Tipo Esperado: ${tipo}`);
		let decision = comparador(clean_data,datos_validos);
		if (decision ===false ) {
			console.log("Algo Falta");
			let {error} = verificar_privi(settings,ID);
			return {"values":undefined, "error":`Falta algún dato o estás usando Caracteres no permitidos en ${nombre_per}`, "tipo": error};
		} else {
			if (datos_validos.includes(".")) {				
				console.log("Exitos Flotantes");
				return {"values": parseFloat(clean_data), "error": undefined, "tipo":"Positivo"};
			} else {
				console.log("Exitos Enteros");
				return {"values": parseInt(clean_data), "error": undefined, "tipo":"Positivo"};
			}
		}
	} else {
		let clean_data = limpiar_datos(settings.valor);
		if (clean_data.match(regex[tipo]) === null) {
			console.log("Error: Es NULL :(");
			let {values,error} = verificar_privi(settings,ID);
			return {"values": values, "error":`Falta algún dato o estás usando Caracteres no permitidos en ${nombre_per}`, "tipo": "Negativo"};
		} else {
			console.log("Passing");
			console.log(clean_data.match(regex[tipo]));
			let datos_validos = clean_data.match(regex[tipo]).join(" ");
			console.log(`Datos Válidos: ${datos_validos} Datos Limpios: ${clean_data} ${typeof clean_data} ${tipo}`);
			let decision = comparador(clean_data,datos_validos);
			if (decision===false) {
				console.log("Algo Falta");
				let {error} = verificar_privi(settings,ID);
				return {"values":undefined, "error":`Falta algún dato o estás usando Caracteres no permitidos en ${nombre_per}`, "tipo": "Negativo"};
			} else {
				console.log("Exitos");
				return {"values":clean_data, "error": undefined, "tipo":"Positivo"};
			}
		}
	}
}

function procesar_objeto (settings,ID) {
	console.log(`Procesando Objt ${settings.valor} de ${ID}`);
	let new_data = Object.values(settings.valor);
	let data_array = [];
	let errors;
	let privilegio;
	new_data.forEach((valores)=>{
		settings.valor = valores;
		let {values, error, tipo} = verificar(settings,ID);
		if (values) {
			console.log('Mensajes de Exito');
			console.log(values);
			console.log(error);
			console.log(tipo);
			data_array.push(values);
			errors = error;
			privilegio = tipo;
		} else {
			console.warn('Mensajes de Fallo');
			console.log(values);
			console.log(error);
			console.log(tipo);
			data_array.push(values);
			errors = error;
			privilegio = tipo;
		}
	});
	let valores_cad = data_array.join(",");
	console.warn('Mensajes de Producción');
	console.log(errors);
	console.log(privilegio.match("/(Negativo)/g"));
	return {"values":valores_cad, "error": errors, "tipo": privilegio};
}

function limpiar_datos (datos) {
	console.log(`Limpiando: ${datos}`);
	if (typeof datos === "number") {
		const clean_data = datos;
		console.log(`Limpio Numero: ${clean_data} y Tipo ${typeof clean_data}`);
		return clean_data;
	} else {
		const clean_data = datos.replace(/\s+/g, ' ').trim();
		console.log(`Limpio: ${clean_data}`);
		return clean_data;
	}
}


function comparador (datos,datos_limpios) {
	console.log(`Comparando ${datos} y ${datos_limpios}`);
	let longitud_neta = length_data(datos);
	let longitud_limpia = length_data(datos_limpios);
	if (longitud_neta!=longitud_limpia) {
		return false;
	} else {
		return true;
	}
}

function length_data (datos) {
	console.log(`Midiendo ${datos}`);
	let {estado,tipo} = is_Empty(datos);
	if (estado === true) {
		const length_datos = datos.split("").length;
		console.log(`Datos Medidos ${length_datos}`);
		return length_datos;
	} else {
		const length_datos = 0;
		console.log(`Datos Medidos ${length_datos}`);
		return length_datos;
	}
}

function verificar_privi (settings,ID) {
	console.log(`Veficando de ${ID}`);
	let apodo = settings.nombre_per;
	switch (settings.privi) {
		case "required":
			return {"values": undefined, "error": `El Elemento ${apodo} es Requerido`};
			break;
		case "optional":
			return {"values": "Opcional","error": `El Elemento ${apodo} es Opcional`};
			break;
		default:
			console.log("Nada captado");
			break;
	}
}

function messages (errors,tipo) {
	console.log("Errores");
	console.log(errors);
	console.log("Tipos");
	console.log(tipo);
	let cont = -1;
	let Fallo = /(Requerido)|(Opcional)|(Positivo)|(Negativo)/g;
	let IDS = Object.keys(tipo);
	let message = Object.values(errors);
	let tipos = Object.values(tipo);
	$(`#messages`).html("");
	IDS.forEach((id)=>{
		cont++;
		if (message[cont] === undefined) {
			
		} else {
			$(`#messages`).append(`<p class='error' onclick='close_this(this)'>${message[cont]}</p>`);
		}
		let similars = tipos[cont].match(Fallo).join("");
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

function is_Empty (datos) {
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

function close_this (button) {
	$(button).remove();
}