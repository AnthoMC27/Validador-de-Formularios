function sendThis (data) {
	console.log("Datos Netos");
	console.log(data);
	let cont = -1;
	/*let object_keys = Object.keys(data);
	let values = Object.values(data);*/
	let newData = {};
	newData["nombre"] = {"tipo":"nombre","valor": data.nombre, "nombre_per": "Nombre Usuario", "privi": "required"};
	newData["edad"] = {"tipo":"numero","valor": data.edad, "nombre_per": "Edad del Usuario", "privi": "required"};
	newData["sexo"] = {"tipo":"nombre","valor": data.sexo, "nombre_per": "Sexo del Usuario", "privi": "required"};
	newData["comida"] = {"tipo":"nombre","valor": data.comida, "nombre_per": "Comida Favorita", "privi": "optional"};
	console.log(newData);
	ultimate_validator_v4(newData);
}