async function import_api_request() {
  const module = await import("./api_request.js");
  return module;
}
///////////////////////////////PRODUCT ITEM COMPONENT////////////////////////////////
export function generate_product_item_component(product_list) {
  product_list.forEach((product) => {
    const product_div = document.createElement("div");
    product_div.classList.add("product");
    if (product.discount > 0) {
      const bubble_div = document.createElement("div");
      bubble_div.classList.add("bubble");

      ////////////////////////////////////DISCOUNT
      const percentage_span = document.createElement("span");
      percentage_span.classList.add("percentage");
      percentage_span.textContent = "-" + product.discount * 100 + "%";

      product_div.appendChild(bubble_div);
      bubble_div.appendChild(percentage_span);
    }
    const cover_div = document.createElement("div");
    cover_div.classList.add("cover");

    const stock_span = document.createElement("span");
    stock_span.classList.add("stock");
    stock_span.textContent = `In Stock: ${product.units}`;

    const rating_span = document.createElement("span");
    rating_span.classList.add("rating");
    rating_span.textContent = `Rating:⭐${product.average_rating}/5`;

    const description_span = document.createElement("span");
    description_span.classList.add("description");

    /////////////////////////////////DETAILS
    const details_span = document.createElement("span");
    details_span.classList.add("details");
    details_span.textContent = "Details..";
    details_span.addEventListener("click", () => {
      blur_bg.style.backgroundColor = "#fff7ea"
      import_api_request().then((api_mod) => {
        api_mod.Product.get_product_images(product.img_id).then((images) => {
          console.log(images);
          let index = 0;
          prod_detail_img_bg.style.backgroundImage = `url(${cleaned_img_path(images[0].image_path)})`;
          prod_name.textContent = product.product_name;
          prod_price.textContent = product.product_price + "birr";
          prod_descrip.textContent = product.product_description;
          prod_rating.textContent = `Rating:⭐${product.average_rating}/5`;
          prev_button_img_nav.addEventListener("click", () => {
            index-=1;
            if (index <= 0) {
              index = 2;
            }
            prod_detail_img_bg.style.backgroundImage = `url(${cleaned_img_path(images[index].image_path)})`;
          });

          next_button_img_nav.addEventListener("click", () => {
            index += 1;
            if (index === 3) {
              index = 0;
            }
            prod_detail_img_bg.style.backgroundImage = `url(${cleaned_img_path(images[index].image_path)})`;
          });

          api_mod.Product.get_seller_contact(product.product_class_id).then(
            (info) => {
              seller_email_link.setAttribute("href", `mailto:${info[0].email}`);
              seller_email_link.textContent = info[0].email;
            }
          );
        });
      });
      prod_detail_div.style.display = "grid";
      blur_bg.style.display = "flex";
      expand_div.style.display = "none";
    });

    const amount_div = document.createElement("div");
    amount_div.classList.add("amount_div");

    const close_btn = document.createElement("button");
    close_btn.classList.add("close");
    close_btn.textContent = "X";

    const s_value_span = document.createElement("span");
    s_value_span.classList.add("s_value");
    s_value_span.textContent = "1";

    const slider_container_div = document.createElement("div");
    slider_container_div.classList.add("slider_container");

    const form = document.createElement("form");
    form.setAttribute("action", "");
    form.setAttribute("method", "post");
    form.setAttribute("class", "form_amount_input");

    //////////////////////////////////////RANGE PRODUCT AMOUNT
    const range_input = document.createElement("input");
    range_input.setAttribute("type", "range");
    range_input.setAttribute("value", "1");
    range_input.setAttribute("min", "1");
    range_input.setAttribute("max", product.units);
    range_input.setAttribute("name", "units");
    range_input.setAttribute("class", "units");

    slider_container_div.appendChild(form);
    form.appendChild(range_input);

    const confirm_input = document.createElement("input");
    confirm_input.setAttribute("type", "submit");
    confirm_input.setAttribute("value", "confirm");
    confirm_input.setAttribute("name", "confirm_btn");
    confirm_input.setAttribute("class", "confirm_btn");

    /////////////////////////////////INSERT IN CART/////////////////////////////////////////
    confirm_input.addEventListener("click", (e) => {
      e.preventDefault();
      import_api_request().then((module) => {
        module.Buyer.current_user().then((user) => {
          const new_item = new module.Cart(
            user[0].login_id,
            product.product_class_id,
            range_input.value
          );
          module.Cart.insert_in_cart(new_item)
            .then((r) => {
              console.log(r);
              if (r === "success") {
                cart_units.style.display = "flex";
                let current_amount = parseInt(cart_units_value.innerHTML);
                current_amount += 1;
                cart_units_value.innerHTML = current_amount;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    });

    form.appendChild(confirm_input);

    amount_div.appendChild(close_btn);
    amount_div.appendChild(s_value_span);
    amount_div.appendChild(slider_container_div);

    cover_div.appendChild(stock_span);
    cover_div.appendChild(rating_span);
    cover_div.appendChild(description_span);
    cover_div.appendChild(details_span);
    cover_div.appendChild(amount_div);

    const confirm_add_btn = document.createElement("button");
    confirm_add_btn.classList.add("add");
    confirm_add_btn.textContent = "Add to Cart";

    cover_div.appendChild(confirm_add_btn);

    const img_part_div = document.createElement("div");
    img_part_div.classList.add("img_part");

    //PRODUCT IMAGE
    const img_element = document.createElement("img");
    img_element.setAttribute("src", cleaned_img_path(product.image_path));
    img_element.setAttribute("alt", "product image");

    img_part_div.appendChild(img_element);

    const info_div = document.createElement("div");
    info_div.classList.add("info");

    const name_span = document.createElement("span");
    name_span.classList.add("name");
    name_span.textContent = `${product.product_name} - `;

    const disc_span = document.createElement("span");
    disc_span.classList.add("disc");
    disc_span.textContent = product.product_price + "birr";

    if (product.discount <= 0) {
      disc_span.style.color = "white";
    }

    name_span.appendChild(disc_span);
    info_div.appendChild(name_span);

    product_div.appendChild(cover_div);
    product_div.appendChild(img_part_div);
    product_div.appendChild(info_div);

    products_div_parent.append(product_div);
  });

  const add_cart = document.querySelectorAll(".add");
  const amount_div = document.querySelectorAll(".amount_div");
  const slider = document.querySelectorAll(".units");
  const close_amount_popup = document.querySelectorAll(".close");
  const slider_value = document.querySelectorAll(".s_value");

  for (let i = 0; i < amount_div.length; i++) {
    slider[i].addEventListener("input", function () {
      slider_value[i].innerHTML = slider[i].value;
    });
  }

  for (let i = 0; i < add_cart.length; i++) {
    add_cart[i].addEventListener("click", function () {
      amount_div[i].style.display = "flex";
    });
  }

  for (let i = 0; i < close_amount_popup.length; i++) {
    close_amount_popup[i].addEventListener("click", () => {
      amount_div[i].style.display = "none";
    });
  }
}

//////////////////////////////////////////CART ITEM COMPONENT////////////////////////////////////

export function generate_cart_item_component(cart_list) {
  cart_list.forEach((cart_item) => {
    if (cart_item.show === true) {
      const cart_item_div = document.createElement("div");
      cart_item_div.classList.add("cart_item");

      const cart_item_img_div = document.createElement("div");
      cart_item_img_div.classList.add("cart_img_part");

      const cart_item_img = document.createElement("img");
      cart_item_img.classList.add("cart_item_img");
      cart_item_img.src = cleaned_img_path(cart_item.image_path);

      cart_item_div.append(cart_item_img_div);
      cart_item_img_div.append(cart_item_img);

      const in_cart_amnt_div = document.createElement("div");
      in_cart_amnt_div.classList.add("in_cart_amount_div");
      cart_item_div.append(in_cart_amnt_div);
      /////////////////////////CART ITEM NAME///////////////////////////
      const in_cart_name = document.createElement("span");
      in_cart_name.classList.add("in_cart_name");
      in_cart_name.textContent = cart_item.product_name;

      in_cart_amnt_div.append(in_cart_name);

      /////////////////////////CART AMOUNT///////////////////////////
      const in_cart_amnt_value = document.createElement("span");
      in_cart_amnt_value.classList.add("in_cart_amount_span");
      in_cart_amnt_value.textContent = cart_item.units;

      in_cart_amnt_div.append(in_cart_amnt_value);

      const incr_div = document.createElement("div");
      incr_div.classList.add("incr_div");
      const plus_button = document.createElement("button");
      plus_button.classList.add("incr_in_cart");
      plus_button.title = "more";

      const plus_img = document.createElement("img");
      plus_img.src = "../buyer_home_page/components/comp_images/plus.png";
      plus_button.append(plus_img);
      incr_div.append(plus_button);
      cart_item_div.append(incr_div);

      const decr_div = document.createElement("div");
      decr_div.classList.add("decr_div");
      const minus_button = document.createElement("button");
      minus_button.classList.add("decr_in_cart");
      minus_button.title = "less";

      const minus_img = document.createElement("img");
      minus_img.src =
        "../buyer_home_page/components/comp_images/minus-button.png";
      minus_button.append(minus_img);
      decr_div.append(minus_button);
      cart_item_div.append(decr_div);

      const remove_div = document.createElement("div");
      remove_div.classList.add("rm_div");
      const remove_button = document.createElement("button");
      remove_button.classList.add("rm_i_button");
      remove_button.title = "remove";

      const remove_img = document.createElement("img");
      remove_img.src = "../buyer_home_page/components/comp_images/delete.png";
      remove_button.append(remove_img);
      remove_div.append(remove_button);
      cart_item_div.append(remove_div);

      ///////////////////////PLUS BUTTON EVENT/////////////////
      plus_button.addEventListener("click", () => {
        if (cart_item.units < cart_item.product_units) {
          cart_item.units += 1;
          in_cart_amnt_value.innerHTML = cart_item.units;
          cart_sub_total.innerHTML = cart_list
            .reduce(
              (acc, { product_price, units }) =>
                acc + parseFloat(product_price) * parseInt(units),
              0
            )
            .toFixed(2);
        }
      });

      //////////////////MINUS BUTTON AMOUNT/////////////
      minus_button.addEventListener("click", () => {
        if (cart_item.units > 1) {
          cart_item.units -= 1;
          in_cart_amnt_value.innerHTML = cart_item.units;
          cart_sub_total.innerHTML = cart_list
            .reduce(
              (acc, { product_price, units }) =>
                acc + parseFloat(product_price) * parseInt(units),
              0
            )
            .toFixed(2);
        }
      });

      ///////////////REMOVE CART ITEM CLICK/////////////////
      remove_button.addEventListener("click", () => {
        var new_cart_amount = parseInt(cart_units_value.textContent) - 1;
        cart_units_value.textContent = new_cart_amount;
        import_api_request().then((api_mod) => {
          api_mod.Buyer.current_user().then((user) => {
            api_mod.CartExtras.delete_cart_item(
              cart_item.product_c_id,
              user[0].login_id
            );
          });
          var new_cart = api_mod.CartExtras.cart_items.filter(
            (item) => item.product_c_id != cart_item.product_c_id
          );
          api_mod.CartExtras.cart_items = [...new_cart];
          cart_list = [...new_cart];
          cart_sub_total.innerHTML = cart_list
            .reduce(
              (acc, { product_price, units }) =>
                acc + parseFloat(product_price) * parseInt(units),
              0
            )
            .toFixed(2);
        });
        cart_item_div.style.display = "none";
      });
      cart_item_div.style.width = "85%";
      expand_items.append(cart_item_div);
    }
  });
}
