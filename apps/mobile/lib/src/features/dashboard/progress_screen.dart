import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api_client.dart';
import '../../core/providers.dart';
import '../../shared/screen_shell.dart';

class ProgressScreen extends ConsumerStatefulWidget {
  const ProgressScreen({super.key});

  @override
  ConsumerState<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends ConsumerState<ProgressScreen> {
  late Future<Map<String, dynamic>> _progressFuture;

  @override
  void initState() {
    super.initState();
    _progressFuture = ref.read(apiClientProvider).getData('/api/users/progress');
  }

  @override
  Widget build(BuildContext context) {
    return ScreenShell(
      title: 'Progress',
      children: [
        FutureBuilder<Map<String, dynamic>>(
          future: _progressFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState != ConnectionState.done) {
              return const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator()));
            }
            if (snapshot.hasError) return Text(ApiClient.messageFromError(snapshot.error!));

            final data = snapshot.data ?? {};
            final xp = data['xp'] as int? ?? 0;
            final level = data['level'] as int? ?? 1;
            final nextLevelXp = level * 1000;
            final progress = nextLevelXp == 0 ? 0.0 : (xp / nextLevelXp).clamp(0.0, 1.0);

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LinearProgressIndicator(value: progress),
                const SizedBox(height: 16),
                Text('Level $level - $xp XP - ${data['currentStreak'] ?? 0} day streak'),
                Text('${data['completedTasks'] ?? 0} tasks completed'),
              ],
            );
          },
        ),
      ],
    );
  }
}
