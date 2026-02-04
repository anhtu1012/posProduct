import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../footer";
import Header from "../header";
import { CounterContext } from "./CounterContext.tsx";

function Layout() {
  const [count, setCount] = useState<number>(0);

  return (
    <div style={{ overflow: "hidden" }}>
      <Header />
      <CounterContext.Provider value={{ count, setCount }}>
        <div style={{ marginTop: "80px" }}>
          <Outlet />
        </div>
      </CounterContext.Provider>
      <Footer />
    </div>
  );
}

export default Layout;
