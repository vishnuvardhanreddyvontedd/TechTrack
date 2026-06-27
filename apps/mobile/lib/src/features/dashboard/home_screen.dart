import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = {
      'Roadmap': '/roadmap',
      'Daily task': '/daily-task',
      'AI mentor': '/mentor',
      'Progress': '/progress',
      'Profile': '/profile',
      'Settings': '/settings',
      'Streak': '/streak',
    };

    return Scaffold(
      appBar: AppBar(title: const Text('TechTrack AI')),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        children: items.entries.map((entry) {
          return Card(
            child: InkWell(
              onTap: () => Navigator.pushNamed(context, entry.value),
              child: Center(child: Text(entry.key, style: const TextStyle(fontWeight: FontWeight.w700))),
            ),
          );
        }).toList(),
      ),
    );
  }
}
