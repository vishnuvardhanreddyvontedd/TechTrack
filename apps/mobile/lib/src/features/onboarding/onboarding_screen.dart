import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenShell(
      title: 'Build your roadmap',
      actionLabel: 'Generate roadmap',
      onAction: () => Navigator.pushReplacementNamed(context, '/home'),
      children: const [
        TextField(decoration: InputDecoration(labelText: 'Career goal')),
        TextField(decoration: InputDecoration(labelText: 'Current skill level')),
        TextField(decoration: InputDecoration(labelText: 'Daily available time')),
        TextField(decoration: InputDecoration(labelText: 'Learning style')),
        TextField(decoration: InputDecoration(labelText: 'Existing skills')),
        TextField(decoration: InputDecoration(labelText: 'Weak areas')),
      ],
    );
  }
}
