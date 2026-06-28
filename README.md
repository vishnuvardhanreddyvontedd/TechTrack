# TechTrack

TechTrack is organized as a small two-app monorepo:

- `website/` - Next.js web app and shared backend API route handlers.
- `mobile/` - Flutter frontend that consumes the website backend.

## Website

```bash
cd website
npm install
npm run dev
```

The shared backend lives in `website/app/api`. Run the website locally at `http://localhost:3000`; the Flutter app can point to the same backend with `TECHTRACK_API_URL`.

Useful website commands:

```bash
npm run build
npm run lint
npm run db:push
npm run db:seed
```

## Mobile

```bash
cd mobile
flutter pub get
flutter run --dart-define=TECHTRACK_API_URL=http://localhost:3000
```

For Android emulators, use `http://10.0.2.2:3000` instead of `localhost`.
