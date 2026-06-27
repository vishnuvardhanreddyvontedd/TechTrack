import 'package:flutter/material.dart';

class MentorChatScreen extends StatelessWidget {
  const MentorChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Mentor')),
      body: Column(
        children: [
          const Expanded(
            child: Center(child: Text('Ask for examples, practice questions, reviews, or motivation.')),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                const Expanded(child: TextField(decoration: InputDecoration(labelText: 'Message'))),
                IconButton(onPressed: () {}, icon: const Icon(Icons.send)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
