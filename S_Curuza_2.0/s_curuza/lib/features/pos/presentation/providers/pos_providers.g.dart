// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pos_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(dummyPosCatalog)
final dummyPosCatalogProvider = DummyPosCatalogProvider._();

final class DummyPosCatalogProvider
    extends
        $FunctionalProvider<
          List<PosProduct>,
          List<PosProduct>,
          List<PosProduct>
        >
    with $Provider<List<PosProduct>> {
  DummyPosCatalogProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyPosCatalogProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyPosCatalogHash();

  @$internal
  @override
  $ProviderElement<List<PosProduct>> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  List<PosProduct> create(Ref ref) {
    return dummyPosCatalog(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(List<PosProduct> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<List<PosProduct>>(value),
    );
  }
}

String _$dummyPosCatalogHash() => r'a4aa18be190376053aed6500af0be661cf25bfd8';

@ProviderFor(dummyCartItems)
final dummyCartItemsProvider = DummyCartItemsProvider._();

final class DummyCartItemsProvider
    extends $FunctionalProvider<List<CartItem>, List<CartItem>, List<CartItem>>
    with $Provider<List<CartItem>> {
  DummyCartItemsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyCartItemsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyCartItemsHash();

  @$internal
  @override
  $ProviderElement<List<CartItem>> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  List<CartItem> create(Ref ref) {
    return dummyCartItems(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(List<CartItem> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<List<CartItem>>(value),
    );
  }
}

String _$dummyCartItemsHash() => r'dce3de0c92ba2758be94c92f3ce78fb92ca554e9';

@ProviderFor(dummyOrderSummary)
final dummyOrderSummaryProvider = DummyOrderSummaryProvider._();

final class DummyOrderSummaryProvider
    extends $FunctionalProvider<OrderSummary, OrderSummary, OrderSummary>
    with $Provider<OrderSummary> {
  DummyOrderSummaryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dummyOrderSummaryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dummyOrderSummaryHash();

  @$internal
  @override
  $ProviderElement<OrderSummary> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  OrderSummary create(Ref ref) {
    return dummyOrderSummary(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(OrderSummary value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<OrderSummary>(value),
    );
  }
}

String _$dummyOrderSummaryHash() => r'79d8b78eb14a9b3e4627d1366602cf75cc9c6bb7';
