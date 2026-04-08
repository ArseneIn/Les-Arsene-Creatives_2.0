import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'providers/pos_providers.dart';

class PosScreen extends ConsumerWidget {
  const PosScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDesktop = MediaQuery.of(context).size.width >= 1024;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: SafeArea(
        child: Row(
          children: [
            // Main Content Area
            Expanded(
              child: Column(
                children: [
                   Container(
                    color: const Color(0xFFF8F9FB),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Text(
                              'Terminal 01',
                              style: TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Manrope', fontSize: 18, letterSpacing: -0.5, color: Color(0xFF0B0C0C)),
                            ),
                          ],
                        ),
                        // Search & Scanner
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 32.0),
                            child: Container(
                              height: 48,
                              constraints: const BoxConstraints(maxWidth: 672), // max-w-2xl
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3F4F6), 
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: TextField(
                                decoration: InputDecoration(
                                  hintText: 'Search product name or SKU...',
                                  hintStyle: const TextStyle(color: Color(0xFF747878), fontSize: 14),
                                  prefixIcon: const Icon(Icons.search, color: Color(0xFF747878)),
                                  suffixIcon: IconButton(
                                    icon: const Icon(Icons.qr_code_scanner, color: Colors.black),
                                    onPressed: () {},
                                  ),
                                  border: InputBorder.none,
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                              decoration: BoxDecoration(color: const Color(0xFFDFE2EA), borderRadius: BorderRadius.circular(20)),
                              child: Row(
                                children: [
                                  Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle)),
                                  const SizedBox(width: 8),
                                  const Text('Online', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF181C21))),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            IconButton(
                              icon: const Icon(Icons.notifications_none, color: Color(0xFF191C1E)),
                              onPressed: () {},
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Product Catalog', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800, fontFamily: 'Manrope', letterSpacing: -1, color: Color(0xFF191C1E))),
                                  const SizedBox(height: 4),
                                  Text('Tap items to add to current order', style: TextStyle(color: const Color(0xFF5B5F65), fontSize: 14)),
                                ],
                              ),
                              Row(
                                children: [
                                  _FilterChip(label: 'Beverages', isSelected: false),
                                  const SizedBox(width: 8),
                                  _FilterChip(label: 'All Essentials', isSelected: true),
                                  const SizedBox(width: 8),
                                  _FilterChip(label: 'Grains', isSelected: false),
                                  const SizedBox(width: 8),
                                  _FilterChip(label: 'Dairy', isSelected: false),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          const Expanded(child: _ProductCatalogGrid()),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Cart Sidebar (only visible on wide screens)
            if (isDesktop) const _CartSidebar(),
          ],
        ),
      ),
      floatingActionButton: !isDesktop
          ? FloatingActionButton.extended(
              onPressed: () {},
              icon: const Icon(Icons.shopping_cart),
              label: const Text('View Cart'),
              backgroundColor: const Color(0xFFFDE336),
              foregroundColor: const Color(0xFF201C00),
            )
          : null,
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  const _FilterChip({required this.label, required this.isSelected});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFFFDE336) : Colors.white,
        border: Border.all(color: isSelected ? Colors.transparent : const Color(0xFFC4C7C7).withValues(alpha: 0.1)),
        borderRadius: BorderRadius.circular(12),
        boxShadow: isSelected ? [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4, offset: const Offset(0, 1))] : null,
      ),
      child: Text(
        label,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
          fontSize: 14,
          color: isSelected ? const Color(0xFF201C00) : const Color(0xFF191C1E),
        ),
      ),
    );
  }
}

class _ProductCatalogGrid extends ConsumerWidget {
  const _ProductCatalogGrid();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final catalog = ref.watch(dummyPosCatalogProvider);

    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 280,
        mainAxisSpacing: 24,
        crossAxisSpacing: 24,
        childAspectRatio: 0.8,
      ),
      itemCount: catalog.length,
      itemBuilder: (context, index) {
        final product = catalog[index];
        final isLowStock = product.stockStatus.contains('LOW STOCK');

        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 15, offset: const Offset(0, 4)),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Image container
              Expanded(
                flex: 5,
                child: Stack(
                  children: [
                    Image.network(product.imageUrl, fit: BoxFit.cover, width: double.infinity, height: double.infinity,
                      errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[200]),
                    ),
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isLowStock ? const Color(0xFFFFDAD6) : Colors.white.withValues(alpha: 0.9),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          product.stockStatus,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: isLowStock ? const Color(0xFF93000A) : const Color(0xFF191C1E),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Details container
              Expanded(
                flex: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Manrope', color: Color(0xFF0B0C0C)),
                          ),
                          const SizedBox(height: 4),
                          Text('${product.category} • ${product.sku}', style: const TextStyle(color: Color(0xFF5B5F65), fontSize: 12)),
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(product.priceStr, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.5, color: Color(0xFF0B0C0C))),
                          Container(
                            width: 32,
                            height: 32,
                            decoration: const BoxDecoration(color: Color(0xFFFDE336), shape: BoxShape.circle),
                            alignment: Alignment.center,
                            child: const Icon(Icons.add, size: 20, color: Color(0xFF201C00)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _CartSidebar extends ConsumerWidget {
  const _CartSidebar();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartItems = ref.watch(dummyCartItemsProvider);
    final summary = ref.watch(dummyOrderSummaryProvider);

    return Container(
      width: 420,
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F6),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0B0C0C).withValues(alpha: 0.04),
            blurRadius: 32,
            offset: const Offset(-12, 0),
          )
        ],
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(24),
            color: Colors.white,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Current Order', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, fontFamily: 'Manrope', color: Color(0xFF0B0C0C))),
                    const SizedBox(height: 4),
                    Text('ORDER #SC-89231', style: const TextStyle(color: Color(0xFF5B5F65), fontSize: 10, fontWeight: FontWeight.w500, letterSpacing: 2)),
                  ],
                ),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.delete, color: Color(0xFFBA1A1A), size: 14),
                  label: const Text('Clear', style: TextStyle(color: Color(0xFFBA1A1A), fontWeight: FontWeight.w600, fontSize: 14)),
                )
              ],
            ),
          ),
          // Items
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(24),
              itemCount: cartItems.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final item = cartItems[index];
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(item.imageUrl, width: 48, height: 48, fit: BoxFit.cover, errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[200], width: 48, height: 48)),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0B0C0C))),
                            const SizedBox(height: 2),
                            Text(item.pricePerUnitStr, style: const TextStyle(color: Color(0xFF5B5F65), fontSize: 12)),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          _buildCartBtn(Icons.remove),
                          Container(width: 32, alignment: Alignment.center, child: Text('${item.quantity}', style: const TextStyle(fontWeight: FontWeight.w900))),
                          _buildCartBtn(Icons.add),
                        ],
                      )
                    ],
                  ),
                );
              },
            ),
          ),
          // Summary Footer
          Container(
            padding: const EdgeInsets.all(24),
            color: Colors.white,
            child: Column(
              children: [
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  const Text('Subtotal', style: TextStyle(color: Color(0xFF5B5F65), fontSize: 14)),
                  Text(summary.subtotalStr, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF191C1E))),
                ]),
                const SizedBox(height: 8),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  const Text('VAT (18%)', style: TextStyle(color: Color(0xFF5B5F65), fontSize: 14)),
                  Text(summary.vatStr, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF191C1E))),
                ]),
                const Padding(padding: EdgeInsets.only(top: 16, bottom: 16), child: Divider(height: 1, color: Color(0x26C4C7C7))),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, crossAxisAlignment: CrossAxisAlignment.end, children: [
                  const Text('Total Due', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, fontFamily: 'Manrope')),
                  Text(summary.totalStr, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 36, letterSpacing: -1, color: Color(0xFF0B0C0C), height: 1)),
                ]),
                const SizedBox(height: 24),
                // Payment Buttons
                ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.payments),
                  label: const Text('CASH PAYMENT'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981), // cash-green
                    foregroundColor: Colors.white,
                    minimumSize: const Size(double.infinity, 56),
                    elevation: 10,
                    shadowColor: const Color(0xFF10B981).withValues(alpha: 0.3),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    textStyle: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Manrope'),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.smartphone),
                        label: const Text('MOMO'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB), // momo-blue
                          foregroundColor: Colors.white,
                          minimumSize: const Size(0, 56),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Manrope'),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.credit_card),
                        label: const Text('CREDIT'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFE4B61A), // credit-gold
                          foregroundColor: const Color(0xFF201C00),
                          minimumSize: const Size(0, 56),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Manrope'),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCartBtn(IconData icon) {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.3)), borderRadius: BorderRadius.circular(8)),
      child: Icon(icon, size: 18, color: const Color(0xFF191C1E)),
    );
  }
}
