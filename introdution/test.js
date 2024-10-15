console.log("Welcome to javascript");
console.log("Name is:","Niraj");


// normal function
const radius = [3,5,4,2]
const area = (radius)=>{

    for(let x of radius){
        
        let result = 3.14*x*x;
        console.log(result)
    }
}

area(radius)