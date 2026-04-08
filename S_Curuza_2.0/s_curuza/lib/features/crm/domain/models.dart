import 'package:flutter/material.dart';

enum ClientRiskStatus {
  goodStanding,
  criticalRisk,
  vip,
}

extension ClientRiskStatusExtension on ClientRiskStatus {
  String get label {
    switch (this) {
      case ClientRiskStatus.goodStanding:
        return 'Good Standing';
      case ClientRiskStatus.criticalRisk:
        return 'Critical Risk';
      case ClientRiskStatus.vip:
        return 'VIP Merchant';
    }
  }

  Color get bgColor {
    switch (this) {
      case ClientRiskStatus.goodStanding:
        return const Color(0xFFDFE2EA); // secondary-container
      case ClientRiskStatus.criticalRisk:
        return const Color(0xFFFFDAD6); // error-container
      case ClientRiskStatus.vip:
        return const Color(0xFFFDE336).withValues(alpha: 0.2); // primary-fixed/20
    }
  }

  Color get textColor {
    switch (this) {
      case ClientRiskStatus.goodStanding:
        return const Color(0xFF61646B); // on-secondary-container
      case ClientRiskStatus.criticalRisk:
        return const Color(0xFFBA1A1A); // error
      case ClientRiskStatus.vip:
        return const Color(0xFF514700); // on-primary-fixed-variant
    }
  }
}

class ClientProfile {
  final String id;
  final String name;
  final String phoneNumber;
  final ClientRiskStatus riskStatus;
  final int loyaltyPoints;
  final double outstandingDebt;
  final String? debtStatusNote;

  const ClientProfile({
    required this.id,
    required this.name,
    required this.phoneNumber,
    required this.riskStatus,
    this.loyaltyPoints = 0,
    this.outstandingDebt = 0.0,
    this.debtStatusNote,
  });

  String get initials {
    if (name.isEmpty) return '';
    final parts = name.split(' ');
    if (parts.length > 1) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name[0].toUpperCase();
  }

  String get formattedDebt {
    if (outstandingDebt == 0) return 'Sh 0';
    if (outstandingDebt >= 1000000) {
      return 'Sh ${(outstandingDebt / 1000000).toStringAsFixed(1)}M';
    } else if (outstandingDebt >= 1000) {
      return 'Sh ${(outstandingDebt / 1000).toStringAsFixed(0)}K';
    }
    return 'Sh ${outstandingDebt.toStringAsFixed(0)}';
  }

  String get formattedDebtLong {
    if (outstandingDebt == 0) return 'Sh 0';
    // Very basic commarizer
    final str = outstandingDebt.toInt().toString();
    String result = '';
    for (int i = 0; i < str.length; i++) {
      if (i > 0 && (str.length - i) % 3 == 0) result += ',';
      result += str[i];
    }
    return 'Sh $result';
  }
}

class CrmSummaryStats {
  final double totalOutstandingDebt;
  final double debtGrowthPercentage;
  final int highRiskDebtorsCount;
  final int activeClients;

  const CrmSummaryStats({
    required this.totalOutstandingDebt,
    required this.debtGrowthPercentage,
    required this.highRiskDebtorsCount,
    required this.activeClients,
  });

  String get formattedTotalDebt {
    final str = totalOutstandingDebt.toInt().toString();
    String result = '';
    for (int i = 0; i < str.length; i++) {
      if (i > 0 && (str.length - i) % 3 == 0) result += ',';
      result += str[i];
    }
    return 'Sh $result';
  }

  String get debtGrowthStr {
    if (debtGrowthPercentage >= 0) {
      return '+${debtGrowthPercentage.toStringAsFixed(1)}%';
    } else {
      return '${debtGrowthPercentage.toStringAsFixed(1)}%';
    }
  }
}
