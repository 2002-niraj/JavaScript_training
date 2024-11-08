arr = [{category:"food",price:300}, {category:"food",price:500}, {category:"travel",price:500}];
 
let expance = {};
for(let i=0;i<arr.length;i++){

     expance = arr[i];

    if(!expance['category']){
        expance['category'] = 0;
    }

    expance['category'] = expance['category'] + expance['price']
    
}

console.log(expance)