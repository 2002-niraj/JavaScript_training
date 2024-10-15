// array is a varibale which can hold more than two value

const arr = [10,30,20,40]
console.log(arr.length)

// we can easily access any element and manipulte it easily 
arr[2] = 264
console.log(arr)  // modified array

// in js array are object
console.log(typeof arr)  // object

// array method
// 1) tostring method

const arr1 = arr.toString()
console.log(arr1);

// 2) join method 
const text = ["my","name","is","niraj"]
let sentence = text.join(" ")
console.log(sentence)

//3) remove the last elemet and update in original array
arr.pop()
console.log(arr)

// 4)) push method
// add a new element at end of the array 
//modify the original array and return as new array length
let n = arr.push(18)  
console.log(arr,n)

// 5) shift method
// remove first element from array and return that element
// modify in original array
let r = arr.shift()
console.log(arr,r)

// 6) unshift method
// add element to the begining and return new array length
let n1 = arr.unshift(10) 
console.log(arr,n1)

// 7) delete operater
// the array element deleted using delete operater
// but length can'not be affected
console.log(arr.length);
let d = delete arr[1]  // true
console.log(arr,d, arr.length)

//  8) concate method

 const a = [10,20,30,40]
 const b = [50,60,70,80]
 const c = [90,100]

console.log( a.concat(b,c)) 
//it will give new array donot change in exiting array


// 9)) sort method
// sort method is used to sort array alphabetically
const array = [3,11,13,100,264]
array.sort()  // modify the original array
console.log(array);

// if you want to sort method for asending and desending 
let compare = (a,b)=>{
    return a-b;
}
array.sort(compare)
console.log(array); // asending (a-b) desending (b-a)

// 10) reverse the array

// 11) splice method
// add a new element in array (postion,number of deleted element,elements)
// it return deleted item and modify original array
const myarray = [33,12,34,67,45,78];
let deletedele = myarray.splice(2,3,1011,1012,1013,1014)
console.log("deleted element from original array:",deletedele)
console.log(myarray)

// 12) slice out piece of array it create a new array

console.log(arr.slice(2,4))