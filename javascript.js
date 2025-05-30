
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
    if(number.length > 15) return String(Number(number).toFixed(13)); 
    else return number;
};

function showResult(){
    result = operate(previousOperand, operator, currentOperand);

    if(handleDivisionByZeroError(result)){
        return;
    }

    result = roundDecimalNumber(String(result));
    currentOperand = result;
    previousOperand = "";
    operator = "";
    shoudResetDisplay = true;
    updateDisplay();
    
    
};


function appendInput(input){
    if(shoudResetDisplay){
        currentOperand = "";
        shoudResetDisplay = false;
    }
    if(currentOperand.includes('.') && input === '.'){
        return;
    }
    currentOperand += input;
    updateDisplay(); /** currentOperandTextElement.textContent = currentOperand;*/
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

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        appendInput(button.textContent);
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if(previousOperand !== "" && currentOperand !== ""){

            let intermediateResult = operate(previousOperand, operator, currentOperand);

            if(handleDivisionByZeroError(intermediateResult)){
                return;
            }

            intermediateResult = roundDecimalNumber(String(intermediateResult));
            currentOperandTextElement.textContent = intermediateResult;
            previousOperand = intermediateResult;
        }
        else if(previousOperand !== "" && currentOperand === ""){
            operator = button.textContent;
            return;
        }
        
        else if(currentOperand !== "" && previousOperand === ""){
            previousOperand = currentOperand;
            currentOperand = "";
        }
        else{
            return;
        }
        operator = button.textContent;
        shoudResetDisplay = true;
        updateDisplay();
    });
});

decimalButton.addEventListener("click", () => {
    appendInput(decimalButton.textContent);
});

equalsButton.addEventListener("click", () => {
    if(previousOperand !== "" && currentOperand !== "" && operator != "") showResult();
    else return;
});

clearButton.addEventListener("click", () => {
    clearOperation();
    updateDisplay();
});

backspaceButton.addEventListener("click", () => {

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
});

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

updateDisplay();
// rounding
// improve UI

