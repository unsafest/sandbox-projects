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
    displayValue += event.target.textContent;
    document.querySelector(".display-result").innerHTML = displayValue;
}

document.querySelectorAll(".button-number").forEach(button => {
    button.addEventListener("click", handleNumberClick);
});

function handleOperatorClick(event) {
    operator = event.target.textContent;
}

document.querySelectorAll(".button-operator").forEach(button => {
    button.addEventListener("click", handleOperatorClick);
});

function clear() {
    document.querySelector("display-history").innerHTML = "";
    document.querySelector("display-result").innerHTML = "0";
}

function deleteLastChar() {

}

