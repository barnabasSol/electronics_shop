//SELECTING ELEMENTS
let main_sec = document.querySelector(".main_section");

let err_fname = document.querySelector(".err_fname");
let err_lname = document.querySelector(".err_lname");
let err_email = document.querySelector(".err_email");
let err_phone = document.querySelector(".err_phone");

//GETTING INPUTS
let fname_field = document.querySelector(".fname");
let lname_field = document.querySelector(".lname");
let email_field = document.querySelector(".email");
let phone_field = document.querySelector(".phone");
let acc_type_field = document.querySelector("#account_type_input"); 

let create_1 = document.querySelector(".create_1");
let create_2 = document.querySelector(".create_2");
let create_3 = document.querySelector(".create_3");

let bar_1 = document.querySelector(".bar1");
let bar_2 = document.querySelector(".bar2");
let bar_3 = document.querySelector(".bar3");

let next_btn = document.querySelector(".next_btn");
let prev_btn = document.querySelector(".prev_btn");

//PREVENTING SUBMISSION WHEN ENTER KEY IS PRESSED
document.addEventListener("keydown", function(event){
  if (event.key === "Enter"){
    event.preventDefault();
  }
});

//VALIDATING FUNCTIONS
function is_email(str) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(str);
}
function is_number(str) {
  const regex = /^\d+$/;
  return regex.test(str);
}
function is_letters(str) {
  const regex = /^[a-zA-Z]+$/;
  return regex.test(str);
}
function is_account_type(){
  if (acc_type_field.value == "Account Type"){
    return false;
  }
  return true
}

//THE NEXT BUTTON
next_btn.addEventListener("click", function () {
  let all_true_1 = true;
  let all_true_2 = true;
  let all_true_3 = true;
  // fname_field.style.boxShadow = "none";
  // err_fname.style.display = "none";
  // lname_field.style.boxShadow = "none";
  // err_lname.style.display = "none";
  // email_field.style.boxShadow = "none";
  // err_email.style.display = "none";
  // phone_field.style.boxShadow = "none";
  // err_phone.style.display = "none";
  // if (is_letters(fname_field.value) == false) {
  //   all_true_1 = false;
  //   fname_field.style.boxShadow = "0px 0px 20px red";
  //   err_fname.style.display = "flex";
  // }
  // if (!is_letters(lname_field.value)) {
  //   all_true_1 = false;
  //   lname_field.style.boxShadow = "0px 0px 20px red";
  //   err_lname.style.display = "flex";
  // }
  // if (is_email(email_field.value) == false) {
  //   console.log('email function')
  //   all_true_1 = false;
  //   email_field.style.boxShadow = "0px 0px 10px red";
  //   err_email.style.display = "flex";
  // }
  // if (!is_number(phone_field.value)) {
  //   all_true_1 = false;
  //   phone_field.style.boxShadow = "0px 0px 20px red";
  //   err_phone.style.display = "flex";
  // }
  if(is_account_type() == false){
    all_true_1 = false;
    acc_type_field
  }

  if (all_true_1) {
    bar_1.style.backgroundColor = "white";
    bar_2.style.backgroundColor = "purple";

    next_btn.style.backgroundColor = "gray";
    prev_btn.style.display = "block";

    create_1.style.transform = "translateX(189px)";
    create_1.style.opacity = "0";
    setTimeout(() => {
      create_1.style.display = "none";
      create_2.style.display = "flex";
    }, 500);

    setTimeout(() => {
      create_2.style.transform = "translateX(0px)";
      create_2.style.opacity = "1";
    }, 540);
  }
});


//THE PREV BUTTON
prev_btn.addEventListener("click", function () {
  prev_btn.style.display = "none";
  bar_1.style.backgroundColor = "purple";
  bar_2.style.backgroundColor = "white";

  create_2.style.opacity = "0";
  create_2.style.transform = "translateX(-189px)";

  setTimeout(() => {
    create_1.style.display = "flex";
    create_2.style.display = "none";
  }, 500);

  setTimeout(() => {
    create_1.style.opacity = "1";
    create_1.style.transform = "translateX(0px)";
  }, 540);
});
