import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import ProductListToCategory from "../../../components/Product/ProductListToCategory";
import { useBroadcastChannel } from "../../../hooks/useBroadcastChannel";
import useSocket from "../../../hooks/useSocket";
import type { Product } from "../../../models/Product";
import { addToCart } from "../../../redux/features/cartSlice";
import "./index.scss";

function Home() {
  const dispartch = useDispatch();
  const broadCastAddtoCart = useBroadcastChannel<Product>("add-to-cart");
  const socket = useSocket();

  useEffect(() => {
    const handleGetProducts = (data: Product[]) => {
      console.log("Received products via socket:", data);
      // setProducts(data);
    };
    socket.on("PRODUCT_KEY", handleGetProducts);
  }, [socket, socket.connected]);

  console.log("Socket ID:", socket);

  const handleSendMessage = useCallback(
    (product: Product) => {
      broadCastAddtoCart.sendMessage(product);
    },
    [broadCastAddtoCart]
  );

  const handleAddToCart = (product: Product) => {
    console.log("Thêm vào giỏ hàng:", product);
    handleSendMessage(product);
    dispartch(addToCart(product));
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content" data-aos="fade-up">
          <h1>☕ Thưởng thức hương vị cafe tuyệt là vời</h1>
          <p>
            Khám phá menu đa dạng từ cafe truyền thống đến các loại đồ uống hiện
            đại
          </p>
          <button
            className="cta-button"
            onClick={() => {
              const productsSection =
                document.getElementById("products-section");
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Xem menu ngay
          </button>
        </div>
      </section>

      <section id="products-section" className="products-section">
        <ProductListToCategory
          category="isBestSeller"
          title="Những sản phẩm nổi bật"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
      <section>
        <ProductListToCategory
          category="1"
          title="Cafe đặc biệt"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
      <section>
        <ProductListToCategory
          category="2"
          title="Cafe Máy"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
      <section>
        <ProductListToCategory
          category="3"
          title="Cafe Đá Xay"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
      <section>
        <ProductListToCategory
          category="4"
          title="Trà đặc biệt"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
      <section>
        <ProductListToCategory
          category="5"
          title="Special Drinks đặc biệt"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
      <section>
        <ProductListToCategory
          category="6"
          title="Nước ép - Sinh tố"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
      <section>
        <ProductListToCategory
          category="7"
          title="Trà Sữa"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
      <section>
        <ProductListToCategory
          category="8"
          title="Nước Ngọt - Giải Khát"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
    </div>
  );
}

export default Home;
