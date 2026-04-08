class PosProduct {
  final String id;
  final String title;
  final String category;
  final String sku;
  final String priceStr;
  final String stockStatus;
  final String imageUrl;

  const PosProduct({
    required this.id,
    required this.title,
    required this.category,
    required this.sku,
    required this.priceStr,
    required this.stockStatus,
    required this.imageUrl,
  });
}

class CartItem {
  final String productId;
  final String title;
  final String pricePerUnitStr;
  final int quantity;
  final String imageUrl;

  const CartItem({
    required this.productId,
    required this.title,
    required this.pricePerUnitStr,
    required this.quantity,
    required this.imageUrl,
  });
}

class OrderSummary {
  final String subtotalStr;
  final String vatStr;
  final String totalStr;

  const OrderSummary({
    required this.subtotalStr,
    required this.vatStr,
    required this.totalStr,
  });
}
