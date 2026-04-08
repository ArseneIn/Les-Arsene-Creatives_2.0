import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFFBE134), // Gold/Yellow mapping the Stitch UI
        brightness: Brightness.light,
        surface: const Color(0xFFF8F9FB), // Light background
      ),
      scaffoldBackgroundColor: const Color(0xFFF8F9FB),
      typography: Typography.material2021(),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFFBE134),
        brightness: Brightness.dark,
        surface: const Color(0xFF0B0C0C),
      ),
      scaffoldBackgroundColor: const Color(0xFF0B0C0C),
      typography: Typography.material2021(),
    );
  }
}
