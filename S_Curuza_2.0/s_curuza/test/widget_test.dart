import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:s_curuza/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const ProviderScope(child: SmartCuruzaApp()));

    // Verify application boots (Stitch generated Merchant Dashboard is first route)
    expect(find.text('Merchant Dashboard'), findsOneWidget);
  });
}
