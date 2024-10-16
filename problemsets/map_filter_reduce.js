// map method

// create a new array by performing some operationon each array element
// map vs forEach
const arr = [45,10,14,16];
const a = arr.map((value,index,array)=>{
      
      console.log(value,index,array)
      return value+1
})

console.log(a)

//filter method

//filter an array value that passes the test, create a new array
const arr1 = [45,10,14,16];
let b = arr1.filter((value)=>{

    return value<40;
});
console.log("filtered array:",b)
console.log(arr1);


// reduce function
// reduce an array to single value
const arr2 = [45,10,14,16];

const add = (a1,b1)=>{
  return a1 +b1
}
let c = arr2.reduce(add)
console.log("value is:",c);
