import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CardListProduct from "../../component/CartListProduct/CardListProduct";
import Container from "react-bootstrap/Container";

const koiFishData = [
  { id: 1, image: "koi1.jpg", price: 500, size: "small", promo: true },
  { id: 2, image: "koi2.jpg", price: 1000, size: "medium", promo: false },
  { id: 3, image: "koi3.jpg", price: 1500, size: "large", promo: true },
  { id: 4, image: "koi4.jpg", price: 800, size: "medium", promo: false },
];

function KoiListPage() {
  const [filter, setFilter] = useState({
    promo: false,
    price: "lowToHigh",
    size: "all",
  });

  const filterKoi = () => {
    return koiFishData
      .filter((koi) => (filter.promo ? koi.promo : true))
      .sort((a, b) =>
        filter.price === "lowToHigh" ? a.price - b.price : b.price - a.price
      )
      .filter((koi) => filter.size === "all" || koi.size === filter.size);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 border-bottom">Cá Koi Nhật Nhập Khẩu</h1>
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn ${
            filter.promo ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setFilter({ ...filter, promo: !filter.promo })}
        >
          Khuyến Mãi
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            setFilter({
              ...filter,
              price: filter.price === "lowToHigh" ? "highToLow" : "lowToHigh",
            })
          }
        >
          {filter.price === "lowToHigh"
            ? "Giá Thấp Đến Cao"
            : "Giá Cao Đến Thấp"}
        </button>
        <select
          className="form-select w-auto"
          onChange={(e) => setFilter({ ...filter, size: e.target.value })}
        >
          <option value="all">Kích Cỡ</option>
          <option value="small">Nhỏ</option>
          <option value="medium">Trung Bình</option>
          <option value="large">Lớn</option>
        </select>
      </div>
      <div className="productList">
        <Container>
          <CardListProduct />
        </Container>
      </div>
    </div>
  );
}

export default KoiListPage;
