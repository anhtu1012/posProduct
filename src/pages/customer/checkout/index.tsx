import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../../../models/CartItem";
import {
  changeQuantity,
  remove,
  selectCart,
  addToCart,
} from "../../../redux/features/cartSlice";
import "./index.scss";
import { useBroadcastChannel } from "../../../hooks/useBroadcastChannel";
import type { Product } from "../../../models/Product";
import { useEffect, useState } from "react";
import { formatPrice } from "../../../utils/formatPrice";

function Checkout() {
  const navigate = useNavigate();
  const cartItems: CartItem[] = useSelector(selectCart);
  const dispartch = useDispatch();
  const broadCastAddtoCart = useBroadcastChannel<Product>("add-to-cart");
  const [voucherCode, setVoucherCode] = useState<number>(0);

  // Danh sách voucher mẫu
  const vouchers = [
    { code: "", label: "Chọn voucher giảm giá", value: 0 },
    { code: "GIAM10K", label: "Giảm 10 %", value: 10 },
    { code: "GIAM20K", label: "Giảm 20 %", value: 20 },
    { code: "FREESHIP", label: "Giảm 30 % (Freeship)", value: 30 },
  ];

  useEffect(() => {
    if (broadCastAddtoCart.message) {
      console.log(
        "Nhận sản phẩm từ kênh broadcast:",
        broadCastAddtoCart.message
      );
      dispartch(
        addToCart({
          ...broadCastAddtoCart.message,
          discountPercent: voucherCode,
        })
      );
    }
  }, [broadCastAddtoCart.message, dispartch, voucherCode]);

  const updateQuantity = (id: string, quantity: number) => {
    dispartch(changeQuantity({ id, quantity }));
  };
  const removeItem = (id: string) => {
    dispartch(remove({ id }));
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

  const calculateDiscountedPrice = (
    price: number,
    discountPercent?: number
  ) => {
    if (!discountPercent) return price;
    const discount = discountPercent;
    return Math.round(price * (1 - discount / 100));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = calculateDiscountedPrice(
        item.price,
        item.discountPercent
      );
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const calculateTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = calculateDiscountedPrice(
        item.price,
        item.discountPercent
      );
      const discount = (item.price - discountedPrice) * item.quantity;
      return total + discount;
    }, 0);
  };
  const subtotal = calculateSubtotal();
  const totalDiscount = calculateTotalDiscount();
  const shippingFee = subtotal > 200000 ? 0 : 30000; // Miễn phí ship từ 200k
  const tax = Math.round(subtotal * 0.1); // VAT 10%
  const grandTotal = (subtotal + shippingFee + tax) * (voucherCode / 100);

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header" data-aos="fade-up">
          <h1>☕ Thanh toán đơn hàng</h1>
          <p>Kiểm tra lại đơn hàng của bạn trước khi thanh toán</p>
        </div>

        <div className="checkout-content">
          <div className="cart-section" data-aos="fade-right">
            <h2>Giỏ hàng của bạn</h2>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Giỏ hàng trống</p>
              </div>
            ) : (
              <div className="cart-items">
                {cartItems.map((item, index) => {
                  const discountedPrice = calculateDiscountedPrice(
                    item.price,
                    item.discountPercent
                  );

                  return (
                    <div
                      key={item.id}
                      className="cart-item"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="item-info">
                        <div className="item-category">
                          {getCategoryName(item.categoryId)}
                        </div>
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-description">{item.description}</p>

                        <div className="item-price">
                          <span className="current-price">
                            {formatPrice(discountedPrice)}
                          </span>
                          {item.discountPercent && (
                            <>
                              <span className="original-price">
                                {formatPrice(item.price)}
                              </span>
                              <span className="discount-badge">
                                -{item.discountPercent}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="icon" />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <PlusIcon className="icon" />
                          </button>
                        </div>

                        <div className="item-total">
                          {formatPrice(discountedPrice * item.quantity)}
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <TrashIcon className="icon" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="summary-section" data-aos="fade-left">
            <div className="order-summary">
              <h2>Tổng kết đơn hàng</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal + totalDiscount)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="summary-row discount">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(totalDiscount)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Sau giảm giá:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span className={shippingFee === 0 ? "free" : ""}>
                    {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="summary-row">
                  <span>VAT (10%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {/* Voucher select */}
                <div className="voucher-row">
                  <label htmlFor="voucher-select">Mã giảm giá:</label>
                  <select
                    id="voucher-select"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(Number(e.target.value))}
                  >
                    {vouchers.map((v) => (
                      <option key={v.code} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

                {shippingFee > 0 && (
                  <div className="shipping-note">
                    <small>
                      💡 Mua thêm {formatPrice(200000 - subtotal)} để được miễn
                      phí ship!
                    </small>
                  </div>
                )}
              </div>

              <div className="checkout-actions">
                <button
                  className="continue-shopping-btn"
                  onClick={() => navigate("/")}
                >
                  Tiếp tục mua hàng
                </button>
                <button
                  className="checkout-btn"
                  onClick={() =>
                    alert("Tính năng thanh toán đang được phát triển!")
                  }
                >
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
