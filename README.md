>[!IMPORTANT]
>Mejorado el HTML para mayor Seguridad.

>[!TIP]
>Para validar ahora debes colocar tus datos en una función aparte, es importante el Dinamismo pero la seguridad es Primero.

>Antes: `<input type="text" class="input" id='nombre' data-priv='required' data-type='nombre' data-nombre_per='Nombre de la Persona' placeholder='Ingresa Tu Nombre'>`

>Ahora: `<input type="text" class="input" id='nombre' placeholder='Ingresa Tu Nombre'>`
>
>JS que Va a Validar los Datos: `let newData = {};
	newData["nombre"] = {"tipo":"nombre","valor": data.nombre, "nombre_per": "Nombre Usuario", "privi": "required"};`

Esto con el fin de que la información no quede tan expuesta.

>[!IMPORTANT]
>Ver el Archivo [script.js](script.js) para entender mejor lo que digo.
