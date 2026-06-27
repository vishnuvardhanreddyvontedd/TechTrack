import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Progress',
      children: [
        LinearProgressIndicator(value: 0.42),
        SizedBox(height: 16),
        Text('Level 3 - 1,250 XP - 5 day streak'),
      ],
    );
  }
}
