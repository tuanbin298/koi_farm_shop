// File: src/components/CreateProductForm.js
import React, { useState } from 'react';
import {
    Box, Typography, Paper, TextField, Button, MenuItem,
    Select, InputLabel, FormControl
} from '@mui/material';

export default function CreateProductForm() {
    const [productData, setProductData] = useState({
        name: '',
        birthYear: '',
        gender: '',
        size: '',
        price: '',
        description: '',
        source: '',
        breed: '',
        image: null,
        type: '',
        status: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleImageUpload = (e) => {
        setProductData({ ...productData, image: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(productData);
    };

    return (
        <Box sx={{ display: 'flex', marginLeft: '15%' }}>
            <Box component="main" sx={{ flexGrow: 1, padding: 5, marginRight: '10%' }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Thêm sản phẩm</Typography>

                <Paper elevation={3} sx={{ padding: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            mb: 2
                        }}>
                            {/* Cá Koi Name */}
                            <TextField
                                fullWidth
                                label="Cá Koi"
                                variant="outlined"
                                name="name"
                                value={productData.name}
                                onChange={handleChange}
                                sx={{ mr: 2 }} // Margin right
                            />

                            {/* Năm Sinh */}
                            <TextField
                                fullWidth
                                label="Năm Sinh"
                                variant="outlined"
                                name="birthYear"
                                value={productData.birthYear}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            mb: 2
                        }}>
                        {/* Giới Tính */}
                        <FormControl fullWidth sx={{ mr: 2 }}>
                            <InputLabel>Giới Tính</InputLabel>
                            <Select
                                name="gender"
                                value={productData.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="male">Đực</MenuItem>
                                <MenuItem value="female">Cái</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Kích Thước */}
                        <FormControl fullWidth>
                            <InputLabel>Kích Thước</InputLabel>
                            <Select
                                name="size"
                                value={productData.size}
                                onChange={handleChange}
                            >
                                <MenuItem value="20cm">20cm</MenuItem>
                                <MenuItem value="30cm">30cm</MenuItem>
                                <MenuItem value="40cm">40cm</MenuItem>
                                <MenuItem value="50cm">50cm</MenuItem>
                                <MenuItem value="60cm">60cm</MenuItem>
                                <MenuItem value="70cm">70cm</MenuItem>
                            </Select>
                        </FormControl>
                        </Box>
                        {/* Giá */}
                        <TextField
                            fullWidth
                            label="Giá"
                            variant="outlined"
                            name="price"
                            type="number"
                            value={productData.price}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />

                        {/* Mô Tả */}
                        <TextField
                            fullWidth
                            label="Mô Tả"
                            variant="outlined"
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                        />

                    <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            mb: 2
                        }}>
                        {/* Nguồn Cung */}
                        <TextField
                            fullWidth
                            label="Nguồn Cung"
                            variant="outlined"
                            name="source"
                            value={productData.source}
                            onChange={handleChange}
                            sx={{ mr: 2 }}
                        />

                        {/* Chủng Loại */}
                        <TextField
                            fullWidth
                            label="Chủng Loại"
                            variant="outlined"
                            name="breed"
                            value={productData.breed}
                            onChange={handleChange}
                        />
                        </Box>

                        {/* Hình Ảnh */}
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ mb: 2 }}
                        >
                            Upload Hình Ảnh
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>

                        {/* Loại */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Loại</InputLabel>
                            <Select
                                name="type"
                                value={productData.type}
                                onChange={handleChange}
                            >
                                <MenuItem value="physical">Vật Lý</MenuItem>
                                <MenuItem value="digital">Kỹ Thuật Số</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Trạng Thái */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Trạng Thái</InputLabel>
                            <Select
                                name="status"
                                value={productData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="available">Còn Hàng</MenuItem>
                                <MenuItem value="sold out">Hết Hàng</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                backgroundColor:"#4287f5"
                            }}
                        >
                            Thêm sản phẩm
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
}
