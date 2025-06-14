import axiosInstance from "../axios/axiosInstance";

interface Order {
  orderDate: string;
  shippedDate: string;
  customerId: number;
}

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/");
    return response.data;
  } catch (error) {
    console.error("Error to get all orders");
    throw error;
  }
};

export const getOrderById = async (orderId: number) => {
  try {
    const response = await axiosInstance.get(`/orders/getById/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error to get order");
    throw error;
  }
};

export const getByCustomerId = async (customerId: number) => {
  try {
    const response = await axiosInstance.get(`/orders/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error to get orders by custumer");
    throw error;
  }
};

export const createOrders = async (order: Order) => {
  try {
    const response = await axiosInstance.post("/orders/save", order);
    return response.data;
  } catch (error) {
    console.error("Error to create order");
    throw error;
  }
};

export const deleteOrder = async (orderId: number) => {
  try {
    const response = await axiosInstance.delete(`/orders/delete/${orderId}`);
    return response.status == 200;
  } catch (error) {
    console.error("Error to delete order");
    throw error;
  }
};
