import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import CardListProduct from "../../component/CartListProduct/CardListProduct";
import {
  GET_PRODUCT_BY_CATEGORY,
  GET_ALL_PRODUCTS,
} from "../api/Queries/product"; // Import consignment query
import { GET_ALL_CONSIGNMENT_SALES } from "../api/Queries/consignment";
import Pagination from "@mui/material/Pagination";

function KoiListPage() {
  const [page, setPage] = useState(1);
  const { categoryId } = useParams();
  const itemsPerPage = 6;

  const defaultFilter = {
    size: "all",
    price: "all",
    generic: "all",
    supplier: "all", // Filter by supplier
  };

  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    setFilter(defaultFilter);
    setPage(1); // Reset to page 1 when category changes
  }, [categoryId]);

  // Query for products
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(
    categoryId ? GET_PRODUCT_BY_CATEGORY : GET_ALL_PRODUCTS,
    categoryId
      ? { variables: { categoryId: { id: { equals: categoryId } } } }
      : undefined
  );

  // Query for consignment sales
  const {
    data: consignmentData,
    loading: consignmentLoading,
    error: consignmentError,
  } = useQuery(GET_ALL_CONSIGNMENT_SALES);

  if (productLoading || consignmentLoading) return <p>Loading...</p>;
  if (productError || consignmentError) return <p>Error loading Koi data!</p>;

  // Mapping size and price ranges for filtering
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

  // Combine products and consignment sales
  const combinedData = [
    ...(productData?.products || []),
    ...(consignmentData?.consignmentSales || []),
  ];

  // Apply filters
  const filterKoi = () => {
    return combinedData.filter((koi) => {
      // Filter by size
      if (filter.size !== "all") {
        const koiSize = parseInt(koi.size.replace("cm", ""), 10);
        const [minSize, maxSize] = sizeMap[filter.size];
        if (koiSize < minSize || koiSize > maxSize) return false;
      }

      // Filter by price
      if (filter.price !== "all") {
        const koiPrice = koi.price;
        const [minPrice, maxPrice] = priceMap[filter.price];
        if (koiPrice < minPrice || koiPrice > maxPrice) return false;
      }

      // Filter by generic
      if (filter.generic !== "all" && koi.generic !== filter.generic)
        return false;

      // Filter by supplier (if applicable)
      if (filter.supplier !== "all") {
        // Check if koi has a supplier field (depends on your schema)
        if (koi.supplier !== filter.supplier) return false;
      }

      return true;
    });
  };

  const filteredProducts = filterKoi();

  // Calculate the products to display on the current page
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate total pages based on filtered products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value); // Ensure state is updated with the selected page
  };

  return (
    <div className="container mt-5">
      {/* Display category name and description if available */}
      <h1 className="mb-4 border-bottom">
        {categoryId
          ? productData?.products[0]?.category?.name ||
            "Danh sách Cá Koi theo loại"
          : "Cá Koi Nhật"}
      </h1>

      {categoryId && productData?.products[0]?.category?.description && (
        <p className="mb-4 paddingBottom">
          {productData.products[0].category.description}
        </p>
      )}

      {/* Filter section */}
      <div className="d-flex gap-3 mb-4">
        {/* Size Filter */}
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

        {/* Generic Filter */}
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

        {/* Price Filter */}
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

        {/* Supplier Filter */}
        <select
          className="form-select w-auto btn-outline-primary"
          value={filter.supplier}
          onChange={(e) => setFilter({ ...filter, supplier: e.target.value })}
        >
          <option value="all">Tất cả các nguồn gốc</option>
          <option value="Dainichi Koi Farm">Dainichi Koi Farm</option>
          <option value="KoiViet">Koi Viet Farm</option>
        </select>
      </div>

      {/* Display the filtered products */}
      <div className="productList">
        <CardListProduct products={paginatedProducts} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* MUI Pagination Component */}
          <Pagination
            count={totalPages} // Total pages
            page={page} // Current page
            onChange={handlePageChange} // Handle page change
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

export default KoiListPage;
