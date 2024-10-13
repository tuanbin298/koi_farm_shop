import React from "react";
import { GET_PRODUCT } from "../../page/api/Queries/product";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CardProduct.css"; // Import the new CSS file for hover effects

export default function CardProduct() {
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT, {
    variables: { take: 6 }, // Lấy 6 sản phẩm
  });

  if (productLoading) return <p>Loading ...</p>;
  if (productError) return <p>Error loading products.</p>;

  return (
    <div className="container mt-4 species-section">
      <div className="row">
        {productData &&
          productData.products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm card-product"
                style={{
                  maxWidth: "350px",
                  margin: "0 auto",
                }}
              >
                <Link to={`/ProductDetail/${product.id}`}>
                  <img
                    src={product.image?.publicUrl}
                    alt={product.name}
                    className="card-img-top img-fluid"
                    style={{
                      height: "360px",
                      width: "100%",
                      objectFit: "fill",
                    }}
                  />
                </Link>

                <div
                  className="card-body text-start"
                  style={{ padding: "25px" }}
                >
                  <h4 className="card-title">{product.name}</h4>
                  <p className="mb-1 text-danger">
                    <strong>Giá: </strong>
                    {formatMoney(product.price)}
                  </p>
                  <p className="mb-1">
                    <strong>Nguồn gốc: </strong>
                    {product.origin}
                  </p>
                  <p className="mb-1">
                    <strong>Kích thước </strong>
                    {product.size}
                  </p>
                  <p className="mb-1">
                    <strong>Giới tính </strong>
                    {product.sex}
                  </p>
                  <p className="mb-1">
                    <strong>Loại: </strong>
                    {product.generic}
                  </p>
                  <p className="mb-1">
                    <strong>Nguồn: </strong>
                    Dainichi Koi Farm
                  </p>
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
