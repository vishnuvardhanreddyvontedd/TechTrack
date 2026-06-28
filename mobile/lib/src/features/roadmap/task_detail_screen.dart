import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class TaskDetailScreen extends StatelessWidget {
  const TaskDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Task detail',
      actionLabel: 'Mark complete',
      children: [
        Text('Topic: Practical API integration'),
        SizedBox(height: 12),
        Text('Steps: read the resource, implement the exercise, answer the mini quiz, and commit your work.'),
        SizedBox(height: 12),
        Text('XP reward: 50'),
      ],
    );
  }
}
