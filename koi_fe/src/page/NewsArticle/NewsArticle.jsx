import React from "react";
import { GET_ARTICLES } from "../../page/api/Queries/articles";
import { useQuery } from "@apollo/client";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import "./NewsArticle.css";

// Styled component cho phần bài viết
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
  },
}));

export default function NewsArticle() {
  const {
    data: articlesData,
    loading: loadingArticles,
    error: errorArticles,
  } = useQuery(GET_ARTICLES, {
    variables: { take: 3 }, // Lấy 3 bài viết
  });

  if (loadingArticles) {
    return <p>Loading...</p>;
  }
  if (errorArticles) {
    return <p>Error fetching articles</p>;
  }

  return (
    <div className="news-article-list">
      {articlesData &&
        articlesData.articles.map((article) => {
          const link = article.link?.document?.[0]?.children?.find(
            (child) => child.href
          )?.href;

          return (
            <Item key={article.id} className="news-article-item">
              <a
                href={link ? link : "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="article-horizontal">
                  {article.image?.publicUrl && (
                    <img
                      src={article.image.publicUrl}
                      alt={article.name}
                      className="newsArticle-image"
                    />
                  )}
                  <div className="article__info">
                    <h2 className="newsArticle-title">{article.name}</h2>
                    <p className="newsArticle-content">
                      {article.content.slice(0, 150)}...
                    </p>
                    <button className="readMoreButton">Đọc thêm</button>
                  </div>
                </div>
              </a>
            </Item>
          );
        })}
    </div>
  );
}
