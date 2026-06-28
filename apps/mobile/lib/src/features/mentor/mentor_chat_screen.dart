import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api_client.dart';
import '../../core/providers.dart';

class MentorChatScreen extends ConsumerStatefulWidget {
  const MentorChatScreen({super.key});

  @override
  ConsumerState<MentorChatScreen> createState() => _MentorChatScreenState();
}

class _MentorChatScreenState extends ConsumerState<MentorChatScreen> {
  final _messageController = TextEditingController();
  final List<({String role, String text})> _messages = [];
  String? _conversationId;
  bool _isSending = false;

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final message = _messageController.text.trim();
    if (message.isEmpty || _isSending) return;

    setState(() {
      _messages.add((role: 'You', text: message));
      _messageController.clear();
      _isSending = true;
    });

    try {
      final data = await ref.read(apiClientProvider).postData('/api/ai/mentor', {
        'message': message,
        if (_conversationId != null) 'conversationId': _conversationId,
      });
      setState(() {
        _conversationId = data['conversationId']?.toString();
        _messages.add((role: 'Mentor', text: data['reply']?.toString() ?? 'No reply received.'));
      });
    } catch (error) {
      setState(() => _messages.add((role: 'Error', text: ApiClient.messageFromError(error))));
    } finally {
      if (mounted) setState(() => _isSending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Mentor')),
      body: Column(
        children: [
          Expanded(
            child: _messages.isEmpty
                ? const Center(child: Text('Ask for examples, practice questions, reviews, or motivation.'))
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final message = _messages[index];
                      return ListTile(
                        title: Text(message.role),
                        subtitle: Text(message.text),
                      );
                    },
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: const InputDecoration(labelText: 'Message'),
                    onSubmitted: (_) => _send(),
                  ),
                ),
                IconButton(onPressed: _isSending ? null : _send, icon: const Icon(Icons.send)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
