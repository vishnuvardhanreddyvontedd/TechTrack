import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class DailyTaskScreen extends StatelessWidget {
  const DailyTaskScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Today',
      actionLabel: 'Complete task',
      children: [
        Text('Learning topic: API integration'),
        SizedBox(height: 12),
        Text('Practical task: call the TechTrack API and render a task list.'),
        SizedBox(height: 12),
        Text('Reward: 50 XP'),
      ],
    );
  }
}
