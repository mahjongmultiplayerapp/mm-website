# mm-website

## Manual binary asset copy

Binary image files are intentionally not checked in under `public/assets` and `public/uploads`.

Before local run or Vercel deployment, copy them from the source folder:

```bash
cp -R "Mahjong Multiplayer Website Source/assets/." public/assets/
cp -R "Mahjong Multiplayer Website Source/uploads/." public/uploads/
```

Required source folders:
- `Mahjong Multiplayer Website Source/assets/`
- `Mahjong Multiplayer Website Source/uploads/`
