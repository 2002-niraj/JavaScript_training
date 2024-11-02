const sidebarStep = document.querySelectorAll(".step__num");
const formStep = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");
const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");
const step__cards = document.querySelectorAll('.step__card');
const switcher = document.querySelector('.switch');

const obj = {
  plan: null,
  price: null,
  status: null
};

let addOn = [];
let stepNum = 0;

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
    showStep(stepNum);

    if (stepNum === 4) {
      sidebarStep[3].classList.add('active');
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
        document.getElementById("name").style.borderColor = 'red';
        isValid = false;
      } else if (!/^[a-zA-Z]+/.test(value)) {
        document.getElementById("message1").style.display = "flex";
        document.getElementById("name").style.borderColor = 'red';
        isValid = false;
      }
    }

    if (input.name === "email") {
      if (value.length === 0) {
        document.getElementById("error2").style.display = "flex";
        document.getElementById("email").style.borderColor = 'red';
        isValid = false;
      }
    }

    if (input.name === "phone") {
      if (value.length === 0) {
        document.getElementById("error3").style.display = "flex";
        document.getElementById("phone").style.borderColor = 'red';
        isValid = false;
      } else if (value.length !== 10) {
        document.getElementById("message3").style.display = "flex";
        document.getElementById("phone").style.borderColor = 'red';
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

  if (stepNum === 1) {
    showPrice(switcher.querySelector('input').checked);
  }

  if (stepNum === 2) {
    ShowMonthYear(switcher.querySelector('input').checked);
  }

  if (stepNum === 3) {
    showDetails();
    selectedAddon();
    totalFunc();
  }
};

step__cards.forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelector('.active2').classList.remove("active2");
    card.classList.add("active2");

    obj.plan = card.querySelector('.plan__name').textContent;

    let price = card.querySelector('.plan__month').textContent;
    price = price.match(/\d+/);
    obj.price = Number(price[0]);
  });
});

switcher.addEventListener('click', () => {
  const bool = switcher.querySelector('input').checked;

  showPrice(bool);
  obj.status = bool;

  updateAddonPrices();
  totalFunc();
});

function updateAddonPrices() {
  addOn.forEach(addon => {
    const box = Array.from(boxs).find(
      box => box.querySelector('.box_name').textContent === addon.name);

    if (box) {
      let price;
      if (obj.status) {
        price = box.querySelector('.year').textContent.match(/\d+/)[0];
      } else {
        price = box.querySelector('.month').textContent.match(/\d+/)[0];
      }
      addon.price = Number(price);
    }
  });
}

function showPrice(checked) {
  const monthPrice = [9, 12, 15];
  const yearPrice = [90, 120, 150];

  const prices = document.querySelectorAll(".plan__month");
  const plan__names = document.querySelectorAll('.plan__name');
  const free = document.querySelectorAll('.free');
  const activeCard = document.querySelector('.active2');

  if (checked) {
    prices[0].innerHTML = `$${yearPrice[0]}/yr`;
    free[0].style.display = 'flex';
    prices[1].innerHTML = `$${yearPrice[1]}/yr`;
    free[1].style.display = 'flex';
    prices[2].innerHTML = `$${yearPrice[2]}/yr`;
    free[2].style.display = 'flex';

    if (activeCard) {
      const activeIndex = Array.from(step__cards).indexOf(activeCard);
      let price = prices[activeIndex].textContent;
      price = price.match(/\d+/);
      obj.price = Number(price[0]);
      obj.plan = plan__names[activeIndex].textContent;
      obj.status = true;
    }
  } else {
    prices[0].innerHTML = `$${monthPrice[0]}/mo`;
    free[0].style.display = 'none';
    prices[1].innerHTML = `$${monthPrice[1]}/mo`;
    free[1].style.display = 'none';
    prices[2].innerHTML = `$${monthPrice[2]}/mo`;
    free[2].style.display = 'none';

    if (activeCard) {
      const activeIndex = Array.from(step__cards).indexOf(activeCard);
      let price = prices[activeIndex].textContent;
      price = price.match(/\d+/);
      obj.price = Number(price[0]);
      obj.plan = plan__names[activeIndex].textContent;
      obj.status = false;
    }
  }
}

const boxs = document.querySelectorAll('.box');

boxs.forEach((box) => {
  const checkbox = box.querySelector('.checkbox');

  checkbox.addEventListener('change', () => {
    const name = box.querySelector('.box_name').textContent;
    let price;

    if (checkbox.checked) {
      if (obj.status) {
        price = Number(box.querySelector('.year').textContent.match(/\d+/)[0]);
      } else {
        price = Number(box.querySelector('.month').textContent.match(/\d+/)[0]);
      }

      addOn.push({ name: name, price: price });
    } else {
      addOn = addOn.filter(add => add.name !== name);
    }

    totalFunc();
  });
});

function ShowMonthYear(status) {
  boxs.forEach((box) => {
    if (status) {
      box.querySelector('.year').style.display = 'flex';
      box.querySelector('.month').style.display = 'none';
    } else {
      box.querySelector('.year').style.display = 'none';
      box.querySelector('.month').style.display = 'flex';
    }
  });
}

const selected__plan = document.querySelector('#selected__plan');

function showDetails() {

  if (selected__plan.children.length > 1) {
    Array.from(selected__plan.children).forEach(child => {
      selected__plan.removeChild(child);
    });
  }

  const name = document.createElement('p');
  const monthORyear = document.createElement('p');
  const price = document.createElement('p');

  name.innerHTML = obj.plan;


  if(obj.status){
    monthORyear.innerHTML = "(Yearly)";
    price.innerHTML = `$${obj.price}/yr`;
  }
  else{
    monthORyear.innerHTML = "(Monthly)";
    price.innerHTML = `$${obj.price}/mo`;
  }


  selected__plan.appendChild(name);
  selected__plan.appendChild(monthORyear);
  selected__plan.appendChild(price);
}

const changePlanBtn = document.querySelector('#change-plan');
changePlanBtn.addEventListener('click', () => {
  stepNum = 0;
  showStep(stepNum);
});

const selected_addon = document.querySelector('#selected-addon');

function selectedAddon() {
  if (selected_addon.children.length >= 1) {
    Array.from(selected_addon.children).forEach(child => {
      selected_addon.removeChild(child);
    });
  }

  addOn.forEach((ele) => {
    let li = document.createElement('li');
    let name = document.createElement('p');
    name.innerHTML = ele.name;
    li.appendChild(name);

    let price = document.createElement('p');

    if(obj.status){
      price.innerHTML = `$${ele.price}/yr`;
    }
    else{
      price.innerHTML = `$${ele.price}/mo`;
    }
    li.appendChild(price);

    selected_addon.appendChild(li);
  });
}

const total_price = document.querySelector('#total_amt span:nth-child(2)')
const total_text = document.querySelector('#total_amt span:nth-child(1)');
function totalFunc() {

  const total = addOn.reduce((acc, curr) => 
    acc + curr.price, obj.price);

     if(obj.status){
      total_price.innerHTML = `$${total}/yr`;
      total_text.innerHTML = "Total (per year)"
    }
    else{
      total_price.innerHTML = `$${total}/mo`;
      total_text.innerHTML = "Total (per month)";
    }
}


showStep(stepNum);

console.log(obj)