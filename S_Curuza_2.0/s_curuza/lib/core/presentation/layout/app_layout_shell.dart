import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AppLayoutShell extends StatelessWidget {
  final Widget child;

  const AppLayoutShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= 768) {
          return Scaffold(
            body: Row(
              children: [
                _buildDrawer(context),
                Expanded(child: child),
              ],
            ),
          );
        } else {
          return Scaffold(
            extendBody: true,
            body: child,
            bottomNavigationBar: _buildBottomNav(context),
          );
        }
      },
    );
  }

  Widget _buildDrawer(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    
    return Container(
      width: 280, // matches ~72 spacing in HTML
      color: const Color(0xFF2A2E34),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [Color(0xFFFBE134), Color(0xFFF0C128)],
                    ),
                  ),
                  alignment: Alignment.center,
                  child: const Icon(Icons.person, color: Colors.black87),
                ),
                const SizedBox(width: 12),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Smart-Curuza', style: TextStyle(color: Color(0xFFFBE134), fontWeight: FontWeight.w900, fontSize: 20)),
                    Text('PREMIUM ERP', style: TextStyle(color: Colors.white60, fontSize: 10, letterSpacing: 2, fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
          ),
          _DrawerItem(icon: Icons.dashboard, title: 'Dashboard', isSelected: location == '/', onTap: () => context.go('/')),
          _DrawerItem(icon: Icons.inventory_2, title: 'Inventory', isSelected: location == '/inventory', onTap: () => context.go('/inventory')),
          _DrawerItem(icon: Icons.payments, title: 'Sales', isSelected: location == '/pos', onTap: () => context.go('/pos')),
          _DrawerItem(icon: Icons.group, title: 'Customers', isSelected: location == '/crm', onTap: () => context.go('/crm')),
          _DrawerItem(icon: Icons.settings, title: 'Settings', isSelected: location == '/users', onTap: () => context.go('/users')),
        ],
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    int idx = 0;
    if (location.startsWith('/pos')) idx = 1;
    if (location.startsWith('/crm')) idx = 2;
    if (location.startsWith('/inventory')) idx = 3;
    if (location.startsWith('/users')) idx = 4;

    return Container(
      height: 96, // h-24
      padding: const EdgeInsets.only(bottom: 16, left: 16, right: 16), // pb-4 px-4
      decoration: BoxDecoration(
        color: const Color(0xFF2A2E34),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(40),
          topRight: Radius.circular(40),
        ),
        border: Border(
          top: BorderSide(color: const Color(0xFFFBE134).withValues(alpha: 0.1)),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 30,
            offset: const Offset(0, -10),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _NavBarItem(icon: Icons.dashboard, label: 'Dash', isSelected: idx == 0, onTap: () => context.go('/')),
          _NavBarItem(icon: Icons.point_of_sale, label: 'Sales', isSelected: idx == 1, onTap: () => context.go('/pos')),
          _NavBarItem(icon: Icons.group, label: 'Clients', isSelected: idx == 2, onTap: () => context.go('/crm')),
          _NavBarItem(icon: Icons.inventory_2, label: 'Stock', isSelected: idx == 3, onTap: () => context.go('/inventory')),
          _NavBarItem(icon: Icons.settings, label: 'Set', isSelected: idx == 4, onTap: () => context.go('/users')),
        ],
      ),
    );
  }
}

class _NavBarItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavBarItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    if (isSelected) {
      return GestureDetector(
        onTap: onTap,
        child: Container(
          margin: const EdgeInsets.only(bottom: 24), // -mt-6 visual equivalent by pushing up within the row if aligned to bottom, or Use Transform.translate.
          transform: Matrix4.translationValues(0, -24, 0),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF2A2E34),
            shape: BoxShape.circle,
            border: const Border(
              top: BorderSide(color: Color(0xFFFBE134), width: 4),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.25),
                blurRadius: 20,
                offset: const Offset(0, 10),
              )
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: const Color(0xFFFBE134), size: 32),
              const SizedBox(height: 4),
              Text(
                label.toUpperCase(),
                style: const TextStyle(
                  color: Color(0xFFFBE134),
                  fontSize: 9,
                  fontFamily: 'Inter',
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return GestureDetector(
      onTap: onTap,
      child: Opacity(
        opacity: 0.4,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFFF3F4F6), size: 28),
            const SizedBox(height: 4),
            Text(
              label.toUpperCase(),
              style: const TextStyle(
                color: Color(0xFFF3F4F6),
                fontSize: 9,
                fontFamily: 'Inter',
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final bool isSelected;
  final VoidCallback onTap;

  const _DrawerItem({
    required this.icon,
    required this.title,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 4),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: isSelected
            ? const BoxDecoration(
                gradient: LinearGradient(colors: [Color(0xFFFBE134), Color(0xFFF0C128)]),
                borderRadius: BorderRadius.only(topRight: Radius.circular(50), bottomRight: Radius.circular(50)),
              )
            : null,
        child: Row(
          children: [
            Icon(icon, color: isSelected ? const Color(0xFF201C00) : Colors.white70),
            const SizedBox(width: 16),
            Text(
              title,
              style: TextStyle(
                color: isSelected ? const Color(0xFF201C00) : Colors.white70,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
