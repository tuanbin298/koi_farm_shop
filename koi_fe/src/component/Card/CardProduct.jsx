import React from "react";
import { GET_PRODUCT } from "../../page/api/Queries/product";
import { GET_CONSIGNMENT_SALES } from "../../page/api/Queries/consignment"; // New Query
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import "bootstrap/dist/css/bootstrap.min.css";
import { CREATE_CART_ITEM } from "../../page/api/Mutations/cart";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@apollo/client";

export default function CardProduct() {
  const [createCartItem] = useMutation(CREATE_CART_ITEM);

  // Fetch 3 products from GET_PRODUCT
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT, {
    variables: { take: 3 }, // Fetch 3 products
  });

  // Fetch 3 products from ConsignmentSale
  const {
    data: consignmentData,
    loading: consignmentLoading,
    error: consignmentError,
  } = useQuery(GET_CONSIGNMENT_SALES, {
    variables: { take: 3 }, // Fetch 3 consignment sale products
  });

  // Loading and error states for both queries
  if (productLoading || consignmentLoading) return <p>Loading ...</p>;
  if (productError || consignmentError)
    return <p>Error loading products or consignment sale items.</p>;

  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem("id");
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
      toast.error("Thêm vào giỏ hàng không thành công");
      alert("Failed to add item to cart. Please try again.");
      console.log(error);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mt-4 species-section">
        <div className="row">
          {/* Render 3 products from GET_PRODUCT */}
          {productData &&
            productData.products
              .filter((product) => product.status === "Còn hàng")
              .map((product) => (
                <div key={product.id} className="col-md-4 mb-4">
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      maxWidth: "350px",
                      margin: "0 auto",
                    }}
                  >
                    {/* Link to product details */}
                    <Link to={`/ProductDetail/${product.slug}`}>
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
                        <strong>Chủng loại: </strong>
                        {product.generic}
                      </p>
                      <p className="mb-1">
                        <strong>Kích thước: </strong>
                        {product.size}
                      </p>
                      <p className="mb-1">
                        <strong>Giới tính: </strong>
                        {product.sex}
                      </p>
                      <p className="mb-1">
                        <strong>Loại: </strong>
                        {product.category.name}
                      </p>
                      <p className="mb-1">
                        <strong>Nguồn gốc: </strong>
                        {product.origin}
                      </p>
                      {/* Add to cart button */}
                      <div className="text-center">
                        <button
                          className="btn btn-success mt-3"
                          onClick={() => handleAddToCart(product.id)} // Pass product ID
                        >
                          Thêm vào giỏ hàng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

          {/* Render 3 products from ConsignmentSale */}
          {consignmentData &&
            consignmentData.consignmentSales.map((consignment) => (
              <div key={consignment.id} className="col-md-4 mb-4">
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    maxWidth: "350px",
                    margin: "0 auto",
                  }}
                >
                  {/* Link to consignment details */}
                  <Link to={`/ConsignmentDetail/${consignment.slug}`}>
                    <img
                      src={consignment.image?.publicUrl}
                      alt={consignment.name}
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
                    <h4 className="card-title">{consignment.name}</h4>
                    <p className="mb-1 text-danger">
                      <strong>Giá: </strong>
                      {formatMoney(consignment.price)}
                    </p>
                    <p className="mb-1">
                      <strong>Chủng loại: </strong>
                      {consignment.generic}
                    </p>
                    <p className="mb-1">
                      <strong>Kích thước: </strong>
                      {consignment.size}
                    </p>
                    <p className="mb-1">
                      <strong>Giới tính: </strong>
                      {consignment.sex}
                    </p>
                    <p className="mb-1">
                      <strong>Loại: </strong>
                      {consignment.generic}
                    </p>
                    <p className="mb-1">
                      <strong>Nguồn gốc: </strong>
                      {consignment.origin}
                    </p>
                    {/* Add to cart button */}
                    <div className="text-center">
                      <button
                        className="btn btn-success mt-3"
                        onClick={() => handleAddToCart(consignment.id)} // Pass consignment ID
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
