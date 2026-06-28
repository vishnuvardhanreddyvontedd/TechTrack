import 'package:dio/dio.dart';

import 'api_client_io.dart' if (dart.library.html) 'api_client_web.dart';

class ApiClient {
  ApiClient({
    Dio? dio,
    this.baseUrl = const String.fromEnvironment(
      'TECHTRACK_API_URL',
      defaultValue: 'http://localhost:3000',
    ),
  }) : _dio = dio ??
            Dio(
              BaseOptions(
                baseUrl: baseUrl,
                connectTimeout: const Duration(seconds: 10),
                receiveTimeout: const Duration(seconds: 20),
                headers: {'Content-Type': 'application/json'},
              ),
            ) {
    configureApiClient(_dio);
  }

  final Dio _dio;
  final String baseUrl;

  Future<Response<dynamic>> get(String path) async {
    return _dio.get(path);
  }

  Future<Response<dynamic>> post(String path, Object? data) async {
    return _dio.post(path, data: data);
  }

  Future<Map<String, dynamic>> getData(String path) async {
    final response = await get(path);
    return _unwrap(response.data);
  }

  Future<Map<String, dynamic>> postData(String path, Map<String, dynamic> data) async {
    final response = await post(path, data);
    return _unwrap(response.data);
  }

  Map<String, dynamic> _unwrap(dynamic payload) {
    if (payload is Map<String, dynamic>) {
      if (payload['ok'] == false) {
        throw ApiException(payload['error']?.toString() ?? 'Request failed');
      }

      final data = payload['data'];
      if (data is Map<String, dynamic>) return data;
      return {'value': data};
    }

    throw ApiException('Unexpected server response');
  }

  static String messageFromError(Object error) {
    if (error is ApiException) return error.message;
    if (error is DioException) {
      final data = error.response?.data;
      if (data is Map && data['error'] != null) return data['error'].toString();
      if (error.type == DioExceptionType.connectionError) {
        return 'Cannot reach the backend. Start the web app on port 3000.';
      }
      return error.message ?? 'Request failed';
    }

    return error.toString();
  }
}

class ApiException implements Exception {
  const ApiException(this.message);

  final String message;

  @override
  String toString() {
    return message;
  }
}
