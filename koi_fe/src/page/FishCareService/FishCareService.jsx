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
    const [depositsArray, setDepositsArray] = useState([]);

    const today = new Date().toISOString().split('T')[0]; // Ngày hiện tại
    const userId = localStorage.getItem("id");
    console.log(location.state.selectedProducts);
    console.log(dates);
    // Lấy danh sách sản phẩm từ location.state
    useEffect(() => {
        if (location.state && location.state.selectedProducts) {
            setSelectedProducts(location.state.selectedProducts);
            // Khởi tạo ngày bắt đầu cho mỗi sản phẩm
            const initialDates = {};
            location.state.selectedProducts.forEach((product) => {
                initialDates[product.id] = { startDate: today, endDate: '' };
            });
            setDates(initialDates);
        }
    }, [location.state]);

    {/*Show consignment price for each consignment product */}
    const calculateDeposits = () => {
        const deposits = selectedProducts.map((product) => {
            const { startDate, endDate } = dates[product.id] || {};
            let totalDeposit = 0;
            
            if (startDate && endDate) {
                const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
                if (days >= 7 && days <= 180) {
                    totalDeposit = days * 50000;
                }
            }
            return { cartId: product.id, totalDeposit };
        });

        setDepositsArray(deposits); // Update the state with cartId and totalDeposit array
    };

    useEffect(() => {
        calculateDeposits();
    }, [dates]);
    console.log(depositsArray);

    // Tính tổng số tiền ký gửi dựa trên ngày bắt đầu/kết thúc và giá ký gửi nuôi
    const calculateTotalPrice = () => {
        let total = 0;
        selectedProducts.forEach((product) => {
            const { startDate, endDate } = dates[product.id] || {};
            if (startDate && endDate) {
                const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
                if (days >= 7 && days <= 180) {
                    total += days * 50000;
                }
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
            setTimeout(() => {
                navigate('/checkout', { state: 
                    { 
                    totalCarePrice: totalCarePrice,  
                    selectedProducts: selectedProducts,
                    dates: dates,
                    depositsArray: depositsArray
                } 
            });
            }, 2000);
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
                                            value={dates[product.id]?.startDate || today}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="date"
                                            value={dates[product.id]?.endDate || ''}
                                            onChange={(e) =>
                                                handleDateChange(product.id, 'endDate', e.target.value)
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            error={
                                                dates[product.id]?.endDate &&
                                                ((new Date(dates[product.id]?.endDate) - new Date(today)) / (1000 * 60 * 60 * 24) < 7 ||
                                                    (new Date(dates[product.id]?.endDate) - new Date(today)) / (1000 * 60 * 60 * 24) > 180)
                                            }
                                            helperText={
                                                dates[product.id]?.endDate &&
                                                    ((new Date(dates[product.id]?.endDate) - new Date(today)) / (1000 * 60 * 60 * 24) < 7 ||
                                                        (new Date(dates[product.id]?.endDate) - new Date(today)) / (1000 * 60 * 60 * 24) > 180)
                                                    ? 'Ngày kết thúc phải từ 7 đến 180 ngày kể từ hôm nay.'
                                                    : ''
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {(() => {
                                            const { startDate, endDate } = dates[product.id] || {};
                                            let totalDeposit = 0;

                                            if (startDate && endDate) {
                                                const days = Math.ceil(
                                                    (new Date(endDate) - new Date(startDate)) /
                                                    (1000 * 60 * 60 * 24)
                                                );
                                                totalDeposit = days * 50000;
                                            }

                                            return formatMoney(totalDeposit);
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
                {agreeToPolicy && (
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleProceedToCheckout}
                    >
                        Tiến hành thanh toán
                    </Button>
                </Box>
                )}
            </div>
        </div>
    );
};

export default FishCareService;
