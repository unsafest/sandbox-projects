let playerScore = 0;
let computerScore = 0;
let roundWinner = undefined;
let playerChoice = undefined;

function getComputerChoice() {
    const rps = ["rock", "paper", "scissors"];
    let random = Math.floor(Math.random() * rps.length);
    return rps[random];
}

function getPlayerChoice(choice) {
    playerChoice = choice;
    console.log(playerChoice);
}

function game() {
    let computerChoice = getComputerChoice();
    playRound(playerChoice, getComputerChoice());

    if (playerScore >= 5 || computerScore >=5) {
        updateUI(playerScore, computerScore, playerChoice, computerChoice);
        
        setTimeout(() => {
            if (playerScore > computerScore) {
                alert("you win");
            }
            else {
                alert("computer wins");
            }
        }, 100);
    }
}

function playRound(playerSelection, computerSelection) {
    if (playerSelection === computerSelection) {
        roundWinner = "tie"
    }
    else if (
        (playerSelection === "rock" && computerSelection === "scissors") ||
        (playerSelection === "paper" && computerSelection === "rock") ||
        (playerSelection === "scissors" && computerSelection === "paper")
    ) {
        roundWinner = "player";
        playerScore++;
    }
    else {
        roundWinner = "computer";
        computerScore++;
    }
    updateUI(playerScore, computerScore, playerSelection, computerSelection);
    return roundWinner;
}

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".rps-button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            getPlayerChoice(button.id);
            game();
        })
    })
});

function updateUI(playerScore, computerScore, playerChoice, computerChoice) {
    updateScore(playerScore, computerScore);
    updateChoices(playerChoice, computerChoice);
}

function updateScore(playerScore, computerScore){
    const playerScoreElement = document.querySelector('#playerScore');
    const computerScoreElement = document.querySelector('#computerScore');

    playerScoreElement.textContent = `Player: ${playerScore}`;
    computerScoreElement.textContent = `Compuer: ${computerScore}`;
}

function updateChoices(playerChoice, computerChoice){
    const playerBoxEmoji = document.querySelector('.player-chose');
    const computerBoxEmoji = document.querySelector('.computer-chose');

    const choiceToEmoji = {
        'rock': '✊',
        'paper': '✋',
        'scissors': '✌️'
    };

    playerBoxEmoji.textContent = choiceToEmoji[playerChoice];
    computerBoxEmoji.textContent = choiceToEmoji[computerChoice];
}

// Path: Rps/rps.html