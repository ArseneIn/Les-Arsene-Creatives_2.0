import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/models.dart';

part 'pos_providers.g.dart';

@riverpod
List<PosProduct> dummyPosCatalog(Ref ref) {
  return const [
    PosProduct(
      id: 'p1',
      title: 'Classic Cola 500ml',
      category: 'Beverages',
      sku: 'SKU-1022',
      priceStr: '\$2.50',
      stockStatus: '12 IN STOCK',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9PU4VhCpYbcz4EW2h5vS8w-IiQXI74lPL-P-0OLGC7o5W7ioLuaR7sty7TmKIn60qO7GYoVl3a0yoxrnth64PWn0yWzqH1_t7vSKd4Rc1UXWmOj6KOkywaELhaxH3O_H6bih0afXAw04mrgJKJIrhhRjPIW1SaD51fXIkMaCYc9hHJi6ksQhC3AGWJ6LJlKs_qK5BxYl7s1l5N84y_plR7chcA5CvzbQHMvyi8TmgIe_E1UW6Nvsb7ePeX6CQqMMY6oLjk41KmA',
    ),
    PosProduct(
      id: 'p2',
      title: 'Premium Wristwatch',
      category: 'Accessories',
      sku: 'SKU-8843',
      priceStr: '\$145.00',
      stockStatus: '5 IN STOCK',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyhbPIUTLyEeso15gb3mVIQ80Me0KCcAWZ0Ep4rei2sPTsnwAYPcD1ITXC1zRcaolYHvBKVbcjbMkLlhilB19L0Kfaxa3fEa2U0hdXWa16TfiqlkPoZBcnkUpLI3nk1DxcbJQ7gcH4tPZCDbyMgx3-0iCHgeJVmeeLetZx4JPxr63DplS49f8CdyUYAMDQcMT01rs1ieeEggl2uqc5TGLkyYnl28RwnW4j75yfkJhQhAfg8xBjwfy9e4XxNxpzCZwxJzTjUSBlLA',
    ),
    PosProduct(
      id: 'p3',
      title: 'Fresh Produce Pack',
      category: 'Grains',
      sku: 'SKU-2201',
      priceStr: '\$18.75',
      stockStatus: '42 IN STOCK',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw4Jnj71rfO6FJ7EB7nzjRMQB4pHVhMsnikw75nthc966QJGVQ7MZWUlUy3BRp3P5_mhOGITJ9RNnyKWevJn3M2FxHFx924nYEF-CkQAzrGwqYjp7Fh3LvIyalK7Wu8yRC22qfBi1-xZnGQWsj0qUrtZP_NcNhFkcMkWe5dGFwIhRiJxtcyetjLHpIWsp98BUzN5eb_yhopq9svLYc1GUce2yxoOaIuj4bxHH0tJkPha_zf6l_ohZ9uYstguyp8EzaxdOySU_Q4Q',
    ),
    PosProduct(
      id: 'p4',
      title: 'Handmade Soap Bar',
      category: 'Hygiene',
      sku: 'SKU-3112',
      priceStr: '\$6.20',
      stockStatus: 'LOW STOCK',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBgB6cyhccjW1Ng31Mr6DbvlcZZWetOMwFJK0IgPETkWJ_LVoHNDMSIAOUDnMtsQDwjSMFujgt_xjhkp4NX0seo_IReCDNRLBnWBhyablx-DKTbzZdaqvERBUCDdE1xt8s2snQpJDY1MY_mhMTXYvd4dwCp3uspxd-nzgZ7Er8a_7XljNP78TgtAm4zb8bF0bz0eqznjeq88RXe2nkIJyQNyUkxmHp-5WrG6x66JJre_ZaiEhYR_InvSBBAmu3k7fB_-9htc6YMQ',
    ),
  ];
}

@riverpod
List<CartItem> dummyCartItems(Ref ref) {
  return const [
    CartItem(
      productId: 'p1',
      title: 'Classic Cola 500ml',
      pricePerUnitStr: '\$2.50 / unit',
      quantity: 2,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzP3lE4DGQMbCBC-5XWjX6kRL9M8tKe73DkHFSOPMY_GD8NLxMkvrwCYm9AuDtj7G_o-wTX5Vgn30smlDYp9ffRvH-xkp3APafXi9lXcBdAz3ySjJ0W-UT21U2nIqA8F2QdGf3wb_jFswO_8LhnEjIahrMXnVrE9QhVQRSJMjbG6k5j3pMfbzYvpxcJ6SDcK7j-57zKxzvng9ZcfFCymIHjBwzSuSTa53KdXErFAeAhV0pUlj2n9U-0SY0D5kzcESD719KX4onvA',
    ),
    CartItem(
      productId: 'p2',
      title: 'Premium Wristwatch',
      pricePerUnitStr: '\$145.00 / unit',
      quantity: 1,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb_xuiYk-8v09_Gfg83LjqzOA8v5iIYee9yJtTCH1U3vyOkcOs3Ka9MS_naNprXh2sRIhcAfMDKs98XXFONGBu_oqMWNxbLTz_4oLmr9A7-09Th7jae9wYaRnuJcfzeOdwu1FVObxHsbbEHxeX4L0N4RV6M0Y-2mGhzCMtFnWndoLopqFpt5uoiottLkXV6gR90gPjtLDY5JcK9Qhy7rzX6mTZAW-AanLTJm3cNzgvv6M74PsIq5C2omEu7rqeZs5WgRV6hEPbag',
    ),
  ];
}

@riverpod
OrderSummary dummyOrderSummary(Ref ref) {
  return const OrderSummary(
    subtotalStr: '\$150.00',
    vatStr: '\$27.00',
    totalStr: '\$177.00',
  );
}
