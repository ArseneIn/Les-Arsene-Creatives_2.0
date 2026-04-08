import 'package:flutter/material.dart';

class InventorySummary {
  final String totalValueStr;
  final int activeBatches;
  final String avgProfitabilityStr;
  final String stockHealth;

  const InventorySummary({
    required this.totalValueStr,
    required this.activeBatches,
    required this.avgProfitabilityStr,
    required this.stockHealth,
  });
}

class BatchPerformance {
  final String id;
  final String name;
  final String batchId;
  final String status; // 'In Progress', 'Low Margin', 'New'
  final Color statusBgColor;
  final Color statusTextColor;
  final double revenue;
  final double maxRevenue;
  final String revenueStr;
  final String maxRevenueStr;
  final double yieldPercentage;
  final String estimatedProfitStr;
  final IconData displayIcon;

  const BatchPerformance({
    required this.id,
    required this.name,
    required this.batchId,
    required this.status,
    required this.statusBgColor,
    required this.statusTextColor,
    required this.revenue,
    required this.maxRevenue,
    required this.revenueStr,
    required this.maxRevenueStr,
    required this.yieldPercentage,
    required this.estimatedProfitStr,
    required this.displayIcon,
  });

  double get progressFraction => (maxRevenue > 0) ? (revenue / maxRevenue).clamp(0.0, 1.0) : 0.0;
}
