// only use let and const

const city_name = "solapur"
let first_name ="niraj",last_name="palmur";

console.log("FirstName:",first_name,"LastName:",last_name,"City:",city_name);

console.table([first_name,last_name,city_name]);

console.table({"firstname":first_name,"lastname":last_name,"city_name":city_name});

// prefer not to use var  because of issue in block and function scope
let middlename;   // undefined
console.log(middlename);

//You cannot re-declare a variable declared with let or const.