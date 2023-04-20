// function getAllQuestions() {
//     let questionsReq = require('./questions.json');
//     let questionsArray = [];
//     let contentArray = [];
//     let correctArray = [];
//     for (let i = 0; i < questionsReq.length; i++) {
//         questionsArray.append(JSON.parse(questionsReq[i].question));
//         contentArray.append(JSON.parse(questionsReq[i].content));
//         correctArray.append(JSON.parse(questionsReq[i].correct));
//     }
//     return [questionsArray, contentArray, correctArray];
// }

function askQuestion(index) {
    questions=getAllQuestions();
    let q=questions[0];
    let c=questions[1];
    let a=questions[2];
    console.log(q[index]);
    c.forEach(element => {
        console.log(element);
    });
    let guess= prompt("Guess: ");
    if(guess.toLowerCase = a){
        return true;
    }
    return false;
}

function menu(text) {
    console.log(text);
    return prompt(">>>");
}


function getQuestionsFile() {
    const jsonFile = require('./questions.json');
    return jsonFile;
}

getQuestionsFile();