import React from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import { CREATE_CART_ITEM } from "../../page/api/Mutations/cart";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CardListProduct({ products }) {
  const [createCartItem] = useMutation(CREATE_CART_ITEM);
  if (!products || products.length === 0) {
    return <p>Không có sản phẩm nào phù hợp.</p>;
  }
  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem("id"); // Assuming userId is stored in localStorage
    const sessionToken = localStorage.getItem("sessionToken");

    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      // Add item to the cart
      await createCartItem({
        variables: {
          data: {
            quantity: 1,
            product: {
              connect: { id: productId }, // Connect product by ID
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      });
      toast.success("Đã thêm vào giỏ hàng!", {
        icon: "🛒",
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#982B1C",
        },
        iconTheme: {
          primary: "#982B1C",
          secondary: "#FFFAEE",
        },
      });
    } catch (error) {
      if (error.message.includes("Access denied")) {
        toast.error("Thêm vào giỏ hàng không thành công");
        console.log(error);
      } else {
        toast.error("Thêm vào giỏ hàng không thành công");
        alert("Failed to add item to cart. Please try again.");
      }
    }
  };

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <div className="container mt-4 species-section">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div
              className="card h-100 shadow-sm"
              style={{
                maxWidth: "350px", // Giới hạn kích thước tối đa của card
                margin: "0 auto", // Căn giữa thẻ card
              }}
            >
              {/* Link tới chi tiết sản phẩm */}
              <Link to={`/ProductDetail/${product.slug}`}>
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

              <div
                className="card-body text-start"
                style={{
                  padding: "25px",
                }}
              >
                <h4 className="card-title">{product.name}</h4>
                <p className="mb-1  text-danger">
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
                {/* Nút thêm vào giỏ hàng */}
                  <div className="text-center">
                    <button className="btn btn-success mt-3" onClick={() => handleAddToCart(product.id)}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
