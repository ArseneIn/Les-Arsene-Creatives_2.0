import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models.dart';

final dummyCrmSummaryProvider = Provider<CrmSummaryStats>((ref) {
  return const CrmSummaryStats(
    totalOutstandingDebt: 4820000,
    debtGrowthPercentage: 12.4,
    highRiskDebtorsCount: 14,
    activeClients: 1248,
  );
});

final dummyClientProfilesProvider = Provider<List<ClientProfile>>((ref) {
  return [
    const ClientProfile(
      id: 'c1',
      name: 'Aliko Kizito',
      phoneNumber: '+256 701 445 990',
      riskStatus: ClientRiskStatus.criticalRisk,
      loyaltyPoints: 450,
      outstandingDebt: 1250000,
      debtStatusNote: 'Overdue 45 Days',
    ),
    const ClientProfile(
      id: 'c2',
      name: 'Sarah Musoke',
      phoneNumber: '+256 782 112 003',
      riskStatus: ClientRiskStatus.goodStanding,
      loyaltyPoints: 1240,
      outstandingDebt: 12000,
      debtStatusNote: null,
    ),
    const ClientProfile(
      id: 'c3',
      name: 'Esther Okello',
      phoneNumber: '+256 700 333 111',
      riskStatus: ClientRiskStatus.vip,
      loyaltyPoints: 3450,
      outstandingDebt: 0,
      debtStatusNote: 'Clear Account',
    ),
    const ClientProfile(
      id: 'c4',
      name: 'Joshua Ndlovu',
      phoneNumber: '+256 711 223 344',
      riskStatus: ClientRiskStatus.goodStanding,
      loyaltyPoints: 120,
      outstandingDebt: 34000,
      debtStatusNote: 'Overdue 5 Days',
    ),
  ];
});
