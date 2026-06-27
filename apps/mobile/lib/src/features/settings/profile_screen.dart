import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Profile',
      children: [
        CircleAvatar(radius: 36, child: Icon(Icons.person)),
        SizedBox(height: 16),
        TextField(decoration: InputDecoration(labelText: 'Name')),
        TextField(decoration: InputDecoration(labelText: 'Career goal')),
      ],
    );
  }
}
