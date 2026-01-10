import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConstants {
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:3001';
    if (Platform.isAndroid) {
      // Use 10.0.2.2 for Emulator, or specific IP for physical device
      // return 'http://10.0.2.2:3001'; // Emulator
      return 'http://192.168.43.140:3001'; // Your PC's Local IP
    }
    return 'http://localhost:3001'; // iOS, Windows, macOS
  }

  static const String loginEndpoint = '/auth/login';
  static const String profileEndpoint = '/auth/profile';
  static const String productsEndpoint = '/products';
  static const String salesEndpoint = '/sales';
}
