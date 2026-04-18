import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { publicAPI, STORAGE_URL } from "../../service/api";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";

import Breakfast from "../../assets/Home/breakfast.svg";
import MainDishes from "../../assets/Home/mainDishes.svg";
import Drinks from "../../assets/Home/drinks.svg";
import Desserts from "../../assets/Home/dessert.svg";

import AboutUs from "../../components/AboutUs";
import Services from "../../components/Services";
import CustomersSays from "../../components/CustomersSays";

import img from "../../assets/Home/img.png";
import foodImg from "../../assets/Home/about.png";

import { FaRegClock } from "react-icons/fa";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

function Home() {
  const { isAuthenticated} = useAuth();

  // ================= FETCH =================
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAsync(publicAPI.getCategories);

  const {
    data: articlesData,
    loading: articlesLoading,
    error: articlesError,
  } = useAsync(publicAPI.getArticles);

  const categories = categoriesData?.data || [];
  const articles = articlesData?.data || [];

  const featured = articles[0];
  const sideArticles = articles.slice(1, 5);
const { showToast } = useToast();
const showError = () => {
  showToast("error", "Please Login First");
}
  // ================= ERROR HANDLING (CONTROLLED TOAST) =================
  useEffect(() => {
    if (categoriesError) {
      showToast("error", "Failed to Load Categories")
    }
  },[categoriesError]);

  useEffect(() => {
    if (articlesError) {
      showToast("error", "Failed to Load Articles")
    }
  }, [articlesError]);

  // ================= MAPS =================
  const iconsMap = {
    Breakfast,
    "Main Dishes": MainDishes,
    Drinks,
    Desserts,
  };

  const captionsMap = {
    Breakfast: "In the new era of technology we look in the future with certainty and pride for our life.",
    "Main Dishes": "In the new era of technology we look in the future with certainty and pride for our life.",
    Drinks: "In the new era of technology we look in the future with certainty and pride for our life.",
    Desserts: "In the new era of technology we look in the future with certainty and pride for our life.",
  };

  // ================= LOADING =================
  if (categoriesLoading || articlesLoading) return <Loader />

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="upper_sec section bg-cover full-height flex-center text-center">
        <div className="hero text-container neutral7">

          <h1 className="h1">Best food for your taste</h1>

          <p className="body-lg">
            Discover delectable cuisine and unforgettable moments<br /> in our welcoming, culinary haven.
          </p>

          <div className="hero-buttons d-flex gap-3 justify-content-center">
            {!isAuthenticated ? (
              <Button as={Link} to="/booking" className="btn-custom btn-primary-custom btn-lg"
            onClick={showError}
            >
              Book A Table
            </Button>
            ) : (
              <Button as={Link} to="/booking" className="btn-custom btn-primary-custom btn-lg"
            >
              Book A Table
            </Button>
            )}

            <Button as={Link} to="/menu" className="btn-custom btn-outline-custom btn-lg">
              Explore Menu
            </Button>
          </div>

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <Container className="py-5">
        <h1 className="h2 text-center mb-4">Browse Our Menu</h1>

        <Row className="mt-5 g-4">
          {categories.map((item) => (
            <Col lg={3} md={6} sm={12} key={item.id}>

              <Card className="category-card card-base card-padding-lg card-hover-up text-center">

                <div className="icon-wrapper">
                  <img src={iconsMap[item.name]} alt={item.name} />
                </div>

                <h3 className="h3">{item.name}</h3>

                <p className="body-md neutral6">
                  {captionsMap[item.name]}
                </p>

                <Link to="/menu" className="explore-link">
                  Explore Menu
                </Link>

              </Card>

            </Col>
          ))}
        </Row>
      </Container>

      {/* ================= SECTIONS ================= */}
      <div className="bg-light-section"><AboutUs img={foodImg} /></div>
      <Services />

      {/* ================= STATS ================= */}
      <div className="bg-light-section stats">
        <Container className="py-5">
          <Row className="align-items-center g-5">

            <Col md={6} className="text-center">
              <img src={img} className="img-fluid rounded-3" />
            </Col>

            <Col md={6} className="text-container-md">
              <h2 className="h2 mb-3">
                Fastest Food Delivery in City
              </h2>

              <p className="body-md neutral5 mb-4">
                Our visual designer lets you quickly and of drag a down your way to customapps for both keep desktop. 
              </p>

              <ul className="body-xl body-xl-medium list-unstyled d-grid gap-3 mb-0">
                <li className="d-flex align-items-center gap-2"><span className="icon-boxs"><FaRegClock /></span> Delivery within 30 minutes</li>
                <li className="d-flex align-items-center gap-2"><span className="icon-boxs"><HiOutlineReceiptTax /></span> Best Offer & Prices</li>
                <li className="d-flex align-items-center gap-2"><span className="icon-boxs"><AiOutlineShoppingCart /></span> Online Services Available</li>
              </ul>

            </Col>

          </Row>
        </Container>
      </div>

      <CustomersSays />

      {/* ================= BLOG ================= */}
      <div className="bg-light-section">
        <Container className="py-5">

          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h2">Our Blog & Articles</h2>

            <Button as={Link} to="/articles" className="btn-custom btn-primary-custom btn-lg">
              Read All Articles
            </Button>
          </div>

          <Row className="mt-4 g-3 blog-cards">

            {/* big card */}
            <Col md={6}>
              {featured && (
                <Card className="h-100 card-base">
                  <Card.Img src={STORAGE_URL + featured.image_url} />

                  <Card.Body>
                    <span className="body-md neutral5">
                      {new Date(featured.created_at).toLocaleDateString()}
                    </span>

                    <h4 className="body-xl body-xl-medium neutral7 mt-2">{featured.title}</h4>

                    <p className="body-sm neutral6">{featured.content?.slice(0, 120)}...</p>
                  </Card.Body>
                </Card>
              )}
            </Col>

            {/* small cards */}
            <Col md={6}>
              <Row className="g-3">

                {sideArticles.map((item) => (
                  <Col md={6} key={item.id}>
                    <Card className="card-base">
                      <Card.Img src={STORAGE_URL + item.image_url} />

                      <Card.Body>
                        <span className="body-sm neutral5">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>

                        <h6 className="body-md body-md-medium neutral7 mt-1">{item.title}</h6>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}

              </Row>
            </Col>

          </Row>

        </Container>
      </div>
    </>
  );
}

export default Home;