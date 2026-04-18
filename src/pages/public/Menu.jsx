import { useState, useEffect } from "react";
import { publicAPI, STORAGE_URL, cartAPI } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";
import { FaPlus, FaMinus, FaTrash, FaShoppingCart } from "react-icons/fa";
import uberEats from "../../assets/Menu/apps/UberEats.svg";
import grubHub from "../../assets/Menu/apps/GrubHub.svg";
import postMates from "../../assets/Menu/apps/Postmates.svg";
import doorDash from "../../assets/Menu/apps/DoorDash.svg";
import foodpanda from "../../assets/Menu/apps/foodpanda.svg";
import delivercoo from "../../assets/Menu/apps/delivercoo.svg";
import instacort from "../../assets/Menu/apps/instacort.svg";
import justEat from "../../assets/Menu/apps/justEat.svg";
import didiFood from "../../assets/Menu/apps/didiFood.svg";
import Loader from "../../components/Loader";
function Menu() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState(null);

  // 🔥 IMPORTANT STRUCTURE
  const [cartState, setCartState] = useState({});

  // ================= FETCH MENU =================
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

  // ================= ERROR =================
  useEffect(() => {
    if (categoriesError) showToast("error", "Failed to load categories");
  }, [categoriesError]);

  useEffect(() => {
    if (menuError) showToast("error", "Failed to load menu items");
  }, [menuError]);

  // ================= FILTER =================
  const filteredItems = activeCategory
    ? menuItems.filter((item) => item.category?.id === activeCategory)
    : menuItems;

  // ================= FETCH CART =================
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart();

      const mapped = {};

      res.data.data.cart_items.forEach((item) => {
        mapped[item.menu_item.id] = {
          cartItemId: item.id,
          quantity: item.quantity,
        };
      });

      setCartState(mapped);
    } catch {
      showToast("error", "Failed to load cart");
    }
  };

  // ================= ADD =================
  const addToCart = async (item) => {
    try {
      const res = await cartAPI.addItem({
        menu_item_id: item.id,
        quantity: 1,
      });

      const cartItem = res.data.data;

      setCartState((prev) => ({
        ...prev,
        [item.id]: {
          cartItemId: cartItem.id,
          quantity: 1,
        },
      }));

      showToast("success", "Added to cart");
    } catch {
      showToast("error", "Failed to add item");
    }
  };

  // ================= INCREASE =================
  const updateQty = async (item, newQty) => {
    const current = cartState[item.id];

    if (newQty === 0) {
      try {
        await cartAPI.removeItem(current.cartItemId);

        setCartState((prev) => {
          const updated = { ...prev };
          delete updated[item.id];
          return updated;
        });

        showToast("success", "Item removed ");
      } catch {
        showToast("error", "Failed to remove item");
      }

      return;
    }

    // 🔥 optimistic update
    setCartState((prev) => ({
      ...prev,
      [item.id]: {
        ...current,
        quantity: newQty,
      },
    }));

    try {
      await cartAPI.updateItem(current.cartItemId, {
        quantity: newQty,
      });

      // ✅ TOAST HERE
      if (newQty > current.quantity) {
        showToast("success", "Added one more");
      } else {
        showToast("success", "One Item Removed");
      }
    } catch {
      showToast("error", "Failed to update");

      // rollback
      setCartState((prev) => ({
        ...prev,
        [item.id]: current,
      }));
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
  if (categoriesLoading || menuLoading) return <Loader />

  return (
    <>
      <section className="menu-page">
        <div className="menu-container container">
          {/* HEADER */}
          <div className="text-center mb-5">
            <h1 className="h1 mb-3">Our Menu</h1>
            <p className="body-lg">We consider all the drivers of change gives you the components you need to change to create a truly happens.</p>
          </div>

          {/* CATEGORIES */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
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

          {/* ITEMS */}
          <div className="menu-grid row g-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="menu-card">
                  <img src={STORAGE_URL + item.image_url} alt={item.name} />

                  <div className="menu-content text-center p-3">
                    <h3 className="h3">$ {item.price}</h3>
                    <h4 className="body-xl body-xl-bold neutral6">
                      {item.name}
                    </h4>
                    <p className="body-md neutral5">{item.description}</p>

                    {isAuthenticated && (
                      <div className="cart-control neutral7">
                        {!cartState[item.id] ? (
                          <button
                            className="add-btn"
                            onClick={() => addToCart(item)}
                          >
                            <FaShoppingCart className="me-1" />
                          </button>
                        ) : (
                          <div className="quantity-box">
                            <button
                              onClick={() =>
                                updateQty(item, cartState[item.id].quantity - 1)
                              }
                            >
                              {cartState[item.id].quantity === 1 ? (
                                <FaTrash />
                              ) : (
                                <FaMinus />
                              )}
                            </button>

                            <span>{cartState[item.id].quantity}</span>

                            <button
                              onClick={() =>
                                updateQty(item, cartState[item.id].quantity + 1)
                              }
                            >
                              <FaPlus />
                            </button>
                          </div>
                        )}
                      </div>
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
              <h2 className="h2 mb-3 "> You can order through apps </h2>
              <p className="body-md neutral6">
                Lorem ipsum dolor sit amet consectetur adipiscing elit enim bibendum sed et aliquet aliquet risus tempor semper.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="delivery-logos">

  {/* ROW 1 */}
  <div className="logos-row">
    {apps.slice(0, 3).map((app, i) => (
      <div key={i} className="logo-box">
      <img src={app.img} alt={app.title} />
      </div>
    ))}
  </div>

  {/* ROW 2 (BIGGER) */}
  <div className="logos-row center-row">
    {apps.slice(3, 6).map((app, i) => (
      <div key={i} className="logo-box">
      <img src={app.img} alt={app.title} />
    </div>))}
  </div>

  {/* ROW 3 */}
  <div className="logos-row">
    {apps.slice(6, 9).map((app, i) => (
      <div key={i} className="logo-box">
      <img src={app.img} alt={app.title} />
    </div>))}
  </div>

</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Menu;
