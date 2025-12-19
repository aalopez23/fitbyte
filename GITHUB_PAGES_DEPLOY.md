# Deploying FitByte to GitHub Pages

## Step 1: Update the homepage URL

1. Open `client/package.json`
2. Find the `"homepage"` line (should be around line 3)
3. Replace `YOUR_USERNAME` with your GitHub username
   - Example: `"homepage": "https://tonio.github.io/fitbyte"`
   - Or if using a custom domain: `"homepage": "https://yourdomain.com"`

## Step 2: Install gh-pages package

```bash
cd client
npm install --save-dev gh-pages
```

## Step 3: Initialize Git (if not already done)

If you haven't already initialized git in your project:

```bash
cd /Users/tonio/Desktop/fitbyte
git init
git add .
git commit -m "Initial commit"
```

## Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository

   - Name it: `fitbyte` (or whatever you prefer)
   - Make it public (GitHub Pages free tier requires public repos, or upgrade to use private)
   - Don't initialize with README (if you already have code)

2. Connect your local repo to GitHub:

```bash
cd /Users/tonio/Desktop/fitbyte
git remote add origin https://github.com/YOUR_USERNAME/fitbyte.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 5: Deploy to GitHub Pages

```bash
cd client
npm run deploy
```

This will:

- Build your React app
- Create a `gh-pages` branch
- Push it to GitHub
- Enable GitHub Pages automatically

## Step 6: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

Your site will be available at: `https://YOUR_USERNAME.github.io/fitbyte`

## Step 7: Update Environment Variables (Important!)

Since your Supabase credentials are hardcoded in `client/src/lib/supabase.ts`, they will work in production. However, if you want to use environment variables:

1. The credentials are already in the code, so it should work as-is
2. If you want to use different credentials for production, you'd need to:
   - Create a `.env.production` file in the `client` folder
   - Add: `REACT_APP_SUPABASE_URL=...` and `REACT_APP_SUPABASE_ANON_KEY=...`
   - Rebuild: `npm run build`
   - Redeploy: `npm run deploy`

## Future Updates

To update your deployed site after making changes:

```bash
cd client
npm run deploy
```

That's it! Your app will be live on GitHub Pages.

## Troubleshooting

- **404 errors on routes**: This is common with React Router on GitHub Pages. The routes should work, but if you have issues, you might need to add a `404.html` file that redirects to `index.html`, or configure GitHub Pages to serve from the root.

- **Build fails**: Make sure all dependencies are installed: `npm install` in the client folder

- **Site shows blank page**: Check browser console for errors. Make sure Supabase URL and keys are correct.
