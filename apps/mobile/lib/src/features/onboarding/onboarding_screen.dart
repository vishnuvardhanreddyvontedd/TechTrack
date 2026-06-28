import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api_client.dart';
import '../../core/providers.dart';
import '../../shared/screen_shell.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _goalController = TextEditingController(text: 'Full Stack Developer');
  final _minutesController = TextEditingController(text: '60');
  final _weeksController = TextEditingController(text: '12');
  final _skillsController = TextEditingController();
  final _weakAreasController = TextEditingController();
  String _skillLevel = 'BEGINNER';
  String _learningStyle = 'PROJECT_BASED';
  bool _isLoading = false;

  @override
  void dispose() {
    _goalController.dispose();
    _minutesController.dispose();
    _weeksController.dispose();
    _skillsController.dispose();
    _weakAreasController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _isLoading = true);
    try {
      await ref.read(apiClientProvider).postData('/api/onboarding', {
        'careerGoal': _goalController.text.trim(),
        'skillLevel': _skillLevel,
        'dailyAvailableMinutes': int.tryParse(_minutesController.text) ?? 60,
        'preferredLearningStyle': _learningStyle,
        'targetTimelineWeeks': int.tryParse(_weeksController.text) ?? 12,
        'existingSkills': _splitCsv(_skillsController.text),
        'weakAreas': _splitCsv(_weakAreasController.text),
      });
      await ref.read(apiClientProvider).postData('/api/roadmap/generate', {
        'goal': _goalController.text.trim(),
        'durationDays': ((int.tryParse(_weeksController.text) ?? 12) * 7).clamp(7, 90),
      });
      if (mounted) Navigator.pushReplacementNamed(context, '/home');
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(ApiClient.messageFromError(error))),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  List<String> _splitCsv(String value) {
    return value.split(',').map((item) => item.trim()).where((item) => item.isNotEmpty).toList();
  }

  @override
  Widget build(BuildContext context) {
    return ScreenShell(
      title: 'Build your roadmap',
      actionLabel: _isLoading ? 'Saving...' : 'Save roadmap profile',
      onAction: _isLoading ? null : _save,
      children: [
        TextField(controller: _goalController, decoration: const InputDecoration(labelText: 'Career goal')),
        DropdownButtonFormField<String>(
          initialValue: _skillLevel,
          decoration: const InputDecoration(labelText: 'Current skill level'),
          items: const [
            DropdownMenuItem(value: 'BEGINNER', child: Text('Beginner')),
            DropdownMenuItem(value: 'INTERMEDIATE', child: Text('Intermediate')),
            DropdownMenuItem(value: 'ADVANCED', child: Text('Advanced')),
          ],
          onChanged: (value) => setState(() => _skillLevel = value ?? _skillLevel),
        ),
        TextField(
          controller: _minutesController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Daily available minutes'),
        ),
        DropdownButtonFormField<String>(
          initialValue: _learningStyle,
          decoration: const InputDecoration(labelText: 'Learning style'),
          items: const [
            DropdownMenuItem(value: 'READING', child: Text('Reading')),
            DropdownMenuItem(value: 'VIDEO', child: Text('Video')),
            DropdownMenuItem(value: 'PROJECT_BASED', child: Text('Project based')),
            DropdownMenuItem(value: 'MIXED', child: Text('Mixed')),
          ],
          onChanged: (value) => setState(() => _learningStyle = value ?? _learningStyle),
        ),
        TextField(
          controller: _weeksController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Target timeline weeks'),
        ),
        TextField(controller: _skillsController, decoration: const InputDecoration(labelText: 'Existing skills')),
        TextField(controller: _weakAreasController, decoration: const InputDecoration(labelText: 'Weak areas')),
      ],
    );
  }
}
