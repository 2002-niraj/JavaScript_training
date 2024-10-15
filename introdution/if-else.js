
const readlinesync = require('readline-sync');

let age = readlinesync.question("what is your age:");

age = Number(age);

if(age<0){
    console.log("age can't be zero or negative")
}
else if(age<=18){
    console.log("you can't appers for voting")
}
else{
    console.log("you can appers for voting")
}