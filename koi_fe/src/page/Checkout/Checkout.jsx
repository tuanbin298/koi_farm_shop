import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import "./Checkout.css"
import { Button, Flex, Radio,  Space, Image } from 'antd';
import {Link} from "react-router-dom"
import {CREATE_ORDER, UPDATE_ORDER} from ".././api/Mutations/order"
import {CREATE_ORDER_ITEMS} from ".././api/Mutations/orderItem"
import { useMutation, useQuery } from '@apollo/client';
import { GET_CART_ITEMS } from '../api/Queries/cartItem';
import { DELETE_CART_ITEM } from '../api/Mutations/deletecartItem';
import toast, { Toaster } from "react-hot-toast";
import { formatMoney } from "../../utils/formatMoney";
import { GET_ORDER_ITEM_ID } from '../api/Queries/orderItem';
import { List, ListItem, ListItemText, Divider, Typography, ListItemAvatar, Avatar
  , Pagination
 } from '@mui/material';
export default function Checkout() {
  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const userId = localStorage.getItem("id");
  const [orderItemsData, setOrderItemsData] = useState([]);
  const [linkOrderId, setLinkOrderId] = useState(null);
  const { loading, error, data: cartItems, refetch: refetchItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: { id: { equals: userId } },
      },
    },
  });

  const { data: orderItemIDs, refetch: refetchOrderItems } = useQuery(GET_ORDER_ITEM_ID, {
    variables: {
      where: {
        order: { id: { equals: linkOrderId } }, // Use the orderId state here
      },
    },
    skip: !linkOrderId, // Skip the query until the orderId is set
  });
  console.log(orderItemIDs);
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState({}); // Error state for each field

  // Function to validate each field
  const validateFields = () => {
    const newErrors = {};
    // if (!orderData.name) {
    //   newErrors.name = "Tên là tối đa 50 ký tự";
    // }
    // // if (!orderData.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(orderData.email)) {
    //   newErrors.email = "Email không hợp lệ";
    // // }
    // if (!orderData.phone || !/^\d{6}$/.test(orderData.phone)) {
    //   newErrors.phone = "Số điện thoại phải là 6 chữ số";
    // }
    // if (!orderData.address) {
    //   newErrors.address = "Địa chỉ là tối đa 100 ký tự";
    // }
    // if (!orderData.city) {
    //   newErrors.city = "Vui lòng nhập tỉnh/thành";
    // }
    // if (!orderData.district) {
    //   newErrors.district = "Vui lòng nhập quận/huyện";
    // }
    // if (!orderData.ward) {
    //   newErrors.ward = "Vui lòng nhập phường/xã";
    // }
    // if (!orderData.paymentMethod) {
    //   newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const [createOrder] = useMutation(CREATE_ORDER);
  const [createOrderItems] = useMutation(CREATE_ORDER_ITEMS);

  const [name, setName] = useState(localStorage.getItem("name") || '');
  const [email, setEmail] = useState(localStorage.getItem("email") || '');
  const [phone, setPhone] = useState(localStorage.getItem("phone") || '');
  const [address, setAddress] = useState(localStorage.getItem("address") || '');

  const checkoutOption1 = [
    { label: 'Thanh toán bằng thẻ tín dụng', value: 'creditCard' },
    { label: 'Thanh toán khi nhận hàng(đặt cọc 50%)', value: 'cod' }
  ];
  const [orderItemIds, setOrderItemIds] = useState([]);

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "", // Clear error on user input
    });
  };
  let totalPrice = 0;
  cartItems.cartItems?.forEach((cartItem) => {
    if (cartItem.product.length > 0) {
      totalPrice += cartItem.product[0].price;
    } else if (cartItem.consignmentProduct) {
      totalPrice += cartItem.consignmentProduct[0].price;
    }
  });
  const handleCreateOrder = async () => {
    console.log(cartItems);
    if (validateFields()){
    if(cartItems.cartItems.length <= 0){
      toast.error("Lỗi tạo đơn hàng!");
    }
    else{
    try {
      // Create Order
      const { data } = await createOrder({
        variables: {
          data: {
            user: {
              connect: { id: userId },
            },
            price: totalPrice,
            // address: `${orderData.address}, ${orderData.city}, ${orderData.district}, ${orderData.ward}`,
            address: `${orderData.address}, ${orderData.city}, ${orderData.district}, ${orderData.ward}`,
          },
        },
      });

      const orderId = data.createOrder.id;
      setLinkOrderId(orderId);
      // Create Order Items (replace with actual items from cart)
      // setOrderItemsData(cartItems)
      // console.log(cartItems);
      // await createOrderItems({
      //   variables: {
      //     data: cartItems,
      //   },
      // });
      const orderItems = cartItems.cartItems.map((item) => ({
        // Use product if available, otherwise use consignmentProduct
        ...(item.product.length > 0
          ? { product: { connect: { id: item.product[0].id } } }
          : { consignmentSale: { connect: { id: item.consignmentProduct[0].id } } }
        ),
      //   product: { connect: { 
      //     id: item.product[0]?.id ? item.product[0].id : item.consignmentProduct[0].id 
      //   } 
      // },
        order: { connect: { id: orderId } },
        quantity: 1,
        price: item.product.length > 0 ? item.product[0].price : item.consignmentProduct[0].price,
      }));

      // Create the order items
      const { data: createOrderItemsData } = await createOrderItems({
        variables: { data: orderItems },
      });

      // Store Order Item IDs
      const orderItemIds = createOrderItemsData.createOrderItems.map(item => item.id);
      setOrderItemIds(orderItemIds);
      console.log(orderItemIds)
      for (let i = 0; i < orderItemIds.length; i++){
      // const orderItemId = orderItems[i].id;
      console.log(orderItemIds[i]);
      await updateOrder({
        variables: {
          where: {
            id: orderId
          },
          data: {
            items: {
              connect: [
                {
                  id: orderItemIds[i]
                }
              ]
            }
          }
        }
      })
    }

      for (let i = 0; i < cartItems.cartItems.length; i++) {
        const cartItemId = cartItems.cartItems[i].id;
        await deleteCartItem({
          variables: {
            where: { id: cartItemId },
          },
        });
      }
      toast.success('Đã tạo đơn hàng!')
    } catch (error) {
      console.log(orderItemsData)
      console.error("Error creating order:", error);
      toast.error("Lỗi tạo đơn hàng!");
    }
  }
}
else{
  toast.error("Lỗi tạo đơn hàng!");
}
  };
  const [page, setPage] = useState(1); // Current page
  const itemsPerPage = 3; // Items per page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = cartItems?.cartItems?.slice(startIndex, endIndex) || [];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
      <div className='checkOutInfo' style={{ padding: "20px" }}>
        <section className="TitleSection">
          <h3>Thông tin giao/nhận hàng</h3>
        </section>
        <Box>
          <Flex gap="large">
            <TextField
              id="name"
              name="name"
              label="Họ và tên"
              variant="outlined"
              value={name}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 50 }}
              helperText={errors.name || "Tên tối đa 50 ký tự"}
              error={Boolean(errors.name)}
              style={{ width: "40%" }}
            />

            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleInputChange}
              required
              helperText={errors.email || "Vui lòng nhập email hợp lệ"}
              error={Boolean(errors.email)}
              style={{ width: "30%" }}
              inputProps={{
                pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}",
              }}
            />

            <TextField
              id="phone"
              name="phone"
              label="Số điện thoại"
              variant="outlined"
              value={phone}
              onChange={handleInputChange}
              required
              helperText={errors.phone || "Chỉ nhập số, tối đa 10 ký tự"}
              error={Boolean(errors.phone)}
              style={{ width: "25%" }}
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
          </Flex>
        </Box>

        <Box style={{ marginTop: "2%" }}>
          <Flex gap="large">
            <TextField
              id="address"
              name="address"
              label="Địa chỉ"
              variant="outlined"
              value={address}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 100 }}
              helperText={errors.address || "Địa chỉ tối đa 100 ký tự"}
              error={Boolean(errors.address)}
              style={{ width: "98%" }}
            />
          </Flex>
        </Box>

        <Box style={{ marginTop: "2%" }}>
          <Flex gap="large">
            <TextField
              id="city"
              name="city"
              label="Nhập tỉnh/thành"
              variant="outlined"
              value={orderData.city}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 50 }}
              helperText={errors.city || "Tên tỉnh/thành tối đa 50 ký tự"}
              error={Boolean(errors.city)}
              style={{ width: "25%" }}
            />
            <TextField
              id="district"
              name="district"
              label="Nhập quận/huyện"
              variant="outlined"
              value={orderData.district}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 50 }}
              helperText={errors.district || "Tên quận/huyện tối đa 50 ký tự"}
              error={Boolean(errors.district)}
              style={{ width: "25%" }}
            />
            <TextField
              id="ward"
              name="ward"
              label="Nhập phường/xã"
              variant="outlined"
              value={orderData.ward}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 50 }}
              helperText={errors.ward || "Tên phường/xã tối đa 50 ký tự"}
              error={Boolean(errors.ward)}
              style={{ width: "25%" }}
            />
          </Flex>
        </Box>
        <Flex justify="space-between">
        <div className='OrderSection'>
            <section className='OrderTitleSection'>
              <h3>Thông tin đơn hàng</h3>
            </section>
            <List>
              {paginatedItems.map((item, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Image
                        width={75}
                        src={item.product[0]?.image?.publicUrl || item.consignmentProduct[0]?.photo?.image?.publicUrl || ''}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.product[0]?.name || item.consignmentProduct[0]?.name}
                      secondary={`Giá: ${item.product[0]?.price || item.consignmentProduct[0]?.price} VND`}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
              <Box display='flex' justifyContent='center' marginTop={2}>
                <Pagination
                  count={Math.ceil((cartItems?.cartItems?.length || 0) / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color='primary'
                />
              </Box>
              {cartItems?.cartItems?.length === 0 && <Typography variant='body2'>Giỏ hàng trống</Typography>}
            </List>
          </div>

          
          <div className="checkoutSection">
            <section className="TitleFlexSection">
              <h3>Phương thức thanh toán</h3>
            </section>
            <Flex direction="column" style={{ marginTop: "20px" }}>
          <Radio.Group
            onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value })}
            required
          >
            <Space direction="vertical">
              <Radio value="creditCard">Thanh toán bằng thẻ tín dụng</Radio>
              <Radio value="cod">Thanh toán khi nhận hàng (đặt cọc 50%)</Radio>
            </Space>
          </Radio.Group>
          {errors.paymentMethod && <p style={{ color: 'red' }}>{errors.paymentMethod}</p>}
        </Flex>
          </div>

            
        </Flex>

        <Flex style={{ marginTop: "6%", justifyContent: "space-between", padding: "15px" }}>
          <div>
            <Link to="/cart">
              <Button color="danger" variant="solid" style={{ padding: "20px", fontSize: "20px" }}>
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
            }}
              onClick={handleCreateOrder}>
              Đặt hàng
            </Button>
          </div>
        </Flex>
      </div>
    </>
  );
}
