import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiClient {
  ApiClient({
    Dio? dio,
    FlutterSecureStorage? storage,
    this.baseUrl = const String.fromEnvironment(
      'TECHTRACK_API_URL',
      defaultValue: 'http://localhost:3000',
    ),
  })  : _dio = dio ?? Dio(BaseOptions(baseUrl: baseUrl)),
        _storage = storage ?? const FlutterSecureStorage();

  final Dio _dio;
  final FlutterSecureStorage _storage;
  final String baseUrl;

  Future<Response<dynamic>> get(String path) async {
    return _dio.get(path, options: await _options());
  }

  Future<Response<dynamic>> post(String path, Object? data) async {
    return _dio.post(path, data: data, options: await _options());
  }

  Future<void> saveToken(String token) => _storage.write(key: 'session_token', value: token);

  Future<Options> _options() async {
    final token = await _storage.read(key: 'session_token');
    return Options(headers: {
      if (token != null) 'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    });
  }
}
