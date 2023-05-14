import "./operaciones.js";

export class Interprete {
    
    constructor(memoria, instrucciones, instComment, tamanioMemoria){
        this.memoria = memoria;
        this.instrucciones = instrucciones;
        //this.kernel = kernel;
        this.instComment = instComment;
        this.tamanioMemoria = tamanioMemoria
    }

    setInstrucciones(instrucciones){
        this.instrucciones=instrucciones
    }

    setInstComment(instComment){
        this.instComment = instComment
    }
    

    cargarPrograma(memoria1){
        // inicializar el valor del acomulador
        // este siempre va en la posicion cero de la memoria
        /*if(indicador==0){
        let acumulador = 0;       
        
        // guardar el acomulador
        this.memoria.push(acumulador)
        // cargar el kernel en memoria 
        this.memoria = this.memoria.concat(this.kernel);
        }
        */
        // cargar las intrucciones en memoria
        this.memoria = this.memoria.concat(this.instrucciones);
        console.log("esto tiene la memoria--->",this.memoria)
        // guardamos la memoria en una vriable
        memoria1 = this.memoria
        // info de las variables
        let infVariable = []
        // info de las etiquetas
        let infEtiq = []
        //cargar variables
        let retornCreaVar = this.creacionVariables(memoria1);

        // actualizamos memoria y info de variables
        memoria1 = retornCreaVar[0]
        infVariable = retornCreaVar[1]
        if(memoria1.length>this.tamanioMemoria){
            throw new Error(`el tamaño de la memoria se excede`);

        }
        const div = document.getElementById("miArray");
        //div.innerHTML = memory.join(", ");

        const divInstructions = document.getElementById("instructions");
        //divInstructions.innerHTML = this.instrucciones.join(", ");
        //cargar etiquetas
        let returnEti = this.crearEtiquetas(memoria1);
        // actualizamos memoria y info de variables        
        infEtiq = returnEti
        let runInstrc = this.instComment
        let returnArray=[memoria1,runInstrc,infEtiq,infVariable];
        
        return returnArray;
        //this.runPrograma(memory,runInstrc,infEtiq,infVariable);
        
        
    }

    runPrograma(memory, runinstrc, infEtiq, infVariable, inicio, rafaga){
        
        // Creamos el objeto para usar la clase de operaciones
        //let calseOperaciones = new Operaciones();
        console.log("ENTRO A RUNPROGRAMA");
        console.log("ENTRO A RUNPROGRAMA CON INSTRUCCIONES---->",runinstrc);

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

        // cargar el valor del acumulador.
        //contar la cantidad de lineas en caso de enconetrarse en un ciclo
        let linea = inicio;
        let conteoLineas = -1;
        
        // correr las instrucciones.
        for (let i = inicio; i < runinstrc.length ; i++) {

            //alert("LINEA EN LA QUE VA "+runinstrc[i])
            

            console.log("esto es lo que tiene la linea--------->",runinstrc[i])
            
            let inst =  runinstrc[i].split(" ");
            if( inst[0]!= "nueva" && inst[0]!="etiqueta" && inst[0]!= "retorne" && inst[0]!= "//"){
                
                conteoLineas++
                
            }
            if ((i[0] == '/' && i[1] != '/')){
                //console.log("Es un comentario con el siguiente contenido: --->",i)
            }

            else if (inst[0]==="retorne"){
                //linea = i;
                console.log("EL PROGRAMA TERMINÓ con la linea ---->",linea)

                    alert("termino el programa ")
                    memory[0]=0;
                    //i = runinstrc.length;
                    return [memory,inst[0]];
            }

            else if (operaNumeros.includes(inst[0])){
                let result = this.funOperNum(runinstrc[i],memory,infVariable)
                memory = result[0];
                infVariable = result[1];
            }

            else if (operaString.includes(inst[0])){
                let result = this.funOperStr(runinstrc[i],memory)
                memory = result;                
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
                    console.log("EL ACUMULADOR VA EN EL SIGUIENTE VALOR---->",memory[0])
                    let jsonEtiquetaUno = infEtiq.filter(elemento => elemento.nombre === inst[1]);
                    let jsonEtiquetaDos = infEtiq.filter(elemento => elemento.nombre === inst[2]);
                    if (jsonEtiquetaUno.length === 0 || jsonEtiquetaDos.length === 0){
                        throw new Error(`la etiqueta al que se desea acceder no existe`);
                    }else{
                        if (memory[0]==0){
                            console.log("ENTRO A DONDE EL ACUMULADOR ES CER------->")
                            console.log("VA A LA POSICION DEL ",i=i+1)
                            i=i+1;
                        }
                        else if(memory[0]>0){
                            i=parseInt(jsonEtiquetaUno[0].posicionInstrucciones)-2;
                            console.log("LA POSICION DE LA ETIQUETA QUE ENCUENTRA ES--->")
                            console.log(jsonEtiquetaUno[0].posicionInstrucciones)
                        }
                        else if(memory[0]<0){
                            i=parseInt(jsonEtiquetaDos[0].posicionInstrucciones)-2;
                        }
                        
                        
                    }

                }                
                
            }

            else if (instruc.includes(inst[0])){
                let result = this.funInstruc(runinstrc[i],memory,infVariable)
                memory = result[0];
                infVariable = result[1];
            }

            else{
                console.log("ERROR EN LA LECTURA DE INSTRUCCIONES LINE 135 INTERPRETE");
            }

            console.log("ESTE ES EL VALOR DEL ACOMULADOR------>",memory[0])
            console.log("ES LA MANERA QUE QUEDA LA MEMORIA ---->", memory)

            if(conteoLineas>=rafaga){
                //alert("entro conteo lineas ---> "+ i+ " ESTE CONTEO LINEAS "+ conteoLineas)
                return [memory,i+1];
                
            }

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
                document.getElementById('acumulador-value').innerHTML = memory[0];
            }

            break;
            case "reste":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable que se desea sumar no existe`);
                }else{
                    memory[0] = memory[0] - jsonVariable[0].valor
                    document.getElementById('acumulador-value').innerHTML = memory[0];
                }
            break;
            case "multiplique":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable que se desea sumar no existe`);
                }else{
                    memory[0] = memory[0] * jsonVariable[0].valor
                    document.getElementById('acumulador-value').innerHTML = memory[0];
                }
            break;
            case "divida":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    alert('la variable que se desea dividir no existe');
                    throw new Error(`la variable que se desea dividir no existe`);
                }else{
                    if(jsonVariable[0].valor == 0){
                        alert('No es posible dividir por cero');
                        throw new Error(`No es posible hacer division por cero`);
                    }
                    else {
                        memory[0] = memory[0] / jsonVariable[0].valor
                        document.getElementById('acumulador-value').innerHTML = memory[0];
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
                    document.getElementById('acumulador-value').innerHTML = memory[0];
                }
            break; 
            case "modulo":   
                let valor = parseInt(inst[1])
                if (!isNaN(valor)) {
                    // cambiamos el valor del acumulador por la opercion ya echa
                    memory[0] = memory[0]%inst[1]; 
                    document.getElementById('acumulador-value').innerHTML = memory[0];                   
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
                memory[0] = memory[jsonVariable[0].posicion]
                document.getElementById('acumulador-value').innerHTML = memory[0];
            }

            break;
            case "almacene":
                console.log("entro alamacene infoVariables---->", infVariable)
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0){
                    throw new Error(`la variable en la que se desea almacenar no existe`);
                }else{
                    // Buscamos el valor en el json
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === nombreVariable);

                    // Modificamos se modifica el valor en el json
                    console.log("ESTE ES EL VALOR AL QUE ESTAMOS ACCEDIENDO ---->", memory[0])
                    cambioInfo.valor = memory[0];
                    // Modificamos el valor en la memoria
                    
                    memory[cambioInfo.posicion] = memory[0]


                    console.log("Veamos si modifico el valor --->",infVariable);
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
                    if (valorVariable == "1" || valorVariable == "true"){
                        valorVariable = true;
                    }
                    else if (valorVariable == "0" || valorVariable == "false"){
                        valorVariable = false;
                    }else{
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
                if(nombreVariable === "acumulador"){
                    console.log("la variable tiene el valor impreso", memory[0]);
                }
                else if (jsonVariable.length === 0){
                    throw new Error(`la variable que se desea cargar no existe`);
                }else{
                    document.getElementById('screen-container').innerHTML = `<p>${jsonVariable[0].valor}</p>`
                    console.log( "la variable tiene el valor en pantalla",jsonVariable[0].valor)
                    alert("valor que se tiene" + jsonVariable[0].valor);
                    
                }
            break;
            case "imprima":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if(nombreVariable === "acumulador"){
                    console.log("la variable tiene el valor impreso", memory[0]);
                    
                }
                else if (jsonVariable.length === 0){
                    throw new Error(`la variable no existe`);
                }else{
                    document.getElementById('printer-container').innerHTML = `<p>${jsonVariable[0].valor}</p>`
                    console.log("la variable tiene el valor impreso",jsonVariable[0].valor)
                    alert("valor que se tiene" + jsonVariable[0].valor);
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

    funOperStr(instruccion,memory){

        let inst =  instruccion.split(" ");

        // extraer el valor que viene en el acomulador hasta el momento
        let valorAcumulador = memory[0];
        // valor de la instruccion
        let valorInstruc = inst[1];
        // guardar el resultado de la operación.
        let resultado;
        switch (inst[0]) {
            case "concatene":                
                // resultado
                resultado = valorAcumulador + valorInstruc;
                
                break;

            case "elimine":
                let string = this.acumulador;
                let substringsToRemove = [valorInstruc];

                let regex = new RegExp(substringsToRemove.join("|"), "g");

                resultado = string.replace(regex, "");

                break;
            case "extraiga":
                // extraer de la instruccion la cantidad de caracteres a extraer
                let cantCarac = parseInt(valorInstruc)
                if (!isNaN(cantCarac)) {
                    resultado = valorAcumulador.substring(0, cantCarac);
                    
                }else{
                    throw new Error(`el parametro pasado a la funcion "extraiga" no es valido`);
                }
                
                break;
        
            default:
                break;            
        }
        // cambiamos el valor del acumulador en la memoria
        memory[0] = resultado;
        document.getElementById('acumulador-value').innerHTML = memory[0]; 
        return memory
    }

}