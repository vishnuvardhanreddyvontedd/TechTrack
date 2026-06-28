import 'package:flutter/material.dart';

import 'features/auth/login_screen.dart';
import 'features/auth/forgot_password_screen.dart';
import 'features/auth/register_screen.dart';
import 'features/auth/splash_screen.dart';
import 'features/dashboard/home_screen.dart';
import 'features/dashboard/progress_screen.dart';
import 'features/gamification/streak_screen.dart';
import 'features/gamification/badge_unlock_screen.dart';
import 'features/gamification/level_up_screen.dart';
import 'features/mentor/mentor_chat_screen.dart';
import 'features/onboarding/onboarding_screen.dart';
import 'features/roadmap/daily_task_screen.dart';
import 'features/roadmap/roadmap_screen.dart';
import 'features/roadmap/task_detail_screen.dart';
import 'features/settings/profile_screen.dart';
import 'features/settings/settings_screen.dart';

class TechTrackApp extends StatelessWidget {
  const TechTrackApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TechTrack AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff4f46e5)),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xff818cf8),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      routes: {
        '/': (_) => const SplashScreen(),
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/forgot-password': (_) => const ForgotPasswordScreen(),
        '/onboarding': (_) => const OnboardingScreen(),
        '/home': (_) => const HomeScreen(),
        '/roadmap': (_) => const RoadmapScreen(),
        '/daily-task': (_) => const DailyTaskScreen(),
        '/task-detail': (_) => const TaskDetailScreen(),
        '/mentor': (_) => const MentorChatScreen(),
        '/progress': (_) => const ProgressScreen(),
        '/profile': (_) => const ProfileScreen(),
        '/settings': (_) => const SettingsScreen(),
        '/streak': (_) => const StreakScreen(),
        '/badge-unlock': (_) => const BadgeUnlockScreen(),
        '/level-up': (_) => const LevelUpScreen(),
      },
    );
  }
}
