import React from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import { CREATE_CART_ITEM } from "../../page/api/Mutations/cart";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { GET_CART_ITEMS } from "../../page/api/Queries/cartItem";

export default function CardListProduct({ products }) {
  const [createCartItem] = useMutation(CREATE_CART_ITEM);
  const userId = localStorage.getItem("id");

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
    skip: !userId, // Skip if no user is logged in
  });

  if (!products || products.length === 0) {
    return <p>Không có sản phẩm nào phù hợp.</p>;
  }

  const handleAddToCart = async (productId) => {
    if (!userId) {
      toast.error("Bạn cần đăng nhập để có thể thêm sản phẩm");
      return;
    }

    const productInCart = cart?.cartItems?.some(function (item) {
      return item.product[0]?.id === productId;
    });
    if (productInCart) {
      toast.error("Sản phẩm này đã có trong giỏ hàng!");
      return;
    }

    try {
      // Add item to the cart
      await createCartItem({
        variables: {
          data: {
            quantity: 1,
            product: {
              connect: { id: productId },
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
          {products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm card-product"
                style={{ maxWidth: "350px", margin: "0 auto" }}
              >
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
                    <strong>Nguồn gốc: </strong>
                    {product.origin}
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
                    {product.generic}
                  </p>

                  <div className="text-center">
                    <button
                      className="btn btn-success mt-3"
                      onClick={() => handleAddToCart(product.id)}
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
