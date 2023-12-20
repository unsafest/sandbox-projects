let firstNumber = "";
let secondNumber = "";
let operator = "";
let displayValue = "";

function add(firstNumber, secondNumber) {
    return firstNumber + secondNumber;
}

function subtract(firstNumber, secondNumber) {
    return firstNumber - secondNumber;
}

function multiply(firstNumber, secondNumber) {
    return firstNumber * secondNumber;
}

function divide(firstNumber, secondNumber) {
    if (secondNumber == 0) {
        return "Error: division by 0"
    }
    else {
        return firstNumber / secondNumber;   
    }
}

function operate(firstNumber, secondNumber, operator) {
    switch (operator) {
        case "+":
            return add(firstNumber, secondNumber);
        case "-":
            return subtract(firstNumber, secondNumber);
        case "*":
            return multiply(firstNumber, secondNumber);
        case "/":
            return divide(firstNumber, secondNumber);
    }
}

function handleNumberClick(event) {
    if (operator) {
        if (event.target.textContent === "." && secondNumber.includes(".")) {
            return;
        }
        secondNumber += event.target.textContent;
    }
    else {
        if (event.target.textContent === "." && firstNumber.includes(".")) {
            return;
        }
        firstNumber += event.target.textContent; 
    }
    displayValue = firstNumber + " " + operator + " " + secondNumber;
    document.querySelector(".display-result").innerHTML = displayValue;
}

document.querySelectorAll(".button-number").forEach(button => {
    button.addEventListener("click", handleNumberClick);
});

function handleOperatorClick(event) {
    if (!operator && firstNumber) {
        operator = event.target.textContent; 
        displayValue = firstNumber + " " + operator + " " + secondNumber;
        document.querySelector(".display-result").innerHTML = displayValue;
    }
}

document.querySelectorAll(".button-operator").forEach(button => {
    button.addEventListener("click", handleOperatorClick);
});

document.querySelector(".button-equal").addEventListener("click", function() {
    if(firstNumber && operator && secondNumber) {
        let result = operate(parseFloat(firstNumber), parseFloat(secondNumber), operator);
        document.querySelector(".display-history").innerHTML = displayValue + " =";
        document.querySelector(".display-result").innerHTML = result;
        firstNumber = result;
        operator = "";
        secondNumber = "";
    }
});

function clearCalc() {
    firstNumber = "";
    operator = "";
    secondNumber = "";
    displayValue = "";
    
    document.querySelector(".display-history").innerHTML = "";
    document.querySelector(".display-result").innerHTML = "0";
}

function deleteLastChar() {
    if (secondNumber) {
        secondNumber = secondNumber.slice(0, -1);
    } else if (operator) {
        operator = "";
        displayValue = displayValue.slice(0, -3); // remove operator and spaces
    } else if (firstNumber) {
        firstNumber = firstNumber.slice(0, -1);
    } else {
        return;
    }

    if (operator) {
        displayValue = firstNumber + " " + operator + " " + secondNumber;
    } else {
        displayValue = firstNumber;
    }
    document.querySelector(".display-result").innerHTML = displayValue.trim();
}

document.querySelector(".button-delete").addEventListener("click", deleteLastChar);

