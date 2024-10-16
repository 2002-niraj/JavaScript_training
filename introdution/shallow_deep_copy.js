
// shallow copy
let employee = {
    eid: "E102",
    ename: "Jack",
    eaddress: "New York",
    salary: 50000,
    arr : [10,20,30,40]
}

console.log("employee=>",employee)
const myemployee = employee
console.log("myemployee=>",myemployee)

//When you assign one object to another using the assignment operator (=), 
//a shallow copy is created:
myemployee.salary = 264000
myemployee.arr[2] = 264

 console.log("after modification")
console.log("employee=>",employee)
console.log("myemployee=>",myemployee)

//Deep Copy

let employee1 = {
    eid: "E102",
    ename: "Jack",
    eaddress: "New York",
    salary: 50000,
    arr : [10,20,30,40]
}

console.log("deep copy")
let employeecopy = JSON.parse(JSON.stringify(employee1))
console.log("deep copy of employee=>",employeecopy)
console.log("employee:",employee1)

employeecopy.salary = 264000
employeecopy.arr[2] = 264

console.log("after modification")
console.log("employee=>",employee1)
console.log("employee copy =>",employeecopy)