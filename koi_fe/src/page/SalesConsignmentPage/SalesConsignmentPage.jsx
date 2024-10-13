import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SalesConsignmentPage.css";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CATEGORY } from "../../page/api/Queries/category";
// import {
//   CREATE_REQUEST,
//   CREATE_CONSIGNMENT_SALE,
// } from "../../page/api/Mutations/request";
import { useNavigate } from "react-router-dom";
import SingleForm from "../../component/SalesConsignmentForm/SingleForm";

const SalesConsignmentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    sex: "",
    medical: "",
    size: "",
    price: "",
    description: "",
    origin: "",
    generic: "",
    image: null,
    category: "",
    status: "",
  });

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const { data, loading, error } = useQuery(GET_CATEGORY);
  const [expanded, setExpanded] = useState(false);
  const [createRequest] = useMutation(CREATE_REQUEST);
  const [createConsignmentSale] = useMutation(CREATE_CONSIGNMENT_SALE);

  const currentYear = new Date().getFullYear();
  // Lấy userId từ localStorage
  const userId = localStorage.getItem("id");
  console.log("User ID from localStorage:", userId); // Debugging

  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    setLoggedIn(!!sessionToken);
    setIsCheckingLogin(false);
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "image") {
      // Kiểm tra nếu file được chọn
      if (files && files.length > 0) {
        setFormData({ ...formData, [name]: files[0] }); // Đảm bảo file object được lưu
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (formData.name.length < 10) {
      newErrors.name = "Tên Koi phải có độ dài ít nhất 10 ký tự.";
    }

    const birthYear = parseInt(formData.birth, 10);
    if (birthYear > currentYear || birthYear < currentYear - 50) {
      newErrors.birth = `Năm sinh phải nằm trong khoảng từ ${
        currentYear - 50
      } đến ${currentYear}.`;
    }

    const size = parseInt(formData.size, 10);
    if (size < 20) {
      newErrors.size = "Kích thước phải nằm trong khoảng từ 20 cm đến 70 cm.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kiểm tra nếu userId không tồn tại
    if (!userId) {
      console.error("User ID không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }

    // Kiểm tra tính hợp lệ của form
    if (!validateForm()) {
      return; // Nếu form không hợp lệ, không thực hiện gửi request
    }

    // Đảm bảo price không bị null và có giá trị hợp lệ (ví dụ mặc định là 0)
    const priceValue = formData.price ? parseInt(formData.price, 10) : 0;

    try {
      // Sử dụng FormData để chuẩn bị file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("birth", parseInt(formData.birth, 10));
      formDataToSend.append("size", parseInt(formData.size, 10));
      formDataToSend.append("price", priceValue); // Đảm bảo price không null
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("origin", formData.origin);
      formDataToSend.append("generic", formData.generic);
      formDataToSend.append("image", formData.image); // Đảm bảo file hợp lệ
      formDataToSend.append("status", "PENDING");

      // Gửi mutation với file upload
      const { data: consignmentData } = await createConsignmentSale({
        variables: {
          name: formData.name,
          birth: parseInt(formData.birth, 10),
          size: parseInt(formData.size, 10),
          price: priceValue, // Đảm bảo price không null
          description: formData.description || "",
          origin: formData.origin,
          generic: formData.generic,
          image: formData.image, // Sử dụng file trong mutation
          status: "PENDING",
        },
        context: {
          headers: {
            "Apollo-Require-Preflight": true, // Đảm bảo preflight request được gửi
          },
        },
      });

      console.log("Mutation thành công:", consignmentData);
    } catch (error) {
      console.error("Đã xảy ra lỗi khi gửi dữ liệu:", error);
    }
  };

  if (isCheckingLogin) {
    return (
      <div className="text-center my-5">
        <p>Đang kiểm tra trạng thái đăng nhập...</p>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h1 className="text-center mb-4">Đăng ký ký gửi bán</h1>

          {!loggedIn ? (
            <div className="login-reminder text-center mb-4">
              <p className="text-muted">
                Bạn cần <span className="text-primary">đăng nhập</span> để sử
                dụng chức năng ký gửi.
              </p>
              <button className="btn btn-primary" onClick={handleLoginRedirect}>
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            <SingleForm
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              data={data}
              loading={loading}
              expanded={expanded}
              toggleExpand={toggleExpand}
              currentYear={currentYear}
            />
          )}
        </div>
      </div>

      {/* Policy Section */}
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
