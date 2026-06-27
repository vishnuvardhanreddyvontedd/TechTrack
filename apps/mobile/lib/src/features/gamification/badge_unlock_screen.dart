import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class BadgeUnlockScreen extends StatelessWidget {
  const BadgeUnlockScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Badge unlocked',
      children: [
        Icon(Icons.workspace_premium, size: 80),
        SizedBox(height: 12),
        Text('First Win'),
        Text('Complete your first TechTrack task.'),
      ],
    );
  }
}
