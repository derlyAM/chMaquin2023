export class InterpreteLinea {

    constructor(memoria, instrucciones, instComment,kernel){
        this.memoria = memoria;
        this.instrucciones = instrucciones;
        this.kernel = kernel;
        this.instComment = instComment;      
    }

    cargarPrograma(){

        console.log("entro al programa")
        // inicializar el valor del acomulador
        // este siempre va en la posicion cero de la memoria
        let acumulador = 0;       

        // guardar el acomulador
        this.memoria.push(acumulador)
        // cargar el kernel en memoria 
        this.memoria = this.memoria.concat(this.kernel);
        // cargar las intrucciones en memoria
        this.memoria = this.memoria.concat(this.instrucciones);
        console.log("esto tiene la memoria--->",this.memoria)
        // guardamos la memoria en una vriable
        let memory = this.memoria
        // info de las variables
        let infVariable = []
        // info de las etiquetas
        let infEtiq = []
        //cargar variables
        let retornCreaVar = this.creacionVariables(memory);
        // actualizamos memoria y info de variables
        memory = retornCreaVar[0]
        infVariable = retornCreaVar[1]
        
        const div = document.getElementById("miArray");
        div.innerHTML = memory.join(", ");

        const divInstructions = document.getElementById("instructions");
        divInstructions.innerHTML = this.instrucciones.join(", ");
        //cargar etiquetas
        let returnEti = this.crearEtiquetas(memory);
        // actualizamos memoria y info de variables        
        infEtiq = returnEti
        
        console.log("ESTA ES LA MEMORIA----->",memory)
        console.log("AQUI DEBERIA ESTAR TODA LA INFO DE LAS ETIQUETAAS----->",infEtiq)
        console.log("AQUI DEBERIA ESTAR TODA LA INFO DE LAS VARIALES----->",infVariable)
        let runInstrc = this.instComment

        this.runLineLinea(memory,runInstrc,infEtiq,infVariable);
        
    }

    runLineLinea(memory,runInstrc,infEtiq,infVariable){        

        //que se quede en este proceso hasta que sea el final del programa
        finProg = true

        // Obtener el elemento div correspondiente al cuadro
		const box = document.getElementById("box");

		// Crear un array con contenido
		const array = runInstrc;

		// Inicializar el índice del array a 0
		let index = 0;

        // Mostrar el primer elemento del array en el cuadro al cargar la página
		showElement(memory, runInstrc, infEtiq, infVariable,posicion,index);
        index = index+1;

        while (finProg){
            // Agregar un evento de clic al botón para avanzar al siguiente elemento
		    document.getElementById("nextButton").addEventListener("click", showElement(memory, runInstrc, infEtiq, infVariable,index));
            // Si el índice es mayor o igual al tamaño del array, volver al primer elemento
            if (index >= array.length) {
                index = 0;
                finProg = false;
            }
            index = index+1;
        }

        console.log("TERMINO EL PROGRAMA");


    }

    // Función para mostrar el elemento del array en el cuadro
	showElement(memory, runinstrc, infEtiq, infVariable,posicion,posicion) {
		box.innerHTML = runinstrc[posicion];
        this.runPrograma(memory, runinstrc, infEtiq, infVariable,posicion);
	}

    

    runPrograma(memory, runinstrc, infEtiq, infVariable,posicion){

        // Creamos el objeto para usar la clase de operaciones
        //let calseOperaciones = new Operaciones();
        console.log("ENTRO A RUNPROGRAMA");

        let operaNumeros = ["sume","reste",
                            "multiplique",
                            "divida","potencia",
                            "modulo"];
        let instruc = ["cargue","almacene",
                            "lea","muestre",
                            "imprima"];

        let logicas = ["Y","O","NO"];
        let operaString = ["concatene","elimine","extraiga"];
        
        let ciclos = ["vaya","vayasi"]

        // mostrar en pantalla el contenido del array de esa pocision.
        box.innerHTML = runinstrc[posicion];

        // cargar el valor del acumulador.
                
        // correr las instrucciones.
        
        let i=posicion
        let inst =  runinstrc[i].split(" ");
        if ((i[0] == '/' && i[1] != '/')){
            console.log("Es un comentario con el siguiente contenido: --->",i)
        }

        else if (inst[0]==="retorne"){
            console.log("EL PROGRAMA TERMINO")
            return
        }

        else if (operaNumeros.includes(inst[0])){
            let result = this.funOperNum(runinstrc[i],memory,infVariable)
            memory = result[0];
            infVariable = result[1];
        }

        else if (logicas.includes(inst[0])){
            let result = this.funLogic(runinstrc[i],memory,infVariable)
            memory = result[0];
            infVariable = result[1];
        }

        else if (ciclos.includes(inst[0])){
            if (inst[0] === "vaya"){
                //devolver el contador del for al valor que tiene la etiqueta
                let jsonEtiqueta = infEtiq.filter(elemento => elemento.nombre === inst[1]);
                if (jsonEtiqueta.length === 0){
                    throw new Error(`la etiqueta al que se desea acceder no existe`);
                }else{
                    i=parseInt(jsonEtiqueta[0].posicionInstrucciones)-1;
                }

            }

            if (inst[0] === "vayasi"){
                //devolver el contador del for al valor que tiene la etiqueta
                console.log("Esta es la informacion de las etiquetas",infEtiq)
                let jsonEtiquetaUno = infEtiq.filter(elemento => elemento.nombre === inst[1]);
                let jsonEtiquetaDos = infEtiq.filter(elemento => elemento.nombre === inst[2]);
                if (jsonEtiquetaUno.length === 0 || jsonEtiquetaDos.length === 0){
                    throw new Error(`la etiqueta al que se desea acceder no existe`);
                }else{
                    if(memory[0]>0){
                        i=parseInt(jsonEtiquetaUno[0].posicionInstrucciones)-1;
                    }
                    else if(memory[0]<0){
                        i=parseInt(jsonEtiquetaUno[0].posicionInstrucciones)-1;
                    }
                    
                }

            }                
            
        }

        else if (instruc.includes(inst[0])){
            let result = this.funInstruc(runinstrc[i],memory,infVariable)
            memory = result[0];
            infVariable = result[1];
        }

        //faltan las de abajo

        else if (operaString.includes(inst[0])){
            let result = this.funOperNum(runinstrc[i],memory,infVariable)
            memory = result[0];
            infVariable = result[1];
        }

        else{
            console.log("ERROR EN LA LECTURA DE INSTRUCCIONES LINE 135 INTERPRETE");
        }

        


    }   


    creacionVariables(memory){
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
        resultados.forEach(function(line){

            let inst =  line.split(" ");
            let tamaño = inst.length
            let variable
            let valor
            // nota: el identificador que tiene la variable es por si se carga otro program y este tiene variables con el mismo nombre.
            if (tamaño===3){
                if (inst[2]==="I" | inst[2]==="R" ){
                    valor = 0
                    memory.push(valor)
                }
                if (inst[2]==="L"){
                    valor = false
                    memory.push(valor)
                }
                if (inst[2]==="C"){
                    valor = " "
                    memory.push(valor)
                }
                
                variable ={'nombre':inst[1],
                    'posicion':ultimaPosicion+1,
                    'identificador':ultimaPosicion,
                    'tipo': inst[2],
                    'valor':valor
                }
                infVariables.push(variable)
                

            } else {
                //console.log("ESTA E SLA MEMORIA NO FUN--->",memory)
                if (inst[2]==="I" ){
                    valor = parseInt(inst[3])
                    memory.push(valor)
                }
                if (inst[2]==="R" ){
                    valor = parseFloat(inst[3])
                    memory.push(valor)
                }
                if (inst[2]==="L"){
                    valor = Boolean(inst[3])
                    memory.push(valor)
                }
                if (inst[2]==="C"){
                    valor = inst[3]
                    memory.push(valor)
                }
                
                variable ={'nombre':inst[1],
                    'posicion':ultimaPosicion+1,
                    'identificador':ultimaPosicion,
                    'tipo': inst[2],
                    'valor':valor
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

    crearEtiquetas(memory){
        
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
        resultados.forEach(function(line){

            let inst =  line.split(" ");

            // nota: el identificador que tiene la variable es por si se carga otro program y este tiene variables con el mismo nombre.
            let instruEtique = instruc[parseInt(inst[2])-1]
            etiqueta ={'nombre':inst[1],
                'posicionMemoria':memory.findIndex(elemento => elemento === instruEtique),
                'identificador':ultimaPosicion,
                'posicionInstrucciones': inst[2],
                
            }               
            // gurdar en el arreglo de las etiquetas.
            infEtiqueta.push(etiqueta)            
            ultimaPosicion++;
        })        
        return infEtiqueta
    }

    funOperNum(instruccion,memory,infVariable){
        
        let retunrCambios = []
        let inst =  instruccion.split(" ");
        let jsonVariable = []
        let nombreVariable
        switch (inst[0]) {
            case "sume":
            nombreVariable = inst[1]
            jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
            if (jsonVariable.length === 0){
                throw new Error(`la variable que se desea sumar no existe`);
            }else{
                memory[0] = memory[0] + jsonVariable[0].valor
            }

            break;
            case "reste":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable que se desea sumar no existe`);
                }else{
                    memory[0] = memory[0] - jsonVariable[0].valor
                }
            break;
            case "multiplique":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable que se desea sumar no existe`);
                }else{
                    memory[0] = memory[0] * jsonVariable[0].valor
                }
            break;
            case "divida":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable que se desea dividir no existe`);
                }else{
                    if(jsonVariable[0].valor == 0){
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
                if (jsonVariable.length === 0){
                    throw new Error(`la variable que se desea hacer potencia no existe`);
                }else{
                    memory[0] = memory[0] ** jsonVariable[0].valor
                }
            break; 
            case "modulo":
                console.log("OJO FALTA  DEFINIR MODULO")
            break;           
            default:
            console.log("No es una instruccion valida");
            break;
        }
        retunrCambios.push(memory)
        retunrCambios.push(infVariable)

        return retunrCambios;
        
    }

    funInstruc(instruccion,memory,infVariable){
        let retunrCambios = []
        let inst =  instruccion.split(" ");
        let jsonVariable = []
        let nombreVariable
        switch (inst[0]) {
            case "cargue":
            nombreVariable = inst[1]
            jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
            if (jsonVariable.length === 0){
                throw new Error(`la variable que se desea cargar no existe`);
            }else{
                memory[0] = jsonVariable[0].valor
            }

            break;
            case "almacene":
                console.log("entro alamacene infoVariables---->", infVariable)
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable en la que se desea almacenar no existe`);
                }else{
                    // Buscamos el estudiante con el nombre "Juan"
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === nombreVariable);

                    // Modificamos la carrera del estudiante Juan
                    cambioInfo.valor = memory[0];

                    console.log("Veamos si modifico el valor --->",infVariable);
                }
            break;
            case "lea":
            console.log("OJO FALTA LEER POR PANTALLA");
            break;
            case "muestre":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable que se desea cargar no existe`);
                }else{
                    console.log( "la variable tiene el valor en pantalla",jsonVariable[0].valor)
                }
            break;
            case "imprima":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable no existe`);
                }else{
                    console.log("la variable tiene el valor impreso",jsonVariable[0].valor)
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

    funLogic(instruccion,memory,infVariable){
        
        let retunrCambios = []
        let inst =  instruccion.split(" ");
        let jsonVariableUno = [];
        let jsonVariableDos = [];
        let jsonVariableRespuesta = [];
        
        if (inst[0] === "NO"){
            jsonVariableUno = infVariable.filter(elemento => elemento.nombre === inst[1]);
            jsonVariableDos = infVariable.filter(elemento => elemento.nombre === inst[2]);
        }else {
            jsonVariableUno = infVariable.filter(elemento => elemento.nombre === inst[1]);
            jsonVariableDos = infVariable.filter(elemento => elemento.nombre === inst[2]);
            jsonVariableRespuesta = infVariable.filter(elemento => elemento.nombre === inst[3]);
        }
        
        switch (inst[0]) {
            case "Y":          
            
            if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0 || jsonVariableRespuesta.length === 0){
                throw new Error(`alguna de las variables no se encuentra creada`);
            }else{
                // operacion
                let operacion = jsonVariableUno[0].valor & jsonVariableDos[0].valor
                // Buscamos el la variable que se modificara
                const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[3]);

                // Modificamos el valor en el array
                cambioInfo.valor = operacion;

                console.log("Veamos si modifico el valor --->",infVariable);
                
            }
            break;
            case "O":
                if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0 || jsonVariableRespuesta.length === 0){
                    throw new Error(`alguna de las variables no se encuentra creada`);
                }else{
                    // operacion
                    let operacion = jsonVariableUno[0].valor || jsonVariableDos[0].valor
                    // Buscamos el la variable que se modificara
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[3]);
    
                    // Modificamos el valor en el array
                    cambioInfo.valor = operacion;
    
                    console.log("Veamos si modifico el valor --->",infVariable);                    
                }
            break;
            case "NO":
                if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0 ){
                    throw new Error(`alguna de las variables no se encuentra creada`);
                }else{
                    // operacion
                    let operacion = !jsonVariableUno[0].valor
                    // Buscamos el la variable que se modificara
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[2]);
    
                    // Modificamos el valor en el array
                    cambioInfo.valor = operacion;
    
                    console.log("Veamos si modifico el valor --->",infVariable);
                    
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

    funOperStr(instruccion,memory,infVariable){}

}