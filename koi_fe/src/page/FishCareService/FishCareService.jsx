import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Box, Typography, Checkbox, Button, Grid
} from '@mui/material';
import { formatMoney } from '../../utils/formatMoney';
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom"
import { CREATE_CONSIGNMENT_RAISING } from '../api/Mutations/fishcare';
import { useQuery, useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
const FishCareService = () => {
    const location = useLocation();  // Lấy danh sách sản phẩm được chọn từ CartPage
    const navigate = useNavigate();  // Chuyển hướng sang trang thanh toán
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalCarePrice, setTotalCarePrice] = useState(0);
    const [agreeToPolicy, setAgreeToPolicy] = useState(false); // Khai báo agreeToPolicy
    const [dates, setDates] = useState({});
    const userId = localStorage.getItem("id");
    
    // Lấy danh sách sản phẩm từ location.state
    useEffect(() => {
        if (location.state && location.state.selectedProducts) {
            setSelectedProducts(location.state.selectedProducts);
        }
    }, [location.state]);
    const [createConsignmentRaisings] = useMutation(CREATE_CONSIGNMENT_RAISING);
    // Tính tổng số tiền ký gửi dựa trên ngày bắt đầu/kết thúc và giá ký gửi nuôi
    const calculateTotalPrice = () => {
        let total = 0;
        selectedProducts.forEach((product) => {
            const pricePerDay = product.product[0]?.price || product.consignmentProduct[0]?.price;
            const { startDate, endDate } = dates[product.id] || {};
            if (startDate && endDate) {
                const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
                total += days * 50000;
            }
        });
        setTotalCarePrice(total);
    };

    // Cập nhật ngày bắt đầu/kết thúc cho giá ký gửi nuôi
    const handleDateChange = (productId, field, value) => {
        // Convert selected date to full ISO 8601 date-time string
        const isoDate = new Date(value).toISOString().split("T")[0]; // Outputs full format: YYYY-MM-DDTHH:mm:ss.sssZ
        console.log(isoDate);
        setDates((prevDates) => ({
            ...prevDates,
            [productId]: { ...prevDates[productId], [field]: isoDate },
        }));
    };
    // Tính lại tổng tiền ký gửi mỗi khi ngày được thay đổi
    useEffect(() => {
        calculateTotalPrice();
    }, [dates]);

    // Điều hướng sang trang thanh toán
    const handleProceedToCheckout = async () => {
        if (agreeToPolicy) {
            const consignmentData = selectedProducts.map((product) => {
                console.log(product.product[0].id);    
                const { startDate, endDate } = dates[product.id] || {};
                const pricePerDay = 50000;
                const days = startDate && endDate
                    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
                    : 0;

                return {
                    user: { connect: { id: userId } },
                    product: { connect: { id: product.product[0].id } },
                    returnDate: new Date(endDate).toISOString(),
                    consignmentPrice: days * pricePerDay,
                    status: "Đang xử lý",
                    description: "Consignment for fish care"
                };
            });

            try {
                // Await the mutation execution
                await createConsignmentRaisings({
                    variables: { data: consignmentData },
                });

                // Show the toast and wait for it to display
                toast.success("Ký gửi nuôi thành công!", {
                    icon: "🎉",
                    duration: 2000, // Set the duration as needed
                });

                // Delay navigation to allow the user to see the toast
                setTimeout(() => {
                    navigate('/checkout', { state: { totalCarePrice } });
                }, 2000); // Match this delay to the toast duration
            } catch (error) {
                console.error("Error creating consignment:", error);
                toast.error("Ký gửi nuôi không thành công!");
            }
            
        } else {
            alert('Bạn cần đồng ý với chính sách ký gửi trước khi tiếp tục.');
        }
    };

    return (
        <div className="web-container">
            <div style={{ padding: '20px' }}>

                <section className="back-button-section">
                    <div className="icon-container">
                        <FaArrowLeft className="icon" />
                    </div>
                    <span className="back-button-text">
                        <Link to="/cart">Quay lại giỏ hàng</Link>
                    </span>
                </section>

                <Typography variant="h4" gutterBottom>
                    Dịch Vụ Ký Gửi Nuôi Cá
                </Typography>

                {/* Bảng thông tin ký gửi */}
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Tên Cá</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Ngày Bắt Đầu</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Ngày Kết Thúc</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Giá Tiền Ký Gửi (VND)</TableCell> {/* Cập nhật đây */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell align="center">
                                        {product.product.length > 0
                                            ? product.product[0].name
                                            : product.consignmentProduct[0]?.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="date"
                                            value={dates[product.id]?.startDate || ''}
                                            onChange={(e) => handleDateChange(product.id, 'startDate', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="date"
                                            value={dates[product.id]?.endDate || ''}
                                            onChange={(e) => handleDateChange(product.id, 'endDate', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {(() => {
                                            const pricePerDay = 50000; // Giá ký gửi 50.000 VND/ngày
                                            const { startDate, endDate } = dates[product.id] || {};
                                            let totalDeposit = 0;

                                            // Tính tiền ký gửi theo ngày nếu có ngày bắt đầu và kết thúc
                                            if (startDate && endDate) {
                                                const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
                                                totalDeposit = days * pricePerDay; // Tính tổng tiền ký gửi
                                            }

                                            return formatMoney(totalDeposit); // Trả về giá ký gửi đã tính
                                        })()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


                {/* Tổng tiền ký gửi */}
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                    <Typography variant="h6" gutterBottom>
                        Tổng tiền ký gửi: {formatMoney(totalCarePrice)}
                    </Typography>
                </Box>

                {/* Chính sách ký gửi */}
                <Box marginTop={4}>
                    <Typography variant="h4" gutterBottom>
                        Chính Sách Ký Gửi Chăm Sóc Cá Koi
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Thời gian ký gửi:</strong> <br />
                        - Thời gian tối thiểu ký gửi: 7 ngày<br />
                        - Thời gian tối đa ký gửi: 6 tháng. Sau thời gian này, khách hàng có thể gia hạn nếu cần thiết.<br />
                        - Khách hàng phải thông báo trước 3 ngày nếu muốn gia hạn hoặc kết thúc hợp đồng sớm hơn thời hạn đã cam kết.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Chi phí ký gửi:</strong><br />
                        - Phí ký gửi: 50.000 VND/ngày cho mỗi con cá Koi, không phân biệt kích thước lớn hay nhỏ.<br />
                        - Phí dịch vụ bổ sung: Các dịch vụ chăm sóc sức khỏe hoặc thức ăn đặc biệt sẽ có chi phí phát sinh theo yêu cầu.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Chăm sóc và bảo vệ cá Koi:</strong><br />
                        - Chế độ dinh dưỡng: Cá được cho ăn theo giai đoạn phát triển và tình trạng sức khỏe.<br />
                        - Môi trường sống: Bể nuôi sẽ được làm sạch thường xuyên, đảm bảo nước luôn trong sạch.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Quyền lợi và trách nhiệm của khách hàng:</strong><br />
                        <strong>Quyền lợi:</strong> Khách hàng có thể thăm cá bất kỳ lúc nào trong giờ hành chính, và sẽ nhận báo cáo tình trạng sức khỏe của cá định kỳ.<br />
                        <strong>Trách nhiệm:</strong> Khách hàng cần thanh toán đúng hạn các khoản phí ký gửi và dịch vụ bổ sung (nếu có).
                    </Typography>

                    {/* Checkbox Đồng Ý Chính Sách */}
                    <Grid container alignItems="center" marginTop={2}>
                        <Grid item>
                            <Checkbox
                                checked={agreeToPolicy}
                                onChange={(e) => setAgreeToPolicy(e.target.checked)}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">
                                Tôi đồng ý với chính sách ký gửi
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Nút Tiếp Tục Thanh Toán */}
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleProceedToCheckout}
                    >
                        Tiến hành thanh toán
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default FishCareService;
