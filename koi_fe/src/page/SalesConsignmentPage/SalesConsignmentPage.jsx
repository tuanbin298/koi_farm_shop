import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SalesConsignmentPage.css";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CATEGORY } from "../../page/api/Queries/category";
import {
  CREATE_REQUEST,
  CREATE_CONSIGNMENT_SALE,
} from "../../page/api/Mutations/request";
import { useNavigate } from "react-router-dom";
import SingleForm from "../../component/SalesConsignmentForm/SingleForm";

const SalesConsignmentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    sex: "",
    medical: "",
    size: "",
    estimatedPrice: "",
    description: "",
    category: "",
    image: "",
    generic: "",
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

  const handleChange = async (e) => {
    const { name, value, type } = e.target;

    // Reset errors for the field
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    } else {
      // For other fields, update formData and validate immediately
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

      // Validate the field immediately
      validateField(name, value);
    }
  };

  // New function for validating individual fields
  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (value.length < 10) {
        error = "Tên Koi phải có độ dài ít nhất 10 ký tự.";
      }
      CREATE_CONSIGNMENT_SALE;
    }

    if (name === "birth") {
      const birthYear = parseInt(value, 10);
      if (birthYear > currentYear || birthYear < currentYear - 10) {
        error = `Năm sinh phải nằm trong khoảng từ ${
          currentYear - 10
        } đến ${currentYear}.`;
      }
    }

    if (name === "size") {
      const size = parseInt(value, 10);
      if (size < 20 || size > 70) {
        error = "Kích thước phải nằm trong khoảng từ 20 cm đến 70 cm.";
      }
    }

    if (name === "description") {
      if (value.length < 40) {
        error = "Mô tả cá Koi phải có độ dài ít nhất 40 ký tự.";
      }
    }

    if (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  };

  const priceTable = {
    size: {
      small: 500000, // Kích thước từ 20-35 cm
      medium: 1000000, // Kích thước từ 35-60 cm
      large: 2000000, // Kích thước từ 60-70 cm trở lên
    },
    generic: {
      Japan: 3, // Hệ số giá cho Koi thuần chủng Nhật Bản
      F1: 2, // Hệ số giá cho Koi F1 (giống con lai từ Koi Nhật Bản)
    },
    ageFactor: (age) => {
      if (age < 2) return 0.8; // Cá dưới 2 tuổi, giảm giá 20%
      if (age >= 2 && age <= 5) return 1; // Cá từ 2-5 tuổi, giá bình thường
      return 0.9; // Cá trên 5 tuổi, giảm giá 10%
    },
  };

  const genericMapping = {
    "Cá Koi Nhật thuần chủng": "Japan",
    "Cá Koi F1": "F1",
  };

  const calculatePrice = (formData) => {
    // Xác định kích thước
    const sizeCategory =
      formData.size < 35 ? "small" : formData.size < 60 ? "medium" : "large";

    // Xác định loại giống (generic)
    const genericKey = genericMapping[formData.generic] || "Local";
    const genericMultiplier = priceTable.generic[genericKey] || 1;

    // Xác định tuổi và hệ số tuổi
    const birthYear = parseInt(formData.birth, 10);
    const age = new Date().getFullYear() - birthYear;
    const ageMultiplier = priceTable.ageFactor(age);

    // Tính giá cơ bản dựa trên kích thước
    const basePrice = priceTable.size[sizeCategory];

    // Tính giá dao động với các hệ số bổ sung
    const minPrice = basePrice * genericMultiplier * ageMultiplier * 0.9;
    const maxPrice = basePrice * genericMultiplier * ageMultiplier * 1.1;

    return {
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
    };
  };

  const [calculatedPrice, setCalculatedPrice] = useState({
    minPrice: null,
    maxPrice: null,
  });

  useEffect(() => {
    // Chỉ tính toán giá khi người dùng đã nhập đầy đủ size, generic và birth
    if (formData.size && formData.generic && formData.birth) {
      const priceRange = calculatePrice(formData);
      setCalculatedPrice(priceRange);
    } else {
      // Nếu thiếu thông tin, bỏ trống giá
      setCalculatedPrice({ minPrice: null, maxPrice: null });
    }
  }, [formData.size, formData.generic, formData.birth]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId) {
      console.error("User ID không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }

    const priceValue = `${calculatedPrice.minPrice} - ${calculatedPrice.maxPrice}`;

    try {
      // Tạo Consignment Sale
      const { data: consignmentData } = await createConsignmentSale({
        variables: {
          name: formData.name,
          sex: formData.sex,
          birth: parseInt(formData.birth, 10),
          size: parseInt(formData.size, 10),
          estimatedPrice: priceValue,
          generic: formData.generic,
          description: formData.description || "",
          category: formData.category,
          image: formData.image,
          medical: formData.medical,
          price: 0,
        },
      });

      // Lấy consignmentId
      const consignmentId = consignmentData.createConsignmentSale.id;

      if (!consignmentId) {
        console.error("Không thể lấy ID của Consignment Sale.");
        return;
      }

      const { data: requestData } = await createRequest({
        variables: {
          data: {
            consignment: { connect: { id: consignmentId } },
            description: `Yêu cầu ký gửi cá Koi: ${formData.name}`,
            user: { connect: { id: userId } },
          },
        },
      });

      console.log("Request thành công:", requestData);
      navigate("/someSuccessPage", { state: { from: "/sales" } });
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
              calculatedPrice={calculatedPrice}
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
            Kích thước cá từ 20 - 70 cm, không nhận các loại Koi baby hoặc Koi
            giống.
          </li>
          <li>
            Ưu tiên các dòng Koi thuần chủng từ Nhật Bản, có chất lượng cao và
            tình trạng sức khỏe tốt.
          </li>
        </ul>

        <h5>Trách Nhiệm Của Khách Hàng Ký Gửi</h5>
        <ul>
          <li>
            Quý khách chịu trách nhiệm về chất lượng Koi, tuổi, và sức khỏe của
            Koi trước khi ký gửi.
          </li>
          <li>
            Đảm bảo thông tin cung cấp chính xác về cá Koi, bao gồm: tên, tuổi,
            giới tính, chủng loại, kích thước, hình ảnh, chế độ ăn uống, và lịch
            sử bệnh lý (nếu có).
          </li>
        </ul>

        <h5>Quy Trình Ký Gửi Cá Koi</h5>
        <ol>
          <li>Cung cấp hình ảnh về cá Koi.</li>
          <li>
            Thỏa thuận ký gửi với các điều kiện và giá trị ký gửi phù hợp.
          </li>
          <li>
            Bảo đảm cá Koi luôn trong tình trạng khỏe mạnh sau khi ký gửi.
          </li>
          <li>
            Giao dịch kết thúc khi cá bán thành công. Khách hàng chịu trách
            nhiệm về chất lượng cá Koi với người mua, bao gồm bảo hành và cam
            kết đi kèm.
          </li>
        </ol>

        {expanded && (
          <>
            <h5>Cam Kết Của CaKoiViet</h5>
            <ul>
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
              Chi phí ký gửi được tính là 10% trên giá trị cá Koi đã được định
              giá từ trang trại. Ví dụ: nếu cá Koi của quý khách được định giá
              là 10,000,000 VND, chi phí ký gửi sẽ là 1,000,000 VND.
            </p>
            <p>
              Giá trị định giá của cá Koi sẽ được xác định bởi các chuyên gia
              của trang trại dựa trên kích thước, chủng loại, và tình trạng sức
              khỏe của cá.
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
