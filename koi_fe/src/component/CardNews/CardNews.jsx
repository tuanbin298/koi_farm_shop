import React from "react";
import { GET_ARTICLES } from "../../page/api/Queries/articles";
import { useQuery } from "@apollo/client";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import "./CardNews.css";

// Định nghĩa một styled component
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  transition: "transform 0.3s, box-shadow 0.3s",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[5],
  },
}));

export default function CardNews() {
  const {
    data: articlesData,
    loading: loadingArticles,
    error: errorArticles,
  } = useQuery(GET_ARTICLES, {
    variables: { take: 3 },
  });

  if (loadingArticles) {
    return <p>Loading...</p>;
  }
  if (errorArticles) {
    return <p>Error fetching articles</p>;
  }

  return (
    <Grid container spacing={3}>
      {articlesData &&
        articlesData.articles.map((article) => {
          const link = article.link?.document?.[0]?.children?.find(
            (child) => child.href
          )?.href;

          return (
            <Grid key={article.id} item xs={12} sm={6} md={4}>
              <Item>
                <a
                  href={link ? link : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article">
                    {article.image?.publicUrl && (
                      <img
                        src={article.image.publicUrl}
                        alt={article.name}
                        className="cardNews-image"
                      />
                    )}
                    <div className="article__info">
                      <h4 className="cardNews-title">{article.name}</h4>
                      <p className="cardNews-content">{article.content}</p>
                      <button className="readMoreButton">Đọc thêm</button>
                    </div>
                  </div>
                </a>
              </Item>
            </Grid>
          );
        })}
    </Grid>
  );
}
