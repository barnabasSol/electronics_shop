export class Buyer {
  static current_user = async () => {
    const url = "../login_process.php?function=get_user_info";
    const response = await fetch(url);
    const user = await response.json();
    return user;
  };

  static make_order = async (cart_content) => {
    const url = "buyer_process.php";
    const req_func = "make_order";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `function=${req_func}&ordered_items=${JSON.stringify(
        cart_content
      )}`,
    };
    const response = await fetch(url, options);
    const reply = response.text();
    return reply;
  };

  static check_notifications = async (current_user) => {
    const req_func = "notification";
    const url = `buyer_process.php?function=${req_func}&current_user=${current_user}`;
    const response = await fetch(url);
    return response;
  };
}

export class Product {
  static search_products = async (search_string) => {
    const url = `buyer_process.php`;
    const params = {
      search_string_param: search_string,
      function: "search_product",
    };
    const param_string = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${param_string}`);
    const data = await response.json();
    const result = data.length === 0 ? null : data;
    return result;
  };

  static fetch_products = async (cat) => {
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

  static get_product_images = async (img_id) => {
    const url = "buyer_process.php";
    const req_func = "get_product_images";
    const params = {
      function: req_func,
      prod_img_id: img_id,
    };
    const param_string = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${param_string}`);
    const data = await response.json();
    const result = data.length === 0 ? null : data;
    return result;
  };

  static get_seller_contact = async (prod_id) => {
    const url = "buyer_process.php";
    const req_func = "seller_contact";
    const params = {
      function: req_func,
      product_id: prod_id,
    };
    const param_string = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${param_string}`);
    const data = response.json();
    const result = data.length === 0 ? null : data;
    return result;
  };
}

export class Cart {
  static cart_is_empty = false;
  constructor(buyer_id, product_c_id, units) {
    this.buyer_id = buyer_id;
    this.product_c_id = product_c_id;
    this.units = units;
  }

  static insert_in_cart = async (cart) => {
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

  static update_cart_content = async (cart_content, current_user_id) => {
    const url = "buyer_process.php";
    const data = {
      action: "update_cart_content",
      current_user: current_user_id,
      cart_items: cart_content,
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  static delete_cart_item = async (p_id, current_user) => {
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

  static delete_cart_content = async (current_user_id) => {
    const url = "buyer_process.php";

    const data = {
      action: "delete_cart_content",
      current_user: current_user_id,
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
        return result;
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
    this.product_name = product_name;
    CartExtras.cart_items.push(this);
  }

  static search_cart(search_string) {
    if (search_string === "") {
      this.cart_items.forEach((element) => {
        element.show = true;
      });
      return this.cart_items;
    }
    this.cart_items.forEach((element) => {
      if (
        !element.product_name
          .toLowerCase()
          .includes(search_string.toLowerCase())
      ) {
        element.show = false;
      } else {
        element.show = true;
      }
    });
    return this.cart_items;
  }
}
