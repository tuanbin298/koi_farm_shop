import React from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import { CREATE_CART_ITEM } from "../../page/api/Mutations/cart";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CardListConsignment({ consignments }) {
  const [createCartItem] = useMutation(CREATE_CART_ITEM);
  if (!consignments || consignments.length === 0) {
    return <p>Không có sản phẩm nào phù hợp.</p>;
  }
  const handleAddToCart = async (consignmentId) => {
    const userId = localStorage.getItem("id"); // Assuming userId is stored in localStorage
    const sessionToken = localStorage.getItem("sessionToken");
    console.log(consignmentId)
    if (!userId) {
      toast.error("Thêm vào giỏ hàng không thành công");
      return;
    }

    try {
      // Add item to the cart
      await createCartItem({
        variables: {
          data: {
            quantity: 1,
            consignmentProduct: {
              connect: { id: consignmentId }, // Connect product by ID
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
          {consignments.map((consignment) => (
            
            <div key={consignment.id} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm card-product"
                style={{
                  maxWidth: "350px", // Giới hạn kích thước tối đa của card
                  margin: "0 auto", // Căn giữa thẻ card
                }}
              >
                {/* Link tới chi tiết sản phẩm */}
                <Link to={`/ConsignmentDetail/${consignment.slug}`}>
                  <img
                    src={consignment.photo?.image?.publicUrl}
                    alt={consignment.name}
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
                  <h4 className="card-title">{consignment.name}</h4>
                  <p className="mb-1  text-danger">
                    <strong>Giá: </strong>
                    {formatMoney(consignment.price)}
                  </p>
                  <p className="mb-1">
                    <strong>Kích thước </strong>
                    {consignment.size}
                  </p>
                  <p className="mb-1">
                    <strong>Giới tính </strong>
                    {consignment.sex}
                  </p>
                  <p className="mb-1">
                    <strong>Loại: </strong>
                    {consignment.generic}
                  </p>
                  {/* <p className="mb-1">
                    <strong>Nguồn gốc: </strong>
                    {consignment.origin}
                  </p> */}
                  {/* Nút thêm vào giỏ hàng */}
                  <div className="text-center">
                    <button
                      className="btn btn-success mt-3"
                      onClick={() => handleAddToCart(consignment.id)}
                    >
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
