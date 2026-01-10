import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFFFBE134), // Bright Gold
      primary: const Color(0xFFFBE134),
      secondary: const Color(0xFFE4B61A), // Saffron
      surface: const Color(0xFFFBFBFB), // Platinum 900
      onPrimary: const Color(0xFF0B0C0C), // Onyx
      onSurface: const Color(0xFF0B0C0C),
    ),
    scaffoldBackgroundColor: const Color(0xFFE9EAEC),
    textTheme: TextTheme(
      displayLarge: GoogleFonts.playfairDisplay(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: const Color(0xFF0B0C0C),
      ),
      titleLarge: GoogleFonts.playfairDisplay(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: const Color(0xFF0B0C0C),
      ),
      bodyLarge: GoogleFonts.lato(
        fontSize: 16,
        color: const Color(0xFF2A2E34), // Jet
      ),
      bodyMedium: GoogleFonts.lato(
        fontSize: 14,
        color: const Color(0xFF2A2E34),
      ),
      labelLarge: GoogleFonts.poppins(
        fontSize: 14,
        fontWeight: FontWeight.w600,
      ),
    ),
  );
}
