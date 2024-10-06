import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CardListProduct from "../../component/CartListProduct/CardListProduct";
import { GET_PRODUCT } from "../api/Queries/product";
import { useQuery } from "@apollo/client";

function KoiListPage() {
  const [filter, setFilter] = useState({
    size: "all", // 'all' để hiển thị tất cả các kích cỡ mặc định
    price: "all",
    generic: "all",
  });

  const { data, loading, error } = useQuery(GET_PRODUCT);

  // Debugging để kiểm tra nếu dữ liệu trả về đúng
  console.log("Data:", data);
  console.log("Filter:", filter);

  // Bản đồ các khoảng kích thước mới
  const sizeMap = {
    "10-15cm": [10, 15],
    "15-20cm": [15, 20],
    "20-30cm": [20, 30],
    "30-40cm": [30, 40],
    "40-50cm": [40, 50],
    "above-50cm": [50, 100],
  };

  const priceMap = {
    "1000000-5000000": [1000000, 5000000],
    "5000000-10000000": [5000000, 10000000],
    "10000000-15000000": [10000000, 15000000],
    "15000000-20000000": [15000000, 20000000],
    "20000000-25000000": [20000000, 25000000],
    "above-25000000": [25000000, 100000000],
  };

  // Hàm lọc các sản phẩm cá Koi theo cả kích thước, giá tiền và nguồn gốc
  const filterKoi = () => {
    if (!data || !data.products) return [];

    return data.products.filter((koi) => {
      // 1. Lọc theo kích thước nếu có giá trị
      if (filter.size !== "all") {
        const koiSize = parseInt(koi.size.replace("cm", ""), 10);
        const [minSize, maxSize] = sizeMap[filter.size];
        if (koiSize < minSize || koiSize > maxSize) return false; // Không phù hợp với kích thước
      }

      // 2. Lọc theo giá nếu có giá trị
      if (filter.price !== "all") {
        const koiPrice = koi.price;
        const [minPrice, maxPrice] = priceMap[filter.price];
        if (koiPrice < minPrice || koiPrice > maxPrice) return false; // Không phù hợp với kích thước
      }

      // 3. Lọc theo nguồn gốc nếu có giá trị
      if (filter.generic !== "all" && koi.generic !== filter.generic)
        return false; // Không phù hợp với nguồn gốc

      return true; // Thỏa mãn cả điều kiện về kích thước, giá và nguồn gốc
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading Koi data!</p>;

  const filteredProducts = filterKoi();

  return (
    <div className="container mt-5">
      <h1 className="mb-4 border-bottom">Cá Koi Nhật Nhập Khẩu</h1>

      {/* Filter Controls */}
      <div className="d-flex gap-3 mb-4">
        {/* Kích thước Filter */}
        <select
          className="form-select w-auto btn-outline-primary"
          value={filter.size}
          onChange={(e) => setFilter({ ...filter, size: e.target.value })}
        >
          <option value="all">Tất cả kích cỡ</option>
          <option value="10-15cm">10-15 cm</option>
          <option value="15-20cm">15-20 cm</option>
          <option value="20-30cm">20-30 cm</option>
          <option value="30-40cm">30-40 cm</option>
          <option value="40-50cm">40-50 cm</option>
          <option value="above-50cm">Trên 50 cm</option>
        </select>

        {/* Nguồn gốc Filter */}
        <select
          className="form-select w-auto btn-outline-primary"
          value={filter.generic}
          onChange={(e) => setFilter({ ...filter, generic: e.target.value })}
        >
          <option value="all">Tất cả nguồn gốc</option>
          <option value="Cá Koi Nhật thuần chủng">Nhập khẩu Nhật bản</option>
          <option value="F1">Cá Koi F1</option>
          <option value="Mini">Cá Koi Mini</option>
          {/* Thêm các tùy chọn khác nếu cần */}
        </select>

        {/* Giá Filter */}
        <select
          className="form-select w-auto btn-outline-primary"
          value={filter.price}
          onChange={(e) => setFilter({ ...filter, price: e.target.value })} // Cập nhật đúng filter.price
        >
          <option value="all">Tất cả mức giá</option>
          <option value="1000000-5000000">1,000,000 - 5,000,000 VND</option>
          <option value="5000000-10000000">5,000,000 - 10,000,000 VND</option>
          <option value="10000000-15000000">10,000,000 - 15,000,000 VND</option>
          <option value="15000000-20000000">15,000,000 - 20,000,000 VND</option>
          <option value="20000000-25000000">20,000,000 - 25,000,000 VND</option>
          <option value="above-25000000">Trên 25,000,000 VND</option>
        </select>
      </div>

      {/* Product List */}
      <div className="productList">
        <CardListProduct products={filteredProducts} />
      </div>
    </div>
  );
}

export default KoiListPage;
