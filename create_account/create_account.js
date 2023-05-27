

//PREVENTING SUBMISSION WHEN ENTER KEY IS PRESSED
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

//VALIDATING FUNCTIONS
function is_email(str) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(str);
}
function is_number(str) {
  const regex = /^(\+251)?0?9[0-9]{8}$/;
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



function is_date(birth_date) {
  var re = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!re.test(birth_date)) {
    return false;
  }

  var parts = birth_date.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);
  console.log(year);
  console.log(month);
  console.log(day);
  // Check day valid for month
  if (day < 1 || day > new Date(year, month + 1, 0).getDate()) {
    return false;
  }

  // Check year is not in future
  var currentYear = new Date().getFullYear();
  if (year > currentYear) {
    return false;
  }

  return true;
}



function dob_set() {
  let result = dob.value == "" ? false : true;
  return result;
}

let all_true_2 = true;
let all_true_3 = true;

///////////////////////////////////validation request/////////////////////////////////////////////////
async function email_phone_exists(email, phone) {
  const url = "create_account.php";
  const req_func = "email_phone_exists";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `function=${req_func}&email=${email}&phone=${phone}`,
  };
  const response = await fetch(url, options);
  const data = response.text();
  return data;
}

////////////////////////////////////////////////insertion request////////////////////////////////////////

async function create_account(
  first_name,
  last_name,
  phone_num,
  email,
  acc_type,
  gender,
  dob,
  password,
  conf_password
) {
  const url = "create_account.php";
  const req_func = "create_account";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `function=${req_func}&first_name=${first_name}&last_name=${last_name}
    &phone=${phone_num}&email=${email}&acc_type=${acc_type}&gender=${gender}
    &dob=${dob}&password=${password}&confirm_password=${conf_password}`,
  };
  const response = await fetch(url, options);
  const reply = response.text();
  return reply;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

//The First Section
val_btn.addEventListener("click", (e) => {
  e.preventDefault();
  fname_field.style.boxShadow = "none";
  err_fname.style.display = "none";
  lname_field.style.boxShadow = "none";
  err_lname.style.display = "none";
  email_field.style.boxShadow = "none";
  err_email.style.display = "none";
  phone_field.style.boxShadow = "none";
  err_phone.style.display = "none";

  email_phone_exists(email_field.value, phone_field.value).then((x) => {
    var z = true;
    if (is_letters(fname_field.value) == false || fname_field.value == "") {
      z = false;
      fname_field.style.boxShadow = "0px 0px 20px red";
      err_fname.style.display = "flex";
    }
    if (is_letters(lname_field.value) == false || lname_field.value == "") {
      z = false;
      lname_field.style.boxShadow = "0px 0px 20px red";
      err_lname.style.display = "flex";
    }
    if (phone_field.value == "") {
      z = false;
      phone_field.style.boxShadow = "0px 0px 20px red";
      err_phone.style.display = "flex";
      err_phone.textContent = "field is required";
    }
    if (email_field.value == "") {
      z = false;
      email_field.style.boxShadow = "0px 0px 10px red";
      err_email.style.display = "flex";
      err_email.textContent = "field is required";
    }
    var splited = x.split(" ");
    if (is_number(phone_field.value) == true) {
      if (splited[0] == "phone:true") {
        z = false;
        phone_field.style.boxShadow = "0px 0px 20px red";
        err_phone.style.display = "flex";
        err_phone.textContent = "the phone is in use";
      }
    } else {
      z = false;
      phone_field.style.boxShadow = "0px 0px 20px red";
      err_phone.style.display = "flex";
      err_phone.textContent = "please give a proper input";
    }
    if (is_email(email_field.value) == true) {
      if (splited[1] == "email:true") {
        z = false;
        email_field.style.boxShadow = "0px 0px 10px red";
        err_email.style.display = "flex";
        err_email.textContent = "the email is in use";
      }
    } else {
      z = false;
      email_field.style.boxShadow = "0px 0px 20px red";
      err_email.style.display = "flex";
      err_email.textContent = "please give a proper input";
    }
    if (z == true) {
      val_btn.style.display = "none";
      next_btn.style.display = "block";
      next_btn.style.backgroundColor = "gray";

      bar_1.style.backgroundColor = "white";
      bar_2.style.backgroundColor = "purple";

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
});

//The Second Section
next_btn.addEventListener("click", function (e) {
  console.log(dob.value);
  e.preventDefault();
  var y = true;
  err_acc_type.style.display = "none";
  err_gender.style.display = "none";
  err_dob.style.display = "none";

  if (is_account_type() == false) {
    y = false;
    err_acc_type.style.display = "flex";
  }
  if (gender_checked() == false) {
    y = false;
    err_gender.style.display = "flex";
  }
  if (dob_set() === false || is_date(dob.value) === false) {
    y = false;
    err_dob.style.display = "flex";
  }
  if (y == true) {
    bar_2.style.backgroundColor = "white";
    bar_3.style.backgroundColor = "purple";

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

    prev_btn2.style.backgroundColor = "#4e31aa";
    prev_btn2.style.display = "block";
    prev_btn.style.display = "none";
    next_btn.style.display = "none";
    submit_btn.style.display = "block";
  }
});

//THE PREV BUTTON 1
prev_btn.addEventListener("click", function (event) {
  event.preventDefault();
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
  prev_btn.style.display = "none";
  val_btn.style.display = "block";
  next_btn.style.display = "none";
  prev_btn2.style.display = "none";
});

//PREV BUTTON 2
prev_btn2.addEventListener("click", (e) => {
  e.preventDefault();
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

  submit_btn.style.display = "none";
  next_btn.style.display = "block";
  prev_btn.style.display = "block";
  prev_btn2.style.display = "none";
});

psw_field.addEventListener("input", () => {
  c_psw_field.style.boxShadow = "none";
  psw_field.style.boxShadow = "none";
  err_psw[0].style.display = "none";
  err_psw[1].style.display = "none";
  if (psw_field.value.length < 8) {
    // psw_field.style.boxShadow = "0px 0px 20px #009FBD";
    // err_psw[0].style.color = "#009FBD"
    err_psw[0].textContent = "must have atleast 8 characters";
    err_psw[0].style.display = "flex";
  } else if (psw_field.value != c_psw_field.value) {
    // psw_field.style.boxShadow = "0px 0px 20px red";
    // c_psw_field.style.boxShadow = "0px 0px 20px red";
    err_psw[0].style.color = "red";
    err_psw[0].style.display = "flex";
    err_psw[0].textContent = "password must match";
    err_psw[1].textContent = "password must match";
    err_psw[1].style.display = "flex";
  }
});

c_psw_field.addEventListener("input", () => {
  c_psw_field.style.boxShadow = "none";
  psw_field.style.boxShadow = "none";
  err_psw[0].style.display = "none";
  err_psw[1].style.display = "none";

  if (c_psw_field.value.length < 8) {
    // psw_field.style.boxShadow = "0px 0px 20px red";
    // err_psw[1].textContent = "must have atleast 8 characters";
    // err_psw[1].style.color = "#009FBD"
    err_psw[1].style.display = "flex";
  } else if (psw_field.value != c_psw_field.value) {
    // psw_field.style.boxShadow = "0px 0px 20px red";
    // c_psw_field.style.boxShadow = "0px 0px 20px red";
    err_psw[0].style.display = "flex";
    err_psw[1].style.display = "flex";
    err_psw[0].textContent = "password must match";
    err_psw[1].textContent = "password must match";
  }
});

submit_btn.addEventListener("click", (e) => {
  e.preventDefault();
  var all_safe = true;
  err_psw[0].style.display = "none";
  err_psw[1].style.display = "none";
  psw_field_empty = psw_field.value === "" ? true : false;
  c_psw_field_empty = c_psw_field.value === "" ? true : false;
  if (psw_field_empty) {
    all_safe = false;
    err_psw[0].style.display = "flex";
    err_psw[0].textContent = "fill out this field";
  }
  if (c_psw_field_empty) {
    all_safe = false;
    err_psw[1].style.display = "flex";
    err_psw[1].textContent = "fill out this field";
  }
  if (psw_field.value != c_psw_field.value) {
    all_safe = false;
    err_psw[0].style.color = "red";
    err_psw[0].style.display = "flex";
    err_psw[1].style.display = "flex";
    err_psw[0].textContent = "passwords must match";
    err_psw[1].textContent = "passwords must match";
  }
  if (all_safe) {
    var picked_gender = male.checked
      ? "M"
      : female.checked
      ? "F"
      : other.checked
      ? "Ot"
      : "";

    create_account(
      fname_field.value,
      lname_field.value,
      phone_field.value,
      email_field.value,
      acc_type_field.value,
      picked_gender,
      dob.value,
      psw_field.value,
      c_psw_field.value
    ).then((response) => {
      if (response === "success") {
        alert("your account has been successfuly created");
      } else if (response === "error") {
        alert("something went wrong when creating account");
      } else if (response === "") {
        alert("couldnt reach the server");
      } else {
        alert("couldnt reach the database");
      }
    });
  }
});
