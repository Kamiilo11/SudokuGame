//Variables de las casillas de juego
let input1 = document.querySelector("#input1");



//Variables de los botones de numeros
let btn1 = document.querySelector("#btn-one");





//Listeners
input1.addEventListener("input", print);
btn1.addEventListener("clic", insertone);




//Funciones
function print() {
    console.log(input1.value);
}

function insertone() {
    
}