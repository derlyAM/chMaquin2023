import { LineaPrueba } from "./lineaprueba.js";
export class Procesos {

    constructor(memoria, infoEtiquetas, infoVariables, tipoEjecucion) {
        this.memoria = memoria;
        this.infoEtiquetas = infoEtiquetas;
        this.infoVariables = infoVariables;
        this.tipoEjecucion = tipoEjecucion;
    }

    ElegirMetodo(instrucciones, opcion, quantum, programa) {
        switch (opcion) {
            case 0:
                this.ordenDeLlegada(instrucciones, programa)
                break;
            case 1:
                alert("estas son las instrucciones:--->"+instrucciones)
                console.log("ESTOS SON LOS PROGRAMAS A CORRER",instrucciones);
                this.RoundRobin(instrucciones, quantum, programa)
                break;
            case 2:
                this.ShortestJobFirstNe(instrucciones, programa)
                break;
            case 3:
                alert("EJECUCION SJFE");
                this.SJFE(instrucciones, programa)
                break;
            case 4:
                this.PrioridadNe(instrucciones, prioridad, programa)
                break;
            default:
                alert("Opción no válida")
                break;
        }

    }

    AsignarRafaga(instrucciones) {

        let excluidos = ["nueva", "etiqueta",
            "retorne", "//"
        ];
        let contador = 0;
        for (let i = 0; i < instrucciones.length; i++) {
            let instruccion = instrucciones[i].split(" ");
            if (!excluidos.includes(instruccion[0])) {
                contador++;
            }
        }
        return contador;
    }

    AsignarTiempoLlegada(instrucciones) {
        let tiempos = [];
        for (let i = 0; i < instrucciones.length; i++) {
            if (i == 0) {
                tiempos.push(0);
            }
            else {
                tiempos.push(Math.round((tiempos[i - 1] + this.AsignarRafaga(instrucciones[i])) / 4))
            }
        }
        return tiempos;
    }

    async ordenDeLlegada(instrucciones, programa) {
        for (let j = 0; j < instrucciones.length; j++) {
            programa.runPrograma(this.memoria, instrucciones[j], this.infoEtiquetas[j], this.infoVariables[j], 0, instrucciones[j].length + 3000);
        }
    }

    async ShortestJobFirstNe(instrucciones, programa) {
        let json = []
        let instruccionesSjf = []
        let variables = []
        let etiquetas = []

        for (let i = 0; i < instrucciones.length; i++) {
            console.log("Rafaga: " + this.AsignarRafaga(instrucciones[i]));
            console.log(instrucciones[i]);
            json.push({
                "Instruccion": instrucciones[i], "Rafaga": this.AsignarRafaga(instrucciones[i]),
                "InfoEtiquetas": this.infoEtiquetas[i], "InfoVariables": this.infoVariables[i]
            })
        };
        json.sort(function (a, b) {
            return a.Rafaga - b.Rafaga;
        })
        instruccionesSjf.push(instrucciones[0]);
        variables.push(this.infoVariables[0])
        etiquetas.push(this.infoEtiquetas[0])

        json.forEach(element => {
            if (element.Instruccion != instruccionesSjf[0]) {
                instruccionesSjf.push(element.Instruccion);
                variables.push(element.InfoVariables)
                etiquetas.push(element.InfoEtiquetas)
            }
        });
        if (this.tipoEjecucion == 0) {
            let ejecutar = new LineaPrueba();
            for (let i = 0; i < instruccionesSjf.length; i++) {
                await programa.runPrograma(this.memoria, json[0].Instruccion, json[0].InfoEtiquetas, json[0].InfoVariables, 0, json[0].Instruccion.length - 1);

            };
        } else {
            for (let j = 0; j < instruccionesSjf.length; j++) {
                await programa.runPrograma(this.memoria, json[0].Instruccion, json[0].InfoEtiquetas, json[0].InfoVariables, 0, json[0].Instruccion.length - 1);

            }
        }
    }

    async PrioridadNe(instrucciones, prioridad, programa) {
        let json = []
        let instruccionesSjf = []
        let variables = []
        let etiquetas = []
        for (let i = 0; i < instrucciones.length; i++) {
            console.log("Rafaga: " + this.AsignarRafaga(instrucciones[i]));
            console.log(instrucciones[i]);
            json.push({
                "Instruccion": instrucciones[i], "Prioridad": prioridad[i],
                "InfoEtiquetas": this.infoEtiquetas[i], "InfoVariables": this.infoVariables[i]
            })
        };
        json.sort(function (a, b) {
            return b.Prioridad - a.Prioridad;
        })

        json.forEach(element => {
            instruccionesSjf.push(element.Instruccion);
            variables.push(element.InfoVariables)
            etiquetas.push(element.InfoEtiquetas)
        });
        if (this.tipoEjecucion == 0) {
            let ejecutar = new LineaPrueba();
            for (let i = 0; i < instruccionesSjf.length; i++) {
                await programa.runPrograma(this.memoria, json[0].Instruccion, json[0].InfoEtiquetas, json[0].InfoVariables, 0, json[0].Instruccion.length - 1);

            };
        } else {
            for (let j = 0; j < instruccionesSjf.length; j++) {
                console.log(instruccionesSjf[j]);
                programa.runPrograma(this.memoria, json[0].Instruccion, json[0].InfoEtiquetas, json[0].InfoVariables, 0, json[0].Instruccion.length - 1);

            }
        }
    }



    SJFE(instrucciones, programa) {
        // arreglo donde se guardaran los datos
        let json = []        
        let tiempoLlegada = this.AsignarTiempoLlegada(instrucciones);
        // datos iniciales para cada uno de programas cargados.
        for (let i = 0; i < instrucciones.length; i++) {
            console.log("Rafaga: " + this.AsignarRafaga(instrucciones[i]), tiempoLlegada[i]);
            json.push({
                "Rafaga": this.AsignarRafaga(instrucciones[i]),
                "Instruccion": instrucciones[i],
                "Tiemporllegada": tiempoLlegada[i],
                "acumulador": 0,
                "linea": 0,
                "InfoEtiquetas": this.infoEtiquetas[i], "InfoVariables": this.infoVariables[i]
            })
        };
        // recorremos el json con los datos  ejecutamos y hacmeos la actualizaciones necesarias.
        this.newMethod(json,programa);

    }

    newMethod(json,programa) {

        let noTerminados = []
        console.log("JSONNN", json);
        if (json.length == 1) {
            programa.runPrograma(this.memoria, json[0].Instruccion, json[0].InfoEtiquetas, json[0].InfoVariables, 0, json[0].Instruccion.length+300);

            return;
        }

        // let fin = 0;
        let retorno;
        for (let i = 0; i < json.length; i++) {



            let inicio = json[i].linea;            

            // calculamos la cantidad de lineas que deben ejecutarse
            let cantInstr = json[i + 1].Tiemporllegada - json[i].Tiemporllegada;

            alert(" cantidad instrucciones --->"+ cantInstr);

            // actualizamos la cantidad de rafajas
            json[i]["Rafaga"] = json[i]["Rafaga"] - cantInstr;

            // se pasa la informacion para que se ejcuten las instrucciones
            retorno = programa.runPrograma(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, inicio, cantInstr);

            this.memoria = retorno[0]
            json[i].Acumulador = this.memoria[0];
            if(retorno[1]==="retorne"){ 
                json.shift();
                i--;
            } else {

                json[i].linea = retorno[1]

                console.log("SFSC1 :", json[i].Instruccion, cantInstr);

                // compara la rafagas con el siguiente programa para saber si se sigue con el programa o no
                if (json[i]["Rafaga"] > json[i + 1]["Rafaga"]) {
                    noTerminados.push(json[i]);
                    json.shift();
                    if(json.length==1){

                        retorno = programa.runPrograma(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, json[i].linea, json[i].length+3000);
                    

                    }else{
                        
                        i--;
                    }
                } else {
                    noTerminados.push(json[i + 1]);
                    alert("este se agrega a no terminados ----> "+ json[i + 1]);
                    console.log("este se agrega a no terminados ----> "+ json[i + 1])
                    json.splice(i + 1, 1);
                    alert("ELEMENTOS EN NO TERMINADOS->>>>>"+ json)
                    console.log("ELEMENTOS EN NO TERMINADOS->>>>>",json)

                    if(json.length==1){

                        retorno = programa.runPrograma(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, json[i].linea, json[i].length+3000);

                    }else{                        
                        i--;
                    }

                }

            }

            alert("ESTO SON LOS NO TERMINADOS ---> "+noTerminados[0]);
            
        }

        /*
        una vez que se ejecutaran los programas se organizan por cant de rafaga y se proceden
        a ejecutar las cantidad de lineas no ejecutadas de cada programa
        */
        console.log(noTerminados);

        alert("estos son los progrmas no terminados "+ noTerminados)
        noTerminados.sort(function (a, b) {
            return a.Rafaga - b.Rafaga;
        });
        for (let i = 0; i < noTerminados.length; i++) {

            alert("ENTRO A RECORRER LOS PROGRAMAS NO TERMINADOS"+ "linea en la que quedo"+ noTerminados[i].linea)
            this.memoria[0]=noTerminados[i].Acumulador;
            
            programa.runPrograma(this.memoria, noTerminados[i].Instruccion, noTerminados[i].InfoEtiquetas, noTerminados[i].InfoVariables, noTerminados[i].linea, noTerminados[i].Instruccion.length+300); 
            console.log(noTerminados[i].Instruccion);

        }
    }


    async RoundRobin(instrucciones, quantum, programa) {

        let ejecutar = new LineaPrueba();
        let json = []
        console.log("esta es la informacion de cada variable: ---->",this.infoVariables)

        for (let i = 0; i < instrucciones.length; i++) {
            json.push({
                "Instruccion": instrucciones[i], "Rafaga": this.AsignarRafaga(instrucciones[i]), "Acumulador": 0,
                "InfoEtiquetas": this.infoEtiquetas[i], "InfoVariables": this.infoVariables[i],
                "linea": -1,
                "Index": -1
            })
            
        }
        console.table(json)
        console.log("esta es la informacion de cada programa: ---->",json)
        let fin;
        let retorno;
        let inicio
        for (let i = 0; i < json.length; i++) {

            alert("esto es l que tiene el json cargado "+json[i].linea)
            inicio=json[i].linea===-1 ? json[i].linea+1 :  json[i].linea;
            //inicio = json[i].linea+1;
            //let inicio = json[i].linea;
            
            if (json.length>0) {
                
                //fin = this.CalcularInicioyFin(json[i].Instruccion, inicio, quantum);
                
                //programa.setAcumulador(json[i].Acumulador);
                this.memoria[0] = json[i].Acumulador

                //retorno = programa.runPrograma(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, inicio, quantum);
                ejecutar.setIndex(inicio);
                await ejecutar.runLineaLinea(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, inicio, quantum);
                
                //alert(" esta es la posicion del retorno "+ retorno)
                //this.memoria = retorno[0];
                this.memoria = ejecutar.getMemory();

                if(ejecutar.getIndex()=== "retorne1"){ //retorno[1]==="retorne"
                    json.shift();

                    i--;
                }else{

                    //json[i].linea = retorno[1]
                    json[i].linea = ejecutar.getIndex();            

                    console.log(json[i].InfoVariables);
                    json[i].Acumulador = this.memoria[0];
                    json[i].Rafaga = json[i].Rafaga - quantum;
                    let temporal = json.shift();
                    json.push(temporal)
                    i--;

                }
                
            } 

        }
    }

}