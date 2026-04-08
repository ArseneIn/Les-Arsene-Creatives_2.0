import 'package:flutter/material.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: SafeArea(
        child: Column(
          children: [
            const _OnboardingHeader(),
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 48.0, horizontal: 24.0),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1024),
                      child: const _OnboardingContent(),
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

class _OnboardingHeader extends StatelessWidget {
  const _OnboardingHeader();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      color: const Color(0xFFF8F9FB),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'Smart-Curuza',
            style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w900, fontSize: 24, color: Color(0xFF0B0C0C), letterSpacing: -0.5),
          ),
          Row(
            children: [
              if (MediaQuery.of(context).size.width >= 768)
                const Padding(
                  padding: EdgeInsets.only(right: 24),
                  child: Text(
                    'Set Up Your Shop',
                    style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFFE0C70F), letterSpacing: -0.5),
                  ),
                ),
              Container(
                width: 40,
                height: 40,
                decoration: const BoxDecoration(
                  color: Color(0xFFE7E8EA),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.person, color: Color(0xFF61646B)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _OnboardingContent extends StatelessWidget {
  const _OnboardingContent();

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 768;

    Widget editorialSection = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(color: const Color(0xFFDFE2EA), borderRadius: BorderRadius.circular(20)),
          child: const Text('ONBOARDING', style: TextStyle(color: Color(0xFF61646B), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2.0)),
        ),
        const SizedBox(height: 24),
        Text(
          isDesktop ? 'Empower your\nbusiness journey.' : 'Empower your business journey.',
          style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w900, fontSize: isDesktop ? 48 : 36, color: const Color(0xFF000000), letterSpacing: -1.5, height: 1.1),
        ),
        const SizedBox(height: 16),
        const Text(
          'Join thousands of merchants using our golden precision tools to scale their retail and wholesale operations.',
          style: TextStyle(color: Color(0xFF5B5F65), fontSize: 16, height: 1.6),
        ),
        const SizedBox(height: 32),
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 32, offset: const Offset(0, 12))],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.verified_user, color: Color(0xFFE0C70F), size: 28),
                    const SizedBox(height: 8),
                    const Text('Secure Core', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 14)),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.insights, color: Color(0xFFE0C70F), size: 28),
                    const SizedBox(height: 8),
                    const Text('Live Analytics', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 14)),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),
        Container(
          height: 192,
          decoration: BoxDecoration(
            color: const Color(0xFF2E3132),
            borderRadius: BorderRadius.circular(12),
            image: const DecorationImage(
              image: NetworkImage('https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=600&auto=format&fit=crop'),
              fit: BoxFit.cover,
            ),
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: LinearGradient(begin: Alignment.bottomCenter, end: Alignment.topCenter, colors: [Colors.black.withValues(alpha: 0.8), Colors.transparent]),
            ),
            alignment: Alignment.bottomLeft,
            padding: const EdgeInsets.all(24),
            child: const Text('Your brand, elevated by our precision.', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14)),
          ),
        ),
      ],
    );

    Widget formSection = Container(
      padding: EdgeInsets.all(isDesktop ? 48.0 : 32.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 64, offset: const Offset(0, 24))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Shop Profile', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 24, color: Color(0xFF000000))),
          const SizedBox(height: 8),
          const Text('Please provide your official business details to initialize your merchant account.', style: TextStyle(color: Color(0xFF5B5F65), fontSize: 14)),
          const SizedBox(height: 40),
          _CustomTextField(label: 'Shop Name', hintText: 'e.g. Curuza Boutique'),
          const SizedBox(height: 24),
          const _CustomTextField(label: 'Category', hintText: 'Select Category', isDropdown: true),
          const SizedBox(height: 24),
          _CustomTextField(label: 'Business Location', hintText: 'Enter full business address', icon: Icons.location_on),
          const SizedBox(height: 24),
          _CustomTextField(label: 'Tax Identification Number (TIN)', hintText: '000-000-000', helperText: 'TIN is required for processing high-volume transactions securely.'),
          
          const SizedBox(height: 48),
          Flex(
            direction: isDesktop ? Axis.horizontal : Axis.vertical,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: isDesktop ? CrossAxisAlignment.center : CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: isDesktop ? MainAxisAlignment.start : MainAxisAlignment.center,
                children: [
                  const Icon(Icons.lock, color: Color(0xFF5B5F65), size: 16),
                  const SizedBox(width: 8),
                  const Text('Encrypted Data Processing', style: TextStyle(color: Color(0xFF5B5F65), fontSize: 12, fontWeight: FontWeight.w600)),
                ],
              ),
              if (!isDesktop) const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  foregroundColor: const Color(0xFF201C00),
                  padding: EdgeInsets.zero,
                  elevation: 12,
                  shadowColor: const Color(0xFFFBE134).withValues(alpha: 0.3),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
                child: Ink(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFFFBE134), Color(0xFFF0C128)]),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
                    child: const Text('Complete Setup', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 0.5)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );

    if (isDesktop) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(flex: 5, child: editorialSection),
          const SizedBox(width: 64),
          Expanded(flex: 7, child: formSection),
        ],
      );
    } else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          editorialSection,
          const SizedBox(height: 48),
          formSection,
        ],
      );
    }
  }
}

class _CustomTextField extends StatelessWidget {
  final String label;
  final String hintText;
  final IconData? icon;
  final bool isDropdown;
  final String? helperText;

  const _CustomTextField({
    required this.label,
    required this.hintText,
    this.icon,
    this.isDropdown = false,
    this.helperText,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4.0),
          child: Text(label.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2.0, color: Color(0xFF5B5F65))),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(8),
          ),
          child: TextField(
            readOnly: isDropdown,
            decoration: InputDecoration(
              hintText: hintText,
              hintStyle: TextStyle(color: const Color(0xFF747878).withValues(alpha: 0.5), fontWeight: FontWeight.w500),
              prefixIcon: icon != null ? Icon(icon, color: const Color(0xFFE0C70F)) : null,
              suffixIcon: isDropdown ? const Icon(Icons.expand_more, color: Color(0xFF5B5F65)) : null,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            ),
          ),
        ),
        if (helperText != null) ...[
          const SizedBox(height: 6),
          Padding(
            padding: const EdgeInsets.only(left: 4.0),
            child: Text(helperText!, style: TextStyle(fontSize: 10, color: const Color(0xFF5B5F65).withValues(alpha: 0.7))),
          ),
        ]
      ],
    );
  }
}
