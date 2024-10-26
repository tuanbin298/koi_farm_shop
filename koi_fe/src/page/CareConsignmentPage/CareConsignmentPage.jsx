import React, { useState } from "react";
import "./CareConsignmentPage.css"; // Import the CSS file

const CareConsignmentPage = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return  (
    <div className="policy-care-container">
      <h2>Chính sách ký gửi chăm sóc cá Koi</h2>

      <h5>Thời gian ký gửi:</h5>
      <ul>
        <li>Thời gian tối thiểu ký gửi: 7 ngày.</li>
        <li>
          Thời gian tối đa ký gửi: 6 tháng. Sau thời gian này, khách hàng có thể gia hạn nếu cần thiết.
        </li>
        <li>
          Thông báo trước: Khách hàng phải thông báo trước 3 ngày nếu muốn gia hạn hoặc kết thúc hợp đồng sớm hơn thời hạn đã cam kết.
        </li>
      </ul>

      <h5>Chi phí ký gửi:</h5>
      <ul>
        <li>Phí ký gửi: 50.000 VND/ngày cho mỗi con cá Koi, không phân biệt kích thước lớn hay nhỏ.</li>
        <li>
          Phí dịch vụ bổ sung: Các dịch vụ như chăm sóc sức khỏe đặc biệt hoặc sử dụng thức ăn đặc biệt sẽ có chi phí phát sinh theo yêu cầu cụ thể của khách hàng.
        </li>
      </ul>

      <h5>Chăm sóc và bảo vệ cá Koi:</h5>
      <ul>
        <li>Chế độ dinh dưỡng: Cá Koi được cho ăn theo từng giai đoạn phát triển và tình trạng sức khỏe.</li>
        <li>Môi trường sống: Bể nuôi được làm sạch thường xuyên, đảm bảo nước luôn trong sạch, giúp cá phát triển tốt.</li>
      </ul>

      {/* Nội dung mở rộng chỉ hiển thị khi người dùng nhấn "Xem thêm" */}
      {expanded && (
        <>
          <h5>Quyền lợi và trách nhiệm của khách hàng:</h5>
          <ul>
            <li><strong>Quyền lợi:</strong></li>
            <ul>
              <li>Khách hàng có quyền thăm cá Koi vào bất kỳ thời điểm nào trong giờ hành chính.</li>
              <li>Nhận báo cáo định kỳ về tình trạng sức khỏe và các vấn đề phát sinh (nếu có).</li>
            </ul>
            <li><strong>Trách nhiệm:</strong></li>
            <ul>
              <li>Thanh toán đúng hạn các khoản phí ký gửi và dịch vụ bổ sung (nếu có).</li>
            </ul>
          </ul>
        </>
      )}
      
      <button className="toggle-button" onClick={toggleExpand}>
        {expanded ? "Thu gọn" : "Xem thêm"}
      </button>
    </div>
  );
};

export default CareConsignmentPage;
