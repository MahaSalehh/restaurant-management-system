import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollTopBtn = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <button className="scroll-top-btn" onClick={scrollToTop}>
      <FaArrowUp />
    </button>
  );
};

export default ScrollTopBtn;