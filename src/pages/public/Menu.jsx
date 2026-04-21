import { useState, useEffect, useCallback } from "react";
import { publicAPI, STORAGE_URL, cartAPI } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";
import { FaPlus, FaMinus, FaTrash, FaShoppingCart } from "react-icons/fa";
import UberEats from "../../assets/Menu/apps/uber-eats.svg";
import GrubHub from "../../assets/Menu/apps/grub-hub.svg";
import PostMates from "../../assets/Menu/apps/postmates.svg";
import DoorDash from "../../assets/Menu/apps/door-dash.svg";
import foodpanda from "../../assets/Menu/apps/foodpanda.svg";
import delivercoo from "../../assets/Menu/apps/delivercoo.svg";
import instacort from "../../assets/Menu/apps/instacort.svg";
import justEat from "../../assets/Menu/apps/just-eat.svg";
import didiFood from "../../assets/Menu/apps/didi-food.svg";
import Loader from "../../components/Loader";
import { Link } from "lucide-react";

function Menu() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState(null);
  const [cartState, setCartState] = useState({});

  const getCategories = useCallback(() => publicAPI.getCategories(), []);
  const getMenuItems = useCallback(() => publicAPI.getMenuItems(), []);

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAsync(getCategories, []);

  const {
    data: menuData,
    loading: menuLoading,
    error: menuError,
  } = useAsync(getMenuItems, []);

  const categories = categoriesData?.data || [];
  const menuItems = menuData?.data || [];

  useEffect(() => {
    if (categoriesError) showToast("error", "Failed to load categories");
  }, [categoriesError]);

  useEffect(() => {
    if (menuError) showToast("error", "Failed to load menu items");
  }, [menuError]);

  const filteredItems = activeCategory
    ? menuItems.filter((item) => item.category?.id === activeCategory)
    : menuItems;

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

      if (newQty > current.quantity) {
        showToast("success", "Added one more");
      } else {
        showToast("success", "One Item Removed");
      }
    } catch {
      showToast("error", "Failed to update");

      setCartState((prev) => ({
        ...prev,
        [item.id]: current,
      }));
    }
  };

  const apps = [
    { title: "Uber Eats", img: UberEats },
    { title: "GRUBHUB", img: GrubHub },
    { title: "Postmates", img: PostMates },
    { title: "DOORDASH", img: DoorDash },
    { title: "foodpanda", img: foodpanda },
    { title: "deliveroo", img: delivercoo },
    { title: "instacart", img: instacort },
    { title: "JUST EAT", img: justEat },
    { title: "DiDi Food", img: didiFood },
  ];

  if (categoriesLoading || menuLoading) return <Loader />;

  return (
    <>
      <section className="menu-page">
        <div className="menu-container container">
          <div className="text-center mb-5">
            <h1 className="h1 mb-3">Our Menu</h1>
            <p className="body-lg">
              We consider all the drivers of change gives you the components you
              need to change to create a truly happens.
            </p>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            <button
              className={`category-btn ${
                activeCategory === null ? "active" : ""
              }`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${
                  activeCategory === cat.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id}>
                <div className="menu-card">
                  <img src={STORAGE_URL + item.image_url} alt={item.name} />

                  <div className="menu-content text-center p-3">
                    <h3 className="h3 body-xl-bold">$ {item.price}</h3>
                    <h4 className="body-xl-bold neutral6">{item.name}</h4>
                    <p className="neutral5">{item.description}</p>

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
                                updateQty(
                                  item,
                                  cartState[item.id].quantity - 1
                                )
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
                                updateQty(
                                  item,
                                  cartState[item.id].quantity + 1
                                )
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

      <section className="delivery-section section">
        <div className="menu-container">
          <div className="row align-items-center delivery-wrapper">
            <div className="col-lg-6 col-md-6 col-12 delivery-text">
              <h2 className="h2 mb-3">You can order through apps</h2>
              <p className="neutral6">
                Lorem ipsum dolor sit amet consectetur adipiscing elit enim
                bibendum sed et aliquet aliquet risus tempor semper.
              </p>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <div className="delivery-logos">
                <div className="logos-row">
                  {apps.slice(0, 3).map((app, i) => (
                    <div key={i} className="logo-box">
                      <img src={app.img} alt={app.title} />
                    </div>
                  ))}
                </div>

                <div className="logos-row center-row">
                  {apps.slice(3, 6).map((app, i) => (
                    <div key={i} className="logo-box">
                      <img src={app.img} alt={app.title} />
                    </div>
                  ))}
                </div>

                <div className="logos-row">
                  {apps.slice(6, 9).map((app, i) => (
                    <div key={i} className="logo-box">
                      <img src={app.img} alt={app.title} />
                    </div>
                  ))}
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