const color = ["yellow","red","pink"]

// let x = "";
// for(let i=0;i<color.length;i++){
//      x = x+" "+color[i];
// }
// console.log(x);


// // for in loop
// let text = ""
// for(let x in color){
//     text = text+color[x];
// }
// console.log(text)

// // for of loop
// let text1 = ""
// for(let x of color){
//     text1 = text1 +x
// }
// console.log(text1)


// while loop
let text2 = "";
let x=0
while(x<3){
    text2 = text2+color[x]
    x++
}
console.log(text2);

// do while loop