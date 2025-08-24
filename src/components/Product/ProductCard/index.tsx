import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import "./ProductCard.scss";
import type { Product } from "../../../models/Product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseInt(price);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numPrice);
  };

  const calculateOriginalPrice = (price: string, discountPercent?: string) => {
    if (!discountPercent) return null;
    const numPrice = parseInt(price);
    const discount = parseInt(discountPercent);
    const originalPrice = Math.round(numPrice / (1 - discount / 100));
    return originalPrice;
  };

  const getCategoryName = (categoryId: string) => {
    const categoryMap: { [key: string]: string } = {
      cafe_viet: "Cafe Việt",
      cafe_may: "Cafe Máy",
      cafe_da_xay: "Cafe Đá Xay",
      tra: "Trà",
      special_drinks: "Special Drinks",
      nuoc_ep: "Nước ép - Sinh tố",
      tra_sua: "Trà Sữa",
      nuoc_ngot: "Nước Ngọt - Giải Khát",
    };
    return categoryMap[categoryId] || categoryId;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  const originalPrice = calculateOriginalPrice(
    product.price,
    product.discountPercent
  );

  return (
    <div className="product-card">
      {product.discountPercent && (
        <div className="discount-badge">-{product.discountPercent}%</div>
      )}

      <button
        className={`like-button ${isLiked ? "liked" : ""}`}
        onClick={() => setIsLiked(!isLiked)}
      >
        {isLiked ? (
          <HeartSolidIcon className="heart-icon" />
        ) : (
          <HeartIcon className="heart-icon" />
        )}
      </button>

      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <div className="product-category">
          {getCategoryName(product.categoryId)}
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="rating-text">({product.reviews})</span>
        </div>

        <div className="price-section">
          <div className="current-price">{formatPrice(product.price)}</div>
          {originalPrice && (
            <div className="original-price">
              {formatPrice(originalPrice.toString())}
            </div>
          )}
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <ShoppingCartIcon className="cart-icon" />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
