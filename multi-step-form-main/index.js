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

const obj = {
  name: null,
  price: null,
  status: null,
};

let addOn = [];
let stepNum = 0;

let userDetails = {
  name: null,
  email: null,
  phone: null,
};

if (!localStorage.getItem("hasLoaded")) {
  localStorage.clear();
  localStorage.setItem("hasLoaded", "true");
}

document.addEventListener("DOMContentLoaded", loaddata);

function loaddata() {
  stepNum = Number(localStorage.getItem("current_step"));
  userDetails = JSON.parse(localStorage.getItem("userDetails")) || {
    name: null,
    email: null,
    phone: null,
  };
  inputValueFunc(userDetails)
  showStep(stepNum);
  if(stepNum === 4){
    localStorage.removeItem("current_step");
    localStorage.removeItem("userDetails");
    stepNum = 0;
    userDetails = {
      name: null,
      email: null,
      phone: null,
    };
    inputValueFunc(userDetails)
    showStep(stepNum);
  }
}

function inputValueFunc(userDetails){
     
    if(userDetails.name!=null){
         document.getElementById('name').value = userDetails.name;
    }
    else{
      document.getElementById('name').value = "";
    }

    if(userDetails.email!=null){
      document.getElementById('email').value = userDetails.email;
    }
    else{
      document.getElementById('email').value = "";
    }

    if(userDetails.phone!=null){
      document.getElementById('phone').value = userDetails.phone;
    }
    else{
      document.getElementById('phone').value = "";
    }
}

// Next and prev button
nextBtns.forEach((nextBtn) => {
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (stepNum === 0) {
      if (!formValidation()) return;
    }

    if (stepNum === 2) {
      if (addOn.length === 0) return;
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
      let num = Number(localStorage.getItem("current_step"));
      num = stepNum;
      localStorage.setItem("current_step", JSON.stringify(num));
      showStep(stepNum);
    }
  });
});

/* this is form vaildation function of step-1 
  if any input field is empty it return true ( display message or error) otherwise false 
  */
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
      let flag = true;
      if (value.length === 0) {
        document.getElementById("error1").style.display = "flex";
        document.getElementById("name").style.borderColor = "red";
        isValid = false;
        flag = false;
      } else if (!/^[a-zA-Z]+/.test(value)) {
        document.getElementById("message1").style.display = "flex";
        document.getElementById("name").style.borderColor = "red";
        isValid = false;
        flag = false;
        console.log(value);
      }

      if (flag === true) {
        document.getElementById("name").style.borderColor = "hsl(243,100%,62%)";
        userDetails.name = value
        console.log(value);
      }
    }

    if (input.name === "email") {
      let flag1 = true;
      if (value.length === 0) {
        document.getElementById("error2").style.display = "flex";
        document.getElementById("email").style.borderColor = "red";
        isValid = false;
        flag1 = false;
      }

      if (flag1 === true) {
        document.getElementById("email").style.borderColor =
          "hsl(243,100%,62%)";
          userDetails.email = value;
          console.log(value);
      }
    }

    if (input.name === "phone") {
      let flag2 = true;
      if (value.length === 0) {
        document.getElementById("error3").style.display = "flex";
        document.getElementById("phone").style.borderColor = "red";
        isValid = false;
        flag2 = false;
      } else if (value.length !== 10) {
        document.getElementById("message3").style.display = "flex";
        document.getElementById("phone").style.borderColor = "red";
        isValid = false;
        flag2 = false;
      }

      if (flag2 === true) {
        document.getElementById("phone").style.borderColor =
          "hsl(243,100%,62%)";
          userDetails.phone = value;
          console.log(value);
      }
    }

    localStorage.setItem("userDetails",JSON.stringify(userDetails))
  });

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

  if (stepNum === 1) {
    showPrice(switcher.querySelector("input").checked);
  }

  if (stepNum === 2) {
    ShowMonthYear(switcher.querySelector("input").checked);
  }

  if (stepNum === 3) {
    showDetails();
    selectedAddon();
    totalFunc();
  }
};

/* this is used to store plan name, price content when user 
  click on any card in step 2*/
step__cards.forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelector(".active2").classList.remove("active2");
    card.classList.add("active2");

    obj.name = card.querySelector(".plan__name").textContent;

    let price = card.querySelector(".plan__month").textContent;
    price = price.match(/\d+/);
    obj.price = Number(price[0]);
  });
});

/*  this store the status (true of false) true means yearly_plan and 
     false means monthly plan  bydefault status false */
switcher.addEventListener("click", () => {
  const bool = switcher.querySelector("input").checked;

  showPrice(bool);
  obj.status = bool;

  if (bool) {
    document.querySelector(".yearly__plan").style.color = "#02295a";
    document.querySelector(".monthly__plan").style.color = "#9699ab";
  } else {
    document.querySelector(".monthly__plan").style.color = "#02295a";
    document.querySelector(".yearly__plan").style.color = "#9699ab";
  }

  updateAddonPrices();
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
      obj.price = Number(price[0]);
      obj.name = plan__names[activeIndex].textContent;
      obj.status = true;
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
      obj.price = Number(price[0]);
      obj.name = plan__names[activeIndex].textContent;
      obj.status = false;
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
      if (obj.status) {
        price = Number(box.querySelector(".year").textContent.match(/\d+/)[0]);
      } else {
        price = Number(box.querySelector(".month").textContent.match(/\d+/)[0]);
      }

      addOn.push({ name: name, price: price });
      box.classList.add("active2");
    } else {
      addOn = addOn.filter((add) => add.name !== name);
      box.classList.remove("active2");
    }

    totalFunc();
  });
});

// when switch is toogleed then this function exectued
// it will updated the price in array
function updateAddonPrices() {
  addOn.forEach((addon) => {
    const box = Array.from(boxs).find(
      (box) => box.querySelector(".box_name").textContent === addon.name
    );

    if (box) {
      let price;
      if (obj.status) {
        price = box.querySelector(".year").textContent.match(/\d+/)[0];
      } else {
        price = box.querySelector(".month").textContent.match(/\d+/)[0];
      }
      addon.price = Number(price);
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

  name.innerHTML = obj.name;

  if (obj.status) {
    monthORyear.innerHTML = "(Yearly)";
    price.innerHTML = `$${obj.price}/yr`;
  } else {
    monthORyear.innerHTML = "(Monthly)";
    price.innerHTML = `$${obj.price}/mo`;
  }

  selected__plan.appendChild(name);
  selected__plan.appendChild(monthORyear);
  selected__plan.appendChild(price);
}

// when user click on change button it will go to stepNum= 0
changePlanBtn.addEventListener("click", () => {
  stepNum = 0;
  showStep(stepNum);
});

function selectedAddon() {
  if (selected_addon.children.length >= 1) {
    Array.from(selected_addon.children).forEach((child) => {
      selected_addon.removeChild(child);
    });
  }

  // this will show name and price which user is selected on step 3
  addOn.forEach((ele) => {
    let li = document.createElement("li");
    let name = document.createElement("p");
    name.innerHTML = ele.name;
    li.appendChild(name);

    let price = document.createElement("p");

    if (obj.status) {
      price.innerHTML = `+$${ele.price}/yr`;
    } else {
      price.innerHTML = `+$${ele.price}/mo`;
    }
    li.appendChild(price);

    selected_addon.appendChild(li);
  });
}

// this function calculate total sum
function totalFunc() {
  const total = addOn.reduce((acc, curr) => acc + curr.price, obj.price);

  if (obj.status) {
    total_price.innerHTML = `+$${total}/yr`;
    total_text.innerHTML = "Total (per year)";
  } else {
    total_price.innerHTML = `+$${total}/mo`;
    total_text.innerHTML = "Total (per month)";
  }
}

//showStep(stepNum);

console.log(obj);
