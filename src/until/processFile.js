import { useCallback } from "react";

const useProcessFile = () => {
  // Hàm chuyển đổi tệp sang Base64
  const convertFilesToBase64 = useCallback((files) => {
    return Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result); // Trả về Base64
          reader.onerror = (error) => reject(error); // Trả về lỗi nếu có
          reader.readAsDataURL(file);
        });
      })
    );
  }, []);

  // Hàm lọc tệp hợp lệ dựa trên định dạng được chấp nhận
  const processFile = useCallback((files, typeAccept) => {
    const validFiles = files.filter((file) => typeAccept.includes(file.type));
    if (validFiles.length !== files.length) {
      alert("Một số tệp không hợp lệ hoặc không được hỗ trợ.");
    }
    return validFiles; // Trả về danh sách tệp hợp lệ
  }, []);

  return { convertFilesToBase64, processFile };
};

export default useProcessFile;
