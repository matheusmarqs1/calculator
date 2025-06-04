// Variables to store the operands, operator and result of the calculator
let previousOperand = "";
let currentOperand = "";
let operator = "";
let result = "";
// Flag to indicate whether the display should be cleared before adding the next number.
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
    
    // Defines display limits and internal precision for calculations.
    const MAX_DISPLAY_LENGTH = 16;
    const MAX_DECIMAL_PLACES = 12;

    // Handles extreme numbers: Very large (>= 10^16) or very small (e.g., < 10^-12).
    // Formats them using exponential notation to fit the display.
    if((Math.abs(number) >= Math.pow(10, MAX_DISPLAY_LENGTH)) || (Math.abs(number) > 0 && Math.abs(number) < Math.pow(10, -(MAX_DECIMAL_PLACES)))){
        
        let result = String(number.toExponential(MAX_DECIMAL_PLACES -1));
        result = result.replace(/(\.\d*?)0+(e|$)/, '$1$2');
        result = result.replace(/\.(?=e)/, '');
        return result;
    }
   
    // Mathematical rounding for internal precision before display formatting.
    // Addresses floating-point inaccuracies (e.g., 0.1 + 0.2).

    const factor = Math.pow(10, MAX_DECIMAL_PLACES + 2);
    let roundedNumber = Math.round(factor * number) / factor;
    let formattedString = String(roundedNumber);

    // Final check: If the formatted string is still too long for the display.
    // This catches numbers with large integer parts that were not caught by the exponential check.
    if(formattedString.length > MAX_DISPLAY_LENGTH){
        
        let integerParthLength = String(Math.floor(Math.abs(roundedNumber))).length;
        let decimalPlacesToUse = MAX_DISPLAY_LENGTH - integerParthLength - (formattedString.includes('.') ? 1 : 0);
        if(decimalPlacesToUse < 0) decimalPlacesToUse = 0;

        return roundedNumber.toFixed(decimalPlacesToUse).replace(/\.?0+$/g, '');
    }

    // Returns the formatted string if it already fits the display.
    return roundedNumber.toPrecision(MAX_DECIMAL_PLACES).replace(/\.?0+$/g, '');

};

function appendInput(input){
    // If the shoudResetDisplay flag is true, clear the display for a new calculation or operator
    if(shoudResetDisplay){
        currentOperand = "";
        shoudResetDisplay = false;
    }
    // Prevents the user from typing multiple leading zeros or starting with a zero and another number
    if(currentOperand === '0' && input !== '.'){
        currentOperand = input;
        updateDisplay();
        return;
    }
    // Prevents adding multiple decimal points
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
    // Remove the last digit from the current operand, if any
    if(currentOperand !== ""){
        currentOperand = currentOperand.slice(0, -1);
    }
    // If there is no current operand, remove the operator if there is one
    else if (operator !== ""){
        operator = "";
    }
    // If there is no operator, remove the last digit of the previous operand
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
    // If there is a pending calculation (previousOperand and currentOperand are filled),
    // calculate the intermediate result before defining the new operator
    if(previousOperand !== "" && currentOperand !== ""){

        let intermediateResult = operate(previousOperand, operator, currentOperand);

        if(handleDivisionByZeroError(intermediateResult)){
            return;
        }

        intermediateResult = roundDecimalNumber(intermediateResult);
        currentOperandTextElement.textContent = intermediateResult;
        previousOperand = intermediateResult;
    }
    // If only the previous operand is filled, just update the operator
    else if(previousOperand !== "" && currentOperand === ""){
        operator = newOperator;
        return;
    }
    // If only the current operand is filled, move it to the previous operand
    // and clear the current operand for the next entry
    else if(currentOperand !== "" && previousOperand === ""){
        previousOperand = currentOperand;
        currentOperand = "";
    }
    // If both are empty, do nothing
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

    // If there is no previous operator or operand, calculate the percentage of the current number
    if(operator === "" || isNaN(Number(previousOperand))){
        currentOperand = String(currentOperand / 100);
        previousOperand = "";
        shoudResetDisplay = true;
    }

    // If operator is '+' or '-', calculate the percentage of previousOperand and add/subtract
    else if(operator === "+" || operator === "-"){
       currentOperand = (operator === "+") ? String(previousOperand + (((currentOperand) / 100) * previousOperand)) 
            : String(previousOperand - (((currentOperand) / 100) * previousOperand));
        
        previousOperand = "";
        operator = "";
        shoudResetDisplay = true;
    }

    // If operator is '*' or '/', calculate the percentage of currentOperand and multiply/divide
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
