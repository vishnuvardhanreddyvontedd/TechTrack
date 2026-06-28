# AI Prompting

Roadmap generation should request JSON only and validate the model output before writing to the database.

Required context:

- User name
- Career goal
- Skill level
- Daily available time
- Existing skills
- Weak areas
- Target timeline
- Preferred learning style

Expected shape:

```json
{
  "title": "Flutter Developer Roadmap",
  "durationWeeks": 12,
  "phases": [
    {
      "title": "Foundation",
      "description": "Learn Dart and Flutter basics",
      "modules": [
        {
          "title": "Dart Basics",
          "tasks": [
            {
              "title": "Learn variables and data types",
              "description": "Understand Dart variables, types, and null safety",
              "estimatedMinutes": 45,
              "xp": 50,
              "type": "LEARNING"
            }
          ]
        }
      ]
    }
  ]
}
```
