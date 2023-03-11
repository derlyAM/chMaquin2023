export class Validation {
    // palabras reservadas
    // operaciones    
    constructor(fileContent=[]) {
        this.fileContent = fileContent;
    }
    // Primer paso eliminar los comentarios y luego parsar a las siguientes validaciones.
    validComments() {
        /* Este metodo se encarga de hacer la eliminacion de los comentarios
            ademas si encuentra una line en la cual se encuentre una sola "/""
            enviara una alerta de error sintactico
         */
        let filewhitout = []
        this.fileContent = this.fileContent.filter((line) => {

            // en el caso de haber comentarios
            if (!(line[0] == '/' && line[1] == '/')) {
                //const line = line.replace(/\s+/g, " ").trim();
                //const line = line.trim();
                filewhitout.push(line)
            }
            
            
        })
        return filewhitout
    }

    validSintaxis(){
        /* Este metodo se encarga de hacer la validaciones sintatica sea correcata
            es decir que se encuentren correctamente escritas las insctruciones
            en cuanto a sintaxis
         */
        // palabras reservadas
        let reservadas = ["sume","reste",
                        "multiplique",
                        "divida","potencia",
                        "modulo","Y","O","NO",
                        "concatene","elimine","extraiga",
                        "cargue","almacene",
                        "nueva", "lea","muestre",
                        "imprima", "retorne","etiqueta",
                        "vaya","vayasi"
                        ]
        // tipo de variables
        let tipoVariable = ["I","L","R","C"]

        // instruccion sin comentarios.
        //let instructions = this.validComments()     
        // las instrucciones con comentarios
        let  instructions = this.fileContent

        instructions.forEach(function(line) {


            let inst =  line.split(" ");
            let tamaño = inst.length
            // en el caso de error sintactico en el que se queria comentar algo pero no se hizo

            if ((line[0] == '/' && line[1] == '/')){
                console.log("ESTE ES UN COMENTARIO ---->",line)
            }
            else if ((line[0] == '/')) {
                // Encontrar la posición del primer número par
                const evenIndex = instructions.indexOf(line);
                throw new Error(`Se encuentra un error syntactico en la linea ${evenIndex+1}`);
            }
            
            else if ( reservadas.indexOf(inst[0])===-1 || (tamaño ===1 & inst[0] != "retorne" )) {
                // caso en el que hayan mas de dos operaciones en una sola linea o si la instruccion
                // no se encuentra al inicio de la linea.
                // En el caso que no la primera parte del string no contenga ninguna instrucción.
                // o que el tamaño del de la linea sea 1 y la plabra existente sea diferente de retorne
                const evenIndex = instructions.indexOf(line);            
                throw new Error(`error la linea ${evenIndex+1} no contiene ninguna instrucción `);
            }

            const indices = [];

            for (let i = 0; i < inst.length; i++) {
            const index = reservadas.indexOf(inst[i]);
            if (index !== -1) {
                indices.push({ valor: inst[i], posicion: i });
            }
            }           

            if (indices.length>1) {
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error syntactico existen dos instruciones en una misma linea ${evenIndex+1}`);
            }
            
            //dado el caso que la creacion de una variable no tenga tipo
            if (inst[0]=="nueva" & tipoVariable.indexOf(inst[2])===-1){
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error syntactico tipo de varible no reconocida ${evenIndex+1}`);
            }
            // validacion de la instruccion nueva, en esta se debe verificar que 
            // se defina el tipo de variable
            if ((inst[0]=="nueva" & tipoVariable.indexOf(inst[2])===-1) || (inst[0]=="nueva" & inst.length<3 )){
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error syntactico tipo de varible no reconocida ${evenIndex+1}`);
            }

            // validacion para etiquetas
            if ((inst[0]=="etiqueta" & inst.length<3)){
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error syntactico la instruccion etiqueta no esta completa ${evenIndex+1}`);
            }

            if(inst[2] <0 || inst[2]>instructions.length ){
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error syntactico la etiqueta no se puede signar ${evenIndex+1}`);
            }

        });
        // retornar las instrucciones sin comentarios, para luego ponerlas en memoria.
        instructions = this.validComments() 

        return instructions;

    }
}