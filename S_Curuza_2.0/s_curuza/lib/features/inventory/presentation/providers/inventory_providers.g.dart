// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'inventory_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(dummyInventorySummary)
final dummyInventorySummaryProvider = DummyInventorySummaryProvider._();

final class DummyInventorySummaryProvider
    extends
        $FunctionalProvider<
          InventorySummary,
          InventorySummary,
          InventorySummary
        >
    with $Provider<InventorySummary> {
  DummyInventorySummaryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyInventorySummaryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyInventorySummaryHash();

  @$internal
  @override
  $ProviderElement<InventorySummary> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  InventorySummary create(Ref ref) {
    return dummyInventorySummary(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(InventorySummary value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<InventorySummary>(value),
    );
  }
}

String _$dummyInventorySummaryHash() =>
    r'9c04de99285ff0034c29c3e9f754dde5afae4aa0';

@ProviderFor(dummyBatchPerformances)
final dummyBatchPerformancesProvider = DummyBatchPerformancesProvider._();

final class DummyBatchPerformancesProvider
    extends
        $FunctionalProvider<
          List<BatchPerformance>,
          List<BatchPerformance>,
          List<BatchPerformance>
        >
    with $Provider<List<BatchPerformance>> {
  DummyBatchPerformancesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyBatchPerformancesProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyBatchPerformancesHash();

  @$internal
  @override
  $ProviderElement<List<BatchPerformance>> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  List<BatchPerformance> create(Ref ref) {
    return dummyBatchPerformances(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(List<BatchPerformance> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<List<BatchPerformance>>(value),
    );
  }
}

String _$dummyBatchPerformancesHash() =>
    r'57e9b2a47ab05740b185d968d2e208f5c6308566';
