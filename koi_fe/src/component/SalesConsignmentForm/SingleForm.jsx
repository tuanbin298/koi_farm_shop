import React from "react";

export default function SingleForm({
  formData,
  errors,
  handleChange,
  handleSubmit,
  data,
  loading,
  currentYear,
}) {
  return (
    <form onSubmit={handleSubmit}>
      {/* Tên Koi */}
      <div className="row mb-3">
        <label htmlFor="name" className="col-sm-4 col-form-label">
          Tên Koi <span className="text-danger">*</span>
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nhập tên cá koi"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
      </div>

      {/* Nguồn gốc */}
      <div className="row mb-3">
        <label htmlFor="origin" className="col-sm-4 col-form-label">
          Nguồn gốc <span className="text-danger">*</span>
        </label>
        <div className="col-sm-8">
          <select
            name="origin"
            className={`form-select ${errors.origin ? "is-invalid" : ""}`}
            value={formData.origin}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Chọn nguồn gốc cá
            </option>
            <option value="Nhập khẩu Nhật bản">Nhập khẩu Nhật bản</option>
            <option value="bố nhật mẹ nhật">Bố nhật mẹ nhật</option>
          </select>
          {errors.origin && (
            <div className="invalid-feedback">{errors.origin}</div>
          )}
        </div>
      </div>

      {/* Chủng loại */}
      <div className="row mb-3">
        <label htmlFor="breed" className="col-sm-4 col-form-label">
          Chủng loại <span className="text-danger">*</span>
        </label>
        <div className="col-sm-8">
          <select
            name="breed"
            className={`form-select ${errors.breed ? "is-invalid" : ""}`}
            value={formData.breed}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Chọn chủng loại cá
            </option>
            {loading ? (
              <option>Đang tải...</option>
            ) : (
              data?.categories?.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))
            )}
          </select>
          {errors.breed && (
            <div className="invalid-feedback">{errors.breed}</div>
          )}
        </div>
      </div>

      {/* Năm sinh */}
      <div className="row mb-3">
        <label htmlFor="birth" className="col-sm-4 col-form-label">
          Năm sinh <span className="text-danger">*</span>
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            name="birth"
            id="birth"
            placeholder="Nhập năm sinh cá"
            className={`form-control ${errors.birth ? "is-invalid" : ""}`}
            value={formData.birth}
            onChange={handleChange}
            required
          />
          {errors.birth && (
            <div className="invalid-feedback">{errors.birth}</div>
          )}
        </div>
      </div>

      {/* Các bệnh đã từng bị */}
      <div className="row mb-3">
        <label htmlFor="diseases" className="col-sm-4 col-form-label">
          Các bệnh đã từng bị (nếu có)
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            name="diseases"
            id="diseases"
            placeholder="Nhập tên các bệnh nếu có"
            className="form-control"
            value={formData.diseases}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Kích thước */}
      <div className="row mb-3">
        <label htmlFor="size" className="col-sm-4 col-form-label">
          Kích thước (cm) <span className="text-danger">*</span>
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            name="size"
            id="size"
            placeholder="Nhập kích thước cá"
            className={`form-control ${errors.size ? "is-invalid" : ""}`}
            value={formData.size}
            onChange={handleChange}
            required
          />
          {errors.size && <div className="invalid-feedback">{errors.size}</div>}
        </div>
      </div>

      {/* Hình ảnh */}
      <div className="row mb-3">
        <label htmlFor="image" className="col-sm-4 col-form-label">
          Hình ảnh <span className="text-danger">*</span>
        </label>
        <div className="col-sm-8">
          <input
            type="file"
            name="image"
            id="image"
            className="form-control-file"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </div>
      </div>
      {/* Giá dự tính */}
      <div className="row mb-3">
        <label htmlFor="estimatedPrice" className="col-sm-4 col-form-label">
          Giá dự tính
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            name="estimatedPrice"
            id="estimatedPrice"
            placeholder="Giá được xác định bằng hệ thống"
            className="form-control"
            value={formData.estimatedPrice}
            onChange={handleChange}
            disabled
          />
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-danger btn-lg w-25 mt-4">
          Đăng ký
        </button>
      </div>
    </form>
  );
}
