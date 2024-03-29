async function import_api_request() {
  const module = await import("./api_request.js");
  return module;
}

async function import_generate_markups() {
  const module = await import("./generate_markup.js");
  return module;
}

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
      mod.Buyer.get_pending_orders(user[0].login_id).then((orders) => {
        orders_amount.textContent = orders.length;
      });
      mod.Cart.get_cart_items(user[0].login_id).then((items) => {
        if (items.length != 0) {
          cart_units.style.display = "flex";
          cart_units_value.textContent = items.length;
        } else {
          mod.Cart.cart_is_empty = true;
          cart_units.style.display = "none";
        }
      });
    });
  });
});

/////////////////////////////DETAIL CLICK PROPAGATION STOP////////////////////
prod_detail_div.addEventListener("click", (e) => {
  e.stopPropagation();
});

//////////////////////////search products/////////////////////////////////

search_product.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    products_div_parent.innerHTML = "";
    cat_butns.forEach((element) => {
      element.style.borderBottom = "2px solid black";
      element.style.color = "black";
    });
    cat_butns[0].style.color = "purple";
    cat_butns[0].style.borderColor = "purple";
    import_api_request().then((api_mod) => {
      api_mod.Product.search_products(search_product.value).then(
        (searched_products) => {
          console.log(searched_products);
          import_generate_markups().then((mk_mod) => {
            mk_mod.generate_product_item_component(searched_products);
          });
        }
      );
    });
  }
});

/////////////////////////////SORTING OPTION/////////////////////////////
sort_selected.addEventListener("change", (event) => {
  const selected_option = event.target.value;
  import_api_request().then((api_mod) => {
    import_generate_markups().then((mk_mod) => {
      switch (selected_option) {
        case "affordable":
          products_div_parent.innerHTML = "";
          api_mod.Product.sort_products(selected_option).then((sorted) => {
            mk_mod.generate_product_item_component(sorted);
          });
          break;
        case "expensive":
          products_div_parent.innerHTML = "";
          api_mod.Product.sort_products(selected_option).then((sorted) => {
            mk_mod.generate_product_item_component(sorted);
          });
          break;
        case "rating":
          products_div_parent.innerHTML = "";
          api_mod.Product.sort_products(selected_option).then((sorted) => {
            mk_mod.generate_product_item_component(sorted);
          });
          break;
        case "seller_reputation":
          products_div_parent.innerHTML = "";
          api_mod.Product.sort_products(selected_option).then((sorted) => {
            mk_mod.generate_product_item_component(sorted);
          });
          break;
        default:
          break;
      }
    });
  });
});

////////////////////////////////CLICK CART/////////////////////////////////////
the_cart.addEventListener("click", () => {
  blur_bg.style.display = "flex";
  expand_div.style.display = "grid";
  pending_orders.style.display = "none";
  expand_items.innerHTML = "";
  import_api_request().then((api_mod) => {
    api_mod.Buyer.current_user().then((user) => {
      api_mod.Cart.get_cart_items(user[0].login_id).then((cart_items) => {
        api_mod.CartExtras.cart_items = [...cart_items];
        api_mod.CartExtras.cart_items.forEach((element) => {
          element.show = true;
        });
        import_generate_markups().then((mod) => {
          mod.generate_cart_item_component(api_mod.CartExtras.cart_items);
          cart_sub_total.textContent = api_mod.CartExtras.cart_items
            .reduce(
              (acc, { product_price, units }) =>
                acc + parseFloat(product_price) * parseInt(units),
              0
            )
            .toFixed(2);
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
      if (api_mod.CartExtras.search_cart(search_value).length != 0) {
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
  notif_container.style.display = "none";
  notif_list.innerHTML = ""
  import_api_request().then((api_mod) => {
    api_mod.Buyer.current_user().then((user) => {
      api_mod.Cart.update_cart_content(
        api_mod.CartExtras.cart_items,
        user[0].login_id
      );
    });
  });
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
const load_left_tab_content = () => {
  const is_small_screen = window.innerWidth < 500;

  let width = "30%";
  if (is_small_screen) {
    width = "45%";
  }

  close_btn_img.style.opacity = "1";
  setTimeout(() => {
    info_div.style.display = "flex";
    close_btn.style.display = "flex";
    close_btn_img.style.display = "flex";
    opt_buttons.forEach((element) => {
      element.style.display = "flex";
    });
    info_div.style.opacity = "1";
    opt_buttons.forEach((element) => {
      element.style.opacity = "1";
    });
  }, 500);

  div_side.style.width = width;
};

left_button.addEventListener("click", load_left_tab_content);

function close_left_tab() {
  div_side.style.width = "0%";
  setTimeout(() => {
    close_btn_img.style.display = "none";
    opt_buttons.forEach((element) => {
      element.style.display = "none";
    });
  }, 300);
  // top_text.style.opacity = "0";
  info_div.style.opacity = "0";
  close_btn_img.style.opacity = "0";
  opt_buttons.forEach((element) => {
    element.style.opacity = "0";
  });
}
//event to close the side tab
close_btn.addEventListener("click", close_left_tab);

//////////////////////////////////////////////CATAGORY NAVIGATION///////////////////////////////////////////////////////
cat_butns.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(element.value);
    sort_selected.selectedIndex = 0;
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

////////////////////////////PROCEEDING TO ORDER///////////////
exp_proceed_btn.addEventListener("click", () => {
  import_api_request().then((api_mod) => {
    if (api_mod.CartExtras.cart_items.length != 0) {
      api_mod.Buyer.make_order(api_mod.CartExtras.cart_items).then((status) => {
        if (status === "success") {
          alert("your order went successful!");
          api_mod.CartExtras.cart_items = [];
          expand_items.innerHTML = "";
          cart_units_value.innerHTML = "0";
          cart_sub_total.innerHTML = "0.00";
        }
      });
    }
  });
});

////////////////////////////CLEAR CART////////////////////////
exp_clear_cart_btn.addEventListener("click", () => {
  import_api_request().then((api_mod) => {
    api_mod.Buyer.current_user().then((user) => {
      console.log(user[0].login_id);
      api_mod.Cart.delete_cart_content(user[0].login_id).then((response) => {
        if (response.result === "success") {
          api_mod.CartExtras.cart_items = [];
          expand_items.innerHTML = "";
          cart_units_value.innerHTML = "0";
          cart_sub_total.innerHTML = "0.00";
        }
      });
    });
  });
});

prod_detail_close.addEventListener("click", () => {
  prod_detail_div.style.display = "none";
  blur_bg.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  blur_bg.style.display = "none";
});

pending_orders.addEventListener("click", (e) => {
  e.stopPropagation();
});

clear_all_pending.addEventListener("click", () => {
  import_api_request().then((api_mod) => {
    api_mod.Buyer.current_user().then((user) => {
      api_mod.Buyer.cancel_all_order(user[0].login_id).then((res) => {
        if (res.status === "success") {
          pending_orders_container.innerHTML = "";
        }
      });
    });
  });
});

pending_button.addEventListener("click", () => {
  close_left_tab();
  blur_bg.style.display = "flex";
  expand_div.style.display = "none";
  pending_orders_container.innerHTML = ""
  setTimeout(() => {
    pending_orders.style.display = "grid";
    pending_orders.style.transform = "translateY(-100%)";
  }, 300);
  setTimeout(() => {
    import_api_request().then((api_mod) => {
      api_mod.Buyer.current_user().then((user) => {
        api_mod.Buyer.get_pending_orders(user[0].login_id).then((data) => {
          console.log(data);
          import_generate_markups().then((mk_mod) => {
            mk_mod.generate_pending_order_component(data);
          });
        });
      });
    });
  }, 600);
});

document.querySelector("#pending_header img").addEventListener("click", () => {
  blur_bg.style.display = "none";
  pending_orders.style.display = "none";
  pending_orders.style.transform = "translateY(468px)";
});

notif_button.addEventListener("click", () => {
  close_left_tab();
  expand_div.style.display = "none";
  blur_bg.style.display = "flex";
  pending_orders.style.display = "none";
  notif_container.style.display = "grid";
  import_api_request().then((api_mod) => {
    api_mod.Buyer.current_user().then((user) => {
      api_mod.Buyer.check_notifications(user[0].login_id).then(
        (notifictions) => {
          import_generate_markups().then((mk_mod) => {
            mk_mod.generate_notification_component(notifictions);
          });
        }
      );
    });
  });
});


rating.addEventListener("change", (event) => {
  import_api_request().then(api_mod=>{
    api_mod.Product.rating_value = event.target.value
    console.log(`You rated ${api_mod.Product.rating_value} stars`);
  })
});

document.querySelector(".logout_div button").addEventListener("click", ()=>{
  document.querySelector(".logout_div button").style.backgroundColor = "red"
  import_api_request().then(api_mod=>{
    api_mod.Buyer.logout_user()
  })
})