import { useContext } from "react";
import { CounterContext } from "../../../components/layout/CounterContext";

interface DisplayCountProps {
  countNe: number;
  shipperTien: (newCount: number) => void;
}

const DisplayCount = ({ countNe, shipperTien }: DisplayCountProps) => {
  const context = useContext(CounterContext);
  if (!context) return null;
  const { count } = context;

  return (
    <>
      <p style={{ fontSize: "20px" }}>Count từ Context: {count}</p>
      <p style={{ fontSize: "20px" }}>Count từ Props: {countNe}</p>
      <button
        style={{ fontSize: "20px", padding: "10px 20px" }}
        onClick={() => {
          if (shipperTien) {
            shipperTien(2000);
          }
        }}
      >
        Nhấn tôi của prop
      </button>
    </>
  );
};

export default DisplayCount;
