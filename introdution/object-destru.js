const person = {
    firstname: "Niraj",
    lastname: "Palmur",
    age: 23,
    isInten: true,
    fullname: function () {
      return this.firstname + " " + this.lastname;
    },
  };
  
  // object destructure {}
  const {firstname:f_name} = person
  console.log(f_name)

  // destructure array and object

//   1) destructure array
let a,b,rest;
[a,b] = [10,20]
console.log(a);

[a,b,...rest] = [10,20,30,40];
console.log(rest)

const arr = [1,2,3,4,5]
const [a1,b1] = arr;
console.log(a1,b1)

// 2) destructing object
 
const myobj = {firstname:"Niraj",lastname:"palmur"}
const {firstname:f,lastname:l} = myobj
console.log(f)
console.log(l)