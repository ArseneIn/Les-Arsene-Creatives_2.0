import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/pos/presentation/pos_screen.dart';
import '../../features/inventory/presentation/inventory_screen.dart';
import '../../features/crm/presentation/crm_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/users/presentation/users_screen.dart';
import '../presentation/layout/app_layout_shell.dart';

part 'app_router.g.dart';

@riverpod
GoRouter appRouter(Ref ref) {
  return GoRouter(
    initialLocation: '/', // Redirects to correct start later
    routes: [
      ShellRoute(
        builder: (context, state, child) => AppLayoutShell(child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const MerchantDashboardScreen(),
          ),
          GoRoute(
            path: '/pos',
            builder: (context, state) => const PosScreen(),
          ),
          GoRoute(
            path: '/inventory',
            builder: (context, state) => const InventoryScreen(),
          ),
          GoRoute(
            path: '/crm',
            builder: (context, state) => const CrmScreen(),
          ),
          GoRoute(
            path: '/users',
            builder: (context, state) => const UsersScreen(),
          ),
        ],
      ),
      // Onboarding is full-screen, so it sits outside the ShellRoute
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
    ],
  );
}
