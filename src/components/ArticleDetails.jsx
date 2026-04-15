import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicAPI, STORAGE_URL } from "../service/api";
import { useToast } from "../context/ToastContext";

function ArticleDetails() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // ================= FETCH ARTICLE =================
  const fetchArticle = async () => {
    try {
      setLoading(true);

      const res = await publicAPI.getArticle(id);

      const data = res?.data?.data || res?.data || null;

      setArticle(data);

    } catch {
      showToast("error", "Failed to load article");
      setArticle(null);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  // ================= LOADING =================
  if (loading) {
    return (
      <p className="text-center body-md py-5">
        Loading article...
      </p>
    );
  }

  // ================= EMPTY STATE =================
  if (!article) {
    return (
      <p className="text-center body-md py-5 text-danger">
        Article not found
      </p>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >

      <h1>{article.title}</h1>

      <img
        src={STORAGE_URL + article.image_url}
        alt={article.title}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          borderRadius: "10px",
          margin: "20px 0",
        }}
      />

      <p style={{ lineHeight: "1.6", fontSize: "18px" }}>
        {article.content}
      </p>

    </div>
  );
}

export default ArticleDetails;