const add_cart = document.querySelectorAll(".add");
const amount_div = document.querySelectorAll(".amount_div");
const slider = document.querySelectorAll(".units")
const slider_value = document.querySelectorAll(".s_value")

for (let i = 0; i < add_cart.length; i++) {
  add_cart[i].addEventListener("click", function () {
    amount_div[i].style.display = "flex";
  });
}

  for (let i = 0; i < amount_div.length; i++) {
    slider[i].addEventListener("input", function(){
      slider_value[i].innerHTML = slider[i].value;
    })
  }