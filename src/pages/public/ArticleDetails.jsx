import { useEffect, useCallback } from "react";
import { useNavigate,  useParams } from "react-router-dom";
import { publicAPI } from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { useAsync } from "../../hooks/useAsync";
import Loader from "../../components/Loader";

function ArticleDetails() {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  // ================= FETCH SINGLE ARTICLE =================
  const fetchArticle = useCallback(() => {
    return publicAPI.getArticle(id);
  }, [id]);

  const {
    data: articleData,
    loading,
    error,
    execute,
  } = useAsync(fetchArticle, false);

  // ================= FETCH ALL ARTICLES =================
  const {
    data: articlesData,
  } = useAsync(publicAPI.getArticles);

  // ================= DATA =================
  const article =
    articleData?.data?.data || articleData?.data || null;

  const articles = articlesData?.data || [];

  // ================= TRIGGER FETCH =================
  useEffect(() => {
    execute();
  }, [id]);

  // ================= ERROR HANDLING =================
  useEffect(() => {
    if (error) {
      showToast("error", "Failed to load article");
    }
  }, [error]);

  // ================= LOADING =================
  if (loading) return <Loader />
  // ================= EMPTY =================
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
          src={article.image_url}
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
          need to change to create a truly happens.
        </p>
      </div>

      <div className="articles-grid mt-4">
          {articles.length > 0 &&
            articles
              .filter((item) => item.id !== article.id) // 🔥 exclude current article
              .slice(0, 4)
              .map((item) => (
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
                    <span className="body-sm body-sm-medium neutral5">
                      {new Date(item.created_at).toLocaleDateString()}
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