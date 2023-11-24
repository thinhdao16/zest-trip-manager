export const formatNumber = (number) => {
  const formattedNumber = number?.toLocaleString('en-US');
  return formattedNumber ? `${formattedNumber}${' '}đ` : ''; // Thêm 'đ' nếu giá trị được định dạng, ngược lại trả về chuỗi trống.
};
