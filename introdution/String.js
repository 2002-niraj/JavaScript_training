// string are used to manipulate or store text
//  single and double quout
// \t \n
let name = "niraj"

console.log(name.length)

// this we used ofenly
console.log(`my name is ${name}`);

// string properties and method
// 1)) charAt()
console.log(name.charAt(0))
// and otherway
console.log(name[0]);

// 2)) to compare two string in js (===)

// 3)toUpperCase()
console.log(name.toUpperCase());

 // 4) split function
let text = "my name is niraj";
const arr = text.split(" ")
console.log(arr)

  // 5) slice(start, end)
console.log(name.slice(2))

// 6) replace(old,new)

//7) trim()

// 8)) startwith and endwith
console.log(text.startsWith("niraj"));
console.log(text.endsWith("niraj"));

