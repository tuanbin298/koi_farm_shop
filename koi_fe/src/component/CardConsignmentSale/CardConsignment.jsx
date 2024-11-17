import React from "react";
import { GET_CONSIGNMENT_SALES } from "../../page/api/Queries/consignment";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import "bootstrap/dist/css/bootstrap.min.css";
import { CREATE_CART_ITEM } from "../../page/api/Mutations/cart";
import toast, { Toaster } from "react-hot-toast";
import { GET_CART_ITEMS } from "../../page/api/Queries/cartItem";

export default function CardConsignmentSale() {
  const [createCartItem] = useMutation(CREATE_CART_ITEM);
  const userId = localStorage.getItem("id");
  const {
    data: consignmentData,
    loading: consignmentLoading,
    error: consignmentError,
  } = useQuery(GET_CONSIGNMENT_SALES, {
    variables: { take: 6 },
  });

  const { data: cart, refetch: refetchCartItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: {
          id: {
            equals: userId,
          },
        },
      },
    },
    fetchPolicy: "network-only",
    skip: !userId,
  });

  // Loading and error states
  if (consignmentLoading) return <p>Loading ...</p>;
  if (consignmentError) return <p>Error loading consignments.</p>;

  const handleAddToCart = async (consignmentId) => {
    if (!userId) {
      toast.error("Bạn cần đăng nhập để có thể thêm sản phẩm");
      return;
    }

    const productInCart = cart?.cartItems?.some(function (item) {
      return item.consignmentProduct[0]?.id === consignmentId;
    });
    if (productInCart) {
      toast.error("Sản phẩm này đã có trong giỏ hàng!");
      return;
    }

    try {
      await createCartItem({
        variables: {
          data: {
            quantity: 1,
            consignmentProduct: {
              connect: { id: consignmentId },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      });

      await refetchCartItems();
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
      console.log(error);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mt-4 species-section">
        <div className="row">
          {consignmentData?.consignmentSales.map((consignment) => {
            const isOwner = consignment.request?.user?.id === userId; // Check if the consignment belongs to the current user

            return (
              <div key={consignment.id} className="col-md-4 mb-4">
                <div
                  className="card h-100 shadow-sm card-product"
                  style={{
                    maxWidth: "350px",
                    margin: "0 auto",
                    border: isOwner ? "2px solid #198754" : "", // Highlight card if it's the user's item
                  }}
                >
                  {/* Link to consignment details */}
                  <Link to={`/consignmentDetail/${consignment.slug}`}>
                    <img
                      src={consignment.photo?.image?.publicUrl}
                      alt={consignment.name}
                      className="card-img-top img-fluid"
                      style={{
                        height: "360px",
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Link>

                  <div
                    className="card-body text-start"
                    style={{ padding: "25px" }}
                  >
                    <h4 className="card-title">
                      {consignment.name}
                      {isOwner && (
                        <span
                          className="badge bg-success ms-2"
                          style={{ fontSize: "0.8rem" }}
                        >
                          Cá của bạn
                        </span>
                      )}
                    </h4>
                    <p className="mb-1 text-danger">
                      <strong>Giá: </strong>
                      {formatMoney(consignment.price)}
                    </p>
                    <p className="mb-1">
                      <strong>Kích thước: </strong>
                      {consignment.size}cm
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
                      <strong>Chủng loại: </strong>
                      {consignment.category}
                    </p>

                    {/* Add to cart button */}
                    <div className="text-center">
                      <button
                        className="btn btn-success mt-3"
                        onClick={() => handleAddToCart(consignment.id)}
                        disabled={isOwner} // Disable button if the consignment belongs to the user
                      >
                        {isOwner
                          ? "Không thể thêm vào giỏ hàng"
                          : "Thêm vào giỏ hàng"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
