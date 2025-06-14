import axiosInstance from "../axios/axiosInstance";

interface Customer {
  companyName: string;
  contactName: string;
  phoneNumber: string;
  faxNumber: string;
  country: string;
}

export const getAllCustomers = async () => {
  try {
    const response = await axiosInstance.get("/customers/");
    return response.data;
  } catch (error) {
    console.error("Error to find customers ", error);
    throw error;
  }
};

export const getCustomerById = async (customerId: number) => {
  try {
    const response = await axiosInstance.get(
      `/customers/getById/${customerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error to find customer ", error);
    throw error;
  }
};

export const seachCustomerByCountry = async (country: string) => {
  try {
    const response = await axiosInstance.get(
      `/customers/searchByCountry?country=${country}`
    );
    return response.data;
  } catch (error) {
    console.error("Error to get customers by country");
    throw error;
  }
};

export const createCustomer = async (customer: Customer) => {
  try {
    const response = await axiosInstance.post("/customers/save", customer);
    return response.data;
  } catch (error) {
    console.error(`Error to create customer ${error}`);
    throw error;
  }
};

export const deleteCustomer = async (customerId: number) => {
  try {
    const response = await axiosInstance.delete(
      `/customers/delete/${customerId}`
    );
    return response.status == 200;
  } catch (error) {
    console.error("Error to delete customer");
    throw error;
  }
};
