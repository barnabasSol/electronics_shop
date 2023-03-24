let side = document.querySelector("button");
let div_side = document.querySelector("aside");
let expand = document.querySelector(".expand");
let med_q = window.matchMedia("(width<=500px)");

side.addEventListener("click", function () {
  if (window.innerWidth < 500) {
    div_side.style.width = "50%";
  }
  else if(window.innerWidth < 920){
    div_side.style.width = "40%"
  } else {
    div_side.style.width = "30%";
  }
});

div_side.addEventListener("click", function () {
  div_side.style.width = "0%";
  expand.style.display = "block";
});
