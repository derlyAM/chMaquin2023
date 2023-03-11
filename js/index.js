import { lineByLineFileReader } from "./model/file.js";
import { Validation } from "./model/validation.js";
import { Interprete } from "./model/interprete.js";
import { LineaPrueba } from "./model/lineaprueba.js";



const form = document.querySelector('#file-form');
const fileInput = document.querySelector('#file-input');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const file = fileInput.files[0];
    console.log("este es el archivo leido---->",file)
	try {
		const reader = new lineByLineFileReader();
		// obtener el array con las instruccines.
		const lines = await reader.read(file);
		console.log(lines);
        // obtener la lectura del archivo sin comentarios
        const validation = new Validation(lines);
		// obtener un  array con el programa sin comentarios y haciendo verificación de sintaxis.
        let fileContent = validation.validSintaxis();       
        console.log("Esto es lo que hay sin comentarios----->",fileContent)
        //intepretar lo que vendria siendo hasta el momento el program
		// Nota: para e ste caso se enviaria el programa con comentarios incluidos.
		// se crea el objeto enviando la memoria y el kernel, ademas de las instruccion
		// con comentarios y las que no tiene comentarios.
        const programa = new Interprete([],fileContent,lines,[]);
		// se procede a ejecutar el programa.
        programa.cargarPrograma();

	} catch (err) {
		console.error(err);
	}
});

