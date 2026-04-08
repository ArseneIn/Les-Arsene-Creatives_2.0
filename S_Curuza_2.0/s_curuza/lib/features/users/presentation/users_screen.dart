import 'package:flutter/material.dart';

class UsersScreen extends StatefulWidget {
  const UsersScreen({super.key});

  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  String selectedRole = 'Manager';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: SafeArea(
        child: Column(
          children: [
            const _UsersHeader(),
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1200),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _PageTitleActions(),
                          const SizedBox(height: 32),
                          _UsersLayout(
                            selectedRole: selectedRole,
                            onRoleSelected: (v) => setState(() => selectedRole = v),
                          ),
                          const SizedBox(height: 96), // Extra bottom padding for nav bar overlay
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _UsersHeader extends StatelessWidget {
  const _UsersHeader();

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      color: const Color(0xFFF8F9FB),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              if (isMobile)
                const Padding(
                  padding: EdgeInsets.only(right: 16),
                  child: Icon(Icons.menu, color: Color(0xFF0B0C0C)),
                )
              else
                const Padding(
                  padding: EdgeInsets.only(right: 12),
                  child: Icon(Icons.grid_view, color: Color(0xFF0B0C0C)),
                ),
              const Text(
                'Smart-Curuza',
                style: TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Manrope', fontSize: 18, color: Color(0xFF0B0C0C), letterSpacing: -0.5),
              ),
            ],
          ),
          if (!isMobile)
            Row(
              children: [
                ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 400),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _NavText('Dashboard', isActive: false),
                      _NavText('Shop', isActive: false),
                      _NavText('Team', isActive: true),
                      _NavText('Settings', isActive: false),
                    ],
                  ),
                ),
                const SizedBox(width: 32),
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE7E8EA),
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.2)),
                    image: const DecorationImage(
                      image: NetworkImage('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}

class _NavText extends StatelessWidget {
  final String title;
  final bool isActive;

  const _NavText(this.title, {required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          color: isActive ? const Color(0xFFFBE134) : const Color(0xFF0B0C0C).withValues(alpha: 0.6),
          fontWeight: isActive ? FontWeight.w800 : FontWeight.w600,
          fontSize: 11,
          fontFamily: 'Inter',
          letterSpacing: 2.0,
        ),
      ),
    );
  }
}

class _PageTitleActions extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 768;
    
    return Flex(
      direction: isDesktop ? Axis.horizontal : Axis.vertical,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: isDesktop ? CrossAxisAlignment.center : CrossAxisAlignment.start,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Team & Permissions', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w900, fontSize: isDesktop ? 36 : 28, letterSpacing: -1.0, color: const Color(0xFF000000))),
            const SizedBox(height: 8),
            const Text('Manage your storefront staff and access levels with precision.', style: TextStyle(color: Color(0xFF444747), fontSize: 16)),
          ],
        ),
        if (!isDesktop) const SizedBox(height: 24),
        ElevatedButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.person_add, color: Color(0xFF201C00)),
          label: const Text('Add New Member', style: TextStyle(color: Color(0xFF201C00), fontWeight: FontWeight.bold, fontSize: 14)),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            foregroundColor: const Color(0xFF201C00),
            padding: EdgeInsets.zero,
            elevation: 8,
            shadowColor: const Color(0xFFFBE134).withValues(alpha: 0.3),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ).copyWith(
            backgroundColor: WidgetStateProperty.all(Colors.transparent),
          ),
          // We must wrap button content in ink for gradient
        ),
      ],
    );
  }
}

class _UsersLayout extends StatelessWidget {
  final String selectedRole;
  final ValueChanged<String> onRoleSelected;

  const _UsersLayout({required this.selectedRole, required this.onRoleSelected});

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 1024;
    
    Widget teamSection = Column(
      children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(32),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.group, color: Color(0xFFE0C70F), size: 24),
                  const SizedBox(width: 8),
                  const Text('Active Members', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 20)),
                ],
              ),
              const SizedBox(height: 24),
              _TeamMemberCard(
                name: 'Alex Curuza',
                roleDesc: 'Owner • admin@curuza.com',
                roleLabel: 'Owner',
                roleBgColor: const Color(0xFF000000),
                roleTextColor: Colors.white,
                avatarChild: const Icon(Icons.shield, color: Color(0xFFFDE336)),
                avatarBgColor: const Color(0xFF201C00),
              ),
              const SizedBox(height: 16),
              _TeamMemberCard(
                name: 'Janelle Doe',
                roleDesc: 'Manager • janelle.d@curuza.com',
                roleLabel: 'Manager',
                roleBgColor: const Color(0xFFF0C128),
                roleTextColor: const Color(0xFF241A00),
                imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
              ),
              const SizedBox(height: 16),
              _TeamMemberCard(
                name: 'Marcus Brookes',
                roleDesc: 'Cashier • m.brookes@curuza.com',
                roleLabel: 'Limited Access',
                roleBgColor: const Color(0xFFDFE2EA),
                roleTextColor: const Color(0xFF61646B),
                imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.1)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Team Capacity', style: TextStyle(color: Color(0xFF444747), fontSize: 14, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    const Text('3 / 10', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w900, fontSize: 32, color: Color(0xFF000000))),
                    const SizedBox(height: 16),
                    LinearProgressIndicator(
                      value: 0.3,
                      backgroundColor: const Color(0xFFE7E8EA),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFFDE336)),
                      minHeight: 8,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.1)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Recent Activity', style: TextStyle(color: Color(0xFF444747), fontSize: 14, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _FacepileAvatar('https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop', offset: 0),
                        _FacepileAvatar('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop', offset: -12),
                        Transform.translate(
                          offset: const Offset(-24, 0),
                          child: Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: const Color(0xFFE0C70F),
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFFF3F4F6), width: 2),
                            ),
                            child: const Center(child: Text('+4', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF201C00)))),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text('Last login: 14 mins ago', style: TextStyle(fontSize: 12, color: Color(0xFF444747), fontStyle: FontStyle.italic)),
                  ],
                ),
              ),
            ),
          ],
        )
      ],
    );

    Widget formSection = Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: const Color(0xFFC4C7C7).withValues(alpha: 0.1)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 32, offset: const Offset(0, 12))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Add Member', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 24, color: Color(0xFF000000))),
          const SizedBox(height: 32),
          
          const Text('Full Name', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF000000))),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(12)),
            child: const TextField(
              decoration: InputDecoration(
                hintText: 'e.g. Sarah Jenkins',
                hintStyle: TextStyle(color: Color(0xFF747878)),
                border: InputBorder.none,
                contentPadding: EdgeInsets.all(16),
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          const Text('Role Selection', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF000000))),
          const SizedBox(height: 12),
          
          _RoleRadio(title: 'Manager', desc: 'Full access to reports and inventory.', icon: Icons.manage_accounts, groupValue: selectedRole, onChanged: onRoleSelected),
          const SizedBox(height: 12),
          _RoleRadio(title: 'Cashier', desc: 'Sales processing and customer management only.', icon: Icons.point_of_sale, groupValue: selectedRole, onChanged: onRoleSelected),
          const SizedBox(height: 12),
          _RoleRadio(title: 'Inventory Clerk', desc: 'Stock counts and supplier updates.', icon: Icons.inventory_2, groupValue: selectedRole, onChanged: onRoleSelected),
          
          const SizedBox(height: 32),
          const Divider(height: 1, color: Color(0xFFDFE2EA)),
          const SizedBox(height: 24),
          const Text('LOGIN CREDENTIALS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2.0, color: Color(0xFF444747))),
          const SizedBox(height: 16),
          
          const Text('Email Address', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF000000))),
          const SizedBox(height: 4),
          Container(
            decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(12)),
            child: const TextField(
              decoration: InputDecoration(
                hintText: 'staff@curuza.com',
                border: InputBorder.none,
                contentPadding: EdgeInsets.all(12),
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          const Text('Temporary Password', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF000000))),
          const SizedBox(height: 4),
          Container(
            decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(12)),
            child: const TextField(
              obscureText: true,
              decoration: InputDecoration(
                hintText: '••••••••',
                suffixIcon: Icon(Icons.visibility, color: Color(0xFF747878), size: 20),
                border: InputBorder.none,
                contentPadding: EdgeInsets.all(12),
              ),
            ),
          ),
          
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFFFBE134), Color(0xFFF0C128)]),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 10, offset: const Offset(0, 4))],
              ),
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('CONFIRM TEAM MEMBER', style: TextStyle(color: Color(0xFF201C00), fontWeight: FontWeight.w900, fontFamily: 'Manrope', letterSpacing: 0.5)),
              ),
            ),
          ),
        ],
      ),
    );

    if (isDesktop) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(flex: 7, child: teamSection),
          const SizedBox(width: 32),
          Expanded(flex: 5, child: formSection),
        ],
      );
    } else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          teamSection,
          const SizedBox(height: 32),
          formSection,
        ],
      );
    }
  }
}

class _TeamMemberCard extends StatelessWidget {
  final String name;
  final String roleDesc;
  final String roleLabel;
  final Color roleBgColor;
  final Color roleTextColor;
  final Widget? avatarChild;
  final Color? avatarBgColor;
  final String? imageUrl;

  const _TeamMemberCard({
    required this.name,
    required this.roleDesc,
    required this.roleLabel,
    required this.roleBgColor,
    required this.roleTextColor,
    this.avatarChild,
    this.avatarBgColor,
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: avatarBgColor ?? Colors.grey.shade200,
                  shape: BoxShape.circle,
                  image: imageUrl != null ? DecorationImage(image: NetworkImage(imageUrl!), fit: BoxFit.cover) : null,
                ),
                child: avatarChild,
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF000000))),
                  const SizedBox(height: 2),
                  Text(roleDesc, style: const TextStyle(fontSize: 12, color: Color(0xFF444747))),
                ],
              ),
            ],
          ),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(color: roleBgColor, borderRadius: BorderRadius.circular(20)),
                child: Text(roleLabel.toUpperCase(), style: TextStyle(color: roleTextColor, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
              ),
              const SizedBox(width: 12),
              const Icon(Icons.more_vert, color: Color(0xFF747878)),
            ],
          )
        ],
      ),
    );
  }
}

class _FacepileAvatar extends StatelessWidget {
  final String imgPath;
  final double offset;

  const _FacepileAvatar(this.imgPath, {required this.offset});

  @override
  Widget build(BuildContext context) {
    return Transform.translate(
      offset: Offset(offset, 0),
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: const Color(0xFFF3F4F6), width: 2),
          image: DecorationImage(image: NetworkImage(imgPath), fit: BoxFit.cover),
        ),
      ),
    );
  }
}

class _RoleRadio extends StatelessWidget {
  final String title;
  final String desc;
  final IconData icon;
  final String groupValue;
  final ValueChanged<String> onChanged;

  const _RoleRadio({
    required this.title,
    required this.desc,
    required this.icon,
    required this.groupValue,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final bool isSelected = title == groupValue;

    return InkWell(
      onTap: () => onChanged(title),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? const Color(0xFFE0C70F) : Colors.transparent, width: 2),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? const Color(0xFFE0C70F) : const Color(0xFF5B5F65), size: 24),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: isSelected ? const Color(0xFF000000) : const Color(0xFF191C1E))),
                  const SizedBox(height: 2),
                  Text(desc, style: const TextStyle(fontSize: 12, color: Color(0xFF444747))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
