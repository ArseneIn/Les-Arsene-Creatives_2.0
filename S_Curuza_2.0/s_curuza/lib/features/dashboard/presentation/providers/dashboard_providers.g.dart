// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(dummyDashboardStats)
final dummyDashboardStatsProvider = DummyDashboardStatsProvider._();

final class DummyDashboardStatsProvider
    extends $FunctionalProvider<DashboardStats, DashboardStats, DashboardStats>
    with $Provider<DashboardStats> {
  DummyDashboardStatsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyDashboardStatsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyDashboardStatsHash();

  @$internal
  @override
  $ProviderElement<DashboardStats> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  DashboardStats create(Ref ref) {
    return dummyDashboardStats(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(DashboardStats value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<DashboardStats>(value),
    );
  }
}

String _$dummyDashboardStatsHash() =>
    r'89721d0550dbdf220dda91faccd7ebcf01c8d132';

@ProviderFor(dummyRecentTransactions)
final dummyRecentTransactionsProvider = DummyRecentTransactionsProvider._();

final class DummyRecentTransactionsProvider
    extends
        $FunctionalProvider<
          List<Transaction>,
          List<Transaction>,
          List<Transaction>
        >
    with $Provider<List<Transaction>> {
  DummyRecentTransactionsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyRecentTransactionsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyRecentTransactionsHash();

  @$internal
  @override
  $ProviderElement<List<Transaction>> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  List<Transaction> create(Ref ref) {
    return dummyRecentTransactions(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(List<Transaction> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<List<Transaction>>(value),
    );
  }
}

String _$dummyRecentTransactionsHash() =>
    r'3aa89765daf15ad26728ca3396cbd669246c3e5d';

@ProviderFor(dummyInventoryAlerts)
final dummyInventoryAlertsProvider = DummyInventoryAlertsProvider._();

final class DummyInventoryAlertsProvider
    extends
        $FunctionalProvider<
          List<InventoryAlert>,
          List<InventoryAlert>,
          List<InventoryAlert>
        >
    with $Provider<List<InventoryAlert>> {
  DummyInventoryAlertsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyInventoryAlertsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyInventoryAlertsHash();

  @$internal
  @override
  $ProviderElement<List<InventoryAlert>> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  List<InventoryAlert> create(Ref ref) {
    return dummyInventoryAlerts(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(List<InventoryAlert> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<List<InventoryAlert>>(value),
    );
  }
}

String _$dummyInventoryAlertsHash() =>
    r'100c5e08dcace25283073fed9c4b6158fb69a496';

@ProviderFor(dummyInventorySnapshot)
final dummyInventorySnapshotProvider = DummyInventorySnapshotProvider._();

final class DummyInventorySnapshotProvider
    extends
        $FunctionalProvider<
          List<InventoryItemSnapshot>,
          List<InventoryItemSnapshot>,
          List<InventoryItemSnapshot>
        >
    with $Provider<List<InventoryItemSnapshot>> {
  DummyInventorySnapshotProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyInventorySnapshotProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyInventorySnapshotHash();

  @$internal
  @override
  $ProviderElement<List<InventoryItemSnapshot>> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  List<InventoryItemSnapshot> create(Ref ref) {
    return dummyInventorySnapshot(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(List<InventoryItemSnapshot> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<List<InventoryItemSnapshot>>(value),
    );
  }
}

String _$dummyInventorySnapshotHash() =>
    r'4c720f526b281d664b2d36d8fe96761dd43c2f0d';
