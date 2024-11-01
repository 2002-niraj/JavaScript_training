const str = "$9/mo";

let num = Number(str.slice(1,2))
console.log(num,typeof(num))


function ShowMonthYear(){

    if(obj.status){
        
      boxs.forEach((box)=>{
           
        box.querySelector('.year').style.display = 'flex';
        box.querySelector('.month').style.display = 'none'
      })
    }
    else{
      boxs.forEach((box)=>{
           
        box.querySelector('.year').style.display = 'none';
        box.querySelector('.month').style.display = 'flex';
      })
    }
  }