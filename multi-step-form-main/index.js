const sidebarStep = document.querySelectorAll(".step__num");
const formStep = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");
const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");

let stepNum = 0;

nextBtns.forEach((nextBtn) => {
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (stepNum === 0) {
      if (!formValidation()) return;
    }
    stepNum++;
    showStep(stepNum);
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
};

showStep(stepNum);
