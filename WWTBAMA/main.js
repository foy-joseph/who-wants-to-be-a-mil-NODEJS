const fs = require('fs');
const prompt = require('prompt-sync')();
const fileString = 'CA1/questions.json';
const highScoresFileString = 'CA1/highScores.json';

// initialise game
function initialiseGame(){ // this is if there are no existing records in the highscores
    const placeholders = '[\n'+
        '{ "name": "****", "score": 0 },\n' +
        '{ "name": "****", "score": 0 },\n' +
        '{ "name": "****", "score": 0 },\n' +
        '{ "name": "****", "score": 0 },\n' +
        '{ "name": "****", "score": 0 }\n' +
    ']';
    fs.readFile(highScoresFileString, 'utf-8', function(err, data){
        const scoresJSON = JSON.parse(data);
        if (scoresJSON == ''){
            fs.writeFile(highScoresFileString, placeholders, function(err, result) {
                if(err) console.log('error' , err);
            });
        }
    });
}

function printHighScores(){ // Display highscores to the terminal
    fs.readFile(highScoresFileString, 'utf-8', function(err, data){
        if(err){
            console.error(err);
            return;
        }
        const scoresJSON = JSON.parse(data);
        console.log('High Scores:');
        let i = 0;
        scoresJSON.forEach(user => {
            if(i++<5){
                console.log(user.name + "\t" + user.score);
            }
        });
    });
}

function setHighScores(pName, pScore){ // this function takes in a user with name and score as perimeter
    fs.readFile(highScoresFileString, 'utf-8', function(err, data){
        const scores = JSON.parse(data);
        for (let i = 0; i < 5; i++) {
            const user = scores[i];
            if(pScore > user.score){ // if the users score makes the leaderboard, it is saved, if not, nothing happens
                console.log("Congrats, you made the Leaderboard!")
                scores.push({
                    "name": pName,
                    "score": pScore
                });
                scores.sort(function(a, b) {
                    return parseFloat(b.score) - parseFloat(a.score);
                });
                scores.pop(); // pop the 6th score - redundant
                fs.writeFileSync(highScoresFileString, JSON.stringify(scores));
                break;
            }
        }
    });
}

function listQuestionsAndAnswers(){ // this function allows the admin to view all questions and answers
    fs.readFile(fileString, 'utf-8', function(err, data){
        const questions = JSON.parse(data);
        for (let i = 0; i < questions.length; i++) {
            if(questions[i].correct == "a"){answer = 0;}
            else if (questions[i].correct == "b"){answer = 1;}
            else if(questions[i].correct == "c"){answer = 2;}
            else if(questions[i].correct == "d"){answer = 3;}
            console.log(questions[i].question + "\t" + questions[i].content[answer])
        }
    });
}

function listQuestions(){// this function allows the admin to view all questions without answers(no cheating)
    fs.readFile(fileString, 'utf-8', function(err, data){
        const questions = JSON.parse(data);
        for (let i = 0; i < questions.length; i++) {
            console.log(questions[i].question);
        }
    });
}

function addQuestion(){// allows admin to add new question
    let theQ = prompt("Enter your question: ");
    let choiceA = prompt("Enter choice a: ");
    let choiceB = prompt("Enter choice b: ");
    let choiceC = prompt("Enter choice c: ");
    let choiceD = prompt("Enter choice d: ");
    let answer = prompt("Enter which is answer [a],[b],[c],[d] : "); 
    fs.readFile(fileString, 'utf-8', function(err, data){
        const questions = JSON.parse(data);
        questions.push({ // new object
            "question": theQ ,
            "content": [choiceA, choiceB, choiceC, choiceD] ,
            "correct": answer
        });
        fs.writeFileSync(fileString, JSON.stringify(questions));

    });
}

function deleteQuestion(){ // allows admin to delete any question
    fs.readFile(fileString, 'utf-8', function(err, data){
        const questions = JSON.parse(data);
        for (let i = 0; i < questions.length; i++) {
            console.log((i) + "\t" + questions[i].question)
        }
        let deleteNumber = prompt("Which number question do you wish to delete [0],[1],[2],...?")
        questions.splice(deleteNumber,1); // remove chosen question object
        fs.writeFileSync(fileString, JSON.stringify(questions));
    });
}

function editQuestion(){ // allows admin to edit any question or answer
    fs.readFile(fileString, 'utf-8', function(err, data){
        const questions = JSON.parse(data);
        for (let i = 0; i < questions.length; i++) {
            console.log((i) + "\t" + questions[i].question)
        }
        const editNumber = prompt("Which number question do you wish to edit [0],[1],[2],...? ")
        if (editNumber<questions.length){
            let choice1 = prompt("Edit [1]-Question, [2]-choices, [3]-answer: ");
            if(choice1 == 1){
                questions[editNumber] = prompt("Enter edited question below: ");
            }
            else if(choice1 == 2){
                for (let j = 0; j < 4; j++) {
                    console.log((j) + "\t" + questions[editNumber].content[j])
                }
                let choice2 = prompt("Which number choice do you wish to edit [0],[1]...? ");
                questions[editNumber].content[choice2] = prompt("Enter new choice:")
            }
            else if(choice1 == 3){
                let choice3 = prompt("Enter new Answer [a],[b],[c],[d]: ")
                questions[editNumber].answer = choice3;
            } 
        }
        fs.writeFileSync(fileString, JSON.stringify(questions));
    });
}

function doAdmin(){
    console.log("Welcome to Admin. Please select from the following options: \n[1] List Questions (If you're honest)\n[2] List Questions & Answers (If you're not)\n[3] Add Question\n[4] Delete Question\n[5] Edit Question\n[*any other key*] Cancel");
    let adminChoice = prompt("Enter choice:\t");

    if(adminChoice == 1){listQuestions();}
    else if(adminChoice == 2){listQuestionsAndAnswers();}
    else if(adminChoice == 3){addQuestion();}
    else if(adminChoice == 4){deleteQuestion();}
    else if(adminChoice == 5){editQuestion();}
}

function printMainMenu() {
    const mainMenuText = "\nNode Pointaire Game\n====================\n\n[1] Play Pointaire Game\n[2] Game Admin\n[3] Top Five Scores\n[0] CANCEL\n\n";
    console.log(mainMenuText);
    mainMenuPrompt();
}

function mainMenuPrompt() {
    while (true) {
        const mainPrompt = prompt("Select option? [1, 2, 3, 0]:\t");
        if(mainPrompt == 1){
            //PLAY
            playGame();
            return;
        }
        else if(mainPrompt == 2){
            doAdmin();
            return;
        }  
        else if(mainPrompt == 3){
            printHighScores();
            return;
        }
        else if(mainPrompt == 0){
            console.log("See you again soon! ")
            return;
        }            
    }
}

function getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function playGame(){
    const userName = prompt("Username: ");
    var userScore = 0;

    let askAudience = true;
    let fifty50 = true;
    let dialFriend = true;

    const arrayOfNums = []
    fs.readFile(fileString, 'utf-8', function(err, data){
        const questions = JSON.parse(data);
        var i = 0;
        while (arrayOfNums.length < 10) {
            const temp = getRandomNumberBetween(0, questions.length);
            if(!arrayOfNums.includes(temp)){
                arrayOfNums[i++] = temp;
            }
        }

        const lilArray = ['a','b','c','d'];
        for (let q = 0; q < 10; q++) {
            console.log(questions[arrayOfNums[q]].question);
            for( let ch = 0; ch < 4; ch ++) {
                console.log((lilArray[ch]) + "\t" + questions[arrayOfNums[q]].content[ch]);
            }
            
            let helpText = '';
            if(fifty50){helpText+="[50]=50/50 | ";}
            if(askAudience){helpText+='[ask]=Ask the Audience | ';}
            if(dialFriend){helpText+='[dial]=Dial a Friend | '}
            let guess = prompt(helpText + "Take a guess... [a],[b],[c],[d]:\t");
            let corr = questions[arrayOfNums[q]].correct
            let incorrectArray = [];
            let shuffledIncorrectArray = [];
            
            if(guess == 50 && fifty50 == true){ // Fifty unused
                fifty50=false;
                if(corr == 'a'){
                    incorrectArray = ['b','c','d'];
                    shuffledIncorrectArray = shuffleArray(incorrectArray);
                    let incorrect2 = shuffledIncorrectArray[0];
                    let incorrect2Pos = lilArray.indexOf(incorrect2);
                    console.log("a\t" + questions[arrayOfNums[q]].content[0]);
                    console.log(incorrect2+"\t"+ questions[arrayOfNums[q]].content[incorrect2Pos])
                }
                else if(corr == 'b'){
                    incorrectArray = ['a','c','d'];
                    shuffledIncorrectArray = shuffleArray(incorrectArray);
                    let incorrect2 = shuffledIncorrectArray[0];
                    let incorrect2Pos = lilArray.indexOf(incorrect2);
                    if(questions[arrayOfNums[q]].content.indexOf(incorrect2) < 1){
                        console.log(incorrect2+"\t"+ questions[arrayOfNums[q]].content[incorrect2Pos])
                    }
                    console.log("a\t" + questions[arrayOfNums[q]].content[0]);
                    if(questions[arrayOfNums[q]].content.indexOf(incorrect2) > 1){
                        console.log(incorrect2+"\t"+ questions[arrayOfNums[q]].content[incorrect2Pos]);
                    }
                }
                else if(corr == 'c'){
                    incorrectArray = ['a','b','d'];
                    shuffledIncorrectArray = shuffleArray(incorrectArray);
                    let incorrect2 = shuffledIncorrectArray[0];
                    let incorrect2Pos = lilArray.indexOf(incorrect2);
                    if(questions[arrayOfNums[q]].content.indexOf(incorrect2) < 2){
                        console.log(incorrect2+"\t"+ questions[arrayOfNums[q]].content[incorrect2Pos])
                    }
                    console.log("a\t" + questions[arrayOfNums[q]].content[0]);
                    if(questions[arrayOfNums[q]].content.indexOf(incorrect2) > 2){
                        console.log(incorrect2+"\t"+ questions[arrayOfNums[q]].content[incorrect2Pos]);
                    }
                }
                else if(corr == 'd'){
                    incorrectArray = ['a','b','c'];
                    shuffledIncorrectArray = shuffleArray(incorrectArray);
                    let incorrect2 = shuffledIncorrectArray[0];
                    let incorrect2Pos = lilArray.indexOf(incorrect2);
                    console.log(incorrect2+"\t"+ questions[arrayOfNums[q]].content[incorrect2Pos]);
                    console.log("d\t" + questions[arrayOfNums[q]].content[3]);
                }

                guess = prompt("Surely now you'll get it...");
            }
            else if(guess == 50 && fifty50 == false){ //fifty used
                console.log("You've already used your 50/50!")
                q--;
                continue;
            }

            if(guess.toLowerCase() == 'dial' && dialFriend == true){ // dial unused
                dialFriend=false;
                const chance = getRandomNumberBetween(1,10);
                let dialText = "You're friend is 80% sure the answer is ";
                if(chance > 2){
                    dialText += corr;
                }
                else{
                    if(corr == 'a'){incorrectArray = ['b','c','d'];}
                    else if(corr == 'b'){incorrectArray = ['a','c','d'];}
                    else if(corr == 'c'){incorrectArray = ['a','b','d'];}
                    else if(corr == 'd'){incorrectArray = ['a','b','c'];}
                    shuffledIncorrectArray = shuffleArray(incorrectArray);
                    let incorrect2 = shuffledIncorrectArray[0];

                    dialText+=incorrect2;
                }
                console.log(dialText)
                q--;
                continue;

            }
            if(guess.toLowerCase() == 'dial' && dialFriend == false){ // dial used
                console.log("You've already dialed a friend!")
                q--;
                continue;
            }
            
            if(guess.toLowerCase() == 'ask' && askAudience == true){ // audience unused
                const audienceCount = 100;
                let countArray = [0, 0, 0, 0] // a , b, c, d, count respectively
                askAudience=false;
                let chance = 0;
                for (let i = 0; i < audienceCount; i++) { // get each audience members' vote
                    chance = getRandomNumberBetween(1,10)
                    if(chance >= 4){ // audience members have 60% chance of knowing the answer, otherwise they guess it randomly
                        if(corr =='a'){countArray[0]++;}
                        else if(corr =='b'){countArray[1]++;}
                        else if(corr =='c'){countArray[2]++;}
                        else if(corr =='d'){countArray[3]++;}
                    }
                    else{
                        let random0t3 = getRandomNumberBetween(0,3);
                        countArray[random0t3]++; // random guess
                    }
                }
                console.log("The votes are in: out of 100 people, " + countArray[0]+" say 'a', " +countArray[1]+" say 'b', " + countArray[2]+" say 'c', " + countArray[3]+" say 'd'" )
                q--;
                continue;
            }
            if(guess == corr){
                userScore++;
                console.log("Correct! Score: " + userScore);
                console.log("Next question...");
            }
            else {
                console.log("Incorrect answer! :( The correct answer was " + questions[arrayOfNums[q]].correct )
                break;
                //save
            }
        }
        setHighScores(userName, userScore);



    });
}



function main(){
    initialiseGame();
    printMainMenu();
}

main();