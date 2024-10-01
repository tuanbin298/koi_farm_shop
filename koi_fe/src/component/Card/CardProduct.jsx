import React from "react";
import { GET_PRODUCT } from "../../page/api/Queries/product";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CardProduct() {
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT, {
    variables: { take: 6 }, // Lấy 6 sản phẩm
  });

  // Kiểm tra trạng thái loading và error
  if (productLoading) return <p>Loading ...</p>;
  if (productError) return <p>Error loading products.</p>;

  return (
    <div className="container mt-4">
      <div className="row">
        {productData &&
          productData.products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  maxWidth: "350px", // Giới hạn kích thước tối đa của card
                  margin: "0 auto", // Căn giữa thẻ card
                }}
              >
                {/* Link tới chi tiết sản phẩm */}
                <Link to={`/ProductDetail/${product.id}`}>
                  <img
                    src={product.image?.publicUrl}
                    alt={product.name}
                    className="card-img-top img-fluid"
                    style={{
                      height: "360px", // Chiều cao cố định cho ảnh
                      width: "100%", // Chiếm toàn bộ chiều rộng của khung chứa
                      objectFit: "fill", // Bóp méo ảnh để lấp đầy khung
                    }}
                  />
                </Link>

                <div className="card-body text-start">
                  <h4 className="card-title text-danger">{product.name}</h4>
                  <p className="mb-1">
                    <strong>Size: </strong>15 cm - 90 cm
                  </p>
                  <p className="mb-1">
                    <strong>Nguồn gốc: </strong>
                    {product.origin}
                  </p>
                  <p className="mb-1">
                    <strong>Chất lượng: </strong>
                    {product.quality || "Xuất sắc"}
                  </p>
                  <p className="mb-1">
                    <strong>Loại: </strong>
                    {product.generic}
                  </p>
                  <p className="mb-1">
                    <strong>Xuất xứ: </strong>Nhật Bản
                  </p>

                  {/* Nút thêm vào giỏ hàng */}
                  <Link to={`/ProductDetail/${product.id}`}>
                    <div className="text-center">
                      <button className="btn btn-success mt-3">
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
