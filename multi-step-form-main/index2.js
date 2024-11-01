const str = "$90/mo";

let num = Number(str.slice(1,2))
console.log(num,typeof(num))

const match1 = str.match(/\d+/)
console.log(match1[0]);



