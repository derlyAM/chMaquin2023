import { lineByLineFileReader } from "./model/file.js";
import { Validation } from "./model/validation.js";
import { Interprete } from "./model/interprete.js";
import { LineaPrueba } from "./model/lineaprueba.js";
import { Procesos } from "./model/process.js";



const form = document.querySelector('#file-form');
const fileInput = document.querySelector('#file-input');
let memoryContainer = document.getElementById('memory-container');
form.addEventListener('submit', async (e) => {
	e.preventDefault();
	let programa;
	let correrPrograma;
	let memoria = [];
	let instrucciones = [];
	let infEtiquetas = [];
	let infoVariables = [];

	// creacion de la memoria con su kernel 
	// 1. creacion del kernel
	const kernel = new Array(5).fill('Derly`s kernel');
	// creacion de la memoria con su tamaño correspondiente
	const memory = new Array();
	// agregamos el acumulador en la posicion cero
	memory.push(0) 
	// cargamos el kernel a la memoria
	memory.push(kernel)
	// creamos la nueva memoria
	let nuevo = [].concat(...memory);
	
	// tamaño de la memoria
	const tamanioMemoria = 1000 + kernel.length

	// creacion del objeto que se utilizara para el cargue corriespondiente de los programas
	programa = new Interprete(nuevo, [], [], tamanioMemoria);


	memoryContainer.innerHTML = ''
	for (let index = 0; index < fileInput.files.length; index++) {
		const file = fileInput.files[index];
		const linIns = 1;

		console.log("este es el archivo leido---->", file)
		try {
			const reader = new lineByLineFileReader();
			// obtener el array con las instruccines.
			const lines = await reader.read(file);
			console.log(lines);
			// obtener la lectura del archivo sin comentarios
			const validation = new Validation(lines);
			// obtener un  array con el programa sin comentarios y haciendo verificación de sintaxis.
			let fileContent = validation.validSintaxis();
			console.log("Esto es lo que hay sin comentarios----->", fileContent)

			// cambiamos el contenido que tendra el filecontent y las lineas
			programa.setInstrucciones(fileContent)
			programa.setInstComment(lines)


			correrPrograma = programa.cargarPrograma(memoria);
			//memoria = [...memoria, ...correrPrograma[0]]
			for (let i = 0; i < lines.length; i++) {
				document.getElementById('instructions-container').innerHTML += `<p class="">${(i+1)+'. '+lines[i]}</p>`
				
			}
			
			correrPrograma[2].forEach(etiqueta => {
				document.getElementById('etiquetas-container').innerHTML += `<p class="">${' identificador: '+etiqueta.identificador + ',  nombre:' + etiqueta.nombre + ',  posInstruc:' + etiqueta.posicionInstrucciones}</p>`
			})
			correrPrograma[3].forEach(variable => {
				document.getElementById('variables-container').innerHTML += `<p class="">${' nombre:'+variable.nombre + ',  posicion:' + variable.posicion + ',   identificador:' + variable.identificador + ',  tipo:' + variable.tipo +
					',  valor:' + variable.valor}</p>`
			})
			instrucciones.push(correrPrograma[1])
			infEtiquetas.push(correrPrograma[2])
			infoVariables.push(correrPrograma[3])

		} catch (err) {
			alert(err);
			console.error(err);
		}
	}
	memoria = correrPrograma[0]

	let metodo = document.getElementById("priority-method").value;

	console.log("este es el metodo elegido",metodo)
	// llama una funcion que se encarga de de correr el programa ya sea linea a line o de corrido.
	runProg(memoria, instrucciones, infEtiquetas, infoVariables, e, programa, metodo)
});


async function runProg(memoria, instrucciones, infEtiquetas, infoVariables, e, programa, metodo) {
	let contador = 0
	memoria.forEach(memoriaText => {
		memoryContainer.innerHTML += `<p>${contador} . ${memoriaText}</p>`
		contador++
	})
	contador = 0
	let proceso;
	if (e.submitter.id == 'submit-btn') {
		proceso = new Procesos(memoria,infEtiquetas,infoVariables,1)
	} else {
		proceso = new Procesos(memoria,infEtiquetas,infoVariables,0)
	}	

	switch (metodo) {
		case "FCFS":

			proceso.ElegirMetodo(instrucciones,0, programa)
			break;
		case "RR":
			
			proceso.ElegirMetodo(instrucciones,1, programa)
			break;
		case "SJF":

			proceso.ElegirMetodo(instrucciones,2, programa)
			break;
		case "SJFE":

			proceso.ElegirMetodo(instrucciones,3, programa)
			break;
		case "Priority":

			proceso.ElegirMetodo(instrucciones,4, programa)
			break;
	
		default:
			break;
	}
}




/*async function runProg(memoria, instrucciones, infEtiquetas, infoVariables, e, programa) {
	
	contador = 0
	for (let index = 0; index < instrucciones.length; index++) {
		if (e.submitter.id == 'submit-btn') {
			// esperar 10 segundos antes de continuar
			setTimeout(function() {
				// código que se ejecutará después de 10 segundos
				// ...
				programa.runPrograma(memoria, instrucciones[index], infEtiquetas[index], infoVariables[index]);
				alert("Termino la  ejecucion del programa numero "+(index+1))
			}, 3000); // 10000 milisegundos = 10 segundos
			
		} else {
			await linea.runLineaLinea(memoria, instrucciones[index], infEtiquetas[index], infoVariables[index]);
		}
		if (index === instrucciones.length - 1) {
			document.getElementById("nextButton").disabled = true;
			document.getElementById("box").innerHTML = 'Terminó la ejrcución corretamente'
		}
	}
}*/





