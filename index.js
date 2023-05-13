const login_card = document.querySelector(".section");
const curtain = document.querySelector(".curtain");
const curtain_text = document.querySelector(".curtain h1");
const wrapper = document.querySelector(".wrapper");
const login_btn = document.querySelector(".submit");

const login_input = document.querySelector(".login_input");
const password_input = document.querySelector(".psw_input");

password_input.value = "";

const err_login = document.querySelector(".err_login");
const err_psw = document.querySelector(".err_psw");

setTimeout(() => {
  curtain.style.height = "0";
  curtain_text.style.opacity = "0";
}, 800);

setTimeout(() => {
  curtain.style.display = "none";
  wrapper.style.scale = "1";
}, 1500);

setTimeout(() => {
  curtain.textContent = "";
}, 1500);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

async function login_validate(login, password) {
  const url = "login_process.php";
  const req_func = "process_login";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `function=${req_func}&login_input=${login}&password_input=${password}`,
  };
  const response = await fetch(url, options);
  const final = response.redirected ? (window.location.href = response.url) : await response.text();
  return final;
}

function check_input() {}

login_btn.addEventListener("click", (e) => {
  e.preventDefault();
  err_psw.style.opacity = "0";
  err_login.style.opacity = "0";
  var all_good = true;
  if (login_input.value == "") {
    all_good = false;
    err_login.textContent = "please fill out the field";
    err_login.style.opacity = "1";
  }
  if (password_input.value == "") {
    all_good = false;
    err_psw.textContent = "please fill out the field";
    err_psw.style.opacity = "1";
  }
  if (all_good) {
    login_validate(login_input.value, password_input.value)
    .then((r) => {
      var no_error = true;
        switch (r) {
          case "invalid":
            no_error = false;
            err_login.textContent = "invalid input";
            err_login.style.opacity = "1";
            break;
          case "psw_error":
            no_error = false;
            err_psw.textContent = "incorrect password";
            err_psw.style.opacity = "1";
            break;
          case "loginid_doesnt_exist":
            no_error = false;
            err_login.textContent = "login id doesnt exist";
            err_login.style.opacity = "1";
            break;
          case "email_doesnt_exist":
            no_error = false;
            err_login.textContent = "email doesn't exist";
            err_login.style.opacity = "1";
            break;
          case "phone_doesnt_exist":
            no_error = false;
            err_login.textContent = "phone doesn't exist";
            err_login.style.opacity = "1";
            break;
          case "":
            alert(r);
            break;
          case "error_db_connection":
            alert(r)
            break;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
