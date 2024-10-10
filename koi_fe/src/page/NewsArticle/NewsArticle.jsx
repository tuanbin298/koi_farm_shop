import React, { useState } from 'react';
import { GET_ARTICLES } from '../../page/api/Queries/articles';
import { useQuery } from '@apollo/client';
import Pagination from '@mui/material/Pagination';
import Spinner from 'react-bootstrap/Spinner';

// Component tin tức
export default function NewsArticle() {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const { data: articlesData, loading, error } = useQuery(GET_ARTICLES);

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Cột bài viết tin tức */}
        <div className="col-md-12">
          <div className="row">
            {currentArticles.map((article) => {
              const link = article.link?.document?.[0]?.children?.find((child) => child.href)?.href;

              return (
                <div key={article.id} className="col-md-4 mb-4">
                  <div className="card shadow-sm">
                    <div className="row no-gutters">
                      <div className="col-md-12">
                        {article.image?.publicUrl && (
                          <img
                            src={article.image.publicUrl}
                            alt={article.name}
                            className="card-img-top"
                          />
                        )}
                      </div>
                      <div className="col-md-12">
                        <div className="card-body">
                          <h5 className="card-title">{article.name}</h5>
                          <p className="card-text">{article.content.slice(0, 150)}...</p>
                          {/* Căn giữa nút "Đọc thêm" */}
                          <div className="d-flex justify-content-center">
                            <a
                              href={link ? link : '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-danger text-white" // Đặt màu chữ thành trắng
                            >
                              Đọc thêm
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
      </div>
    </div>
  );
}
