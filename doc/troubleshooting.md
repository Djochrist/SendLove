# 🔧 Troubleshooting Guide

This guide helps you diagnose and resolve common issues with SendLove. Follow the steps systematically to identify and fix problems.

**Repository**: [https://github.com/Djochrist/SendLove](https://github.com/Djochrist/SendLove)

## 📋 Quick Reference

### Most Common Issues

| Issue | Quick Fix | Documentation |
|-------|-----------|---------------|
| App won't start | Check Node.js version, dependencies | [Installation](#installation-issues) |
| Build fails | Clear cache, check TypeScript errors | [Build Issues](#build-and-compilation-issues) |
| Video not generating | Check FFmpeg, file permissions | [Video Processing](#video-processing-issues) |
| Upload fails | Check file size, type validation | [File Upload](#file-upload-issues) |
| Slow performance | Enable caching, check database | [Performance](#performance-issues) |

## 🚀 Installation Issues

### Node.js Version Problems

**Error:** `Error: Node.js version 18+ required`

**Solution:**
```bash
# Check current version
node --version

# Install Node.js 18+ (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### Dependency Installation Fails

**Error:** `npm ERR! code ENOTFOUND`

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use different registry
npm config set registry https://registry.npmjs.org/
npm install

# Check network connectivity
ping registry.npmjs.org
```

### Permission Errors

**Error:** `EACCES: permission denied`

**Solutions:**
```bash
# Fix npm permissions (Linux/Mac)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use a Node version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

## 🏗️ Build and Compilation Issues

### TypeScript Compilation Errors

**Error:** `error TS2304: Cannot find name 'X'`

**Solutions:**
```bash
# Check TypeScript version
npx tsc --version

# Clear TypeScript cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check tsconfig.json
cat tsconfig.json
```

### Vite Build Failures

**Error:** `Error: Build failed with 1 error`

**Solutions:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Check for syntax errors
npm run check

# Build with verbose output
npm run build -- --logLevel info

# Check available disk space
df -h
```

### Module Resolution Issues

**Error:** `Cannot resolve module 'X'`

**Solutions:**
```typescript
// Check import paths in tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["client/src/*"],
      "@shared/*": ["shared/*"]
    }
  }
}

// Clear module cache
rm -rf node_modules package-lock.json
npm install
```

## 🎬 Video Processing Issues

### FFmpeg Not Found

**Error:** `ffmpeg command not found`

**Solutions:**
```bash
# Install FFmpeg (Ubuntu/Debian)
sudo apt update
sudo apt install ffmpeg

# Install FFmpeg (macOS with Homebrew)
brew install ffmpeg

# Install FFmpeg (Windows with Chocolatey)
choco install ffmpeg

# Verify installation
ffmpeg -version
```

### Video Generation Fails

**Error:** `Video processing failed`

**Debug Steps:**
```bash
# Check FFmpeg.wasm loading
curl -I https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js

# Verify file permissions
ls -la client/public/uploads/

# Check console logs
npm run dev
# Open browser dev tools → Console

# Test FFmpeg directly
ffmpeg -f lavfi -i testsrc=duration=1:size=320x240:rate=1 -c:v libx264 test.mp4
```

### Memory Issues During Processing

**Error:** `Out of memory` or `FFmpeg processing failed`

**Solutions:**
```typescript
// Increase Node.js memory limit
node --max-old-space-size=4096 server/index.ts

# Or set in package.json
{
  "scripts": {
    "start": "node --max-old-space-size=4096 dist/index.cjs"
  }
}

// Optimize FFmpeg settings
const ffmpegOptions = [
  '-threads', '2', // Limit CPU threads
  '-preset', 'ultrafast', // Fastest encoding
  '-crf', '28', // Lower quality, smaller file
];
```

## 📁 File Upload Issues

### Upload Size Limits

**Error:** `File too large` or `413 Payload Too Large`

**Solutions:**
```typescript
// Increase Multer limits in server/routes.ts
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Increase server limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

### File Type Rejection

**Error:** `Only audio files are allowed`

**Debug:**
```typescript
// Check file type detection
const fileType = require('file-type');
const type = await fileType.fromBuffer(file.buffer);
console.log('Detected type:', type);

// Update allowed types in multer config
fileFilter: (req, file, cb) => {
  const allowedMimes = [
    'audio/mpeg', 'audio/mp3', 'audio/wav',
    'audio/ogg', 'audio/aac', 'audio/m4a'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`));
  }
},
```

### Upload Directory Issues

**Error:** `ENOENT: no such file or directory`

**Solutions:**
```bash
# Create uploads directory
mkdir -p client/public/uploads

# Fix permissions
chmod 755 client/public/uploads

# Check disk space
df -h client/public/uploads
```

## 🌐 Network and API Issues

### CORS Errors

**Error:** `Access-Control-Allow-Origin` header missing

**Solutions:**
```typescript
// Configure CORS in server/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
}));
```

### API Timeouts

**Error:** `Request timeout`

**Solutions:**
```typescript
// Increase timeout in client
const apiClient = axios.create({
  timeout: 30000, // 30 seconds
  baseURL: '/api',
});

// Handle timeouts gracefully
try {
  const response = await apiClient.post('/requests', data);
} catch (error) {
  if (error.code === 'ECONNABORTED') {
    // Handle timeout
    showError('Request timed out. Please try again.');
  }
}
```

### Database Connection Issues

**Error:** `Connection refused` or `Database not found`

**Solutions:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection
psql -h localhost -U sendlove_user -d sendlove_db

# Verify environment variables
echo $DATABASE_URL
```

## 🎨 Frontend Issues

### React Component Errors

**Error:** `Cannot read property 'X' of undefined`

**Debug:**
```typescript
// Add error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Wrap app with error boundary
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Styling Issues

**Error:** Tailwind classes not working

**Solutions:**
```bash
# Rebuild CSS
npm run build

# Check Tailwind config
cat tailwind.config.ts

# Verify PostCSS config
cat postcss.config.js

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

### State Management Issues

**Error:** React Query not updating

**Debug:**
```typescript
// Enable React Query devtools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Check query invalidation
const queryClient = useQueryClient();

const handleUpdate = async () => {
  await updateRequest(data);
  queryClient.invalidateQueries(['requests']);
};
```

## 🔧 Development Environment Issues

### Hot Reload Not Working

**Solutions:**
```bash
# Check Vite configuration
cat vite.config.ts

# Restart dev server
npm run dev

# Check for file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### IDE/Editor Issues

**TypeScript errors in IDE but not in build**

**Solutions:**
```bash
# Update TypeScript in IDE
# VS Code: Ctrl+Shift+P → "TypeScript: Reload Projects"

# Check workspace TypeScript version
npx tsc --version

# Restart TypeScript service
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## 🚀 Deployment Issues

### Environment Variables Missing

**Error:** `process.env.X is undefined`

**Solutions:**
```bash
# Check .env file exists
ls -la .env

# Verify variable names (no spaces around =)
cat .env

# Restart application
npm restart

# Check deployment platform environment variables
# Render: Dashboard → Service → Environment
# Railway: Dashboard → Project → Variables
```

### Port Binding Issues

**Error:** `EADDRINUSE: address already in use`

**Solutions:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm start
```

### Static File Serving Issues

**Error:** `404 Not Found` for static assets

**Solutions:**
```typescript
// Check static file serving in Express
app.use(express.static(path.join(__dirname, '../client/dist')));

// Verify build output exists
ls -la client/dist/

// Check file permissions
chmod -R 755 client/dist/
```

## 📊 Performance Issues

### Slow Page Loads

**Debug:**
```bash
# Check bundle size
npm run build
ls -lh dist/assets/

# Analyze bundle
npx vite-bundle-analyzer dist

# Check network tab in browser dev tools
# Look for large assets or slow requests
```

### Memory Leaks

**Debug:**
```bash
# Monitor memory usage
node --inspect server/index.ts
# Open chrome://inspect → Memory tab

# Use clinic.js for diagnosis
npm install -g clinic
clinic heapprofiler -- node server/index.ts

# Check for React memory leaks
# Use React DevTools → Profiler
```

### Database Performance

**Debug:**
```sql
-- Check slow queries
SELECT query, total_time, calls, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🔍 Advanced Debugging

### Logging Configuration

```typescript
// Enhanced logging
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export { logger };
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Debug specific modules
DEBUG=sendlove:* npm run dev

# Debug database queries
DEBUG=sendlove:db npm run dev
```

### Remote Debugging

```bash
# Debug production application
node --inspect=0.0.0.0:9229 server/index.ts

# Set up SSH tunnel
ssh -L 9229:localhost:9229 user@production-server

# Open chrome://inspect in browser
```

## 📞 Getting Help

### Community Support

1. **Check existing issues** on GitHub
2. **Search documentation** thoroughly
3. **Create detailed bug report** with:
   - Steps to reproduce
   - Environment details
   - Error messages/logs
   - Screenshots if applicable

### Professional Support

- **Email**: support@sendlove.app
- **Response time**: Within 24 hours
- **Premium support**: Available for enterprise customers

### Emergency Contacts

- **Security issues**: security@sendlove.app (immediate response)
- **System down**: emergency@sendlove.app (immediate response)

---

<div align="center">

[← Performance](performance.md) • [Back to Documentation](../README.md#📚-documentation)

</div>
