const sidebarStep = document.querySelectorAll(".step__num");
const formStep = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");
const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");
const step__cards = document.querySelectorAll(".step__card");
const switcher = document.querySelector(".switch");
const boxs = document.querySelectorAll(".box");
const selected__plan = document.querySelector("#selected__plan");
const changePlanBtn = document.querySelector("#change-plan");
const selected_addon = document.querySelector("#selected-addon");
const total_price = document.querySelector("#total_amt span:nth-child(2)");
const total_text = document.querySelector("#total_amt span:nth-child(1)");


let stepNum =0;
const details = {

  userDetails:{
    name:null,
    email:null,
    phone:null
  },
  obj:{
    plan_name:null,
    plan_price:null,
    switch_status:null
  },
  addOn:[],
  total:null
}

if (!localStorage.getItem("hasLoaded")) {
  localStorage.clear();
  localStorage.setItem("hasLoaded", "true");
}

document.addEventListener("DOMContentLoaded", loaddata);

function loaddata(){
   


   const storedDetails = JSON.parse(localStorage.getItem("details"))
   stepNum = Number(localStorage.getItem("current_step"));
   if(stepNum === 4){
    localStorage.clear();
    stepNum = 0;
    showStep(stepNum);
    return;
   }

   if(storedDetails){
    Object.assign(details , storedDetails);
    inputValueFunc();
    selectedPlan();
    selectedAddonFunc();
   }



   showStep(stepNum);
}


function inputValueFunc(){
     
document.getElementById("name").value = details.userDetails.name || "";
document.getElementById("email").value = details.userDetails.email || "";
document.getElementById("phone").value = details.userDetails.phone || "";
  
}

function selectedPlan(){
    
  const plan = Array.from(step__cards).find(
    (plan) => plan.querySelector(".plan__name").textContent === details.obj.plan_name
  );
  if(plan){
    document.querySelector(".active2").classList.remove("active2");
      plan.classList.add("active2");
  }
  if (details.obj.switch_status) {
    document.querySelector(".yearly__plan").style.color = "#02295a";
    document.querySelector(".monthly__plan").style.color = "#9699ab";
  } else {
    document.querySelector(".monthly__plan").style.color = "#02295a";
    document.querySelector(".yearly__plan").style.color = "#9699ab";
  }
}

function selectedAddonFunc(){

  details.addOn.forEach((addon) => {

    const box = Array.from(boxs).find(
      (box) => box.querySelector(".box_name").textContent === addon.name
    );

    if (box) {

      let price;
      if (details.obj.switch_status) {
        price = box.querySelector(".year").textContent.match(/\d+/)[0];
      } else {
        price = box.querySelector(".month").textContent.match(/\d+/)[0];
      }
      addon.price = Number(price);
      box.querySelector("input").checked = true;
    }
  });


}



// Next and prev button
nextBtns.forEach((nextBtn) => {
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (stepNum === 0) {
      if (!formValidation()) 
        return;
    }

    stepNum++;
    localStorage.setItem("current_step", JSON.stringify(stepNum));
    showStep(stepNum);

    if (stepNum === 4) {
      sidebarStep[3].classList.add("active");
    }

  });
});

prevBtns.forEach((prevBtn) => {
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (stepNum > 0) {
      stepNum--;
      localStorage.setItem("current_step", JSON.stringify(stepNum));
      showStep(stepNum);
    }
  });
});


/* this is form vaildation function of step-1 
  if any input field is empty it return true ( display message or error) otherwise false 
  */

  function ClearErrorMessage(){
    document.getElementById("error1").style.display = "none";
    document.getElementById("message1").style.display = "none";
    document.getElementById("message2").style.display = "none";
    document.getElementById("error2").style.display = "none";
    document.getElementById("error3").style.display = "none";
    document.getElementById("message3").style.display = "none";
  }

  function formValidation() {
    let isValid = true;
  
     ClearErrorMessage();
    inputs.forEach((input) => {

      const value = input.value.trim();
  
      if (input.name === "name") {
        let flag = true;
        if (value.length === 0) {

          document.getElementById("error1").style.display = "flex";
          input.style.borderColor = "red";
          isValid = false;
          flag = false;
   
        } else if (!/^[a-zA-Z_ ]+$/.test(value)) {
           
          //^[a-zA-Z_ ]*$
          document.getElementById("message1").style.display = "flex";
          input.style.borderColor = "red";
          isValid = false;
          flag = false;
        }
  
        if (flag === true) {
         input.style.borderColor = "hsl(243,100%,62%)";
          details.userDetails.name = value;
        }
      }
  
      if (input.name === "email") {
        let flag1 = true;
        if (value.length === 0) {
          document.getElementById("error2").style.display = "flex";
          input.style.borderColor = "red";
          isValid = false;
          flag1 = false;
        }
        else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)){
          document.getElementById("message2").style.display = "flex";
          isValid = false;
          flag1 = false;
        }
  
        if (flag1 === true) {
          input.style.borderColor = "hsl(243,100%,62%)";
          details.userDetails.email = value;
        }
      }
  
      if (input.name === "phone") {
        let flag2 = true;
        if (value.length === 0) {
          document.getElementById("error3").style.display = "flex";
          input.style.borderColor = "red";
          isValid = false;
          flag2 = false;
        } else if (!/^[1-9]\d{9}$/.test(value)) {

          document.getElementById("message3").style.display = "flex";
          input.style.borderColor = "red";
          isValid = false;
          flag2 = false;
        }
  
        if (flag2 === true) {
          document.getElementById("phone").style.borderColor = "hsl(243,100%,62%)";
          details.userDetails.phone = value;
        }
      }
  
    });
    
    localStorage.setItem("details",JSON.stringify(details))
    return isValid;
  }


/* this function shows active step/page */
const showStep = (x) => {

  sidebarStep.forEach((step, index) => {
    step.classList.toggle("active", index === x);
  });

  formStep.forEach((step, index) => {
    step.classList.toggle("step__active", index === x);
  });

  if (x === 1) {

    if(details.obj.switch_status){
      switcher.querySelector("input").checked = true;
    }
    showPrice(details.obj.switch_status);
 
  }

  if (x === 2) {
    ShowMonthYear(details.obj.switch_status);
  }

  if (x === 3) {
    showDetails();
    selectedAddon();
    totalFunc();
  }

  if(x == 4){
    console.log(details)
  }

};

/* this is used to store plan name, price content when user 
  click on any card in step 2*/
  step__cards.forEach((card) => {

    card.addEventListener("click", () => {

      document.querySelector(".active2").classList.remove("active2");
      card.classList.add("active2");
  
      details.obj.plan_name = card.querySelector(".plan__name").textContent;
  
      let price = card.querySelector(".plan__month").textContent;
      price = price.match(/\d+/);
      details.obj.plan_price = Number(price[0]);
  
      localStorage.setItem("details",JSON.stringify(details));
    });
  });


  /*  this store the status (true of false) true means yearly_plan and 
     false means monthly plan  bydefault status false */
switcher.addEventListener("click", () => {
  const bool = switcher.querySelector("input").checked;

  showPrice(bool);
  details.obj.switch_status = bool;
  localStorage.setItem("details",JSON.stringify(details));
  updateAddonPrices();

  if (bool) {
    document.querySelector(".yearly__plan").style.color = "#02295a";
    document.querySelector(".monthly__plan").style.color = "#9699ab";
  } else {
    document.querySelector(".monthly__plan").style.color = "#02295a";
    document.querySelector(".yearly__plan").style.color = "#9699ab";
  }

 
  totalFunc();
});



/* this function show prices on step 2 monthly or yearly 
  when toogle button is checked it show yearly price otherwice monthly price
  and by default first card is activeCard */
  function showPrice(checked) {
    const monthPrice = [9, 12, 15];
    const yearPrice = [90, 120, 150];
  
    const prices = document.querySelectorAll(".plan__month");
    const plan__names = document.querySelectorAll(".plan__name");
    const free = document.querySelectorAll(".free");
    const activeCard = document.querySelector(".active2");
  
    if (checked) {
      prices[0].innerHTML = `$${yearPrice[0]}/yr`;
      free[0].style.display = "flex";
      prices[1].innerHTML = `$${yearPrice[1]}/yr`;
      free[1].style.display = "flex";
      prices[2].innerHTML = `$${yearPrice[2]}/yr`;
      free[2].style.display = "flex";
  
      if (activeCard) {
        const activeIndex = Array.from(step__cards).indexOf(activeCard);
        let price = prices[activeIndex].textContent;
        price = price.match(/\d+/);
        details.obj.plan_price = Number(price[0]);
        details.obj.plan_name = plan__names[activeIndex].textContent;
        details.obj.switch_status = true;
      }
    } else {
      prices[0].innerHTML = `$${monthPrice[0]}/mo`;
      free[0].style.display = "none";
      prices[1].innerHTML = `$${monthPrice[1]}/mo`;
      free[1].style.display = "none";
      prices[2].innerHTML = `$${monthPrice[2]}/mo`;
      free[2].style.display = "none";
  
      if (activeCard) {
        const activeIndex = Array.from(step__cards).indexOf(activeCard);
        let price = prices[activeIndex].textContent;
        price = price.match(/\d+/);
        details.obj.plan_price = Number(price[0]);
        details.obj.plan_name = plan__names[activeIndex].textContent;
        details.obj.switch_status = false;
      }
    }
  }

  //   when user checked on checkbox name, and price of that box pushed in addon array
boxs.forEach((box) => {
  const checkbox = box.querySelector(".checkbox");

  checkbox.addEventListener("change", () => {
    const name = box.querySelector(".box_name").textContent;
    let price;

    if (checkbox.checked) {
      if (details.obj.switch_status) {
        price = Number(box.querySelector(".year").textContent.match(/\d+/)[0]);
      } else {
        price = Number(box.querySelector(".month").textContent.match(/\d+/)[0]);
      }

      details.addOn.push({ name: name, price: price });
      box.classList.add("active2");
    } else {
      details.addOn = details.addOn.filter((add) => add.name !== name);
      box.classList.remove("active2");
    }
    totalFunc();
    localStorage.setItem("details",JSON.stringify(details));
  });
});

// when switch is toogleed then this function exectued
// it will updated the price in array
function updateAddonPrices() {

  details.addOn.forEach((addon) => {

    const box = Array.from(boxs).find(
      (box) => box.querySelector(".box_name").textContent === addon.name
    );

    if (box) {
      let price;
      if (details.obj.switch_status) {
        price = box.querySelector(".year").textContent.match(/\d+/)[0];
      } else {
        price = box.querySelector(".month").textContent.match(/\d+/)[0];
      }
      addon.price = Number(price);
      localStorage.setItem("details",JSON.stringify(details));
    }
  });

}

/* in step-3 page  yearly price get showed when status is true otherwise monthly in each box */
function ShowMonthYear(status) {
  boxs.forEach((box) => {
    if (status) {
      box.querySelector(".year").style.display = "flex";
      box.querySelector(".month").style.display = "none";
    } else {
      box.querySelector(".year").style.display = "none";
      box.querySelector(".month").style.display = "flex";
    }
  });
}


/* this function shows name and price which user selected in step 2 
    Ex: Pro (Monthly) $15/mo
   */
    function showDetails() {
      if (selected__plan.children.length > 1) {
        Array.from(selected__plan.children).forEach((child) => {
          selected__plan.removeChild(child);
        });
      }
    
      const name = document.createElement("p");
      const monthORyear = document.createElement("p");
      const price = document.createElement("p");
    
      name.innerHTML = details.obj.plan_name;
    
      if (details.obj.switch_status) {
        monthORyear.innerHTML = "(Yearly)";
        price.innerHTML = `$${details.obj.plan_price}/yr`;
      } else {
        monthORyear.innerHTML = "(Monthly)";
        price.innerHTML = `$${details.obj.plan_price}/mo`;
      }
    
      selected__plan.appendChild(name);
      selected__plan.appendChild(monthORyear);
      selected__plan.appendChild(price);
    }


    // when user click on change button it will go to stepNum= 0
changePlanBtn.addEventListener("click", () => {
  stepNum = 1;
  showStep(stepNum);
});

function selectedAddon() {

  if (selected_addon.children.length >= 1) {
    Array.from(selected_addon.children).forEach((child) => {
      selected_addon.removeChild(child);
    });
  }

  // this will show name and price which user is selected on step 3
  details.addOn.forEach((ele) => {
    let li = document.createElement("li");
    let name = document.createElement("p");
    name.innerHTML = ele.name;
    li.appendChild(name);

    let price = document.createElement("p");

    if (details.obj.switch_status) {
      price.innerHTML = `+$${ele.price}/yr`;
    } else {
      price.innerHTML = `+$${ele.price}/mo`;
    }
    li.appendChild(price);

    selected_addon.appendChild(li);
  });
}

function totalFunc() {
  const total = details.addOn.reduce((acc, curr) => acc + curr.price, details.obj.plan_price);
  details.total = total;
  localStorage.setItem("details",JSON.stringify(details));
  if (details.obj.switch_status) {
    total_price.innerHTML = `+$${total}/yr`;
    total_text.innerHTML = "Total (per year)";
  } else {
    total_price.innerHTML = `+$${total}/mo`;
    total_text.innerHTML = "Total (per month)";
  }
}
