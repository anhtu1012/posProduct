import { useContext, useEffect, useState } from "react";
import { getProducts } from "../../../services/customer/home/api";
import type { Product } from "../../../types/Product";
import DisplayCount from "./DisplayCount";
import { CounterContext } from "../../../components/layout/CounterContext";

function DemoHook() {
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<Product[]>([]);
  const context = useContext(CounterContext);

  const fetchProducts = async () => {
    try {
      console.log("tao đã bị gọi rồi");
      const res = await getProducts();
      console.log(res);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleClick = async () => {
    await Promise.all([
      Promise.resolve(setCount(count + 1)),
      Promise.resolve(context?.setCount(count + 1)),
      Promise.resolve(
        setData((prevData) => {
          if (prevData.length > 0) {
            const updatedData = prevData.map((product) => ({
              ...product,
              price: product.price + 500,
            }));
            return updatedData;
          }
          return prevData;
        })
      ),
    ]);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginTop: "200px",
        flexDirection: "column",
      }}
    >
      <p style={{ fontSize: "24px", margin: "20px 0" }}>
        Bạn đã nhấn {count} lần
      </p>
      <DisplayCount
        countNe={100}
        shipperTien={(newCount) => {
          console.log(newCount);
        }}
      />
      <button
        style={{ fontSize: "20px", padding: "10px 20px" }}
        onClick={handleClick}
      >
        Nhấn tôi
      </button>
      <button
        style={{ fontSize: "20px", padding: "10px 20px", marginTop: "10px" }}
        onClick={() => setCount(0)}
      >
        reset
      </button>

      {data.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3 style={{ fontSize: "20px" }}>Danh sách sản phẩm:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {data.map((product) => (
              <li
                key={product.id}
                style={{ margin: "10px 0", fontSize: "18px" }}
              >
                {product.name} - {product.price} VND
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DemoHook;
