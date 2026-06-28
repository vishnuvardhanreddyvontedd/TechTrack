import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api_client.dart';
import '../../core/providers.dart';
import '../../shared/screen_shell.dart';

class DailyTaskScreen extends ConsumerStatefulWidget {
  const DailyTaskScreen({super.key});

  @override
  ConsumerState<DailyTaskScreen> createState() => _DailyTaskScreenState();
}

class _DailyTaskScreenState extends ConsumerState<DailyTaskScreen> {
  late Future<Map<String, dynamic>> _taskFuture;

  @override
  void initState() {
    super.initState();
    _taskFuture = ref.read(apiClientProvider).getData('/api/tasks/today');
  }

  Future<void> _complete(String id) async {
    try {
      await ref.read(apiClientProvider).postData('/api/tasks/$id/complete', {});
      setState(() => _taskFuture = ref.read(apiClientProvider).getData('/api/tasks/today'));
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Task completed. XP added.')));
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(ApiClient.messageFromError(error))));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScreenShell(
      title: 'Today',
      children: [
        FutureBuilder<Map<String, dynamic>>(
          future: _taskFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState != ConnectionState.done) {
              return const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator()));
            }
            if (snapshot.hasError) return Text(ApiClient.messageFromError(snapshot.error!));

            final tasks = snapshot.data?['tasks'];
            if (tasks is! List || tasks.isEmpty) {
              return const Text('No task scheduled yet. Create a roadmap first.');
            }

            return Column(
              children: tasks.map<Widget>((dailyPlanTask) {
                final map = dailyPlanTask as Map;
                final task = map['task'] as Map? ?? map;
                final template = task['dayTemplate'] as Map?;
                final isComplete = task['isComplete'] == true;
                return Card(
                  child: ListTile(
                    title: Text(template?['title']?.toString() ?? task['customTitle']?.toString() ?? 'Daily task'),
                    subtitle: Text(
                      template?['description']?.toString() ??
                          task['customDesc']?.toString() ??
                          'Complete your learning task.',
                    ),
                    trailing: isComplete
                        ? const Icon(Icons.check_circle)
                        : IconButton(
                            icon: const Icon(Icons.check),
                            onPressed: () => _complete(task['id'].toString()),
                          ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }
}
