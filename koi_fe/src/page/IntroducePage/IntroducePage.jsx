import React from 'react';
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../../page/api/Queries/product";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";

const IntroducePage = () => {
    const {
        data: productData,
        loading: productLoading,
        error: productError,
    } = useQuery(GET_PRODUCT, {
        variables: { take: 3 },
    });
    console.log(productData);
    if (productLoading) return <p className="text-center">Loading ...</p>;
    if (productError) return <p className="text-center text-danger">Error loading Introduce </p>;

    const formatMoney = (amount) => {
        return amount.toLocaleString() + " đ"; // Hàm định dạng giá
    };

    return (
        <div className="introduce-page">
            <Container>
                <h1 className="text-center mt-4">Chào mừng đến với CaKoiViet</h1>
                <h2 className="text-center mt-4">Nơi Giao Lưu và Chia Sẻ Đam Mê Cá Koi!</h2>

                <section className="about-section mt-4">
                    <p>
                        Tại CaKoiViet, chúng tôi không chỉ đơn thuần là một trang web bán cá Koi, mà còn là một cộng đồng dành cho những ai đam mê nghệ thuật nuôi cá và yêu thích vẻ đẹp tuyệt vời của những chú cá Koi. Với sứ mệnh kết nối những người yêu cá Koi trên toàn quốc, chúng tôi cam kết mang đến cho bạn không chỉ những sản phẩm chất lượng mà còn là những kiến thức quý giá về việc chăm sóc và nuôi dưỡng cá Koi.
                    </p>
                    <p>
                        Tại trang web của chúng tôi, bạn sẽ tìm thấy một bộ sưu tập đa dạng các giống cá Koi nổi bật nhất, từ những chú cá thuần chủng nhập khẩu đến các giống cá lai F1 và thuần Việt. Chúng tôi hiểu rằng mỗi người nuôi cá đều có những yêu cầu riêng, vì vậy chúng tôi luôn nỗ lực để đáp ứng nhu cầu của bạn với các sản phẩm chất lượng nhất.
                    </p>
                    <p>
                        Ngoài việc cung cấp cá Koi, CaKoiViet còn hỗ trợ dịch vụ ký gửi nuôi hộ cá khi mua cá tại trang trại và ký gửi bán cá hộ cho các nhà kinh doanh. Chúng tôi cam kết mang lại cho bạn sự yên tâm khi biết rằng những chú cá của bạn sẽ được chăm sóc chu đáo và an toàn.
                    </p>
                </section>

                <Row className="mt-4 justify-content-center">
                    <Col md={10}>
                        <section className="species-section d-flex justify-content-between align-items-center mb-3">
                            <h3 >Các giống Cá của CaKoiViet</h3>
                            <Link to="/koilist" className="ml-auto">
                                <Button variant="outline-primary" className="viewMoreButton">
                                    Xem thêm <FaArrowRight />
                                </Button>
                            </Link>
                        </section>

                        <div className="productList d-flex justify-content-center flex-wrap">
                            {productData.products.length > 0 ? (
                                productData.products.map((product) => (
                                    <div key={product.id} className="col-md-4 mb-4 d-flex">
                                        <div className="card h-100 shadow-sm text-center" style={{ maxWidth: "300px", margin: "0 auto" }}>
                                            <Link to={`/ProductDetail/${product.id}`}>
                                                <img
                                                    src={product.image?.publicUrl}
                                                    alt={product.name}
                                                    className="card-img-top img-fluid rounded mx-auto"
                                                    style={{
                                                        height: "300px",
                                                        width: "200px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </Link>

                                            <div className="card-body">
                                                <h5 className="card-title">{product.name}</h5>
                                                <p className="mb-1 text-danger">
                                                    <strong>Giá: </strong>
                                                    {formatMoney(product.price)}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Nguồn gốc: </strong>
                                                    {product.origin}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Kích thước: </strong>
                                                    {product.size} 
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Loại: </strong>
                                                    {product.generic}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">Không có sản phẩm nào để hiển thị.</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default IntroducePage;
