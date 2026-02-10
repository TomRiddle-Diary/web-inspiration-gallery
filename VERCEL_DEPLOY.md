# Vercelデプロイ手順

このアプリケーションを無料でVercelにデプロイする手順です。

## 📋 必要なもの

1. **Vercelアカウント** - https://vercel.com （GitHubアカウントでサインアップ）
2. **Supabaseアカウント** - https://supabase.com （無料プラン）

---

## 🚀 ステップ1: Supabaseのセットアップ

### 1.1 プロジェクト作成

1. [Supabase](https://supabase.com)にログイン
2. 「New Project」をクリック
3. プロジェクト名を入力（例: `inspiration-app`）
4. データベースパスワードを設定（メモしておく）
5. リージョンを選択（日本なら`Northeast Asia (Tokyo)`）
6. 「Create new project」をクリック

### 1.2 データベーススキーマの作成

1. 左サイドバーの「SQL Editor」をクリック
2. 「New query」をクリック
3. `supabase-schema.sql`の内容を全てコピー＆ペースト
4. 「Run」をクリックしてスキーマを作成

### 1.3 認証情報の取得

1. 左サイドバーの「Settings」→「API」をクリック
2. 以下をメモ：
   - **Project URL** (例: `https://xxxxx.supabase.co`)
   - **anon public key** (公開用キー)
   - **service_role key** (サーバー用キー、**秘密に保つ！**)

---

## 🚀 ステップ2: Vercelへのデプロイ

### 2.1 GitHubにプッシュ

```powershell
# プロジェクトディレクトリで実行
git init
git add .
git commit -m "Initial commit for Vercel deployment"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/inspiration-app.git
git push -u origin main
```

### 2.2 Vercelでインポート

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択
4. 「Import」をクリック

### 2.3 環境変数の設定

「Environment Variables」セクションで以下を追加：

| Name | Value |
|------|-------|
| `SUPABASE_URL` | Supabaseの Project URL |
| `SUPABASE_ANON_KEY` | Supabaseの anon public key |
| `SUPABASE_SERVICE_KEY` | Supabaseの service_role key ⚠️ |

⚠️ `SUPABASE_SERVICE_KEY`は**秘密**です。Production環境のみに設定してください。

### 2.4 デプロイ実行

1. 「Deploy」をクリック
2. ビルドが完了するまで待機（3-5分）
3. デプロイ完了！🎉

---

## 🎨 ステップ3: Vercel Blobの有効化

画像保存のためにVercel Blobを有効にします。

1. Vercel Dashboardでプロジェクトを開く
2. 「Storage」タブをクリック
3. 「Create Database」→「Blob」を選択
4. 「Continue」をクリック
5. 自動的に環境変数`BLOB_READ_WRITE_TOKEN`が追加されます

---

## ✅ 確認

デプロイされたURLにアクセスして動作確認：

1. プロジェクト選択画面が表示される
2. 新しいプロジェクトを作成できる
3. ウェブサイトURLを追加してスクレイピングが成功する

---

## 🔧 トラブルシューティング

### Puppeteerのエラー

Vercelの無料プランでは、Puppeteerの実行に制約があります。
エラーが出る場合は、Vercel Proプラン（月$20）にアップグレードするか、
以下の代替案を検討してください：

**代替案:**
- RenderやRailwayなど、別のプラットフォームを使用
- スクレイピング機能を別のサービスに分離

### データベース接続エラー

- 環境変数が正しく設定されているか確認
- Supabaseのプロジェクトが起動しているか確認
- `supabase-schema.sql`が正しく実行されたか確認

---

## 📝 注意事項

### 無料プランの制限

**Vercel:**
- ビルド時間: 月6,000分
- 帯域幅: 月100GB
- Serverless Function実行時間: 10秒（Hobbyプラン）

**Supabase:**
- データベース容量: 500MB
- 帯域幅: 月5GB
- APIリクエスト: 無制限

### セキュリティ

現在、認証機能はありません。デプロイ後は以下を検討してください：

1. **Basic認証の追加**
2. **IPアドレス制限**
3. **Supabase Row Level Security（RLS）の設定**

---

## 🔄 更新デプロイ

コードを更新してGitHubにプッシュすると、Vercelが自動的に再デプロイします：

```powershell
git add .
git commit -m "Update features"
git push
```

---

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. Vercelのビルドログ
2. Supabaseのログ（Dashboard → Logs）
3. ブラウザのコンソールログ

---

## 🎉 完了！

おめでとうございます！アプリケーションが無料でホスティングされました。

**次のステップ:**
- カスタムドメインの設定
- 認証機能の追加
- パフォーマンス最適化
