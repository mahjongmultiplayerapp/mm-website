# mm-website

## Manual binary asset copy

Binary image files are intentionally not checked in under `public/assets`.

Before local run or Vercel deployment, copy them from the source folder:

```bash
cp -R "Mahjong Multiplayer Website Source/assets/." public/assets/
```

Required source folder:
- `Mahjong Multiplayer Website Source/assets/`
