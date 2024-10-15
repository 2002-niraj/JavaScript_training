// const addTwo = (a,b)=>{
//     return a +b;
// }

// shortcut if arrow function
const addTwo = (a,b) => (a+b);
let z = addTwo(4,5);
console.log("addition of two number is:",z);

const obj = {
    firstname:"niraj",
    lastname :"palmur",
    message :function(){
        console.log("welcome,",this.firstname);
        console.log(this);
        
    }
}

obj.message()
obj.firstname = 'sam';
obj.message()

console.log(this)  // {}
