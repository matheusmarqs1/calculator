
function add(number1, number2){
    return number1 + number2;
};

function subtract(number1, number2){
    return number1 - number2;
};

function multiply(number1, number2){
    return number1 * number2;
};

function divide(number1, number2){
    return (number2 !== 0) ? number1 / number2 : "LMAO";
};

let number1 = Number(prompt("ENTER A NUMBER: "));
let operator = prompt("ENTER AN OPERATOR: ");
let number2 = Number(prompt("ENTER ANOTHER NUMBER: "))

operate(number1, operator, number2);

function operate(number1, operator, number2){

    switch (operator) {
        case "+":
            alert(add(number1, number2));
            break;
        case "-":
            alert(subtract(number1, number2));
            break;
        case "*":
            alert(multiply(number1, number2));
            break;
        case "/":
            alert(divide(number1, number2));
            break;
        default:
            alert("This operator is not present in the calculator!");
    };

};


