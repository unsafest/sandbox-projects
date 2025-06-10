let playerScore = 0;
let computerScore = 0;
let roundWinner = undefined;
let playerChoice = undefined;

document.addEventListener('DOMContentLoaded', () => {
    
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
        playRound(playerChoice, computerChoice);
    
        if (playerScore >= 5 || computerScore >=5) {
            updateUI(playerScore, computerScore, playerChoice, computerChoice);
            document.getElementById("reset").innerHTML = "Play again?";
            
            // Let the UI update before the alert
            setTimeout(() => {
                if (playerScore > computerScore) {
                    document.querySelector('h2').textContent = "🎉 Player wins! 🎉";
                }
                else {
                    document.querySelector('h2').textContent = "Computer wins!";
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
        displayRoundWinner(roundWinner, playerSelection, computerSelection);
    }
    
    function displayRoundWinner(roundWinner, playerSelection, computerSelection) {
        if (roundWinner === "player") {
            document.querySelector('h3').textContent = `${playerSelection} beats ${computerSelection}`;
        }
        else if (roundWinner === "computer") {
            document.querySelector('h3').textContent = `${playerSelection} is beaten by ${computerSelection}`;
        }
        else {
            document.querySelector('h3').textContent = `${playerSelection} ties with ${computerSelection}`;
        }
    }

    const buttons = document.querySelectorAll(".rps-button");
    
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // if either score has reached 5, don't play a new round
            if (playerScore >= 5 || computerScore >= 5) {
                return;
            }
            getPlayerChoice(button.id);
            game();
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
        computerScoreElement.textContent = `Computer: ${computerScore}`;
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
    
    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        roundWinner = undefined;
        playerChoice = undefined;
        document.querySelector('.player-chose').textContent = '❔';
        document.querySelector('.computer-chose').textContent = '❔';
        document.querySelector('h3').textContent = 'Best of five';
        document.querySelector('h2').textContent = 'You know what to do! 👇';
        document.getElementById("reset").innerHTML = "Reset";
        updateScore(0, 0);
    } 

    document.getElementById("reset").addEventListener("click", resetGame);
});

// Path: Rps/rps.html