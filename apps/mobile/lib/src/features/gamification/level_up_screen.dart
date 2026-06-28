import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class LevelUpScreen extends StatelessWidget {
  const LevelUpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Level up',
      children: [
        Icon(Icons.emoji_events, size: 80),
        SizedBox(height: 12),
        Text('Level 4 unlocked'),
        Text('Your consistency is turning into visible skill.'),
      ],
    );
  }
}
