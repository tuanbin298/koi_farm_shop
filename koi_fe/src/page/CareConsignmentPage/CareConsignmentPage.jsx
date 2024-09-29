import React, { useState } from "react";
import "./CareConsignmentPage.css"; // Import the CSS file

const CareConsignmentPage = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="policy-care-container">
      <h2>Chính sách ký gửi chăm sóc cá Koi</h2>

      <h5>Thời gian ký gửi:</h5>
      <ul>
        <li>Thời gian tối thiểu ký gửi: 1 tháng.</li>
        <li>
          Thời gian tối đa ký gửi: 6 tháng, sau thời gian này, khách hàng có thể
          gia hạn nếu cần thiết.
        </li>
        <li>
          Khách hàng phải thông báo trước 7 ngày nếu muốn gia hạn hoặc kết thúc
          thời gian ký gửi sớm hơn.
        </li>
      </ul>

      <h5>Chi phí ký gửi:</h5>
      <ul>
        <li>
          Phí ký gửi sẽ dựa trên kích thước cá Koi, thời gian ký gửi, và các
          dịch vụ kèm theo như chăm sóc đặc biệt.
        </li>
        <li>
          Chi phí cơ bản: X VND/tháng đối với cá Koi nhỏ, Y VND/tháng đối với cá
          Koi lớn (giá cụ thể sẽ được thông báo chi tiết khi ký hợp đồng).
        </li>
        <li>
          Các dịch vụ bổ sung như chăm sóc sức khỏe đặc biệt, sử dụng các loại
          thức ăn đặc biệt sẽ có phí riêng.
        </li>
      </ul>

      <h5>Điều kiện ký gửi:</h5>
      <ul>
        <li>
          Khách hàng phải cung cấp đầy đủ thông tin về tình trạng sức khỏe của
          cá Koi, bao gồm các giấy tờ xét nghiệm hoặc báo cáo y tế nếu có.
        </li>
        <li>
          Nếu cá có yêu cầu đặc biệt về chăm sóc, khách hàng phải thông báo rõ
          ràng và cung cấp hướng dẫn.
        </li>
      </ul>

      <h5>Chăm sóc và bảo vệ cá Koi:</h5>
      <ul>
        <li>
          Chế độ dinh dưỡng: Cá Koi sẽ được cho ăn chế độ dinh dưỡng phù hợp với
          từng giai đoạn phát triển và tình trạng sức khỏe.
        </li>
        <li>
          Kiểm tra sức khỏe định kỳ: Cá Koi sẽ được kiểm tra sức khỏe định kỳ
          mỗi tháng, bao gồm cả kiểm tra thể trạng và xét nghiệm nếu cần.
        </li>
        <li>
          Môi trường sống: Bể nuôi sẽ được làm sạch thường xuyên, đảm bảo môi
          trường nước luôn trong sạch và đạt chuẩn để cá Koi phát triển tốt.
        </li>
      </ul>

      {/* Nội dung mở rộng chỉ hiển thị khi người dùng nhấn "Xem thêm" */}
      {expanded && (
        <>
          <h5>Kiểm tra sức khỏe định kỳ:</h5>
          <ul>
            <li>
              Cá Koi sẽ được kiểm tra sức khỏe định kỳ mỗi tháng, bao gồm cả
              kiểm tra thể trạng và xét nghiệm nếu cần.
            </li>
          </ul>

          <h5>Môi trường sống:</h5>
          <ul>
            <li>
              Bể nuôi sẽ được làm sạch thường xuyên, đảm bảo môi trường nước
              luôn trong sạch và đạt chuẩn để cá Koi phát triển tốt.
            </li>
          </ul>

          <h5>Quyền lợi và trách nhiệm của khách hàng:</h5>
          <ul>
            <li>
              <strong>Quyền lợi:</strong>
            </li>
            <ul>
              <li>
                Khách hàng có quyền thăm cá Koi vào bất kỳ thời điểm nào trong
                giờ hành chính.
              </li>
              <li>
                Nhận báo cáo định kỳ về tình trạng sức khỏe và các vấn đề phát
                sinh (nếu có) của cá Koi.
              </li>
            </ul>
            <li>
              <strong>Trách nhiệm:</strong>
            </li>
            <ul>
              <li>
                Khách hàng phải cung cấp thông tin chính xác về tình trạng sức
                khỏe ban đầu của cá.
              </li>
              <li>
                Thanh toán đúng hạn các khoản phí liên quan đến ký gửi và các
                dịch vụ bổ sung (nếu có).
              </li>
            </ul>
          </ul>

          <h5>Chính sách bảo hiểm cá Koi:</h5>
          <ul>
            <li>
              Trang trại cung cấp các gói bảo hiểm cho cá Koi trong thời gian ký
              gửi nhằm bảo vệ quyền lợi khách hàng trong trường hợp xảy ra sự cố
              (chẳng hạn như bệnh tật, thương tổn ngoài ý muốn).
            </li>
            <li>
              Các gói bảo hiểm sẽ có mức phí khác nhau tùy thuộc vào giá trị và
              tình trạng sức khỏe của cá Koi.
            </li>
          </ul>

          <h5>Hợp đồng ký gửi:</h5>
          <ul>
            <li>
              Nội dung hợp đồng: Hợp đồng sẽ nêu rõ các điều khoản về thời gian,
              chi phí ký gửi, quyền lợi và trách nhiệm của cả hai bên.
            </li>
            <li>
              Ký kết hợp đồng: Hợp đồng phải được ký kết và lưu trữ hợp pháp
              trước khi bắt đầu dịch vụ ký gửi.
            </li>
            <li>
              Cả hai bên phải tuân thủ các điều khoản đã thỏa thuận trong hợp
              đồng.
            </li>
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
