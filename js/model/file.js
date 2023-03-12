export class lineByLineFileReader {    

    async read(file) {
        if (!file) {
            return;
        }
        
      if (file.name.split('.').pop() !== 'ch') {
        throw new Error('El archivo no tiene la extensión esperada (.ch)');
      }
  
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      const lines = [];
  
      return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
          fileReader.abort();
          reject(new Error('Error al leer el archivo.'));
        };
  
        fileReader.onload = () => {
          const content = fileReader.result;
          const rows = content.split(/\r\n|\n/);
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].trim() === ''){
              console.log("linea esta vacia-->",i);
              rows[i]="//"
            }
            rows[i] = rows[i].replace(/\s+/g, " ");
            lines.push(rows[i].trim());
          }
          resolve(lines);
        };
      });
    }
  }
  