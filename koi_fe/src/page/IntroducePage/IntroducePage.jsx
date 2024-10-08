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
                    <div className="koi-item">
                        <img
                            src="https://example.com/koi1.jpg"
                            alt="Koi Sanke"
                            className="koi-image"
                        />
                        <h3>Koi Sanke</h3>
                        <p>
                            Koi Sanke là một trong những giống Koi phổ biến nhất với màu trắng,
                            đen và đỏ tuyệt đẹp.
                        </p>
                    </div>

                    <div className="koi-item">
                        <img
                            src="https://example.com/koi2.jpg"
                            alt="Koi Showa"
                            className="koi-image"
                        />
                        <h3>Koi Showa</h3>
                        <p>
                            Koi Showa có sự kết hợp màu sắc đen, đỏ và trắng, tạo nên vẻ đẹp
                            mạnh mẽ.
                        </p>
                    </div>

                    <div className="koi-item">
                        <img
                            src="https://example.com/koi3.jpg"
                            alt="Koi Kohaku"
                            className="koi-image"
                        />
                        <h3>Koi Kohaku</h3>
                        <p>
                            Koi Kohaku nổi bật với màu trắng tinh khiết và các vệt đỏ.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default IntroducePage;
