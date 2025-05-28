
let previousOperand = "";
let currentOperand = "";
let operator = "";
let result = "";
let shoudResetDisplay = false;

const numberButtons = document.querySelectorAll('[data-number]');
const currentOperandTextElement = document.querySelector('.current-operand');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('.equals-button');
const decimalButton = document.querySelector('.decimal-button');
const clearButton = document.querySelector('.function-button-clear');

function roundDecimalNumber(number){
    if(number.length > 15) return String(Number(number).toFixed(13)); 
    else return number;
};

function showResult(){
    result = operate(previousOperand, operator, currentOperand);

    if(typeof(result) === "string" && result.includes("LMAO")){
        currentOperandTextElement.textContent = result;
        clearDisplay();
        shoudResetDisplay = true;
        return;
    }

    result = roundDecimalNumber(String(result));
    currentOperandTextElement.textContent = result;
    currentOperand = result;
    previousOperand = "";
    operator = "";
    shoudResetDisplay = true;
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
    currentOperandTextElement.textContent = currentOperand;
};

function clearDisplay(){
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

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        appendInput(button.textContent);
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if(previousOperand !== "" && currentOperand !== ""){

            let intermediateResult = operate(previousOperand, operator, currentOperand);

            if(typeof(intermediateResult) === "string" && intermediateResult.includes("LMAO")){
                currentOperandTextElement.textContent = intermediateResult;
                clearDisplay();
                shoudResetDisplay = true;
                return;
            }

            intermediateResult = roundDecimalNumber(String(intermediateResult));
            currentOperandTextElement.textContent = intermediateResult;
            previousOperand = intermediateResult;
        }
        else{
            previousOperand = currentOperand;
        }
        operator = button.textContent;
        currentOperand = "";
        shoudResetDisplay = true;
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
    clearDisplay();
    currentOperandTextElement.textContent = "0";
    
});


// arredondamento
// digitar dois operadores seguidos
