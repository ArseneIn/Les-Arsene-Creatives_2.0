// Using Dart 3 primary constructors and sealed classes representation format

class DashboardStats {
  final String totalSalesStr;
  final String salesGrowthStr;
  final String stockValueStr;
  final int totalStockItems;
  final String outstandingDebtStr;
  final int pendingDebts;
  final String revenueYieldStr;

  const DashboardStats({
    required this.totalSalesStr,
    required this.salesGrowthStr,
    required this.stockValueStr,
    required this.totalStockItems,
    required this.outstandingDebtStr,
    required this.pendingDebts,
    required this.revenueYieldStr,
  });
}

class Transaction {
  final String id;
  final String customerName;
  final String paymentMethod; // e.g. "Cash", "MoMo"
  final String amountStr;

  const Transaction({
    required this.id,
    required this.customerName,
    required this.paymentMethod,
    required this.amountStr,
  });
}

class InventoryAlert {
  final String itemName;
  final String severityLevel; // e.g. 'Critical'
  final String alertMessage;
  final String imageUrl;

  const InventoryAlert({
    required this.itemName,
    required this.severityLevel,
    required this.alertMessage,
    required this.imageUrl,
  });
}

class InventoryItemSnapshot {
  final String name;
  final String grade;
  final String quantityStr;
  final String statusColor; // 'error', 'emerald', 'secondary'
  final String imageUrl;

  const InventoryItemSnapshot({
    required this.name,
    required this.grade,
    required this.quantityStr,
    required this.statusColor,
    required this.imageUrl,
  });
}
