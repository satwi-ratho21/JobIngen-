# Vercel Deployment Guide for EduBridge

## Prerequisites
- GitHub repository connected to Vercel
- Node.js 18.x or higher
- Vercel CLI (optional): `npm i -g vercel`

## Environment Variables

Set these in your Vercel project settings (Project Settings → Environment Variables):

### Required Variables
```
API_KEY=your_google_generative_ai_key
NODE_ENV=production
```

### Optional Variables
```
VITE_API_URL=https://your-vercel-domain.vercel.app/api
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository (https://github.com/satwi-ratho21/JobIngen-)
3. Configure project:
   - **Framework Preset**: React
   - **Root Directory**: ./
   - **Build Command**: `npm run build --prefix client && npm run build --prefix server`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install --prefix client && npm install --prefix server`

4. Add Environment Variables:
   - Click "Add New" and create variables listed above
   - **API_KEY**: Your Google Generative AI API key
   - **NODE_ENV**: production

5. Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Navigate to project
cd path/to/proj

# Login to Vercel (first time only)
vercel login

# Deploy
vercel --prod

# Follow prompts to:
# - Confirm project name
# - Set framework (React)
# - Set root directory (./)
# - Override build settings (yes)
```

## Automatic Deployments

Once connected, Vercel will automatically deploy on every push to main:
- Push to `main` → Automatic production deployment
- Push to other branches → Preview deployments

## Configuration Details

### vercel.json
- **buildCommand**: Builds both client (React) and server (Node.js) 
- **outputDirectory**: Points to `client/dist` where the React app is built
- **rewrites**: Redirects API calls to serverless functions
- **functions**: Configures serverless API routes with Node.js runtime

### API Routes
- All API requests to `/api/*` are handled by the serverless functions in `/api` directory
- Express app is exported and automatically converted to serverless format

### How It Works

1. **Frontend (React)**:
   - Built from `client/src` using Vite
   - Output to `client/dist`
   - Served as static files from CDN
   - Automatically cached for performance

2. **Backend (Node.js)**:
   - Express server converted to serverless functions
   - Runs on Vercel's Node.js runtime
   - Handles all `/api/*` requests
   - Automatic scaling and cold start optimization

## Testing Deployment

After deployment completes:

```bash
# Test health check endpoint
curl https://your-vercel-domain.vercel.app/api/health

# Response should be:
# {"status":"ok","message":"EduBridge API is running","timestamp":"2026-03-17T..."}
```

## Troubleshooting

### Build Fails
- Check that both `client` and `server` have valid `package.json` files
- Ensure all dependencies are listed in package.json (not just package-lock.json)
- Check build logs in Vercel dashboard

### API Returns 404
- Verify environment variables are set correctly
- Check that API routes are properly configured in `/api`
- Test health check endpoint first

### CORS Errors
- Vercel headers are configured in `vercel.json`
- If using different domain for frontend, adjust CORS headers in vercel.json

### Cold Starts
- First request to serverless function takes 1-2 seconds
- Subsequent requests are faster
- This is normal behavior for serverless deployments

## Performance Tips

1. **Caching**: Static assets are cached indefinitely by CDN
2. **API Optimization**: Use Vercel's Edge Functions for low-latency APIs
3. **Database**: Connect to Firebase, MongoDB Atlas, or PostgreSQL
4. **Monitoring**: Enable Vercel Analytics for performance insights

## Updating Deployment

Simply push changes to GitHub:
```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel will automatically deploy the changes!

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [React + Vercel Deployment](https://vercel.com/guides/nextjs-react)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

For issues or questions:
- [Vercel Support](https://vercel.com/support)
- [GitHub Issues](https://github.com/satwi-ratho21/JobIngen-)
