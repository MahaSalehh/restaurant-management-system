import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { publicAPI, STORAGE_URL, cartAPI } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";

import uberEats from "../../assets/Menu/apps/uber-eats.png";
import grubHub from "../../assets/Menu/apps/grub-hub.png";
import postMates from "../../assets/Menu/apps/postmates.png";
import doorDash from "../../assets/Menu/apps/doordash.png";
import foodpanda from "../../assets/Menu/apps/foodpanda.png";
import delivercoo from "../../assets/Menu/apps/delivercoo.png";
import instacort from "../../assets/Menu/apps/instacort.png";
import justEat from "../../assets/Menu/apps/justeat.png";
import didiFood from "../../assets/Menu/apps/didi-food.png";

function Menu() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState(null);

  // ================= FETCH =================
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAsync(publicAPI.getCategories);

  const {
    data: menuData,
    loading: menuLoading,
    error: menuError,
  } = useAsync(publicAPI.getMenuItems);

  const categories = categoriesData?.data || [];
  const menuItems = menuData?.data || [];

  // ================= ERROR TOAST (CONTROLLED) =================
  useEffect(() => {
    if (categoriesError) {
      showToast("error", "Failed to load categories");
    }
  }, [categoriesError, showToast]);

  useEffect(() => {
    if (menuError) {
      showToast("error", "Failed to load menu items");
    }
  }, [menuError, showToast]);

  // ================= FILTER =================
  const filteredItems = activeCategory
    ? menuItems.filter(item => item.category?.id === activeCategory)
    : menuItems;

  // ================= CART =================
  const addToCart = async (item) => {
    try {
      await cartAPI.addItem({
        menu_item_id: item.id,
        quantity: 1,
      });

      showToast("success", "Added to cart");
    } catch {
      showToast("error", "Failed to add item");
    }
  };

  const apps = [
    { title: "Uber Eats", img: uberEats },
    { title: "GRUBHUB", img: grubHub },
    { title: "Postmates", img: postMates },
    { title: "DOORDASH", img: doorDash },
    { title: "foodpanda", img: foodpanda },
    { title: "deliveroo", img: delivercoo },
    { title: "instacart", img: instacort },
    { title: "JUST EAT", img: justEat },
    { title: "DiDi Food", img: didiFood },
  ];

  // ================= LOADING =================
  if (categoriesLoading || menuLoading)
    return <p className="text-center body-md py-5">Loading...</p>;

  return (
    <>

      {/* ================= MENU PAGE ================= */}
      <section className="menu-page ">
        <div className="menu-container container">
          <div className="text-center mb-5">
            <h1 className="h1 mb-3">Our Menu</h1>

            <p className="body-md neutral6 text-container-sm mx-auto">
              We consider all the drivers of change gives you the components you need to change to create a truly happens.
            </p>
          </div>

          {/* CATEGORIES */}
          <div className="menu-categories d-flex flex-wrap justify-content-center gap-3 mb-5">

            <button
              className={`category-btn ${activeCategory === null ? "active" : ""}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="col-lg-3 col-md-4 col-sm-6">

                <div className="menu-card">

                  {/* IMAGE */}
                  <div className="menu-img-wrapper">
                    <img
                      src={STORAGE_URL + item.image_url}
                      alt={item.name}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="menu-content text-center">

                    <h3 className="price">${item.price}</h3>

                    <h4 className="title">
                      {item.name}
                    </h4>

                    <p className="desc">
                      Made with eggs, lettuce, salt, oil and other ingredients.
                    </p>

                    {isAuthenticated && (
                      <FaShoppingCart
                        className="cart-icon"
                        onClick={() => addToCart(item)}
                      />
                    )}

                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DELIVERY APPS ================= */}
      <section className="delivery-section section">
        <div className="menu-container">

          <div className="row align-items-center delivery-wrapper">

            {/* LEFT TEXT */}
            <div className="col-lg-6 delivery-text">
              <h2 className="h2 mb-3">
                You can order through apps
              </h2>

              <p className="body-sm neutral5">
                Lorem ipsum dolor sit amet consectetur adipiscing elit enim bibendum sed aliquet aliquet risus tempor semper.
              </p>
            </div>

            {/* RIGHT GRID */}
            <div className="col-lg-6">
              <div className="delivery-logos">
                {apps.map((app, i) => (
                  <img
                    key={i}
                    src={app.img}
                    alt={app.title}
                    className="delivery-logo"
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </>
  );
}

export default Menu;