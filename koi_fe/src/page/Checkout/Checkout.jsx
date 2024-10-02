import React from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import "./Checkout.css"
import { Button, Flex, Radio, Slider } from 'antd';

export default function Checkout() {
  const checkoutOption1 = [
    { label: 'Thanh toán bằng thẻ tín dụng', value: 'Thanh toán bằng thẻ tín dụng' },
    { label: 'Thanh toán khi nhận hàng(đặt cọc 50%)', value: 'Thanh toán khi nhận hàng(đặt cọc 50%)' }
  ];

  return (
    <>
    <div className='checkOutInfo'>
      <section className="TitleSection">
      <h3>Thông tin giao/nhận hàng</h3>
      </section>
      <Box>
        <Flex gap="large">
        <TextField id="outlined-basic" label="Họ và tên" variant="outlined" style={{
                  width: "40%"
              }}/>
        <TextField id="outlined-basic" label="Email" variant="outlined" style={{
                  width: "30%"
              }}/>
        <TextField id="outlined-basic" label="Số điện thoại" variant="outlined" style={{
                  width: "25%"
              }}/>
        </Flex>
      </Box>

      <Box style={
        {
          marginTop: "2%",
        }
      }>
        <Flex gap="large">
        <TextField id="outlined-basic" label="Họ và tên" variant="outlined" style={{
                  width: "98%"
              }}/>
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
              }}/>
        <TextField id="outlined-basic" label="Nhập quận/huyện" variant="outlined" style={{
                  width: "25%"
              }}/>
        <TextField id="outlined-basic" label="Nhập phường/xã" variant="outlined" style={{
                  width: "25%"
              }}/>
        </Flex>
      </Box>

      <Flex justify="space-between">
      <div className="checkoutSection">
        <section className="TitleFlexSection">
        <h3>Phương thức thanh toán</h3>
        </section>
        <Flex direction="column" gap="middle">
    <Radio.Group
      block
      options={checkoutOption1}
      defaultValue="Thanh toán bằng thẻ tín dụng"
      optionType="button"
      buttonStyle="solid"
      size="large"  // Set the size to large
    />
</Flex>


      </div> 
      
      <div className="OrderSection">
        <section className="OrderTitleSection">
        <h3>Thông tin đơn hàng</h3>
        </section>
      </div>

      </Flex>
      
      </div>
    </>
  )
}
