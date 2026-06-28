import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Settings',
      children: [
        SwitchListTile(value: true, onChanged: null, title: Text('Daily reminders')),
        SwitchListTile(value: false, onChanged: null, title: Text('Dark mode follows system')),
      ],
    );
  }
}
