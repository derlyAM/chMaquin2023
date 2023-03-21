export class LineaPrueba {

    index = 0;
    instrucciones = []
    infEtiq = []
    infVariable = []
    memory = []

    async runLineaLinea(memory, runInstrc, infEtiq, infVariable) {
        this.index = 0
        this.instrucciones = []
        this.infEtiq = []
        this.infVariable = []
        this.memory = []
        this.instrucciones = runInstrc
        this.infEtiq = infEtiq
        this.infVariable = infVariable
        this.memory = memory
        alert('Valor de memoria -> ' + memory)

        const box = document.getElementById("box");
        this.showElement(this.memory, this.instrucciones, this.infEtiq, this.infVariable, this.index);

        await new Promise((resolve) => {
            document.getElementById("nextButton").addEventListener("click",
                (e) => {
                    e.preventDefault();
                    if (this.index >= this.instrucciones.length - 1) {
                        resolve();
                    }
                    this.showElement(memory, this.instrucciones, this.infEtiq, this.infVariable, this.index)
                    this.index = this.index + 1;
                });
            return;
        });


    }

    // Función para mostrar el elemento del array en el cuadro
    showElement(memory, runinstrc, infEtiq, infVariable, posicion) {
        console.log("ESTA ES LA LINEA EN LA QUE SE ENCUENTRA-->", runinstrc[posicion])
        box.innerHTML = runinstrc[posicion];
        this.runPrograma(memory, runinstrc, infEtiq, infVariable, posicion);
    }

    runPrograma(memory, runinstrc, infEtiq, infVariable, posicion) {

        // Creamos el objeto para usar la clase de operaciones
        //let calseOperaciones = new Operaciones();
        console.log("ENTRO A RUNPROGRAMA");

        let operaNumeros = ["sume", "reste",
            "multiplique",
            "divida", "potencia",
            "modulo"];
        let instruc = ["cargue", "almacene",
            "lea", "muestre",
            "imprima"];

        let logicas = ["Y", "O", "NO"];
        let operaString = ["concatene", "elimine", "extraiga"];

        let ciclos = ["vaya", "vayasi"]

        // mostrar en pantalla el contenido del array de esa pocision.
        box.innerHTML = runinstrc[posicion];

        // cargar el valor del acumulador.

        // correr las instrucciones.

        let i = posicion
        console.log("POSICION QUE ENTRO.", i)
        let inst = runinstrc[i].split(" ");
        if ((i[0] == '/' && i[1] != '/')) {
            console.log("Es un comentario con el siguiente contenido: --->", i)
        }

        else if (inst[0] === "retorne") {
            console.log("EL PROGRAMA TERMINO")
            memory[0] = 0;

            if (i = runinstrc.length - 1) {
                return
            }
        }

        else if (operaNumeros.includes(inst[0])) {
            let result = this.funOperNum(runinstrc[i], memory, infVariable)
            memory = result[0];
            infVariable = result[1];
        }

        else if (logicas.includes(inst[0])) {
            let result = this.funLogic(runinstrc[i], memory, infVariable)
            memory = result[0];
            infVariable = result[1];
        }

        else if (ciclos.includes(inst[0])) {
            if (inst[0] === "vaya") {
                //devolver el contador del for al valor que tiene la etiqueta
                let jsonEtiqueta = infEtiq.filter(elemento => elemento.nombre === inst[1]);
                if (jsonEtiqueta.length === 0) {
                    throw new Error(`la etiqueta al que se desea acceder no existe`);
                } else {
                    i = parseInt(jsonEtiqueta[0].posicionInstrucciones) - 1;
                    this.index = i;
                }

            }

            if (inst[0] === "vayasi") {
                //devolver el contador del for al valor que tiene la etiqueta
                console.log("Esta es la informacion de las etiquetas", infEtiq)
                console.log("EL ACUMULADOR VA EN EL SIGUIENTE VALOR---->", memory[0])
                let jsonEtiquetaUno = infEtiq.filter(elemento => elemento.nombre === inst[1]);
                let jsonEtiquetaDos = infEtiq.filter(elemento => elemento.nombre === inst[2]);
                if (jsonEtiquetaUno.length === 0 || jsonEtiquetaDos.length === 0) {
                    throw new Error(`la etiqueta al que se desea acceder no existe`);
                } else {
                    if (memory[0] == 0) {
                        console.log("ENTRO A DONDE EL ACUMULADOR ES CER------->")
                        console.log("VA A LA POSICION DEL ", i = i - 1)
                        i = i - 1;
                    }
                    else if (memory[0] > 0) {
                        console.log("LA POSICION DE LA ETIQUETA QUE ENCUENTRA ES--->")
                        console.log(jsonEtiquetaUno[0].posicionInstrucciones)
                        i = parseInt(jsonEtiquetaUno[0].posicionInstrucciones) - 2;
                        this.index = i;
                        console.log("++++++++++---- valor del indice ------++++++")
                        console.log(this.index)

                    }
                    else if (memory[0] < 0) {
                        console.log("LA POSICION DE LA ETIQUETA QUE ENCUENTRA ES--->")
                        console.log(jsonEtiquetaUno[0].posicionInstrucciones)
                        i = parseInt(jsonEtiquetaUno[0].posicionInstrucciones) - 2;
                        this.index = i;
                    }

                }

            }

        }
        else if (instruc.includes(inst[0])) {
            let result = this.funInstruc(runinstrc[i], memory, infVariable)
            memory = result[0];
            infVariable = result[1];
        }
        //faltan las de abajo

        else if (operaString.includes(inst[0])) {
            let result = this.funOperNum(runinstrc[i], memory, infVariable)
            memory = result[0];
            infVariable = result[1];
        }
        else {
            console.log("No hace nada");
        }
    }


    creacionVariables(memory) {
        // arreglo donde se retornara la memoria e infoVariables
        let retorno = [];
        // aqui se guardaran las variables que creara el usuario
        let infVariables = [];
        // Guardar las variables creadas en memoria
        // saber hasta que posición se ha utilizado de la memoria 
        let ultimaPosicion = -1;
        for (let i = 0; i < memory.length; i++) {
            if (memory[i] !== undefined) {
                ultimaPosicion = i;
            }
        }

        // filtrar las instricciones que contienen la palabra nueva       
        const resultados = this.instrucciones.filter((elemento) => elemento.startsWith("nueva"));

        // guardar las variables en memoria
        resultados.forEach(function (line) {

            let inst = line.split(" ");
            let tamaño = inst.length
            let variable
            let valor
            // nota: el identificador que tiene la variable es por si se carga otro program y este tiene variables con el mismo nombre.
            if (tamaño === 3) {
                if (inst[2] === "I" | inst[2] === "R") {
                    valor = 0
                    memory.push(valor)
                }
                if (inst[2] === "L") {
                    valor = false
                    memory.push(valor)
                }
                if (inst[2] === "C") {
                    valor = " "
                    memory.push(valor)
                }

                variable = {
                    'nombre': inst[1],
                    'posicion': ultimaPosicion + 1,
                    'identificador': ultimaPosicion,
                    'tipo': inst[2],
                    'valor': valor
                }
                infVariables.push(variable)


            } else {
                //console.log("ESTA E SLA MEMORIA NO FUN--->",memory)
                if (inst[2] === "I") {
                    valor = parseInt(inst[3])
                    memory.push(valor)
                }
                if (inst[2] === "R") {
                    valor = parseFloat(inst[3])
                    memory.push(valor)
                }
                if (inst[2] === "L") {
                    valor = Boolean(inst[3])
                    memory.push(valor)
                }
                if (inst[2] === "C") {
                    valor = inst[3]
                    memory.push(valor)
                }

                variable = {
                    'nombre': inst[1],
                    'posicion': ultimaPosicion + 1,
                    'identificador': ultimaPosicion,
                    'tipo': inst[2],
                    'valor': valor
                }
                infVariables.push(variable)
            }

            //console.log("ESTAS SON LAS VARIABLES QUE EXISTEN---->",infVariables)
            ultimaPosicion++;
        })
        retorno.push(memory)
        retorno.push(infVariables)
        return retorno;

    }

    crearEtiquetas(memory) {

        // aqui se guardaran las etiquetas que creara el usuario
        let infEtiqueta = [];
        // Guardar las variables creadas en memoria
        // saber hasta que posición se ha utilizado de la memoria 
        let ultimaPosicion = -1;
        for (let i = 0; i < memory.length; i++) {
            if (memory[i] !== undefined) {
                ultimaPosicion = i;
            }
        }
        //let instruc = this.instrucciones
        // En este caso se debera recorrer las instrucciones con comentarios incluidos
        let instruc = this.instComment

        // filtrar las instricciones que contienen la palabra nueva       
        const resultados = instruc.filter((elemento) => elemento.startsWith("etiqueta"));
        let etiqueta;
        // guardar las etiquetas en un arreglo
        resultados.forEach(function (line) {

            let inst = line.split(" ");

            // nota: el identificador que tiene la variable es por si se carga otro program y este tiene variables con el mismo nombre.
            let instruEtique = instruc[parseInt(inst[2]) - 1]
            etiqueta = {
                'nombre': inst[1],
                'posicionMemoria': memory.findIndex(elemento => elemento === instruEtique),
                'identificador': ultimaPosicion,
                'posicionInstrucciones': inst[2],

            }
            // gurdar en el arreglo de las etiquetas.
            infEtiqueta.push(etiqueta)
            ultimaPosicion++;
        })
        return infEtiqueta
    }

    funOperNum(instruccion, memory, infVariable) {

        let retunrCambios = []
        let inst = instruccion.split(" ");
        let jsonVariable = []
        let nombreVariable
        switch (inst[0]) {
            case "sume":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea sumar no existe`);
                } else {
                    memory[0] = memory[0] + jsonVariable[0].valor
                }

                break;
            case "reste":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea sumar no existe`);
                } else {
                    memory[0] = memory[0] - jsonVariable[0].valor
                    console.log("EN ESTO VA LS RESTA---->", memory[0])
                }
                break;
            case "multiplique":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea sumar no existe`);
                } else {
                    memory[0] = memory[0] * jsonVariable[0].valor
                }
                break;
            case "divida":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    alert('la variable que se desea dividir no existe')
                    throw new Error(`la variable que se desea dividir no existe`);
                } else {
                    if (jsonVariable[0].valor == 0) {
                        alert(`No es posible hacer division por cero`)
                        throw new Error(`No es posible hacer division por cero`);
                    }
                    else {
                        memory[0] = memory[0] / jsonVariable[0].valor
                    }

                }
                break;
            case "potencia":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea hacer potencia no existe`);
                } else {
                    memory[0] = memory[0] ** jsonVariable[0].valor
                }
                break;
            case "modulo":
                let valor = parseInt(inst[1])
                if (!isNaN(valor)) {
                    // cambiamos el valor del acumulador por la opercion ya echa
                    memory[0] = memory[0]%inst[1];                    
                }else{
                    throw new Error(`el parametro pasado a la funcion "modulo" no es valido`);
                }
                break;
            default:
                console.log("No es una instruccion valida");
                break;
        }
        retunrCambios.push(memory)
        retunrCambios.push(infVariable)

        return retunrCambios;

    }

    funInstruc(instruccion, memory, infVariable) {
        let retunrCambios = []
        let inst = instruccion.split(" ");
        let jsonVariable = []
        let nombreVariable
        switch (inst[0]) {
            case "cargue":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea cargar no existe`);
                } else {
                    memory[0] = jsonVariable[0].valor
                }

                break;
            case "almacene":
                console.log("entro alamacene infoVariables---->", infVariable)
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable en la que se desea almacenar no existe`);
                } else {
                    // Buscamos el elemento
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === nombreVariable);

                    // Modificamos el valor en el json
                    cambioInfo.valor = memory[0];

                    console.log("Veamos si modifico el valor --->", infVariable);
                }
                break;
            case "lea":
                // extraemos el nombre de la variable
                nombreVariable = inst[1]
                // valor asignar variable
                let valorVariable = prompt(`Ingrese el valor para la variable ${nombreVariable}`);

                // Buscamos la variable en el json de variables y le cambiamos el valor
                const cambioInfo = infVariable.find(elemento => elemento.nombre === nombreVariable);

                switch (cambioInfo.tipo) {
                    case "I":
                        try {
                            valorVariable = parseInt(valorVariable);
                        } catch (error) {
                            throw new Error(`la variable no es del tipo esperado`);
                        }


                        break;
                    case "R":
                        try {
                            valorVariable = parseFloat(valorVariable);
                        } catch (error) {
                            throw new Error(`la variable no es del tipo esperado`);
                        }

                        break;
                    case "B":
                        if (valorVariable == "1" || valorVariable == "true") {
                            valorVariable = true;
                        }
                        else if (valorVariable == "0" || valorVariable == "false") {
                            valorVariable = false;
                        } else {
                            throw new Error(`la variable no es del tipo esperado`);
                        }

                        break;

                    default:
                        break;
                }

                // Modificamos el valor en el json.
                cambioInfo.valor = valorVariable;
                // extraemos el valor de la posicion en memoria.
                let posicionMemoria = cambioInfo.posicion;
                // Modificamos el valor en memoria.
                memory[posicionMemoria] = valorVariable;


                break;
            case "muestre":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (nombreVariable === "acumulador") {
                    console.log("la variable tiene el valor impreso", memory[0]);
                }
                else if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea cargar no existe`);
                } else {
                    document.getElementById('screen-container').innerHTML = `<p>${jsonVariable[0].valor}</p>`
                    console.log("la variable tiene el valor en pantalla", jsonVariable[0].valor)
                }
                break;
            case "imprima":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);

                if (nombreVariable === "acumulador") {
                    console.log("la variable tiene el valor impreso", memory[0]);
                }
                else if (jsonVariable.length === 0) {
                    throw new Error(`la variable no existe`);
                } else {
                    document.getElementById('printer-container').innerHTML = `<p>${jsonVariable[0].valor}</p>`
                    console.log("la variable tiene el valor impreso", jsonVariable[0].valor)
                }
                break;
            default:
                console.log("No es una instruccion valida");
                break;
        }
        retunrCambios.push(memory)
        retunrCambios.push(infVariable)

        return retunrCambios;

    }

    funLogic(instruccion, memory, infVariable) {

        let retunrCambios = []
        let inst = instruccion.split(" ");
        let jsonVariableUno = [];
        let jsonVariableDos = [];
        let jsonVariableRespuesta = [];

        if (inst[0] === "NO") {
            jsonVariableUno = infVariable.filter(elemento => elemento.nombre === inst[1]);
            jsonVariableDos = infVariable.filter(elemento => elemento.nombre === inst[2]);
        } else {
            jsonVariableUno = infVariable.filter(elemento => elemento.nombre === inst[1]);
            jsonVariableDos = infVariable.filter(elemento => elemento.nombre === inst[2]);
            jsonVariableRespuesta = infVariable.filter(elemento => elemento.nombre === inst[3]);
        }

        switch (inst[0]) {
            case "Y":

                if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0 || jsonVariableRespuesta.length === 0) {
                    throw new Error(`alguna de las variables no se encuentra creada`);
                } else {
                    // operacion
                    let operacion = jsonVariableUno[0].valor & jsonVariableDos[0].valor
                    // Buscamos el la variable que se modificara
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[3]);

                    // Modificamos el valor en el array
                    cambioInfo.valor = operacion;

                    console.log("Veamos si modifico el valor --->", infVariable);

                }
                break;
            case "O":
                if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0 || jsonVariableRespuesta.length === 0) {
                    throw new Error(`alguna de las variables no se encuentra creada`);
                } else {
                    // operacion
                    let operacion = jsonVariableUno[0].valor || jsonVariableDos[0].valor
                    // Buscamos el la variable que se modificara
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[3]);

                    // Modificamos el valor en el array
                    cambioInfo.valor = operacion;

                    console.log("Veamos si modifico el valor --->", infVariable);
                }
                break;
            case "NO":
                if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0) {
                    throw new Error(`alguna de las variables no se encuentra creada`);
                } else {
                    // operacion
                    let operacion = !jsonVariableUno[0].valor
                    // Buscamos el la variable que se modificara
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[2]);

                    // Modificamos el valor en el array
                    cambioInfo.valor = operacion;

                    console.log("Veamos si modifico el valor --->", infVariable);

                }
                break;

            default:
                console.log("No es una instruccion valida");
                break;
        }
        retunrCambios.push(memory)
        retunrCambios.push(infVariable)

        return retunrCambios;

    }

    funOperStr(instruccion, memory, infVariable) { }

}