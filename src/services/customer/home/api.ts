import api from "../../../config/axios";

export const getProducts = () => {
  return api.get("Product");
};
