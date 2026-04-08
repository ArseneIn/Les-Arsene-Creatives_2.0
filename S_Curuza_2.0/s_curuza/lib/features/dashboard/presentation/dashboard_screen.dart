import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'providers/dashboard_providers.dart';

class MerchantDashboardScreen extends ConsumerWidget {
  const MerchantDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDesktop = MediaQuery.of(context).size.width >= 1024;
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 24.0, right: 8.0),
        child: Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFFBE134), Color(0xFFF0C128)],
            ),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.15),
                blurRadius: 15,
                offset: const Offset(0, 8),
              )
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {},
              customBorder: const CircleBorder(),
              child: const Icon(Icons.add, size: 32, color: Color(0xFF201C00)),
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            const _DashboardHeader(),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  const _KpiGrid(),
                  const SizedBox(height: 32),
                  if (isDesktop)
                    const Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(flex: 8, child: _RecentTransactions()),
                        SizedBox(width: 32),
                        Expanded(flex: 4, child: _AlertsAndStock()),
                      ],
                    )
                  else ...[
                    const _RecentTransactions(),
                    const SizedBox(height: 32),
                    const _AlertsAndStock(),
                  ],
                  const SizedBox(height: 120), // Bottom padding for FAB and Nav Bar
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardHeader extends StatelessWidget {
  const _DashboardHeader();

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      pinned: true,
      backgroundColor: const Color(0xFFF8F9FB),
      surfaceTintColor: Colors.transparent,
      titleSpacing: 24,
      title: Row(
        children: [
          const Text(
            'The Gold Corner',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontFamily: 'Manrope',
              fontSize: 24,
              color: Color(0xFF0B0C0C),
              letterSpacing: -0.5,
            ),
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFDFE2EA),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Color(0xFF10B981), // emerald-500
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  'Online',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF181C21)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Color(0xFF191C1E)),
            onPressed: () {},
            style: IconButton.styleFrom(backgroundColor: Colors.transparent),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.search, color: Color(0xFF191C1E)),
            onPressed: () {},
            style: IconButton.styleFrom(backgroundColor: Colors.transparent),
          ),
        ],
      ),
    );
  }
}

class _KpiGrid extends ConsumerWidget {
  const _KpiGrid();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stats = ref.watch(dummyDashboardStatsProvider);
    final isDesktop = MediaQuery.of(context).size.width >= 1024;
    final isTablet = MediaQuery.of(context).size.width >= 768 && !isDesktop;

    final items = [
      _KpiCard(
        icon: Icons.trending_up,
        iconBg: const Color(0xFFFFF7C2),
        iconColor: const Color(0xFF514700),
        title: 'Total Sales',
        value: stats.totalSalesStr, // UGX 4.2M
        badgeText: stats.salesGrowthStr, // +12.4%
        badgeColor: const Color(0xFF059669), // emerald-600
        isHoverable: true,
      ),
      _KpiCard(
        icon: Icons.inventory,
        iconBg: const Color(0xFFDFE2EA),
        iconColor: const Color(0xFF5B5F65),
        title: 'Stock Value',
        value: stats.stockValueStr,
        badgeText: '${stats.totalStockItems} items',
        badgeColor: const Color(0xFF5B5F65),
        isHoverable: true,
      ),
      _KpiCard(
        icon: Icons.account_balance_wallet,
        iconBg: const Color(0xFFFFDAD6),
        iconColor: const Color(0xFFBA1A1A),
        title: 'Outstanding Debt',
        value: stats.outstandingDebtStr,
        badgeText: '${stats.pendingDebts} Pending',
        badgeColor: const Color(0xFFBA1A1A),
        isHoverable: true,
      ),
      _KpiCard(
        icon: Icons.analytics,
        iconBg: const Color(0xFFFDE336), 
        iconColor: const Color(0xFF201C00), 
        title: 'Revenue Yield',
        value: stats.revenueYieldStr,
        badgeText: 'Monthly',
        badgeColor: const Color(0xFF444747),
        isHoverable: true,
      ),
    ];

    if (!isDesktop && !isTablet) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (var i = 0; i < items.length; i++) ...[
            items[i],
            if (i != items.length - 1) const SizedBox(height: 16),
          ]
        ],
      );
    }

    return GridView.count(
      shrinkWrap: true,
      crossAxisCount: isDesktop ? 4 : 2,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 24,
      crossAxisSpacing: 24,
      childAspectRatio: 1.4,
      children: items,
    );
  }
}

class _KpiCard extends StatelessWidget {
  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String title;
  final String value;
  final String badgeText;
  final Color badgeColor;
  final bool isHoverable;

  const _KpiCard({
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.title,
    required this.value,
    required this.badgeText,
    required this.badgeColor,
    this.isHoverable = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.transparent), // hover border #fde336 
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(8)),
                child: Icon(icon, color: iconColor, size: 24),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  badgeText, 
                  textAlign: TextAlign.right,
                  style: TextStyle(color: badgeColor, fontWeight: FontWeight.bold, fontSize: 12),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: Color(0xFF5B5F65), fontSize: 14, fontWeight: FontWeight.w500)),
              const SizedBox(height: 4),
              Text(value, style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w900, color: Color(0xFF191C1E), letterSpacing: -0.5)),
            ],
          )
        ],
      ),
    );
  }
}

class _RecentTransactions extends ConsumerWidget {
  const _RecentTransactions();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final transactions = ref.watch(dummyRecentTransactionsProvider);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 24.0),
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6).withValues(alpha: 0.5),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Recent Transactions', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF191C1E))),
                TextButton(
                  onPressed: () {},
                  child: const Text('View All', style: TextStyle(color: Color(0xFF514700), fontWeight: FontWeight.bold, fontSize: 14)),
                )
              ],
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingRowColor: WidgetStateProperty.all(Colors.transparent),
              dividerThickness: 1,
              headingTextStyle: const TextStyle(color: Color(0xFF5B5F65), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5),
              dataTextStyle: const TextStyle(color: Color(0xFF191C1E), fontSize: 14),
              columns: const [
                DataColumn(label: Padding(padding: EdgeInsets.only(left: 16), child: Text('TRANSACTION ID'))),
                DataColumn(label: Text('CUSTOMER')),
                DataColumn(label: Text('PAYMENT')),
                DataColumn(label: Text('AMOUNT'), numeric: true),
              ],
              rows: transactions.map((t) {
                final isCash = t.paymentMethod == 'Cash';
                return DataRow(cells: [
                  DataCell(Padding(padding: const EdgeInsets.only(left: 16), child: Text(t.id, style: const TextStyle(fontWeight: FontWeight.w500)))),
                  DataCell(Text(t.customerName, style: const TextStyle(color: Color(0xFF5B5F65)))),
                  DataCell(
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: isCash ? const Color(0xFFD1FAE5) : const Color(0xFF2563EB),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (isCash)
                            Container(width: 6, height: 6, margin: const EdgeInsets.only(right: 6), decoration: const BoxDecoration(color: Color(0xFF059669), shape: BoxShape.circle))
                          else
                            const Padding(padding: EdgeInsets.only(right: 4), child: Icon(Icons.smartphone, size: 12, color: Colors.white)),
                          Text(
                            isCash ? 'CASH' : 'MOMO',
                            style: TextStyle(
                              color: isCash ? const Color(0xFF047857) : Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  DataCell(Padding(padding: const EdgeInsets.only(right: 16), child: Text(t.amountStr, style: const TextStyle(fontWeight: FontWeight.w900)))),
                ]);
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _AlertsAndStock extends ConsumerWidget {
  const _AlertsAndStock();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alerts = ref.watch(dummyInventoryAlertsProvider);
    final stock = ref.watch(dummyInventorySnapshotProvider);

    return Column(
      children: [
        // Low Stock Alerts
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFFFFDAD6).withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFBA1A1A).withValues(alpha: 0.1)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.warning, color: Color(0xFFBA1A1A)),
                  SizedBox(width: 12),
                  Text('Critical Alerts', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF93000A))),
                ],
              ),
              const SizedBox(height: 16),
              ...alerts.map((a) => Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: const Border(left: BorderSide(color: Color(0xFFBA1A1A), width: 4)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        )
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(a.itemName, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF191C1E))),
                            const SizedBox(height: 2),
                            Text(a.alertMessage, style: const TextStyle(color: Color(0xFFBA1A1A), fontSize: 12, fontWeight: FontWeight.w600)),
                          ],
                        ),
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFBA1A1A),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.add_shopping_cart, size: 20),
                            color: Colors.white,
                          ),
                        )
                      ],
                    ),
                  ))
            ],
          ),
        ),
        const SizedBox(height: 24),
        // Inventory Pulse
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.02),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Inventory Pulse', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF191C1E))),
              const SizedBox(height: 16),
              ...stock.map((item) {
                Color countColor = const Color(0xFF5B5F65);
                if (item.statusColor == 'error') countColor = const Color(0xFFBA1A1A);
                if (item.statusColor == 'emerald') countColor = const Color(0xFF059669);

                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              item.imageUrl, 
                              width: 40, height: 40, 
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[300], width: 40, height: 40),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                              Text(item.grade, style: const TextStyle(fontSize: 10, color: Color(0xFF5B5F65))),
                            ],
                          )
                        ],
                      ),
                      Text(item.quantityStr, style: TextStyle(fontWeight: FontWeight.w900, color: countColor, fontSize: 14)),
                    ],
                  ),
                );
              })
            ],
          ),
        ),
      ],
    );
  }
}
