export default class Operaciones{
    funOperNum(instruccion,memory,infVariable){
        
        let retunrCambios = []
        let inst =  instruccion.split(" ");
        let jsonVariable = []
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