import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class StreakScreen extends StatelessWidget {
  const StreakScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Streak',
      children: [
        Icon(Icons.local_fire_department, size: 72),
        SizedBox(height: 12),
        Text('5 day streak'),
        Text('Complete today\'s task to keep momentum.'),
      ],
    );
  }
}
