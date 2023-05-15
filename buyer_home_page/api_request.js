export class Buyer {
  static current_user = async function () {
    const url = "../login_process.php?function=get_user_info";
    const response = await fetch(url);
    const user = await response.json();
    return user;
  };
}

export class Product {
  constructor(product_id, product_name, product_price, product_rating) {}

  static fetch_products = async function (cat) {
    const url = "buyer_process.php";
    const params = {
      cat_value: cat,
    };
    const param_string = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${param_string}`);
    const data = await response.json();
    const result = data.length === 0 ? null : data;
    return result;
  };
}

export class Cart {
  constructor(buyer_id, product_c_id, units) {
    this.buyer_id = buyer_id;
    this.product_c_id = product_c_id;
    this.units = units;
  }

  static insert_in_cart = async function (cart) {
    const url = "buyer_process.php";
    const req_func = "insert_in_cart";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `function=${req_func}&buyer_id=${cart.buyer_id}&product_id=${cart.product_c_id}
    &units=${cart.units}`,
    };
    const response = await fetch(url, options);
    const status = response.text();
    return status;
  };

  static get_cart_items = async function (current_user_id) {
    const url = `buyer_process.php?function=get_cart_items&current_user_id=${current_user_id}`;
    const response = await fetch(url);
    const cart_items = await response.json();
    return cart_items;
  };


  static delete_cart_item = async function (p_id, current_user) {
    const url = "buyer_process.php";
  
    const data = {
      product_id: p_id,
      action: "delete_from_cart",
      current_user: current_user,
    };
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        // Request was successful
        const result = await response.json();
        console.log(result);
      } else if (response.status >= 400 && response.status < 500) {
        // Client error
        console.error("Client error:", response.status, response.statusText);
      } else {
        // Server error
        console.error("Server error:", response.status, response.statusText);
      }
    } catch (error) {
      // Network error
      console.error("Network error:", error);
    }
  };
}

export class CartExtras extends Cart {
  static cart_items = [];
  constructor(buyer_id, product_c_id, product_name, units, image_path) {
    super(buyer_id, product_c_id, units);
    this.image_path = image_path;
    this.product_name = product_name.toLowerCase();
    CartExtras.cart_items.push(this);
  }

  static search_cart(search_string) {
    var result = [];
    result = this.cart_items.filter((ci) =>
      ci.product_name.toLowerCase().includes(search_string.toLowerCase())
    );
    return result;
  }
}
