import React from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import "./Checkout.css"
import { Button, Flex, Radio, Slider, Space } from 'antd';
import {Link} from "react-router-dom"

export default function Checkout() {
  const checkoutOption1 = [
    { label: 'Thanh toán bằng thẻ tín dụng', value: 'Thanh toán bằng thẻ tín dụng' },
    { label: 'Thanh toán khi nhận hàng(đặt cọc 50%)', value: 'Thanh toán khi nhận hàng(đặt cọc 50%)' }
  ];


  return (
    <>
      <div className='checkOutInfo' style={{
        padding: "20px"
      }}>
        <section className="TitleSection">
          <h3>Thông tin giao/nhận hàng</h3>
        </section>
        <Box>
          <Flex gap="large">
            <TextField id="outlined-basic" label="Họ và tên" variant="outlined" style={{
              width: "40%"
            }} />
            <TextField id="outlined-basic" label="Email" variant="outlined" style={{
              width: "30%"
            }} />
            <TextField id="outlined-basic" label="Số điện thoại" variant="outlined" style={{
              width: "25%"
            }} />
          </Flex>
        </Box>

        <Box style={
          {
            marginTop: "2%",
          }
        }>
          <Flex gap="large">
            <TextField id="outlined-basic" label="Địa chỉ" variant="outlined" style={{
              width: "98%"
            }} />
          </Flex>
        </Box>

        <Box style={
          {
            marginTop: "2%",
          }
        }>
          <Flex gap="large">
            <TextField id="outlined-basic" label="Nhập tỉnh/thành" variant="outlined" style={{
              width: "25%"
            }} />
            <TextField id="outlined-basic" label="Nhập quận/huyện" variant="outlined" style={{
              width: "25%"
            }} />
            <TextField id="outlined-basic" label="Nhập phường/xã" variant="outlined" style={{
              width: "25%"
            }} />
          </Flex>
        </Box>

        <Flex justify="space-between">
          <div className="checkoutSection">
            <section className="TitleFlexSection">
              <h3>Phương thức thanh toán</h3>
            </section>
            <Flex direction="column" gap="middle">
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={1}>Thanh toán bằng thẻ tín dụng</Radio>
                  <Radio value={2}>Thanh toán khi nhận hàng(đặt cọc 50%)</Radio>
                </Space>
              </Radio.Group>
            </Flex>


          </div>

          <div className="OrderSection">
            <section className="OrderTitleSection">
              <h3>Thông tin đơn hàng</h3>
            </section>
          </div>

        </Flex>

        <Flex style={{
          marginTop: "6%",
          justifyContent: "space-between",
          padding: "15px"
        }}>
          <div>
            <Link to="/cart">
              <Button color="danger" variant="solid" style={{
                padding: "20px",
                fontSize: "20px"
              }}>
                Quay lại giỏ hàng
              </Button>
            </Link>
            </div>
          <div>
            <Button variant='solid' style={{
              backgroundColor: "green",
              color: "white",
              padding: "20px",
              fontSize: "20px"
            }}>
              Đặt hàng
            </Button>
          </div>
        </Flex>
      </div>
    </>
  )
}
