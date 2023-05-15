async function import_api_request() {
  const module = await import("./api_request.js");
  return module;
}

async function import_generate_markups() {
  const module = await import("./generate_markup.js");
  return module;
}

const left_button = document.querySelector(".left_tab_btn");
const div_side = document.querySelector("aside");
const close_btn = document.querySelector(".exit");
const opt_buttons = document.querySelectorAll(".opts");
const cat_butns = document.querySelectorAll(".catagory");
const info_div = document.querySelector("#info");
const empty_msg = document.querySelector("#empty_msg");
const blur_bg = document.querySelector("#blur");
const expand_div = document.querySelector("#expand_div");
const expand_items = document.querySelector("#exp_items");
const full_name = document.querySelector(".full_name");
const login_id = document.querySelector(".login_id");
const the_cart = document.querySelector(".cart");
const sort_selected = document.querySelector("#sort_by");
const products_div_parent = document.querySelector(".products_div");
const covers = document.querySelectorAll(".cover");
const cart_units = document.querySelector("#cart_units");
const exp_search_field = document.querySelector("#exp_search_input");
const close_exp = document.querySelector("#close_exp");
const cart_sub_total = document.querySelector("#sum_tot_value");
let cart_units_value = document.querySelector("#cart_units_value");

/////////////////////////////WHEN PAGE LOADS/////////////////////////////////
window.addEventListener("load", function () {
  info_div.style.display = "none";
  sort_selected.selectedIndex = 0;
  cat_butns[0].click();
  import_api_request().then((module) => {
    module.Buyer.current_user()
      .then((user) => {
        full_name.textContent = user[0].first_name + " " + user[0].last_name;
        login_id.textContent = user[0].login_id;
      })
      .catch((e) => {
        console.log("failed to get user info", e);
      });
  });

  import_api_request().then((mod) => {
    mod.Buyer.current_user().then((user) => {
      mod.Cart.get_cart_items(user[0].login_id).then((items) => {
        if (items.length != 0) {
          cart_units.style.display = "flex";
          cart_units_value.textContent = items.length;
        } else {
          cart_units.style.display = "none";
        }
      });
    });
  });
});

/////////////////////////////SORTING OPTION/////////////////////////////
sort_selected.addEventListener("change", (event) => {
  const selected_option = event.target.value;
  console.log(selected_option);
});

////////////////////////////////CLICK CART/////////////////////////////////////
the_cart.addEventListener("click", () => {
  blur_bg.style.display = "flex";
  expand_div.style.display = "grid";
  expand_items.innerHTML = "";
  import_api_request().then((api_mod) => {
    api_mod.Buyer.current_user().then((user) => {
      api_mod.Cart.get_cart_items(user[0].login_id).then((cart_items) => {
        api_mod.CartExtras.cart_items = [...cart_items];
        console.log(api_mod.CartExtras.cart_items);
        import_generate_markups().then((mod) => {
          mod.generate_cart_item_component(api_mod.CartExtras.cart_items);
          cart_sub_total.textContent = api_mod.CartExtras.cart_items.reduce(
            (acc, { product_price, units }) => acc + (parseInt(product_price) * parseInt(units)), 0);
        });
      });
    });
  });
});

///////////////////////////////////SEARCH CART/////////////////////////////////
exp_search_field.addEventListener("input", () => {
  var search_value = exp_search_field.value;
  import_api_request().then((api_mod) => {
    expand_items.innerHTML = "";
    import_generate_markups().then((mk_mod) => {
      if (search_value === "") {
        api_mod.Buyer.current_user().then((user) => {
          api_mod.Cart.get_cart_items(user[0].login_id).then((cart_items) => {
            mk_mod.generate_cart_item_component(cart_items);
          });
        });
      } else if (api_mod.CartExtras.search_cart(search_value).length != 0) {
        mk_mod.generate_cart_item_component(
          api_mod.CartExtras.search_cart(search_value)
        );
      }
    });
  });
});

///////////////////////////////////DIM BACKGROUND CLICK///////////////////////////////////
blur_bg.addEventListener("click", (e) => {
  e.stopPropagation();
  blur_bg.style.display = "none";
});

close_exp.addEventListener("click", () => {
  blur_bg.style.display = "none";
});

expand_div.addEventListener("click", (e) => {
  e.stopPropagation();
});

function cleaned_img_path(path) {
  path = path.replace(/\\/g, "/");
  var cleaned = path.substring(path.indexOf("electronics_shop"), path.length);
  return "http://localhost:8080/" + cleaned;
}

//opens side tab based on different screen size
left_button.addEventListener("click", () => {
  if (window.innerWidth < 500) {
    setTimeout(() => {
      info_div.style.display = "flex";
      close_btn.style.display = "flex";
      opt_buttons.forEach((element) => {
        element.style.display = "flex";
      });
    }, 500);
    div_side.style.width = "45%";
    info_div.style.opacity = "1";
    close_btn.style.opacity = "1";
    opt_buttons.forEach((element) => {
      element.style.opacity = "1";
    });
  } else if (window.innerWidth < 920) {
    setTimeout(() => {
      info_div.style.display = "flex";
      close_btn.style.display = "flex";
      opt_buttons.forEach((element) => {
        element.style.display = "flex";
      });
    }, 500);
    div_side.style.width = "30%";
    info_div.style.opacity = "1";
    close_btn.style.opacity = "1";
    opt_buttons.forEach((element) => {
      element.style.opacity = "1";
    });
  } else {
    setTimeout(() => {
      info_div.style.display = "flex";
      close_btn.style.display = "flex";
      info_div.style.display = "flex";
      opt_buttons.forEach((element) => {
        element.style.display = "flex";
      });
    }, 500);
    div_side.style.width = "30%";
    info_div.style.opacity = "1";
    close_btn.style.opacity = "1";
    opt_buttons.forEach((element) => {
      element.style.opacity = "1";
    });
  }
});

//event to close the side tab
close_btn.addEventListener("click", () => {
  div_side.style.width = "0%";
  info_div.style.display = "none";
  setTimeout(() => {
    close_btn.style.display = "none";
    opt_buttons.forEach((element) => {
      element.style.display = "none";
    });
  }, 300);
  // top_text.style.opacity = "0";
  info_div.style.opacity = "0";
  close_btn.style.opacity = "0";
  opt_buttons.forEach((element) => {
    element.style.opacity = "0";
  });
});

//////////////////////////////////////////////CATAGORY NAVIGATION///////////////////////////////////////////////////////
cat_butns.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    cat_butns.forEach((element) => {
      element.style.borderBottom = "2px solid black";
      element.style.color = "black";
    });
    element.style.color = "purple";
    element.style.borderColor = "purple";
    import_api_request().then((module) => {
      module.Product.fetch_products(element.value)
        .then((products) => {
          if (products.length === 0) {
            throw new Error();
          }
          products_div_parent.innerHTML = "";
          import_generate_markups().then((module) => {
            module.generate_product_item_component(products);
          });
        })
        .catch(() => {
          products_div_parent.innerHTML = "";
          products_div_parent.append(empty_msg);
          empty_msg.style.display = "flex";
        });
    });
  });
});
