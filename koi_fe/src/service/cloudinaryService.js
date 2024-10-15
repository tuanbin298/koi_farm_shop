export const uploadImageToCloudinary = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_FOLDER); // upload_preset của bạn

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  // Xử lý lỗi nếu có
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.secure_url; // Trả về URL của ảnh
};
