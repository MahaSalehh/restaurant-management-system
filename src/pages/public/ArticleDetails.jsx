import { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { publicAPI, STORAGE_URL } from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { useAsync } from "../../hooks/useAsync";
import Loader from "../../components/Loader";

function ArticleDetails() {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchArticle = useCallback(() => {
    return publicAPI.getArticle(id);
  }, [id]);

  const {
    data: articleData,
    loading,
    error,
    execute,
  } = useAsync(fetchArticle, [id], false);

  const { data: articlesData } = useAsync(publicAPI.getArticles);

  const article = articleData?.data?.data ?? articleData?.data ?? null;
  const articles = articlesData?.data ?? [];

  useEffect(() => {
    if (id) {
      execute();
    }
  }, [id, execute]);

  useEffect(() => {
    if (error) {
      showToast("error", error || "Failed to load article");
    }
  }, [error, showToast]);

  if (loading) return <Loader />;

  if (!article) {
    return (
      <p className="text-center body-md py-5 text-danger">
        Article not found
      </p>
    );
  }

  return (
    <>
      <section className="bg-light-section">
        <div className="article-container">
          <h2 className="h2 text-center">{article.title}</h2>

          <img
            src={STORAGE_URL + article.image_url}
            alt={article.title}
            className="article-image"
          />

          <p className="article-content">
            {article.content}
          </p>
        </div>
      </section>

      <div className="container">
        <div className="read-more text-center text-container-sm mt-5">
          <h2 className="h2">Read More Articles</h2>

          <p className="body-lg">
            We consider all the drivers of change gives you the components you
            need to create a truly happens.
          </p>
        </div>

        <div className="articles-grid mt-4">
          {articles
            .filter((item) => item.id !== article.id)
            .slice(0, 4)
            .map((item) => (
              <div
                key={item.id}
                className="articles-card"
                onClick={() => navigate(`/articles/${item.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={STORAGE_URL + item.image_url}
                  alt={item.title}
                />

                <div className="articles-content">
                  <span className="body-sm body-sm-medium neutral5">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : ""}
                  </span>

                  <p className="body-xl body-xl-medium mt-3">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ArticleDetails;