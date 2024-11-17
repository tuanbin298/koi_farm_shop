import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export const GET_PROFILE_ADMIN = gql`
  query Users {
    users {
      name
      email
      address
      phone
      role {
        name
      }
    }
  }
`;

const UserList = () => {
    const { loading, error, data } = useQuery(GET_PROFILE_ADMIN);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Box
            sx={{
                marginLeft: "20%",
                marginRight: "5%",
                marginTop: "5%",
                padding: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
            }}
        >
            <Typography variant="h4" sx={{ mb: 3 }}>Danh sách người dùng</Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tên Khách Hàng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.users.map((user) => (
                            <TableRow key={user.email}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.role.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserList;
