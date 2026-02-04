import api from "../../../config/axios";
import { type FilterItem, buildApiUrl } from "../../../utils/filterUtils";

export const getProducts = () => {
  return api.get("Product");
};

export const getProductsMain = (
  limit: number,
  page: number,
  filters: FilterItem[] = [],
) => {
  const url = buildApiUrl("/product", { limit, page, filters });
  return api.get(url);
};
