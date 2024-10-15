//console.log(addition(2,3));

// normal function 1
function addition(a, b) {
  let result = a ** b;
  return result;
}

// normal function 2

function display(username) {
  if (username != "" && username != undefined && username != null) {
    return "vaild username";
  } else {
    return "username is empty";
  }
}

console.log(display());

// if nothing in argument then parameter goes as undefined
// to takle this we can give as default parameter

// function with default parameter

function addition1(b, a = 2) {
  let result = a ** b;
  return result;
}

//console.log(addition1(4))

// rest parameter

function addition2(...input) {
  let sum = 0;
  for (x of input) {
    sum = sum + x;
  }
  return sum;
}
//console.log(addition2(1,2,3,4,5));

// spread op
// 1)
const array1 = [10, 20, 30, 40];
const array2 = [50, 60, 70, 80];

const array3 = [...array1, ...array2, 90, 100];

console.log(array3);

// 2) another example of spread op
const obj1 = {
  firstname: "niraj",
  lastname: "palmur",
};
// copy to another object

const obj2 = {...obj1}
console.log(obj2);


// functional  expression
const x = function(a,b){
  return a+b;
}
let z = x(4,7)
console.log(z);

// scope level in function

function one(username){

    function two(){

      let website = "youtube";
      console.log(username+" "+website)
    }
    console.log(website)
    two()  // error not allowed
}

one()
