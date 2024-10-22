import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import CardListConsignment from "../../component/CardListConsignment/CardListConsignment";
import Pagination from "@mui/material/Pagination";
import { GET_ALL_CONSIGNMENT_SALES } from "../api/Queries/consignment";

function KoiConsignment() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const defaultFilter = {
    size: "all",
    price: "all",
    generic: "all",
    origin: "all",
  };

  const [filter, setFilter] = useState(defaultFilter);

  const { data, loading, error } = useQuery(GET_ALL_CONSIGNMENT_SALES);
  console.log(data);
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Không thể tải dữ liệu cá Koi. Vui lòng thử lại sau!</p>;

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

  const filterKoi = () => {
    if (!data || !data.consignmentSales) return []; // Thay đổi từ consignments thành consignmentSales

    return data.consignmentSales.filter((koi) => {
      // Áp dụng logic lọc như ban đầu
      if (filter.size !== "all") {
        const koiSize = koi.size;
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
      // if (filter.origin !== "all" && koi.origin !== filter.origin) return false;

      return true;
    });
  };

  const filteredConsignments = filterKoi();
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedConsignments = filteredConsignments.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredConsignments.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 border-bottom">Cá Koi Ký Gửi</h1>

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
          <option value="all">Tất cả chủng loại</option>
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
        {/* <select
          className="form-select w-auto btn-outline-primary"
          value={filter.origin}
          onChange={handleFilterChange("origin")}
        >
          <option value="all">Tất cả các nguồn gốc</option> */}
        {/* Other options */}
        {/* </select> */}
      </div>
      <CardListConsignment consignments={paginatedConsignments} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
}

export default KoiConsignment;
