export interface CartProduct {
  productId: number;
  name: string;
  imgName: string;
  price: number;
  discount?: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

export const CART_KEY = 'octocat-cart';

export function validQuantity(quantity: number): number {
  return Number.isSafeInteger(quantity) && quantity >= 0 ? quantity : 0;
}

export function addItem(items: CartItem[], product: CartProduct, quantity: number): CartItem[] {
  if (validQuantity(quantity) === 0) return items;
  const existing = items.find(item => item.productId === product.productId);
  if (!existing) return [...items, { ...product, quantity }];
  return items.map(item => item.productId === product.productId
    ? { ...product, quantity: item.quantity + quantity }
    : item);
}

export function updateItems(items: CartItem[], quantities: Record<number, number>): CartItem[] {
  return items.flatMap(item => {
    const quantity = quantities[item.productId] ?? item.quantity;
    return validQuantity(quantity) > 0 ? [{ ...item, quantity }] : [];
  });
}

export function readCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.reduce<CartItem[]>((items, value: unknown) => {
      if (!value || typeof value !== 'object') return items;
      const item = value as Partial<CartItem>;
      if (!Number.isSafeInteger(item.productId) || typeof item.name !== 'string' ||
          typeof item.imgName !== 'string' || typeof item.price !== 'number' ||
          !Number.isFinite(item.price) || item.price < 0 ||
          (item.discount !== undefined && (typeof item.discount !== 'number' ||
            !Number.isFinite(item.discount) || item.discount < 0 || item.discount > 1)) ||
          validQuantity(item.quantity as number) === 0) return items;
      return addItem(items, item as CartProduct, item.quantity as number);
    }, []);
  } catch {
    return [];
  }
}

export function unitCents(item: CartProduct): number {
  return Math.round(item.price * (1 - (item.discount || 0)) * 100);
}

export function cartTotals(items: CartItem[], couponApplied: boolean) {
  const subtotal = items.reduce((sum, item) => sum + unitCents(item) * item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const shipping = items.length ? 1000 : 0;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
