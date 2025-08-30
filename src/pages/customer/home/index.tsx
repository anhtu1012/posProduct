import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProductCard from "../../../components/Product/ProductCard";
import ProductListToCategory from "../../../components/Product/ProductListToCategory";
import { useBroadcastChannel } from "../../../hooks/useBroadcastChannel";
import useSocket from "../../../hooks/useSocket";
import type { Product } from "../../../models/Product";
import { addToCart } from "../../../redux/features/cartSlice";
import { getProducts } from "../../../services/customer/home/api";
import "./index.scss";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
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

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

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
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Menu đặc biệt</h2>
            <p>Những thức uống được yêu thích nhất tại CafeShop</p>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={product.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <ProductListToCategory
          category="cafe_viet"
          title="Cafe đặc biệt"
          showTitle={true}
          onAddToCart={handleAddToCart}
        />
      </section>
    </div>
  );
}

export default Home;
