import type { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import CTable from "../../../components/Ctable";
import type { Product } from "../../../types/Product";
import { getProductsMain } from "../../../services/customer/home/api";
import Filter, { type FilterForm, type FilterRef } from "./Fiter";

import type { FilterItem } from "../../../utils/filterUtils";

function ManagerProduct() {
  const [data, setData] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const defaultPageSize = 10;
  const [loading, setLoading] = useState(false);
  const filterRef = useRef<FilterRef>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterItem[]>([]);

  const productColumns: ColumnsType<Product> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="Product" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Discount (%)",
      dataIndex: "discountPercent",
      key: "discountPercent",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Reviews",
      dataIndex: "reviews",
      key: "reviews",
    },
    {
      title: "Best Seller",
      dataIndex: "isBestSeller",
      key: "isBestSeller",
      render: (isBestSeller: boolean) => (isBestSeller ? "Yes" : "No"),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (isActive ? "Yes" : "No"),
    },
  ];

  const fetchProducts = async (
    limit: number,
    page: number,
    filters: FilterItem[] = [],
  ) => {
    try {
      setLoading(true);
      const response = await getProductsMain(limit, page, filters);
      setData(response.data.data);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(defaultPageSize, 1);
  }, []);

  const handleChangePage = (page: number, pageSize: number) => {
    console.log(page, pageSize);
    fetchProducts(pageSize, page, currentFilters);
  };
  // Hàm này sẽ gọi fetchProducts với page đầu tiên khi bấm tìm kiếm
  const handleSearch = (value: FilterForm) => {
    const filters: FilterItem[] = [];
    if (value.name) {
      filters.push({ field: "name", op: "contains", value: value.name });
    }
    if (value.price) {
      filters.push({ field: "price", op: "gte", value: value.price });
    }
    if (
      value.isActive &&
      value.isActive.length > 0 &&
      !value.isActive.includes("all")
    ) {
      const activeValues = [];
      if (value.isActive.includes("yes")) activeValues.push(true);
      if (value.isActive.includes("no")) activeValues.push(false);
      if (activeValues.length > 0) {
        // If both, no need to filter active status usually, but logic depends on backend.
        // Assuming strict match if filtered.
        // If 'in' operator is supported for booleans or mapped checks.
        // Backend might expect string 'true'/'false' or boolean.
        // The utility supports string | number | boolean | string[].
        // To be safe with "in" operator:
        filters.push({
          field: "isActive",
          op: "in",
          value: activeValues.map(String),
        });
      }
    }
    setCurrentFilters(filters);
    fetchProducts(defaultPageSize, 1, filters);
  };
  return (
    <div>
      <Filter ref={filterRef} onSearch={handleSearch} />
      <CTable
        loading={loading}
        columns={productColumns}
        dataSource={data}
        isPagination
        defaultPageSize={defaultPageSize}
        totalItems={totalItems}
        onPageChange={handleChangePage}
      />
    </div>
  );
}

export default ManagerProduct;
