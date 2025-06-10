// src/services/shoppingListService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/shoppinglists'; // Thay đổi nếu API của bạn ở địa chỉ khác

// Hàm để lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('userToken');
};

const getConfig = () => {
  const token = getToken();
  if (!token) {
    // Xử lý trường hợp không có token, ví dụ: chuyển hướng người dùng
    console.error("No authentication token found.");
    // Có thể throw error hoặc chuyển hướng người dùng đến trang đăng nhập
    return {}; // Trả về object rỗng hoặc throw error
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Lấy tất cả danh sách mua sắm của người dùng
const getShoppingLists = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// Tạo một danh sách mua sắm mới
// Backend của bạn getShoppingLists trả về một mảng các ShoppingList.
// Component ShoppingList của bạn đang chỉ quản lý các item trong MỘT danh sách.
// Vì vậy, ở đây chúng ta sẽ giả định là bạn đang quản lý một danh sách cụ thể (ví dụ: danh sách đầu tiên của user)
// Hoặc bạn sẽ cần một component cha để quản lý nhiều danh sách.
// Hiện tại, để phù hợp với giao diện của bạn, chúng ta sẽ tập trung vào việc cập nhật item trong MỘT danh sách.
// Nếu bạn muốn tạo danh sách mới, cần truyền đủ thông tin của một ShoppingList model: name, type, items, sharedWith
const createShoppingList = async (listData: { name: string; type: string; items?: any[]; sharedWith?: string[] }) => {
  const response = await axios.post(API_URL, listData, getConfig());
  return response.data;
};

// Cập nhật một danh sách mua sắm (bao gồm các items bên trong)
const updateShoppingList = async (listId: string, updatedData: { name?: string; type?: string; items?: any[]; sharedWith?: string[] }) => {
  const response = await axios.put(`${API_URL}/${listId}`, updatedData, getConfig());
  return response.data;
};

// Xóa một danh sách mua sắm
const deleteShoppingList = async (listId: string) => {
  const response = await axios.delete(`${API_URL}/${listId}`, getConfig());
  return response.data;
};

export { getShoppingLists, createShoppingList, updateShoppingList, deleteShoppingList };