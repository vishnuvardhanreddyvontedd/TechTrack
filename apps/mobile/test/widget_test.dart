import 'package:flutter_test/flutter_test.dart';
import 'package:techtrack_ai/src/app.dart';

void main() {
  testWidgets('renders TechTrack splash screen', (tester) async {
    await tester.pumpWidget(const TechTrackApp());
    expect(find.text('TechTrack AI'), findsOneWidget);
  });
}
