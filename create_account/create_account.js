//SELECTING ELEMENTS
let main_sec = document.querySelector(".main_section");

let err_fname = document.querySelector(".err_fname");
let err_lname = document.querySelector(".err_lname");
let err_email = document.querySelector(".err_email");
let err_phone = document.querySelector(".err_phone");
let err_acc_type = document.querySelector(".err_acc_type");
let err_gender = document.querySelector(".err_gender");
let err_dob = document.querySelector(".err_dob");

//GETTING INPUTS
let fname_field = document.querySelector(".fname");
let lname_field = document.querySelector(".lname");
let email_field = document.querySelector(".email");
let phone_field = document.querySelector(".phone");
let acc_type_field = document.querySelector("#account_type_input");
let male = document.querySelector("#male");
let female = document.querySelector("#female");
let other = document.querySelector("#other");
let dob = document.querySelector("#dob");
let button_container = document.querySelector(".button_container");

let create_1 = document.querySelector(".create_1");
let create_2 = document.querySelector(".create_2");
let create_3 = document.querySelector(".create_3");

let bar_1 = document.querySelector(".bar1");
let bar_2 = document.querySelector(".bar2");
let bar_3 = document.querySelector(".bar3");

let next_btn = document.querySelector(".next_btn");
let prev_btn = document.querySelector(".prev_btn");
let submit_btn = document.querySelector(".submit_btn");

//PREVENTING SUBMISSION WHEN ENTER KEY IS PRESSED
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});


//NAVIGATION INDEX
let on_create = 1;

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
function is_account_type() {
  if (acc_type_field.value == "None") {
    return false;
  }
  return true;
}
function gender_checked() {
  if (male.checked || female.checked || other.checked) {
    return true;
  }
  return false;
}
function dob_set() {
  if (dob.value == "") {
    return false;
  }
  return true;
}

let all_true_1 = true;
let all_true_2 = true;
let all_true_3 = true;

//THE NEXT BUTTON
next_btn.addEventListener("click", function (event) {
  event.preventDefault();
  all_true_1 = true;
  all_true_2 = true;
  all_true_3 = true;
  fname_field.style.boxShadow = "none";
  err_fname.style.display = "none";
  lname_field.style.boxShadow = "none";
  err_lname.style.display = "none";
  email_field.style.boxShadow = "none";
  err_email.style.display = "none";
  phone_field.style.boxShadow = "none";
  err_phone.style.display = "none";
  err_acc_type.style.display = "none";
  err_gender.style.display = "none";
  err_dob.style.display = "none";

  if (is_letters(fname_field.value) == false && on_create == 1) {
    all_true_1 = false;
    fname_field.style.boxShadow = "0px 0px 20px red";
    err_fname.style.display = "flex";
  }
  if (is_letters(lname_field.value) == false && on_create == 1) {
    all_true_1 = false;
    lname_field.style.boxShadow = "0px 0px 20px red";
    err_lname.style.display = "flex";
  }
  if (is_email(email_field.value) == false && on_create == 1) {
    all_true_1 = false;
    email_field.style.boxShadow = "0px 0px 10px red";
    err_email.style.display = "flex";
  }
  if (is_number(phone_field.value) == false && on_create == 1) {
    all_true_1 = false;
    phone_field.style.boxShadow = "0px 0px 20px red";
    err_phone.style.display = "flex";
  }
  if (is_account_type() == false && on_create == 2) {
    all_true_2 = false;
    err_acc_type.style.display = "flex";
  }
  if (gender_checked() == false && on_create == 2) {
    all_true_2 = false;
    err_gender.style.display = "flex";
  }
  if (dob_set() == false && on_create == 2) {
    all_true_2 = false;
    err_dob.style.display = "flex";
  }

  if (all_true_1 == true && on_create == 1) {
    on_create += 1;
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
  } else if (all_true_2 && on_create == 2) {
    console.log(on_create);
    on_create += 1;
    bar_2.style.backgroundColor = "white";
    bar_3.style.backgroundColor = "purple";

    prev_btn.style.backgroundColor = "#4e31aa";
    next_btn.style.display = "none";

    create_2.style.transform = "translateX(189px)";
    create_2.style.opacity = "0";
    setTimeout(() => {
      create_2.style.display = "none";
      create_3.style.display = "flex";
    }, 500);

    setTimeout(() => {
      create_3.style.transform = "translateX(0px)";
      create_3.style.opacity = "1";
    }, 540);
    submit_btn.style.display = "block";
  }
});

//THE PREV BUTTON
prev_btn.addEventListener("click", function (event) {
  event.preventDefault();
  on_create -= 1;
  if (on_create == 1) {
    prev_btn.style.display = "none";
    bar_1.style.backgroundColor = "purple";
    bar_2.style.backgroundColor = "white";
    next_btn.style.backgroundColor = "#4e31aa";

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
  } else if (on_create == 2) {
    bar_3.style.backgroundColor = "white";
    bar_2.style.backgroundColor = "purple";

    create_3.style.opacity = "0";
    create_3.style.transform = "translateX(-189px)";

    setTimeout(() => {
      create_2.style.display = "flex";
      create_3.style.display = "none";
    }, 500);

    setTimeout(() => {
      create_2.style.opacity = "1";
      create_2.style.transform = "translateX(0px)";
    }, 540);
  }
  submit_btn.style.display = "none";
  next_btn.style.display = "block";
});

// submit_btn.addEventListener("click", function () {
//   create_3.innerHTML = "<span>CONGRATS BITCH</span";
// });
