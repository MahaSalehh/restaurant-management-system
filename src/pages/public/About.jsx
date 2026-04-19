import AboutUs from "../../components/AboutUs";
import CustomersSays from "../../components/CustomersSays";

import foodImg from "../../assets/About/about-us.png";
import icon1 from "../../assets/About/icon1.svg";
import icon2 from "../../assets/About/icon2.svg";
import icon3 from "../../assets/About/icon3.svg";
import image from "../../assets/About/about-section.png";
import { FaPlay} from "react-icons/fa";
const About = () => {
  const services = [
    {
      img: icon1,
      title: "Multi Cuisine",
      caption:
        "In the new era of technology we look in the future with certainty life.",
    },
    {
      img: icon2,
      title: "Easy To Order",
      caption:
        "In the new era of technology we look in the future with certainty life.",
    },
    {
      img: icon3,
      title: "Fast Delivery",
      caption:
        "In the new era of technology we look in the future with certainty life.",
    },
  ];

  return (
    <>
      <AboutUs img={foodImg} />

      <section className="video-section">
        <div className="overlay overlay-center text-center">
          <button className="play-btn btn-circle btn-circle-lg btn-hover-scal"> <FaPlay/> </button>

          <h2 className="h2 mt-3 neutral1 text-container-sm">
            Feel the authentic & original taste from us
          </h2>
        </div>
      </section>

      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4 justify-content-center">

            {services.map((s, i) => (
              <div key={i} className="col-lg-4 col-md-4 col-12">

                <div className="feature-item flex-start">

                  <div className="icon-box">
                    <img src={s.img} alt={s.title} />
                  </div>

                  <div className="feature-content">
                    <h5 className="body-xl body-xl-bold neutral7">
                      {s.title}
                    </h5>

                    <p className="body-md neutral6">
                      {s.caption}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      <div className="stats bg-light-section">
      <section className="container">
        <div className="row align-items-center g-4">

          <div className="col-lg-6 col-12">
            <h2 className="h2 mb-4">
              A little information for our valuable guest
            </h2>
            <p className="body-md neutral6">At place, we believe that dining is not just about food, but also about the overall experience. Our staff, renowned for their warmth and dedication, strives to make every visit an unforgettable event.</p>

            <div className="row g-3">

              <div className="col-6">
                <div className="card-custom text-center">
                  <h2 className="h2">3</h2>
                  <span className="body-lg body-lg-medium neutral5">Locations</span>
                </div>
              </div>

              <div className="col-6">
                <div className="card-custom text-center">
                  <h2 className="h2">1995</h2>
                  <span className="body-lg body-lg-medium neutral5">Founded</span>
                </div>
              </div>

              <div className="col-6">
                <div className="card-custom text-center">
                  <h2 className="h2">65+</h2>
                  <span className="body-lg body-lg-medium neutral5">Staff Members</span>
                </div>
              </div>

              <div className="col-6">
                <div className="card-custom text-center">
                  <h2 className="h2">100%</h2>
                  <span className="body-lg body-lg-medium neutral5">Satisfied Customers</span>
                </div>
              </div>

            </div>
          </div>

          <div className="col-lg-6 col-12 text-center">
            <img src={image} alt="chef" className="img-fluid rounded-4" />
          </div>

        </div>
      </section>
</div>
      <CustomersSays />
    </>
  );
};

export default About;