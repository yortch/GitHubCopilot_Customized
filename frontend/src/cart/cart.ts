export const CART_STORAGE_KEY = 'octocat-cart-v1';

export interface CartProduct {
  productId: number;
  name: string;
  imgName: string;
  price: number;
  discount?: number;
}

export interface CartItem {
  productId: number;
  name: string;
  imgName: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  coupon: 'SAVE5' | null;
}

export class CartValidationError extends Error {}

export function emptyCart(): Cart {
  return { items: [], coupon: null };
}

export function isValidQuantity(quantity: number): boolean {
  return Number.isSafeInteger(quantity) && quantity > 0;
}

export function parseQuantity(value: string): number | null {
  const quantity = Number(value);
  return /^\d+$/.test(value) && isValidQuantity(quantity) ? quantity : null;
}

function isMoney(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function getUnitPriceCents(product: Pick<CartProduct, 'price' | 'discount'>): number {
  const discount = product.discount ?? 0;
  if (!Number.isFinite(product.price) || product.price < 0 ||
      !Number.isFinite(discount) || discount < 0 || discount > 1) {
    throw new CartValidationError('This product has an invalid price and cannot be added to the cart.');
  }
  const cents = Math.round((product.price * (1 - discount) + Number.EPSILON) * 100);
  if (!isMoney(cents)) {
    throw new CartValidationError('This product price is too large to calculate safely.');
  }
  return cents;
}

export function getCartTotals(cart: Cart) {
  let subtotal = 0;
  let quantity = 0;
  for (const item of cart.items) {
    const lineTotal = item.unitPriceCents * item.quantity;
    subtotal += lineTotal;
    quantity += item.quantity;
    if (!isMoney(lineTotal) || !isMoney(subtotal) || !Number.isSafeInteger(quantity)) {
      throw new CartValidationError('These quantities make the cart too large to calculate safely. Reduce the quantities.');
    }
  }
  const discount = cart.coupon === 'SAVE5' ? Math.round(subtotal / 20) : 0;
  const shipping = cart.items.length ? 1000 : 0;
  const grandTotal = subtotal - discount + shipping;
  if (!isMoney(grandTotal)) {
    throw new CartValidationError('This cart total is too large to calculate safely. Reduce the quantities.');
  }
  return { subtotal, discount, shipping, grandTotal, quantity };
}

function validateCart(cart: Cart): Cart {
  getCartTotals(cart);
  return cart;
}

export function addCartItem(cart: Cart, product: CartProduct, quantity: number): Cart {
  if (!isValidQuantity(quantity)) {
    throw new CartValidationError('Enter a positive whole-number quantity.');
  }
  const unitPriceCents = getUnitPriceCents(product);
  const existing = cart.items.find(item => item.productId === product.productId);
  const mergedQuantity = (existing?.quantity ?? 0) + quantity;
  if (!isValidQuantity(mergedQuantity)) {
    throw new CartValidationError('This quantity is too large. Enter a smaller whole number.');
  }
  const item: CartItem = {
    productId: product.productId, name: product.name, imgName: product.imgName,
    unitPriceCents, quantity: mergedQuantity,
  };
  return validateCart({
    ...cart,
    items: existing
      ? cart.items.map(current => current.productId === product.productId ? item : current)
      : [...cart.items, item],
  });
}

export function updateCartQuantities(cart: Cart, quantities: Record<number, number>): Cart {
  const items = cart.items.map(item => {
    const quantity = quantities[item.productId];
    if (!isValidQuantity(quantity)) {
      throw new CartValidationError(`Enter a positive whole-number quantity for ${item.name}.`);
    }
    return { ...item, quantity };
  });
  return validateCart({ ...cart, items });
}

export function removeCartItem(cart: Cart, productId: number): Cart {
  const items = cart.items.filter(item => item.productId !== productId);
  return { items, coupon: items.length ? cart.coupon : null };
}

export function applyCartCoupon(cart: Cart, code: string): Cart {
  if (code !== 'SAVE5') {
    throw new CartValidationError(code === '' ? 'Enter a coupon code.' : 'Unsupported coupon code. Use SAVE5 for 5% off.');
  }
  return validateCart({ ...cart, coupon: 'SAVE5' });
}

export function readCart(value: string): Cart {
  const parsed: unknown = JSON.parse(value);
  if (typeof parsed !== 'object' || parsed === null ||
      !('version' in parsed) || parsed.version !== 1 ||
      !('items' in parsed) || !Array.isArray(parsed.items) ||
      !('coupon' in parsed) || (parsed.coupon !== null && parsed.coupon !== 'SAVE5')) {
    throw new CartValidationError('Invalid saved cart format.');
  }
  const ids = new Set<number>();
  const items: CartItem[] = parsed.items.map((item: unknown) => {
    if (typeof item !== 'object' || item === null ||
        !('productId' in item) || typeof item.productId !== 'number' || !Number.isSafeInteger(item.productId) ||
        !('name' in item) || typeof item.name !== 'string' || !item.name.trim() ||
        !('imgName' in item) || typeof item.imgName !== 'string' ||
        !('unitPriceCents' in item) || !isMoney(item.unitPriceCents) ||
        !('quantity' in item) || typeof item.quantity !== 'number' || !isValidQuantity(item.quantity) ||
        ids.has(item.productId)) {
      throw new CartValidationError('Invalid saved cart item.');
    }
    ids.add(item.productId);
    return {
      productId: item.productId, name: item.name, imgName: item.imgName,
      unitPriceCents: item.unitPriceCents, quantity: item.quantity,
    };
  });
  return validateCart({ items, coupon: parsed.coupon });
}

export function writeCart(cart: Cart): string {
  return JSON.stringify({ version: 1, ...cart });
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export function formatMoney(cents: number): string {
  return usd.format(cents / 100);
}
