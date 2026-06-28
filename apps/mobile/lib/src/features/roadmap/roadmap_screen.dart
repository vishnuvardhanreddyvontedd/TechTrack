import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api_client.dart';
import '../../core/providers.dart';
import '../../shared/screen_shell.dart';

class RoadmapScreen extends ConsumerStatefulWidget {
  const RoadmapScreen({super.key});

  @override
  ConsumerState<RoadmapScreen> createState() => _RoadmapScreenState();
}

class _RoadmapScreenState extends ConsumerState<RoadmapScreen> {
  late Future<Map<String, dynamic>> _roadmapsFuture;

  @override
  void initState() {
    super.initState();
    _roadmapsFuture = ref.read(apiClientProvider).getData('/api/roadmaps');
  }

  @override
  Widget build(BuildContext context) {
    return ScreenShell(
      title: 'Roadmap',
      children: [
        FutureBuilder<Map<String, dynamic>>(
          future: _roadmapsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState != ConnectionState.done) {
              return const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator()));
            }
            if (snapshot.hasError) {
              return Text(ApiClient.messageFromError(snapshot.error!));
            }

            final roadmaps = snapshot.data?['value'];
            if (roadmaps is! List || roadmaps.isEmpty) {
              return const Text('No roadmap yet. Complete onboarding first, then generate or select a roadmap.');
            }

            return Column(
              children: roadmaps.map<Widget>((roadmap) {
                final map = roadmap as Map;
                final template = map['template'] as Map?;
                final tasks = map['tasks'] as List? ?? [];
                final complete = tasks.where((task) => task is Map && task['isComplete'] == true).length;
                return ListTile(
                  leading: const Icon(Icons.route),
                  title: Text(template?['title']?.toString() ?? map['title']?.toString() ?? 'Career roadmap'),
                  subtitle: Text('$complete of ${tasks.length} tasks complete'),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }
}
