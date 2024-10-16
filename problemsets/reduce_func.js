const arr = [23, 45, 11, 23, 34];

// write a normal function to find sum of array
const sumOfArray = (arr) => {
  let sum = 0;
  for (let x of arr) {
    sum += x;
  }
  return sum;
};
console.log(sumOfArray(arr));

//now this using  reduce function

const findsum = (acc, curr) => {
  acc = acc + curr;
  return acc;
};
const output = arr.reduce(findsum, 0);

console.log(output);

// write a reduce function to find max element in array

const maxElement = (acc, curr) => {
  if (acc < curr) {
    acc = curr;
  }
  return acc;
};
const max = arr.reduce(maxElement, 0);
console.log(max);
