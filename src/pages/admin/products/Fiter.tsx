/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import "./filter.scss";

interface FilterProps {
  onSearch?: (value: FilterForm) => void;
}
export interface FilterForm {
  name: string;
  isActive: string[];
  price: number;
  view: boolean;
}
export interface FilterRef {
  getFrorm: () => FilterForm;
}

const Filter = forwardRef<FilterRef, FilterProps>(({ onSearch }, ref) => {
  const [form] = Form.useForm();
  const handleSubmit = (value: FilterForm) => {
    if (typeof onSearch === "function") {
      onSearch(value);
    }
  };
  useImperativeHandle(ref, () => ({
    getFrorm: () => form.getFieldsValue(),
  }));
  return (
    <div>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ isActive: ["all", "yes", "no"] }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="name"
              //   label="Tên sản phẩm"
              className="filter-item"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input className="filter-input" placeholder="Nhập tên sản phẩm" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name="isActive"
              //   label="Trạng thái"
              className="filter-item"
            >
              <Checkbox.Group
                className="filter-input"
                options={[
                  { label: "Tất cả", value: "all" },
                  { label: "Có", value: "yes" },
                  { label: "Không", value: "no" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="price"
              //   label="Giá tối thiểu"
              className="filter-item"
            >
              <Input
                type="number"
                className="filter-input"
                placeholder="Nhập giá tối thiểu"
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Button htmlType="submit">Tim kiếm</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

Filter.displayName = "Filter";
export default Filter;
