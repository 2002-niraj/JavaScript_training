// input  = 287

// output = arr = [7,8,2]

const func = (num)=>{
     let rem =0;
     let arr =[]
     while(num>0){
        rem = num%10
        arr.push(rem)
        num = Math.floor(num/10)
     }
     return arr
}

console.log(func(287))