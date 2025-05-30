
let previousOperand = "";
let currentOperand = "";
let operator = "";
let result = "";
let shoudResetDisplay = false;

const numberButtons = document.querySelectorAll('[data-number]');
const currentOperandTextElement = document.querySelector('.current-operand');
const previousOperandTextElement = document.querySelector('.previous-operand');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('.equals-button');
const decimalButton = document.querySelector('.decimal-button');
const clearButton = document.querySelector('.function-button-clear');
const backspaceButton = document.querySelector('.backspace-button');
const percentButton = document.querySelector('.percent-button');

function roundDecimalNumber(number){
    const factor = Math.pow(10, 9);
    number = (Math.round(number * factor) / factor).toFixed(9).replace(/\.?0+$/g, '');
    return number;

};

function appendInput(input){
    if(shoudResetDisplay){
        currentOperand = "";
        shoudResetDisplay = false;
    }
    if((currentOperand.includes('.') || currentOperand === "") && input === '.'){
        return;
    }
    currentOperand += input;
    updateDisplay(); 
};

function clearOperation(){
    previousOperand = "";
    currentOperand = "";
    operator = "";
};

function operate(previousOperand, operator, currentOperand){
    
    let number1 = Number(previousOperand);
    let number2 = Number(currentOperand);

    switch (operator) {
        case "+":
            return number1 + number2;

        case "-":
            return number1 - number2;

        case "*":
            return number1 * number2;

        case "/":
            return (number2 !== 0) ? number1 / number2 : "LMAO";
            
        default:
            return "This operator is not present in the calculator!";

    };

};

function handleDivisionByZeroError(value){
    if(typeof(value) === "string" && value.includes("LMAO")){
        currentOperandTextElement.textContent = value;
        clearOperation();
        shoudResetDisplay = true;
        return true;
    }
    return false;
};

function deleteLastDigit(){
    
    if(currentOperand !== ""){
        currentOperand = currentOperand.slice(0, -1);
    }

    else if (operator !== ""){
        operator = "";
    }

    else if(previousOperand !== ""){
        previousOperand = previousOperand.slice(0,-1);
    }
    updateDisplay();
};

function calculateResult(){
    if(previousOperand !== "" && currentOperand !== "" && operator != ""){
         
        result = operate(previousOperand, operator, currentOperand);

        if(handleDivisionByZeroError(result)){
            return;
        }

        result = roundDecimalNumber(result);
        currentOperand = result;
        previousOperand = "";
        operator = "";
        shoudResetDisplay = true;
        updateDisplay();
    }
    else return;
};

function clearAll(){
    clearOperation();
    updateDisplay();
};

function updateDisplay(){
    currentOperandTextElement.textContent = (currentOperand !== "") ? currentOperand : "0";
    
    if(previousOperand !== "" && operator !== ""){
        previousOperandTextElement.textContent = `${previousOperand} ${operator}`;
    }
    else if(previousOperand !== "" && operator === ""){
        previousOperandTextElement.textContent = previousOperand;
    }
    else {
        previousOperandTextElement.textContent = '';
    }
};

function setOperator(newOperator){
    if(previousOperand !== "" && currentOperand !== ""){

        let intermediateResult = operate(previousOperand, operator, currentOperand);

        if(handleDivisionByZeroError(intermediateResult)){
            return;
        }

        intermediateResult = roundDecimalNumber(intermediateResult);
        currentOperandTextElement.textContent = intermediateResult;
        previousOperand = intermediateResult;
    }
    else if(previousOperand !== "" && currentOperand === ""){
        operator = newOperator;
        return;
    }
    
    else if(currentOperand !== "" && previousOperand === ""){
        previousOperand = currentOperand;
        currentOperand = "";
    }
    else{
        return;
    }
    operator = newOperator;
    shoudResetDisplay = true;
    updateDisplay();
};


numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        appendInput(button.textContent);
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => setOperator(button.textContent));
});

decimalButton.addEventListener("click", () => {
    appendInput(decimalButton.textContent);
});

equalsButton.addEventListener("click", () => calculateResult());

clearButton.addEventListener("click", () => clearAll());

backspaceButton.addEventListener("click", () => deleteLastDigit());

percentButton.addEventListener("click", () => {

    if(currentOperand === "" || isNaN(Number(currentOperand))) return;

    currentOperand = Number(currentOperand);
    previousOperand = Number(previousOperand);

    if(operator === "" || isNaN(Number(previousOperand))){
        currentOperand = String(currentOperand / 100);
        previousOperand = "";
        shoudResetDisplay = true;
    }
    else if(operator === "+" || operator === "-"){
       currentOperand = (operator === "+") ? String(previousOperand + (((currentOperand) / 100) * previousOperand)) 
            : String(previousOperand - (((currentOperand) / 100) * previousOperand));
        
        previousOperand = "";
        operator = "";
        shoudResetDisplay = true;
    }
    else if(operator === "*" || operator === "/"){
        currentOperand = (operator === "*") ? String(previousOperand * (currentOperand / 100)) 
            : String(previousOperand / (currentOperand / 100));
        
        previousOperand = "";
        operator = "";
        shoudResetDisplay = true;
    }

    updateDisplay();
});

document.addEventListener("keydown", (event) => {
    console.log(event.key);
    if(!isNaN(Number(event.key))){
        appendInput(event.key);
    }
    else if(event.key === "Backspace"){
        deleteLastDigit();
    }
    else if(event.key === "Enter"){
        calculateResult();
    }
    else if(event.key === "."){
        appendInput(event.key);
    }
    else if(event.key === "Delete"){
        clearAll();
    }
    else if(event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/"){
        setOperator(event.key);
    }
});

updateDisplay();
// rounding
