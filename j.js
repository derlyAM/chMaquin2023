const p = ()=>{ return new Promise((resolve, reject)=>{
    setTimeout(() => {
        resolve(9)
    }, 5000);
})}

let b = [1,2,3]
async function nn(){
    /*b.forEach(element => {
        element.forEach(elementUno => {
            const num = await p()
            elementUno = num
        });
    });*/
    for (let index = 0; index < 3; index++) {
        //p().then(c => b[index] = c)
        b[index]=p();
    }

    console.log('hhhhha');
}

nn()
console.log(b);
setTimeout(() => {
    console.log(b[0]+2);
}, 15000);