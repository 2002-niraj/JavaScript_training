const sidebarStep = document.querySelectorAll(".step__num");
const formStep = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");
const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");

const step__cards = document.querySelectorAll('.step__card');
const switcher = document.querySelector('.switch');

const obj = {
  plan:null,
  price:null,
  status:null
};

let time;


let stepNum = 0;

nextBtns.forEach((nextBtn) => {
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (stepNum === 0) {
      if (!formValidation()) return;
    }

    stepNum++;
    showStep(stepNum);

    if(stepNum===4){
      sidebarStep[3].classList.add('active')
    }
  });
});

prevBtns.forEach((prevBtn) => {
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (stepNum > 0) {
      stepNum--;
      showStep(stepNum);
    }
  });
});

function formValidation() {
  let isValid = true;

  document.getElementById("error1").style.display = "none";
  document.getElementById("message1").style.display = "none";
  document.getElementById("error2").style.display = "none";
  document.getElementById("error3").style.display = "none";
  document.getElementById("message3").style.display = "none";

  inputs.forEach((input) => {
    const value = input.value.trim();

    if (input.name === "name") {
      if (value.length === 0) {
        document.getElementById("error1").style.display = "flex";
        isValid = false;
      } else if (!/^[a-zA-Z]+/.test(value)) {
        document.getElementById("message1").style.display = "flex";
        isValid = false;
      }
    }

    if (input.name === "email") {
      if (value.length === 0) {
        document.getElementById("error2").style.display = "flex";
        isValid = false;
      }
    }

    if (input.name === "phone") {
      if (value.length === 0) {
        document.getElementById("error3").style.display = "flex";
        isValid = false;
      } else if (value.length !== 10) {
        document.getElementById("message3").style.display = "flex";
        isValid = false;
      }
    }
  });

  return isValid;
}

const showStep = (x) => {
  sidebarStep.forEach((step, index) => {
    step.classList.toggle("active", index === x);
  });

  formStep.forEach((step, index) => {
    step.classList.toggle("step__active", index === x);
  });

  if(stepNum ===1){
      showPrice();
  }
};




step__cards.forEach((card)=>{

  card.addEventListener('click',()=>{
     document.querySelector('.active2').classList.remove("active2");
     card.classList.add("active2");
     
     obj.plan = card.querySelector('.plan__name').textContent
     obj.price = card.querySelector('.plan__month').textContent

  });
})

switcher.addEventListener('click',()=>{

  const bool = switcher.querySelector('input').checked;
  
  showPrice(bool)
  obj.status = bool
  
})

function showPrice(checked){
     const monthPrice = [9,12,15];
     const yearPrice = [90,120,150];

     const prices = document.querySelectorAll(".plan__month");
     const plan__names = document.querySelectorAll('.plan__name');
     const free  = document.querySelectorAll('.free');
     const activeCard = document.querySelector('.active2')

     if(checked){
      prices[0].innerHTML = `$${yearPrice[0]}/yr`;
      free[0].style.display = 'flex';
      prices[1].innerHTML = `$${yearPrice[1]}/yr`;
      free[1].style.display = 'flex';
      prices[2].innerHTML = `$${yearPrice[2]}/yr`;
      free[2].style.display = 'flex';

      if(activeCard){
         const activeIndex = Array.from(step__cards).indexOf(activeCard);
         obj.price = prices[activeIndex].textContent;
         obj.plan = plan__names[activeIndex].textContent;
      }

     }
     else{
      prices[0].innerHTML = `$${monthPrice[0]}/mo`;
      free[0].style.display = 'none';
      prices[1].innerHTML = `$${monthPrice[1]}/mo`;
      free[1].style.display = 'none';
      prices[2].innerHTML = `$${monthPrice[2]}/mo`;
      free[2].style.display = 'none';

      if(activeCard){
        const activeIndex = Array.from(step__cards).indexOf(activeCard);
        obj.price = prices[activeIndex].textContent;
        obj.plan = plan__names[activeIndex].textContent;
     }

     }
}


showStep(stepNum);

console.log(obj)