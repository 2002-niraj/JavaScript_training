// 1) object creation First way
const person = {
  firstname: "Niraj",
  lastname: "Palmur",
  age: 23,
  isInten: true,
};

//accessing object properties
console.log(person["isInten"]);

//  Ex2
const person1 = {
  firstname: "Niraj",
  lastname: "Palmur",
  age: 23,
  isInten: true,
  fullname: function () {
    return this.firstname + " " + this.lastname;
  },
};
console.log(person1.fullname());

// how to add function in object
person1.greeting = function () {
  return "welcome" + " " + this.firstname;
};
console.log(person1.greeting());

// console.log(person1.greeting)  // returns a reference of function

// how symbol is used in object
const mysym = Symbol("key1");
const person2 = {
  firstname: "niraj",
  [mysym]: "mykey1",
};
console.log(person2[mysym]);

// 2) object creation Second way

const p2 = new Object();
p2["firstname"] = "rohan";
p2["lastname"] = "pawar";
p2["age"] = 23;
console.log(p2);

// object properties

// 1) adding a new perperties
console.log(p2);
p2["salary"] = 30000;
console.log(p2);

// 2) deleting properties

delete p2["age"];
console.log(p2);

// 3) how to freeze object

Object.freeze(person);
person.firstname = "Nishant";
console.log(person);

// 4) to find only keys from object and find only values from object
console.log(Object.keys(person));
console.log(Object.values(person));

// 5) method => object has property or not
console.log(person.hasOwnProperty("firstname")); // give true or false

// nested object
const myObj = {
  name: "John",
  age: 30,
  myCars: {
    car1: "Ford",
    car2: "BMW",
    car3: "Fiat",
  },
};

// ? is a extra protection
console.log(myObj.myCars?.car2);

// copy of object

const obj1 = { 1: "a", 2: "b" };
const obj2 = { 3: "c", 4: "d" };

const obj3 = { ...obj1, ...obj2 };
console.log(obj3);
