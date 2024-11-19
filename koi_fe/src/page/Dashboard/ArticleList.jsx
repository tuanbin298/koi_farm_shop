import React from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Modal
} from "@mui/material";
import { GET_ARTICLES } from "../api/Queries/articles";
import UpdateIcon from "@mui/icons-material/Update";
export default function ArticleList() {
  const { data, loading, error } = useQuery(GET_ARTICLES, {
    variables: { take: 10 },
  });
  console.log(data);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", marginTop: 4 }}
      >
        Error loading articles: {error.message}
      </Typography>
    );

  const articles = data?.articles || [];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          marginLeft: "15%",
          marginTop: "5%",
        }}
      >
        <Typography variant="h4">Danh sách bài viết</Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          marginLeft: "15%",
          marginTop: "2%",
          width: "85%",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Đường dẫn</TableCell>
              <TableCell>Hình ảnh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article, index) => (
              <TableRow key={index}>
                <TableCell>{article.name || "Không có tiêu đề"}</TableCell>
                <TableCell>
                  {typeof article.content === "string"
                    ? article.content.slice(0, 100) + "..."
                    : "Không có nội dung"}
                </TableCell>
                <TableCell>
                  {article.links ? (
                    <a
                      href={article.links}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "blue" }}
                    >
                      {article.links}
                    </a>
                  ) : (
                    "Không có đường dẫn"
                  )}
                </TableCell>
                <TableCell>
                  {typeof article.image?.publicUrl === "string" ? (
                    <img
                      src={article.image.publicUrl}
                      alt={article.name || "Hình ảnh"}
                      style={{
                        width: "100px",
                        height: "auto",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    "Không có hình ảnh"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
