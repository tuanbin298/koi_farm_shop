import React from 'react';
import './IntroducePage.css'; // Import file CSS

const IntroducePage = () => {
    return (
        <div className="introduce-page">

            <h1>Chào mừng đến với Trang Trại CaKoiViet</h1>

            <section className="about-section">
                <h2>Về Chúng Tôi</h2>
                <p>
                    Với mục tiêu kết nối những người yêu thích cá Koi, trang web chia
                    sẻ các bài viết về cách nuôi dưỡng, chăm sóc, và bảo vệ sức khỏe
                    cá Koi. Ngoài ra, CaKoiViet còn giới thiệu các giống cá Koi nổi
                    bật và những mẹo hữu ích cho người chơi cá cảnh.
                </p>
                <img
                    src="https://example.com/koifarm.jpg"
                    alt="Koi Farm"
                    className="about-image"
                />
            </section>

            <section className="koi-varieties">
                <h2>Các Giống Cá Koi Của Chúng Tôi</h2>
                <div className="koi-list">
      
                </div>
            </section>

        </div>
    );
};

export default IntroducePage;
