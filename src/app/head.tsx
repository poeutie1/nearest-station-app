// app/head.tsx
export default function Head() {
  return (
    <>
      <title>最寄り駅サーチ｜丸ノ内線・半蔵門線対応</title>
      <meta
        name="google-site-verification"
        content="xp9jSSenrBzCH0IBX3tLkJxeiIYhOnTAhkxcFVq1N5U"
      />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="最寄り駅サーチ" />
      <meta
        property="og:description"
        content="現在地から最寄り駅を自動で探すシンプルなWebアプリです。丸ノ内線と半蔵門線に対応。"
      />
      <meta property="og:url" content="https://<your-project>.vercel.app/" />
      <link rel="canonical" href="https://<your-project>.vercel.app/" />
    </>
  );
}
