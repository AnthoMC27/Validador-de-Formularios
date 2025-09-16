>[!IMPORTANT]
>Es Necesario Tener jQuery, no pesa mucho y no choca con otros paquetes (que yo sepa)

Para usarlo hay que seguir ciertas reglas.

    1-) Es necesario tener los siguientes atributos en los elementos que quieras validar:

    1.1-) id: es necesario para agarrar los valores con el jQuery.
    1.2-) data-priv: Este es el Privilegio de eso datos, los disponibles son : required (requerido) y optional (opcional).
    1.3-) data-type: Es el tipo de dato que debería tener ese elemento, los disponibles actualmente son los siguientes:
          nombre: Sólo letras y espacios, no permite carácteres especiales ni otras cosas.
          texto: Letras, Números y algunos carácteres especiales, ya queda al gusto modificarlos y evitar inyecciones.
          numero: Cualquier número entero.
          numero_f: Cualquier número Flotante.
          correo: Correo Electrónico.
          numero_tlf: Número Telefónico en el Formato de mi País Venezuela, puedes adaptar el RegEx al Gusto.
          fecha: El día que pongas en el Input del Tipo Date, este trabaja con el formato yyyy-mm-dd, internacionalmente aceptado.
          hora: Toma la Hora, hh:mm:ss.
    1.4-) data-nombre_per: Nombre Personalizado para el Elemento, esto es para que la función de los mensajes haga referencia al mismo.

Aquí un ejemplo de un elemento:

    <input type="text" class="input" id='nombre' data-priv='required' data-type='nombre' data-nombre_per='Nombre de la Persona' placeholder='Ingresa Tu Nombre'>

>[!TIP]
>Para Activar el Script hay que colocar el evento en un botón con Onclick, es la forma que conozco, ya que con -addEventListener- no podés ingresar los datos de manera directa y tendrias que colocarlos tu mismo, no es el concepto que estoy buscando, pero de igual forma el Validador está sujeto a mejora.

Aquí un Ejemplo del botón a usar:

    <input type="button" value='Revisar' onclick='ultimate_validator_v3({"nombre":$("#nombre").val(),"edad":parseInt($("#edad").val()),"sexo":$("#sexo").val(),"comida":$("#comida").val(),"musica":$("#musica").val(),"apellido":$("#apellido").val(),"pais":$("#pais").val(),"fecha":$("#fecha").val(),"hora":$("#hora").val(),"correo":$("#correo").val()})'>

Para los números, Recomiendo colocar el parseInt o parseFloat, ya que si se usa sólo "val()", este toma el valor cómo un string y no cómo un int o float.

No se preocupen por los Select o Select multiple, el valida todos esos datos.

Para Mostrar los mensajes se requiere un div o cualquier cosa con el Id "messages".

Cuándo corras el ejemplo te darás cuenta.

Psdata: Hice una versión Orientada al envío y recibimiento de archivos con información dentro que se valida también, esta es mi primera vez usando Git y GitHub, así que todavía falta para que pueda subirlo.

Psdata2: Se puede adaptar la sintaxis del botón a solamente un script que tú mismo le das los atributos y no depender tanto del DOM.Ej:

    send_validator(this,{'search':{'tipo':'texto','valor':$('#local').val(),'req':'required'}})

Pero esta alternativa está en desarrollo.
