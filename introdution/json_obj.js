// 1) Converting a JSON Text to a JavaScript Object

let text = '{ "employees" : [' +
'{ "firstName":"John" , "lastName":"Doe" },' +
'{ "firstName":"Anna" , "lastName":"Smith" },' +
'{ "firstName":"Peter" , "lastName":"Jones" } ]}';

const obj = JSON.parse(text)
console.log(obj)

console.log(obj.employees[1].firstName) // anna

// JSON.stringify()

// A common use of JSON is to exchange data to/from a web server.

// When sending data to a web server, the data has to be a string.

// Convert a JavaScript object into a string with JSON.stringify().

const person = {
    firstname: "Niraj",
    lastname: "Palmur",
    age: 23
  };

  const myjson = JSON.stringify(person)
  console.log(myjson ,",type is:",typeof myjson)
  