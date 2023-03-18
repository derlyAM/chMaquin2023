import { lineByLineFileReader } from "./model/file.js";
import { Validation } from "./model/validation.js";
import { Interprete } from "./model/interprete.js";
import { LineaPrueba } from "./model/lineaprueba.js";



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
	memoryContainer.innerHTML = ''
	for (let index = 0; index < fileInput.files.length; index++) {
		const file = fileInput.files[index];

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
			//intepretar lo que vendria siendo hasta el momento el program
			// Nota: para e ste caso se enviaria el programa con comentarios incluidos.
			// se crea el objeto enviando la memoria y el kernel, ademas de las instruccion
			// con comentarios y las que no tiene comentarios.
			const memory = new Array();
			// crear el array del  kernel
			const kernel = new Array(5).fill('JuanDiegoKernel');
			const tamanioMemoria = 1000
			programa = new Interprete([], fileContent, lines, kernel, tamanioMemoria);
			// se procede a ejecutar el programa.

			correrPrograma = programa.cargarPrograma(memoria, index);
			memoria = [...memoria, ...correrPrograma[0]]
			fileContent.forEach(instruccion => {
				document.getElementById('instructions-container').innerHTML += `<p class="">${instruccion}</p>`
			})
			correrPrograma[2].forEach(etiqueta => {
				document.getElementById('etiquetas-container').innerHTML += `<p class="">${etiqueta.identificador + ' ' + etiqueta.nombre + ' ' + etiqueta.posicionInstrucciones}</p>`
			})
			correrPrograma[3].forEach(variable => {
				document.getElementById('variables-container').innerHTML += `<p class="">${variable.nombre + ' ' + variable.posicion + ' ' + variable.identificador + ' ' + variable.tipo +
					' ' + variable.valor}</p>`
			})
			instrucciones.push(correrPrograma[1])
			infEtiquetas.push(correrPrograma[2])
			infoVariables.push(correrPrograma[3])

		} catch (err) {
			console.error(err);
		}
	}

	// instrucciones = [].concat.apply([], instrucciones);
	/*for (let index = 0; index < instrucciones.length; index++) {

	if(index===instrucciones.length-1){
		bandera=true
	}
	//programa.runPrograma(memoria, instrucciones[index], infEtiquetas[index], infoVariables[index]);
	}*/
	runProg(memoria, instrucciones, infEtiquetas, infoVariables, e, programa)


});

async function runProg(memoria, instrucciones, infEtiquetas, infoVariables, e, programa) {
	let linea = new LineaPrueba();
	let contador = 0
	memoria.forEach(memoriaText => {
		memoryContainer.innerHTML += `<p>${contador} . ${memoriaText}</p>`
		contador++
	})
	contador = 0
	for (let index = 0; index < instrucciones.length; index++) {
		if (e.submitter.id == 'submit-btn') {
			programa.runPrograma(memoria, instrucciones[index], infEtiquetas[index], infoVariables[index]);
		} else {
			await linea.runLineaLinea(memoria, instrucciones[index], infEtiquetas[index], infoVariables[index]);
		}
		if (index === instrucciones.length - 1) {
			document.getElementById("nextButton").disabled = true;
			document.getElementById("box").innerHTML = 'Felicidades, terminó la ejrcución corretamente, no mire el log'
		}
	}
}





