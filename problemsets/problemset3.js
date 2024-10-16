const user = 
[
    {firstname:"niraj",lastname:"palmur",salary:32000},
    {firstname:"rohan",lastname:"pawar",salary:22000},
    {firstname:"nishant",lastname:"kulkarni",salary:40000},
    {firstname:"rajkumar",lastname:"jadhv",salary:32000}
]

// 1)["niraj palmur","rohan pawar"...]
const output = user.map((x)=>{
    return x.firstname+ " "+x.lastname
})
console.log(output)

// 2) {32000:2,22000:1,40000:1}

const output1 = user.reduce((acc,curr)=>{

    if(acc[curr.salary]){
          acc[curr.salary]= ++acc[curr.salary];
    }
    else{
        acc[curr.salary] = 1;
    }

    return acc
} , {})

console.log(output1)

// 3)firstname of peoples whose salary is more than 30000

/*
const output3 = user.filter(x=>{
    return x.salary>=30000
})
const output4 = output3.map(x=>{
    return x.firstname
})
console.log(output4) */


// using map and filter
const output4 = user.filter(x=>x.salary>=30000).map(x=>x.firstname)
console.log(output4)


// using reduce 
const output5 = user.reduce((acc,curr)=>{

     if(curr.salary>30000){
        acc.push(curr.firstname)
     }
     return acc
},[])

console.log(output5)