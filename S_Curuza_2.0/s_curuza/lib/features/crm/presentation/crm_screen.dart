import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/models.dart';
import 'providers/crm_providers.dart';

class CrmScreen extends ConsumerWidget {
  const CrmScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: const SafeArea(
        child: Column(
          children: [
            _CrmHeader(),
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _CrmKpiGrid(),
                      SizedBox(height: 32),
                      _CustomerDirectorySection(),
                      SizedBox(height: 96), // Extra bottom padding for nav bar overlay
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CrmHeader extends StatelessWidget {
  const _CrmHeader();

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      color: const Color(0xFFF8F9FB),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              if (isMobile)
                const Padding(
                  padding: EdgeInsets.only(right: 16),
                  child: Icon(Icons.menu, color: Color(0xFF0B0C0C)),
                ),
              const Text(
                'Madeni CRM',
                style: TextStyle(fontWeight: FontWeight.w800, fontFamily: 'Manrope', fontSize: 18, color: Color(0xFF0B0C0C), letterSpacing: -0.5),
              ),
            ],
          ),
          Row(
            children: [
              if (!isMobile)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDFE2EA), 
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle)), // emerald-500
                      const SizedBox(width: 8),
                      const Text('POS ONLINE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF61646B), letterSpacing: 1.0)),
                    ],
                  ),
                ),
              const SizedBox(width: 16),
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(color: Colors.transparent, shape: BoxShape.circle),
                child: IconButton(
                  icon: const Icon(Icons.search, color: Color(0xFF191C1E)),
                  onPressed: () {},
                ),
              ),
              const SizedBox(width: 8),
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(color: Colors.transparent, shape: BoxShape.circle),
                child: IconButton(
                  icon: const Icon(Icons.filter_list, color: Color(0xFF191C1E)),
                  onPressed: () {},
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CrmKpiGrid extends ConsumerWidget {
  const _CrmKpiGrid();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summary = ref.watch(dummyCrmSummaryProvider);
    final isDesktop = MediaQuery.of(context).size.width >= 1024;

    Widget debtCard = Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            right: -20,
            top: -20,
            bottom: -20,
            child: Align(
              alignment: Alignment.centerRight,
              child: Icon(Icons.account_balance_wallet, size: isDesktop ? 240 : 160, color: Colors.black.withValues(alpha: 0.03)),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('TOTAL OUTSTANDING DEBT', style: TextStyle(color: Color(0xFF444747), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
              const SizedBox(height: 8),
              Text(
                summary.formattedTotalDebt,
                style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w900, fontSize: isDesktop ? 60 : 36, color: const Color(0xFF000000), letterSpacing: -1.0),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFDAD6), 
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFBA1A1A).withValues(alpha: 0.1)),
                    ),
                    child: Text(summary.debtGrowthStr, style: const TextStyle(color: Color(0xFFBA1A1A), fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.warning, color: Color(0xFFBA1A1A), size: 14),
                      const SizedBox(width: 4),
                      Text('${summary.highRiskDebtorsCount} High-risk debtors', style: const TextStyle(color: Color(0xFF444747), fontSize: 12, fontWeight: FontWeight.w500)),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );

    Widget activeClientsCard = Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFFFBE134), Color(0xFFF0C128)]),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFBE134)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 15, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('ACTIVE CLIENTS', style: TextStyle(color: Color(0xFF201C00), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
              const SizedBox(height: 4),
              Text('${summary.activeClients}', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w900, fontSize: isDesktop ? 48 : 36, color: const Color(0xFF201C00))),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.person_add, color: Colors.white, size: 20),
              label: const Text('NEW CUSTOMER', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 14)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF201C00),
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 10,
                shadowColor: Colors.black.withValues(alpha: 0.3),
              ),
            ),
          ),
        ],
      ),
    );

    if (isDesktop) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(flex: 8, child: debtCard),
          const SizedBox(width: 24),
          Expanded(flex: 4, child: activeClientsCard),
        ],
      );
    } else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          debtCard,
          const SizedBox(height: 16),
          activeClientsCard,
        ],
      );
    }
  }
}

class _CustomerDirectorySection extends ConsumerWidget {
  const _CustomerDirectorySection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final clients = ref.watch(dummyClientProfilesProvider);
    final isDesktop = MediaQuery.of(context).size.width >= 1024;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        LayoutBuilder(builder: (context, constraints) {
          final isSmall = constraints.maxWidth < 600;
          return Flex(
            direction: isSmall ? Axis.vertical : Axis.horizontal,
            crossAxisAlignment: isSmall ? CrossAxisAlignment.start : CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Customer Directory', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w900, fontSize: 24, color: Color(0xFF000000), letterSpacing: -0.5)),
                  const SizedBox(height: 4),
                  const Text('Manage credit and loyalty points', style: TextStyle(color: Color(0xFF444747), fontSize: 12)),
                ],
              ),
              if (isSmall) const SizedBox(height: 16),
              Container(
                width: isSmall ? double.infinity : 320,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 4, offset: const Offset(0, 2))],
                ),
                child: const TextField(
                  decoration: InputDecoration(
                    prefixIcon: Icon(Icons.search, color: Color(0xFF444747)),
                    hintText: 'Search by name or phone...',
                    hintStyle: TextStyle(color: Color(0x80444747), fontSize: 14, fontWeight: FontWeight.w500),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
                ),
              ),
            ],
          );
        }),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.3)),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0, 4))],
          ),
          clipBehavior: Clip.antiAlias,
          child: isDesktop ? _ClientTable(clients: clients) : _ClientListView(clients: clients),
        ),
      ],
    );
  }
}

class _ClientTable extends StatelessWidget {
  final List<ClientProfile> clients;
  const _ClientTable({required this.clients});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        headingRowColor: WidgetStateProperty.all(Colors.transparent),
        dividerThickness: 1,
        dataRowMaxHeight: 88,
        headingTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: Color(0xFF5B5F65), fontFamily: 'Inter'),
        columns: const [
          DataColumn(label: Padding(padding: EdgeInsets.only(left: 16), child: Text('CUSTOMER PROFILE'))),
          DataColumn(label: Text('LOYALTY POINTS')),
          DataColumn(label: Text('DEBT LEDGER')),
          DataColumn(label: Text('RISK ASSESSMENT')),
          DataColumn(label: Padding(padding: EdgeInsets.only(right: 16), child: Text('QUICK ACTIONS'))),
        ],
        rows: clients.map((c) => DataRow(
          cells: [
            DataCell(
              Padding(
                padding: const EdgeInsets.only(left: 16.0, top: 16, bottom: 16),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(color: c.riskStatus.bgColor, borderRadius: BorderRadius.circular(16)),
                      child: Center(child: Text(c.initials, style: TextStyle(color: c.riskStatus.textColor, fontWeight: FontWeight.w900, fontSize: 18))),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(c.name, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF191C1E), letterSpacing: -0.5)),
                        const SizedBox(height: 2),
                        Text(c.phoneNumber, style: const TextStyle(color: Color(0xFF444747), fontSize: 12, fontWeight: FontWeight.w500)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            DataCell(Text('${c.loyaltyPoints} Pts', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF191C1E)))),
            DataCell(
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(c.formattedDebtLong, style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: c.outstandingDebt > 0 ? const Color(0xFFBA1A1A) : const Color(0xFF191C1E))),
                  if (c.debtStatusNote != null) ...[
                    const SizedBox(height: 2),
                    Text(c.debtStatusNote!, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.riskStatus == ClientRiskStatus.vip ? const Color(0xFF059669) : const Color(0xFF93000A))),
                  ]
                ],
              ),
            ),
            DataCell(
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: c.riskStatus.bgColor, borderRadius: BorderRadius.circular(4), border: Border.all(color: c.riskStatus.textColor.withValues(alpha: 0.1))),
                child: Text(
                  c.riskStatus.label.toUpperCase(),
                  style: TextStyle(color: c.riskStatus.textColor, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                ),
              ),
            ),
            DataCell(
              Padding(
                padding: const EdgeInsets.only(right: 16.0),
                child: Row(
                  children: [
                    ElevatedButton.icon(
                      onPressed: () {},
                      icon: Icon(c.riskStatus == ClientRiskStatus.vip ? Icons.person : (c.outstandingDebt > 0 ? Icons.sms : Icons.payments), color: c.riskStatus == ClientRiskStatus.vip ? const Color(0xFF201C00) : Colors.white, size: 16),
                      label: Text(c.riskStatus == ClientRiskStatus.vip ? 'PROFILE' : 'SMS', style: TextStyle(color: c.riskStatus == ClientRiskStatus.vip ? const Color(0xFF201C00) : Colors.white, fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: c.riskStatus == ClientRiskStatus.vip ? const Color(0xFFDFE2EA) : const Color(0xFF000000), // bg-primary
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(color: const Color(0xFFE7E8EA), borderRadius: BorderRadius.circular(12)),
                      child: IconButton(onPressed: () {}, icon: const Icon(Icons.more_vert, color: Color(0xFF191C1E))),
                    ),
                  ],
                ),
              ),
            ),
          ],
        )).toList(),
      ),
    );
  }
}

class _ClientListView extends StatelessWidget {
  final List<ClientProfile> clients;
  const _ClientListView({required this.clients});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: clients.length,
      separatorBuilder: (context, index) => Divider(color: const Color(0xFFC4C7C7).withValues(alpha: 0.1), height: 1),
      itemBuilder: (context, index) {
        final c = clients[index];
        return Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () {},
            hoverColor: const Color(0xFFF3F4F6),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(color: c.riskStatus.bgColor, borderRadius: BorderRadius.circular(16)),
                            child: Center(child: Text(c.initials, style: TextStyle(color: c.riskStatus.textColor, fontWeight: FontWeight.w900, fontSize: 18))),
                          ),
                          const SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(c.name, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF191C1E), letterSpacing: -0.5)),
                              const SizedBox(height: 2),
                              Text(c.phoneNumber, style: const TextStyle(color: Color(0xFF444747), fontSize: 12, fontWeight: FontWeight.w500)),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: c.riskStatus.bgColor, borderRadius: BorderRadius.circular(4), border: Border.all(color: c.riskStatus.textColor.withValues(alpha: 0.1))),
                        child: Text(c.riskStatus.label.toUpperCase(), style: TextStyle(color: c.riskStatus.textColor, fontSize: 9, fontWeight: FontWeight.w900)),
                      ),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12),
                    child: Divider(height: 1, color: Color(0x0DC4C7C7)),
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('OUTSTANDING', style: TextStyle(color: Color(0xFF444747), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                            const SizedBox(height: 2),
                            Text(c.formattedDebtLong, style: TextStyle(fontWeight: FontWeight.w900, fontSize: 20, color: c.outstandingDebt > 0 ? const Color(0xFFBA1A1A) : const Color(0xFF191C1E))),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('LOYALTY', style: TextStyle(color: Color(0xFF444747), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                            const SizedBox(height: 2),
                            Text('${c.loyaltyPoints} Pts', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF191C1E))),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {},
                          icon: Icon(c.riskStatus == ClientRiskStatus.vip ? Icons.person : (c.outstandingDebt > 0 ? Icons.sms : Icons.payments), color: c.riskStatus == ClientRiskStatus.vip ? const Color(0xFF201C00) : Colors.white, size: 16),
                          label: Text(c.riskStatus == ClientRiskStatus.vip ? 'PROFILE' : 'SMS', style: TextStyle(color: c.riskStatus == ClientRiskStatus.vip ? const Color(0xFF201C00) : Colors.white, fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: c.riskStatus == ClientRiskStatus.vip ? const Color(0xFFDFE2EA) : const Color(0xFF000000),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: c.riskStatus == ClientRiskStatus.vip ? 0 : 2,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(color: const Color(0xFFE7E8EA), borderRadius: BorderRadius.circular(12)),
                        child: IconButton(onPressed: () {}, icon: const Icon(Icons.more_vert, color: Color(0xFF191C1E))),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
