import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./SalesConsignmentPage.css"; // Import the custom CSS file

const SalesConsignmentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    breed: "",
    age: "",
    diseases: "",
    size: "",
    image: null,
    estimatedPrice: "",
  });

  const [expanded, setExpanded] = useState(false);

  // Toggle the expanded policy section
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h1 className="text-center mb-4">Đăng ký ký gửi bán</h1>
          <form onSubmit={handleSubmit}>
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
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="origin" className="col-sm-4 col-form-label">
                Xuất xứ <span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  name="origin"
                  id="origin"
                  placeholder="Nhập xuất xứ"
                  className="form-control"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="breed" className="col-sm-4 col-form-label">
                Giống <span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  name="breed"
                  id="breed"
                  placeholder="Nhập giống cá"
                  className="form-control"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="age" className="col-sm-4 col-form-label">
                Tuổi <span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  name="age"
                  id="age"
                  placeholder="Nhập tuổi cá"
                  className="form-control"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  className="form-control"
                  value={formData.size}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <label
                htmlFor="estimatedPrice"
                className="col-sm-4 col-form-label"
              >
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
        </div>
      </div>

      <div className="policy-sales-container mt-5">
        <h2 className="text-center">Chính Sách Ký Gửi Bán Cá Koi</h2>

        <h5>Điều Kiện Ký Gửi Cá Koi</h5>
        <ul>
          <li>
            Chỉ nhận cá Koi khỏe mạnh, không bệnh tật, có giấy chứng nhận chất
            lượng.
          </li>
          <li>
            Kích thước cá từ 35-90 cm, không nhận các loại Koi baby, Koi mini,
            hoặc Koi giống.
          </li>
          <li>
            Ưu tiên các dòng Koi thuần chủng từ Nhật Bản, có nguồn gốc từ các
            Koi Farm lớn.
          </li>
        </ul>

        <h5>Trách Nhiệm Của Khách Hàng Ký Gửi</h5>
        <ul>
          <li>
            Quý khách chịu trách nhiệm về chất lượng Koi, giấy chứng nhận, tuổi,
            và sức khỏe của Koi trước khi ký gửi.
          </li>
          <li>
            Đảm bảo thông tin cung cấp chính xác về cá Koi, bao gồm: tên, tuổi,
            giới tính, nguồn gốc, chủng loại, chế độ ăn uống, và lịch sử bệnh lý
            (nếu có).
          </li>
        </ul>

        <h5>Quy Trình Ký Gửi Cá Koi</h5>
        <ol>
          <li>
            Cung cấp hình ảnh, video chi tiết về cá Koi và các giấy tờ chứng
            nhận liên quan.
          </li>
          <li>
            Thỏa thuận hợp đồng ký gửi với các điều kiện và giá trị ký gửi phù
            hợp.
          </li>
          <li>
            Ký kết hợp đồng chính thức và bảo đảm cá Koi luôn trong tình trạng
            khỏe mạnh sau khi ký gửi.
          </li>
          <li>
            Hỗ trợ khách hàng tìm người mua phù hợp, đón tiếp khách tới xem và
            quyết định mua cá Koi.
          </li>
          <li>
            Hợp đồng ký gửi kết thúc khi cá bán thành công. Khách hàng chịu
            trách nhiệm về chất lượng cá Koi với người mua, bao gồm bảo hành và
            cam kết đi kèm.
          </li>
        </ol>

        {expanded && (
          <>
            <h5>Cam Kết Của CaKoiViet</h5>
            <ul>
              <li>
                Chúng tôi cam kết cung cấp đầy đủ và trung thực thông tin về
                tình trạng Koi của quý khách.
              </li>
              <li>
                Hỗ trợ quý khách trong việc định giá lại giá trị của cá Koi dựa
                trên thị trường và nhu cầu hiện tại.
              </li>
              <li>
                Đảm bảo mỗi cá Koi ký gửi được chăm sóc và tìm chủ sở hữu mới
                một cách tận tâm và chuyên nghiệp.
              </li>
            </ul>

            <h5>Chi Phí Ký Gửi</h5>
            <p>
              Chi phí ký gửi được điều chỉnh hợp lý, dựa trên giá trị và tình
              trạng của cá Koi.
            </p>
          </>
        )}

        <button
          className="toggle-button btn btn-danger mt-3"
          onClick={toggleExpand}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>
    </div>
  );
};

export default SalesConsignmentPage;
