import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./SalesConsignmentPage.css"; // Import the custom CSS file
import { gql, useQuery } from "@apollo/client";
import { GET_CATEGORY } from "../../page/api/Queries/category";
import { useNavigate } from "react-router-dom";

const SalesConsignmentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    breed: "",
    birth: "",
    diseases: "",
    size: "",
    image: null,
    estimatedPrice: "",
  });

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const { data, loading, error } = useQuery(GET_CATEGORY);
  const [expanded, setExpanded] = useState(false);
  // const [register, { loading, error, data }] = useMutation(REGISTER_MUTATION);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const sessionToken = localStorage.getItem("sessionToken");
    setLoggedIn(!!sessionToken);
  }, []);

  const handleLoginRedirect = () => {
    if (
      window.confirm(
        "Bạn cần đăng nhập để gửi form này. Bạn có muốn chuyển đến trang đăng nhập không?"
      )
    ) {
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
    }
  };

  // Toggle the expanded policy section
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Reset errors for the current field when it changes
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validate form fields before submission
  const validateForm = () => {
    let newErrors = {};

    // Tên Koi validation (length >= 10)
    if (formData.name.length < 10) {
      newErrors.name = "Tên Koi phải có độ dài ít nhất 10 ký tự.";
    }

    // Năm sinh validation (Koi lifespan, up to 50 years)
    const birthYear = parseInt(formData.birth, 10);
    if (birthYear > currentYear || birthYear < currentYear - 50) {
      newErrors.birth = `Năm sinh phải nằm trong khoảng từ ${
        currentYear - 50
      } đến ${currentYear}.`;
    }

    // Kích thước validation (20 cm to 70 cm)
    const size = parseInt(formData.size, 10);
    if (size < 20) {
      newErrors.size =
        "Trang trại không hỗ trợ ký gửi cá Koi Mini (kích thước < 20 cm).";
    } else if (size > 70) {
      newErrors.size = "Kích thước phải nằm trong khoảng từ 20 cm đến 70 cm.";
    }

    return newErrors;
  };

  if (!loggedIn) {
    return (
      <div className="alert alert-warning text-center">
        <h4>Vui lòng đăng nhập để ký gửi bán cá Koi</h4>
        <button className="btn btn-primary" onClick={handleLoginRedirect}>
          Đăng nhập
        </button>
      </div>
    );
  }
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedIn) {
      // Nếu chưa đăng nhập, hỏi người dùng
      const confirmLogin = window.confirm(
        "Bạn cần đăng nhập để gửi form này. Bạn có muốn chuyển đến trang đăng nhập không?"
      );

      if (confirmLogin) {
        navigate("/login"); // Chuyển đến trang đăng nhập
      }
      return; // Ngăn chặn gửi form
    }
    // Validate the form fields
    const validationErrors = validateForm();

    setErrors(validationErrors); // Update errors if validation fails
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h1 className="text-center mb-4">Đăng ký ký gửi bán</h1>
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
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
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
                  aria-label="Default select example"
                  value={formData.origin}
                  onChange={handleChange}
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
                  aria-label="Default select example"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Chọn chủng loại cá
                  </option>
                  {data?.categories.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
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
                {errors.size && (
                  <div className="invalid-feedback">{errors.size}</div>
                )}
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
