//Variables de las casillas de juego
let input1 = document.querySelector("#input1");
let input2 = document.querySelector("#input2");
let input3 = document.querySelector("#input3");




const maxLength = 1; // Set your desired character limit


//Listeners
input1.addEventListener("input", print,);
input1.addEventListener("input", funcvalidate);
input3.addEventListener("input", print);




//Funciones
function print() {//funcion que limita a 1 la cantidad de digitos que puede ingresar el jugador
    if (input1.value.length >= maxLength) {
        input1.value = input1.value.slice(0, maxLength);
        }
        console.log(input1.value);
    };

function funcvalidate(params) {
    if (input2.value === input1.value) {
        input1.style.backgroundColor = "red";
    }
}
// funcion para confirmar que el input en el que se vaya a agregar el numero este seleccionado:
//if (input1 === document.activeElement) {
//        console.log('The input field is focused!');
//    } else {
//        console.log('The input field is not focused.');
//    }