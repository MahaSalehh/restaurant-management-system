import React, { useEffect } from "react";
import { publicAPI, STORAGE_URL } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";
import { Card } from "react-bootstrap";
import Loader from "../../components/Loader";

function Articles() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data, loading, error } = useAsync(publicAPI.getArticles);

  const articles = data?.data || [];

  // ================= ERROR HANDLING =================
  useEffect(() => {
    if (error) {
      showToast("error", "Failed to load articles");
    }
  }, [error, showToast]);

  // ================= LOADING =================
  if (loading)
    return <Loader />

  return (
    <section className="py-5 bg-light-section">
      <div className="container">

        <h1 className="h1 text-center mb-4">
          Our Blog & Articles
        </h1>
        <p className="body-lg text-center text-container-sm neutral6 mb-5">We consider all the drivers of change gives you the components you need to change to create a truly happens.</p>

        <div className="articles-grid">
  {articles.slice(5).map((item) => (
    <div
      key={item.id}
      className="articles-card"
      onClick={() => navigate(`/articles/${item.id}`)}
    >
      <img
        src={STORAGE_URL + item.image_url}
        alt={item.title}
      />

      <div className="articles-content">
        <span className=" neutral5">
          {new Date(item.created_at).toLocaleDateString()}
        </span>

        <p className=" mt-2">
          {item.title}
        </p>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}

export default Articles;