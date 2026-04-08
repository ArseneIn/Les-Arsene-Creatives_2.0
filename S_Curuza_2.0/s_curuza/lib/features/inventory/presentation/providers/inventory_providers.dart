import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/models.dart';

part 'inventory_providers.g.dart';

@riverpod
InventorySummary dummyInventorySummary(Ref ref) {
  return const InventorySummary(
    totalValueStr: '\$142,850.00',
    activeBatches: 24,
    avgProfitabilityStr: '82%',
    stockHealth: 'Excellent',
  );
}

@riverpod
List<BatchPerformance> dummyBatchPerformances(Ref ref) {
  return const [
    BatchPerformance(
      id: 'b1',
      name: 'Maize Flour 50kg Sack',
      batchId: '#MF-2023-004',
      status: 'In Progress',
      statusBgColor: Color(0xFFDFE2EA), // secondary-container
      statusTextColor: Color(0xFF61646B), // on-secondary-container
      revenue: 12400,
      maxRevenue: 15000,
      revenueStr: '\$12,400',
      maxRevenueStr: '\$15,000',
      yieldPercentage: 82.6,
      estimatedProfitStr: '\$3,200.00',
      displayIcon: Icons.bakery_dining,
    ),
    BatchPerformance(
      id: 'b2',
      name: 'Premium Basmati Rice',
      batchId: '#BR-2023-012',
      status: 'Low Margin',
      statusBgColor: Color(0xFFFFDAD6), 
      statusTextColor: Color(0xFF93000A), 
      revenue: 8100,
      maxRevenue: 18500,
      revenueStr: '\$8,100',
      maxRevenueStr: '\$18,500',
      yieldPercentage: 43.8,
      estimatedProfitStr: '\$1,150.00',
      displayIcon: Icons.agriculture,
    ),
    BatchPerformance(
      id: 'b3',
      name: 'Organic Poultry Batch A',
      batchId: '#PB-2024-001',
      status: 'New',
      statusBgColor: Color(0xFFE1E2E4), 
      statusTextColor: Color(0xFF191C1E), 
      revenue: 2500,
      maxRevenue: 22000,
      revenueStr: '\$2,500',
      maxRevenueStr: '\$22,000',
      yieldPercentage: 11.3,
      estimatedProfitStr: '\$5,400.00',
      displayIcon: Icons.egg,
    ),
  ];
}
