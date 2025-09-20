function sendThis (data) {
	console.log("Datos Netos");
	console.log(data);
	let cont = -1;
	let newData = {};
	newData["nombre"] = {"tipo":"nombre","valor": data.nombre, "nombre_per": "Nombre Usuario", "privi": "required"};
	newData["edad"] = {"tipo":"numero","valor": data.edad, "nombre_per": "Edad del Usuario", "privi": "required"};
	newData["sexo"] = {"tipo":"nombre","valor": data.sexo, "nombre_per": "Sexo del Usuario", "privi": "required"};
	newData["comida"] = {"tipo":"nombre","valor": data.comida, "nombre_per": "Comida Favorita", "privi": "required"};
	newData["musica"] = {"tipo":"nombre","valor": data.musica, "nombre_per": "Genero Músical", "privi": "optional"};
	newData["fecha"] = {"tipo":"fecha","valor": data.fecha, "nombre_per": "Fecha Actual", "privi": "required"};
	newData["hora"] = {"tipo":"hora","valor": data.hora, "nombre_per": "Hora Actual", "privi": "required"};
	newData["apellido"] = {"tipo":"nombre","valor": data.apellido, "nombre_per": "Apellido", "privi": "optional"};
	newData["correo"] = {"tipo":"correo","valor": data.correo, "nombre_per": "Correo Electrónico", "privi": "optional"};
	newData["pais"] = {"tipo":"nombre","valor": data.pais, "nombre_per": "País de Nacimiento", "privi": "optional"};
	console.log(newData);
	let {values,error,tipo} = uvv4(newData);
	console.log(values);
	console.error(error);
	console.warn(tipo);
	if (error.length > 0) {
		console.error("Quedan Errores");
	} else {
		console.log("Todo Bien");
	}
}