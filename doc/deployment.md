# 🚀 Deployment Guide

This guide covers deploying SendLove to various platforms and environments. SendLove is designed to be easily deployable to modern cloud platforms.

## Quick Deploy Options

### One-Click Deploy

#### Render (Recommended)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Djochrist/SendLove)

#### Railway
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Djochrist/SendLove)

#### Vercel (Frontend Only)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Djochrist/SendLove)

## Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** installed locally
- **Git** repository set up
- **Package dependencies** installed (`npm install`)
- **Environment variables** configured

## Local Development Setup

### Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database (Future - currently using JSON storage)
# DATABASE_URL=postgresql://username:password@localhost:5432/sendlove_db

# Security
SESSION_SECRET=your-super-secret-key-change-this-in-production

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# FFmpeg (Optional - uses CDN by default)
FFMPEG_CORE_URL=https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js
FFMPEG_WASM_URL=https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Deployment Platforms

### 1. Render (Recommended for Full-Stack)

Render provides free tier with automatic SSL, custom domains, and persistent disks.

#### Setup Steps

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub account

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:

```yaml
# Service Configuration
Name: sendlove-app
Environment: Node
Build Command: npm install && npm run build
Start Command: npm start
```

3. **Environment Variables**
   Add these in the "Environment" tab:

```env
NODE_ENV=production
SESSION_SECRET=your-secret-key-here
```

4. **Persistent Storage (Optional)**
   - Add a "Disk" in Render dashboard
   - Mount path: `/home/render/project/src/data`
   - This preserves video request data between deployments

5. **Custom Domain (Optional)**
   - Go to "Settings" → "Custom Domain"
   - Add your domain and configure DNS

#### Render Features Used
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Persistent storage
- ✅ Environment variables
- ✅ Build previews
- ✅ Rollback capability

### 2. Railway

Railway offers instant deployments with PostgreSQL integration.

#### Setup Steps

1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)

2. **Deploy from GitHub**
   - Click "Deploy from GitHub"
   - Connect your repository
   - Railway auto-detects Node.js

3. **Environment Variables**
   ```env
   NODE_ENV=production
   SESSION_SECRET=your-secret-key
   ```

4. **Database Setup (Future)**
   ```bash
   # Add PostgreSQL plugin in Railway dashboard
   # Railway automatically sets DATABASE_URL
   ```

#### Railway Features
- ✅ Instant deployment
- ✅ Built-in PostgreSQL
- ✅ Automatic scaling
- ✅ Custom domains

### 3. DigitalOcean App Platform

Good for teams needing more control over infrastructure.

#### Setup Steps

1. **Create DO Account**
   - Sign up at [digitalocean.com](https://digitalocean.com)

2. **Create App**
   ```yaml
   # app.yaml
   name: sendlove
   services:
   - name: web
     source_dir: /
     github:
       repo: yourusername/sendlove
       branch: main
     run_command: npm start
     build_command: npm install && npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: SESSION_SECRET
       value: your-secret-key
   ```

#### DigitalOcean Features
- ✅ Static IP
- ✅ Load balancers
- ✅ Managed databases
- ✅ Monitoring

### 4. AWS (Advanced)

For enterprise deployments requiring high scalability.

#### Option A: Elastic Beanstalk

```yaml
# .ebextensions/node-settings.config
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    SESSION_SECRET: your-secret-key
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: 18.17.0
    GzipCompression: true
```

#### Option B: ECS with Fargate

```yaml
# docker-compose.yml
version: '3.8'
services:
  sendlove:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=your-secret-key
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=sendlove
      - POSTGRES_USER=sendlove
      - POSTGRES_PASSWORD=your-password
```

### 5. Google Cloud Platform

#### App Engine (Simple)

```yaml
# app.yaml
runtime: nodejs18
env_variables:
  NODE_ENV: production
  SESSION_SECRET: your-secret-key

handlers:
- url: /.*
  script: auto
```

#### Cloud Run (Containerized)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### 6. Vercel + Railway (Hybrid)

Deploy frontend to Vercel, backend to Railway.

#### Frontend (Vercel)

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-railway-app.up.railway.app/api/$1" }
  ]
}
```

#### Backend (Railway)

Deploy backend separately to Railway as described above.

## Docker Deployment

### Dockerfile

```dockerfile
# Use Node.js 18 Alpine for smaller image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sendlove -u 1001

# Change ownership
RUN chown -R sendlove:nodejs /app
USER sendlove

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
```

### Docker Compose (Development)

```yaml
version: '3.8'
services:
  sendlove:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=sendlove
      - POSTGRES_USER=sendlove
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Database Setup

### PostgreSQL (Production Ready)

```sql
-- Create database
CREATE DATABASE sendlove_db;

-- Create user
CREATE USER sendlove_user WITH PASSWORD 'your-password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE sendlove_db TO sendlove_user;

-- Create tables (future migration)
-- Tables will be created by migration scripts
```

### Migration Scripts

```bash
# Run migrations (when implemented)
npm run db:migrate

# Seed database (when implemented)
npm run db:seed
```

## CDN Setup

### Cloudflare

1. **Add Site**
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Add your domain

2. **Configure DNS**
   - Point domain to your server IP
   - Enable CDN features

3. **SSL/TLS**
   - Enable "Always Use HTTPS"
   - Set SSL mode to "Full (strict)"

### AWS CloudFront

```yaml
# CloudFront distribution configuration
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: your-app-domain.com
            Id: SendLoveOrigin
        Enabled: true
        DefaultCacheBehavior:
          TargetOriginId: SendLoveOrigin
          ViewerProtocolPolicy: redirect-to-https
```

## Monitoring & Analytics

### Application Monitoring

#### Sentry (Error Tracking)

```bash
npm install @sentry/node @sentry/react
```

```typescript
// server/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

#### Application Metrics

```bash
# Prometheus metrics
npm install prom-client

# Custom metrics
const collectDefaultMetrics = register.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'sendlove_' });
```

### Performance Monitoring

#### Google Analytics

```html
<!-- client/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Core Web Vitals

```typescript
// client/src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Security Checklist

### Pre-Deployment

- [ ] Change default SESSION_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure headers (helmet.js)
- [ ] Validate all environment variables
- [ ] Set up proper logging
- [ ] Configure rate limiting

### Production Security

```typescript
// server/index.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version

# Verify build scripts
npm run build
```

#### Runtime Errors

```bash
# Check environment variables
echo $NODE_ENV
echo $PORT

# View application logs
# (Platform-specific commands)
```

#### Database Connection Issues

```bash
# Test database connection
npm run db:test

# Check connection string
echo $DATABASE_URL
```

### Performance Issues

#### Memory Usage

```bash
# Monitor memory usage
node --expose-gc --max-old-space-size=4096

# Check for memory leaks
npm install clinic
clinic heapprofiler -- node dist/index.js
```

#### Slow Response Times

```bash
# Enable query logging
process.env.DEBUG='*'

# Profile application
npm install 0x
0x dist/index.js
```

## Backup & Recovery

### Data Backup

```bash
# Database backup (PostgreSQL)
pg_dump sendlove_db > backup.sql

# File system backup
tar -czf uploads_backup.tar.gz client/public/uploads/
```

### Disaster Recovery

1. **Code Repository**: Keep code in Git
2. **Database**: Regular backups to cloud storage
3. **Assets**: Upload files to cloud storage (S3, Cloud Storage)
4. **Configuration**: Environment variables in secure storage

## Cost Optimization

### Free Tier Limits

| Platform | Free Tier | Limitations |
|----------|-----------|-------------|
| Render | 750 hours/month | Sleeps after 15min inactivity |
| Railway | $5 credit | Limited resources |
| Vercel | 100GB bandwidth | Build minutes limit |
| Heroku | None | Deprecated free tier |

### Scaling Costs

- **Traffic**: CDN helps reduce server load
- **Storage**: Use cloud storage for files
- **Database**: Managed databases auto-scale
- **Compute**: Serverless reduces idle costs

## Maintenance

### Update Strategy

```bash
# Update dependencies
npm audit
npm update

# Test updates locally
npm run dev

# Deploy updates
git push origin main
```

### Monitoring Checklist

- [ ] Response times < 2s
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%
- [ ] Memory usage < 80%
- [ ] Disk usage < 90%

---

<div align="center">

[← Architecture](architecture.md) • [Contributing →](contributing.md)

</div>
