import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import CardListProduct from "../../component/CartListProduct/CardListProduct";
import {
  GET_PRODUCT_BY_CATEGORY,
  GET_ALL_PRODUCTS,
} from "../api/Queries/product";

function KoiListPage() {
  const { categoryId } = useParams(); // Lấy categoryId từ URL

  const [filter, setFilter] = useState({
    size: "all",
    price: "all",
    generic: "all",
  });

  const { data, loading, error } = useQuery(
    categoryId ? GET_PRODUCT_BY_CATEGORY : GET_ALL_PRODUCTS,
    categoryId
      ? { variables: { categoryId: { id: { equals: categoryId } } } }
      : undefined
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading Koi data!</p>;

  const filterKoi = () => {
    if (!data || !data.products) return [];

    return data.products.filter((koi) => {
      if (filter.size !== "all") {
        const koiSize = parseInt(koi.size.replace("cm", ""), 10);
        const [minSize, maxSize] = sizeMap[filter.size];
        if (koiSize < minSize || koiSize > maxSize) return false;
      }

      if (filter.price !== "all") {
        const koiPrice = koi.price;
        const [minPrice, maxPrice] = priceMap[filter.price];
        if (koiPrice < minPrice || koiPrice > maxPrice) return false;
      }

      if (filter.generic !== "all" && koi.generic !== filter.generic)
        return false;

      return true;
    });
  };

  const filteredProducts = filterKoi();

  return (
    <div className="container mt-5">
      {/* Hiển thị tên và mô tả loại nếu có */}
      <h1 className="mb-4 border-bottom">
        {categoryId
          ? data.products[0]?.category?.name || "Danh sách Cá Koi theo loại"
          : "Cá Koi Nhật"}
      </h1>

      {categoryId && data.products[0]?.category?.description && (
        <p className="mb-4 paddingBottom">
          {data.products[0].category.description}
        </p>
      )}

      {/* Bộ lọc */}
      <div className="d-flex gap-3 mb-4">
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

        <select
          className="form-select w-auto btn-outline-primary"
          value={filter.generic}
          onChange={(e) => setFilter({ ...filter, generic: e.target.value })}
        >
          <option value="all">Tất cả nguồn gốc</option>
          <option value="Cá Koi Nhật thuần chủng">Nhập khẩu Nhật bản</option>
          <option value="F1">Cá Koi F1</option>
          <option value="Mini">Cá Koi Mini</option>
        </select>

        <select
          className="form-select w-auto btn-outline-primary"
          value={filter.price}
          onChange={(e) => setFilter({ ...filter, price: e.target.value })}
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

      {/* Hiển thị sản phẩm */}
      <div className="productList">
        <CardListProduct products={filteredProducts} />
      </div>
    </div>
  );
}

export default KoiListPage;
