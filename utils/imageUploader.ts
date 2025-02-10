export const uploadImage = async (uri: string) => {
  try {
    // Lấy tên file từ URI (phần cuối của đường dẫn)
    const fileName = uri.split('/').pop();
    // Xác định loại file (ví dụ: image/jpeg)
    const fileType = fileName?.split('.').pop();

    // Tạo FormData và thêm trường 'photo'
    const formData = new FormData();
    formData.append('photo', {
      uri,
      name: fileName,
      type: `image/${fileType}`,
    } as any); // "as any" để tránh lỗi về kiểu đối tượng trong TS

    // Gửi yêu cầu POST đến server
    const response = await fetch('http://your-server/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const responseData = await response.json();
    console.log("Upload thành công:", responseData);
    return responseData.url;
  } catch (error) {
    console.error("Upload thất bại:", error);
  }
};
