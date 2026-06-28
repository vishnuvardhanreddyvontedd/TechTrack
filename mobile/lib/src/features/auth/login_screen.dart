import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const TextField(decoration: InputDecoration(labelText: 'Email')),
            const TextField(decoration: InputDecoration(labelText: 'Password'), obscureText: true),
            const SizedBox(height: 24),
            FilledButton(onPressed: () => Navigator.pushReplacementNamed(context, '/home'), child: const Text('Login')),
            TextButton(onPressed: () => Navigator.pushNamed(context, '/register'), child: const Text('Create account')),
            TextButton(onPressed: () => Navigator.pushNamed(context, '/forgot-password'), child: const Text('Forgot password')),
          ],
        ),
      ),
    );
  }
}
