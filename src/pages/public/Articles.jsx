import React, { useEffect } from "react";
import { publicAPI, STORAGE_URL } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";

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
    return <p className="text-center body-md py-5">Loading...</p>;

  return (
    <section className="py-5 bg-light-section">
      <div className="container">

        <h1 className="h2 text-center mb-4">
          Articles
        </h1>

        <div className="articles-grid">

          {articles.map((item) => (
            <div
              key={item.id}
              className="article-card card-base card-padding-md card-hover-scale"
              onClick={() => navigate(`/articles/${item.id}`)}
            >
              <img
                src={STORAGE_URL + item.image_url}
                alt={item.title}
                className="article-img img-cover img-rounded img-lg"
              />

              <h3 className="body-md body-md-bold mt-3">
                {item.title}
              </h3>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Articles;