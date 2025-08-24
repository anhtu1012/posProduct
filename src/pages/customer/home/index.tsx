import { useEffect, useState } from "react";
import ProductCard from "../../../components/Product/ProductCard";
import type { Product } from "../../../models/Product";
import "./index.scss";
import { getProducts } from "../../../services/customer/home/api";
import ProductListToCategory from "../../../components/Product/ProductListToCategory";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/features/cartSlice";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const dispartch = useDispatch();
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
