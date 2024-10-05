import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CardListProduct from "../../component/CartListProduct/CardListProduct";
import { GET_PRODUCT } from "../api/Queries/product";
import { useQuery } from "@apollo/client";

function KoiListPage() {
  const [filter, setFilter] = useState({
    size: "all", // 'all' để hiển thị tất cả các kích cỡ mặc định
    minPrice: "", // Minimum price
    maxPrice: "", // Maximum price
    origin: "all", //Nguồn gốc
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
      const koiPrice = koi.price;
      if (filter.minPrice && koiPrice < filter.minPrice) return false; // Giá quá thấp
      if (filter.maxPrice && koiPrice > filter.maxPrice) return false; // Giá quá cao

      // 3. Lọc theo nguồn gốc nếu có giá trị
      if (filter.origin !== "all" && koi.origin !== filter.origin) return false; // Không phù hợp với nguồn gốc

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
          value={filter.origin}
          onChange={(e) => setFilter({ ...filter, origin: e.target.value })}
        >
          <option value="all">Tất cả nguồn gốc</option>
          <option value="Nhập khẩu Nhật bản">Nhập khẩu Nhật bản</option>
          <option value="Cá Koi F1">Cá Koi F1</option>
          <option value="Cá Koi Mini">Cá Koi Mini</option>
          {/* Thêm các tùy chọn khác nếu cần */}
        </select>

        {/* Giá Filter */}
        <div className="dropdown">
          <select
            className="form-select w-auto btn-outline-primary"
            onClick={() =>
              setFilter({ ...filter, showPriceFilter: !filter.showPriceFilter })
            }
          >
            <option>Giá cả</option>
          </select>

          {filter.showPriceFilter && (
            <div
              className="dropdown-menu p-3"
              style={{
                display: "block",
                backgroundColor: "white",
                boxShadow: "none",
                border: "1px solid #0d6efd",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0 me-2">Giá từ:</label>
                  <input
                    type="number"
                    className="form-control w-auto"
                    placeholder="Min Price"
                    value={filter.minPrice}
                    onChange={(e) =>
                      setFilter({ ...filter, minPrice: e.target.value })
                    }
                  />
                </div>

                <span>đến:</span>

                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    className="form-control w-auto"
                    placeholder="Max Price"
                    value={filter.maxPrice}
                    onChange={(e) =>
                      setFilter({ ...filter, maxPrice: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="productList">
        <CardListProduct products={filteredProducts} />
      </div>
    </div>
  );
}

export default KoiListPage;
