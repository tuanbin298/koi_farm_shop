import React, { useState } from 'react';
import { GET_ARTICLES } from '../../page/api/Queries/articles';
import { useQuery } from '@apollo/client';
import Pagination from '@mui/material/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import './NewsArticle.css';  

// Định nghĩa một styled component
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[5],
  },
}));

// Component tin tức
export default function NewsArticle() {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const { data: articlesData, loading, error } = useQuery(GET_ARTICLES);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <p>Error fetching articles</p>;
  }

  // Tính toán cho phân trang
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articlesData.articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const totalArticles = articlesData.articles.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="container mt-4">
      <Grid container spacing={3}>
        {/* Cột bài viết tin tức */}
        {currentArticles.map((article) => {
          const link = article.link?.document?.[0]?.children?.find((child) => child.href)?.href;

          return (
            <Grid item key={article.id} xs={12} sm={6} md={4}>
              <Item>
                <a
                  href={link ? link : '#'}  // Nếu không có link, mặc định về #
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }} // Đảm bảo không có gạch dưới và màu chữ thừa hưởng
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
                      <p className="cardNews-content">{article.content.slice(0, 150)}...</p>
                      <button className="readMoreButton">Đọc thêm</button>
                    </div>
                  </div>
                </a>
              </Item>
            </Grid>
          );
        })}
      </Grid>

      {/* Phân trang */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: '20px',
      }}>
        <Pagination
          count={totalPages}       // Tổng số trang
          page={currentPage}       // Trang hiện tại
          onChange={handlePageChange} // Hàm xử lý khi thay đổi trang
          color="primary"          // Màu sắc cho phân trang
        />
      </div>
    </div>
  );
}
