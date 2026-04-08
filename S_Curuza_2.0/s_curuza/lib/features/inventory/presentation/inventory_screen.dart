import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'providers/inventory_providers.dart';
import '../domain/models.dart';

class InventoryScreen extends ConsumerWidget {
  const InventoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: const SafeArea(
        child: Column(
          children: [
            _InventoryHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _SummaryBento(),
                    SizedBox(height: 32),
                    _YieldTrackingSection(),
                    SizedBox(height: 96), // Extra bottom padding for nav bar overlay
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InventoryHeader extends StatelessWidget {
  const _InventoryHeader();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      color: const Color(0xFFF8F9FB),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              if (MediaQuery.of(context).size.width < 768)
                const Padding(
                  padding: EdgeInsets.only(right: 16),
                  child: Icon(Icons.menu, color: Color(0xFF0B0C0C)),
                ),
              const Text(
                'Yield Tracking',
                style: TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Manrope', fontSize: 18, color: Color(0xFF0B0C0C), letterSpacing: -0.5),
              ),
            ],
          ),
          Row(
            children: [
              if (MediaQuery.of(context).size.width >= 600)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: const Color(0xFFDFE2EA), borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFFF0C128), shape: BoxShape.circle)),
                      const SizedBox(width: 8),
                      const Text('Online Status', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF181C21))),
                    ],
                  ),
                ),
              const SizedBox(width: 24),
              const Icon(Icons.notifications, color: Color(0xFF747878)),
            ],
          ),
        ],
      ),
    );
  }
}

class _SummaryBento extends ConsumerWidget {
  const _SummaryBento();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summary = ref.watch(dummyInventorySummaryProvider);
    final isDesktop = MediaQuery.of(context).size.width >= 1024;

    Widget mainSummaryCard = Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: const Color(0xFF0B0C0C).withValues(alpha: 0.04), blurRadius: 32, offset: const Offset(0, 12)),
        ],
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            top: -50,
            right: -50,
            child: Container(
              width: 256,
              height: 256,
              decoration: BoxDecoration(
                color: const Color(0xFFFDE336).withValues(alpha: 0.05),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'TOTAL INVENTORY VALUE',
                style: TextStyle(color: Color(0xFF444747), fontSize: 14, letterSpacing: 2, fontWeight: FontWeight.bold, fontFamily: 'Inter'),
              ),
              const SizedBox(height: 8),
              Text(
                summary.totalValueStr,
                style: const TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w800, fontSize: 36, color: Color(0xFF000000)),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _MiniStat(label: 'Active Batches', value: '${summary.activeBatches}'),
                  _MiniStat(label: 'Avg. Profitability', value: summary.avgProfitabilityStr, valueColor: const Color(0xFF22C55E)),
                  if (MediaQuery.of(context).size.width > 400)
                    _MiniStat(label: 'Stock Health', value: summary.stockHealth),
                ],
              ),
            ],
          ),
        ],
      ),
    );

    Widget createBatchCard = Container(
      height: isDesktop ? null : 140,
      decoration: BoxDecoration(
        gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFFFBE134), Color(0xFFF0C128)]),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(24),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(Icons.add_circle, size: 36, color: Color(0xFF201C00)),
          Text('Create New Batch', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w800, fontSize: 18, color: Color(0xFF201C00))),
        ],
      ),
    );

    Widget adjustStockCard = Container(
      height: isDesktop ? null : 140,
      decoration: BoxDecoration(
        color: const Color(0xFFE1E2E4),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(24),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(Icons.tune, size: 36, color: Color(0xFF191C1E)),
          Text('Adjust Stock', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w800, fontSize: 18, color: Color(0xFF191C1E))),
        ],
      ),
    );

    if (isDesktop) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(flex: 8, child: mainSummaryCard),
          const SizedBox(width: 24),
          Expanded(
            flex: 4,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(child: createBatchCard),
                const SizedBox(height: 16),
                Expanded(child: adjustStockCard),
              ],
            ),
          ),
        ],
      );
    } else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          mainSummaryCard,
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(child: createBatchCard),
              const SizedBox(width: 16),
              Expanded(child: adjustStockCard),
            ],
          ),
        ],
      );
    }
  }
}

class _MiniStat extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _MiniStat({required this.label, required this.value, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF444747), fontSize: 12)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 20, color: valueColor ?? const Color(0xFF191C1E))),
      ],
    );
  }
}

class _YieldTrackingSection extends ConsumerWidget {
  const _YieldTrackingSection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    var batches = ref.watch(dummyBatchPerformancesProvider);

    // Limit to 3 items to fit with featured data card effectively
    if (batches.length > 3) batches = batches.sublist(0, 3);

    final List<Widget> gridItems = <Widget>[
      ...batches.map<Widget>((b) => _BatchCard(batch: b)),
      const _FeaturedDataCard(),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Batch Performance', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w800, fontSize: 24, color: Color(0xFF191C1E))),
                const SizedBox(height: 4),
                const Text('Tracking real-time revenue vs expected targets', style: TextStyle(color: Color(0xFF444747), fontSize: 14)),
              ],
            ),
            Row(
              children: [
                const Text('View All', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF000000))),
                const SizedBox(width: 4),
                const Icon(Icons.arrow_forward_ios, size: 14, color: Color(0xFF000000)),
              ],
            )
          ],
        ),
        const SizedBox(height: 24),
        LayoutBuilder(builder: (context, constraints) {
          final isDesktop = constraints.maxWidth >= 768;
          if (!isDesktop) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (var i = 0; i < gridItems.length; i++) ...[
                  gridItems[i],
                  if (i != gridItems.length - 1) const SizedBox(height: 24),
                ]
              ],
            );
          }
          return GridView.count(
            crossAxisCount: isDesktop ? 2 : 1,
            crossAxisSpacing: 24,
            mainAxisSpacing: 24,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: isDesktop ? 1.4 : 1.2,
            children: gridItems,
          );
        }),
      ],
    );
  }
}

class _BatchCard extends StatelessWidget {
  final BatchPerformance batch;

  const _BatchCard({required this.batch});

  @override
  Widget build(BuildContext context) {
    Color yieldColor = const Color(0xFF191C1E);
    if (batch.yieldPercentage >= 80) yieldColor = const Color(0xFF22C55E);
    if (batch.yieldPercentage < 50) yieldColor = const Color(0xFFBA1A1A);

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 24, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(12)),
                    child: Icon(batch.displayIcon, color: const Color(0xFF444747)),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(batch.name, style: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Manrope', fontSize: 16, color: Color(0xFF191C1E))),
                      Text('Batch ID: ${batch.batchId}', style: const TextStyle(color: Color(0xFF444747), fontSize: 12)),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(color: batch.statusBgColor, borderRadius: BorderRadius.circular(20)),
                child: Text(
                  batch.status.toUpperCase(),
                  style: TextStyle(color: batch.statusTextColor, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: -0.5),
                ),
              ),
            ],
          ),
          // Progress bar
          Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Revenue Progress', style: TextStyle(color: Color(0xFF444747), fontSize: 14, fontWeight: FontWeight.w500)),
                  Text('${batch.revenueStr} / ${batch.maxRevenueStr}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF000000))),
                ],
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: batch.progressFraction,
                backgroundColor: const Color(0xFFF3F4F6),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFF0C128)),
                minHeight: 12,
                borderRadius: BorderRadius.circular(6),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('YIELD %', style: TextStyle(color: Color(0xFF444747), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                      Text('${batch.yieldPercentage}%', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: yieldColor)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text('EST. PROFIT', style: TextStyle(color: Color(0xFF444747), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                      Text(batch.estimatedProfitStr, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Color(0xFF191C1E))),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _FeaturedDataCard extends StatelessWidget {
  const _FeaturedDataCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF000000), // primary
        borderRadius: BorderRadius.circular(16),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            top: -24,
            right: -24,
            child: Icon(Icons.trending_up, size: 150, color: Colors.white.withValues(alpha: 0.1)),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Quarterly Yield Forecast', style: TextStyle(color: Color(0xFFFDE336), fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 20)),
                  const SizedBox(height: 8),
                  Text(
                    'Your current inventory rotation is 12% faster than last month. Projected revenue for Q3 is on track to exceed targets by \$22,000.',
                    style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 14, height: 1.5),
                  ),
                ],
              ),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 80,
                      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('+14%', style: TextStyle(color: Colors.white, fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 24)),
                          Text('GROWTH', style: TextStyle(color: Colors.white60, fontSize: 10, fontWeight: FontWeight.w600, letterSpacing: -0.5)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Container(
                      height: 80,
                      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('0.4%', style: TextStyle(color: Colors.white, fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 24)),
                          Text('LOSS RATE', style: TextStyle(color: Colors.white60, fontSize: 10, fontWeight: FontWeight.w600, letterSpacing: -0.5)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
