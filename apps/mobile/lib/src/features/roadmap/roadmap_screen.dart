import 'package:flutter/material.dart';

import '../../shared/screen_shell.dart';

class RoadmapScreen extends StatelessWidget {
  const RoadmapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ScreenShell(
      title: 'Roadmap',
      children: [
        ListTile(title: Text('Foundation'), subtitle: Text('Learn the core concepts')),
        ListTile(title: Text('Practice'), subtitle: Text('Complete daily exercises')),
        ListTile(title: Text('Portfolio'), subtitle: Text('Ship projects and prepare interviews')),
      ],
    );
  }
}
