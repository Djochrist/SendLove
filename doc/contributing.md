# 🤝 Contributing to SendLove

Thank you for your interest in contributing to SendLove! We welcome contributions from developers of all skill levels. This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contributing Guidelines](#contributing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Community](#community)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- **Be respectful** and inclusive in all interactions
- **Be collaborative** and help others when possible
- **Be patient** with new contributors
- **Focus on constructive feedback**
- **Respect differing viewpoints** and experiences

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Code editor** (VS Code recommended)
- **Terminal/Command line** access

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/Djochrist/SendLove.git
   cd sendlove
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5000
   ```

### Project Structure Overview

```
sendlove/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data persistence
│   └── video-processor.ts # Video generation
├── shared/                 # Shared types/schemas
├── doc/                   # Documentation
└── script/                # Build scripts
```

## 🔄 Development Workflow

### 1. Choose an Issue

- Check [GitHub Issues](https://github.com/Djochrist/SendLove/issues) for open tasks
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run check

# Manual testing
npm run dev
```

### 5. Submit a Pull Request

- Push your branch to GitHub
- Create a Pull Request with a clear description
- Reference any related issues
- Wait for review and address feedback

## 📝 Contributing Guidelines

### Code Style

#### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow the existing **ESLint** configuration
- Use **Prettier** for code formatting
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions

#### React Components

```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  );
}

// ❌ Avoid
function userCard(props) {
  return <div>{props.user.name}</div>;
}
```

#### API Design

- Use **RESTful conventions**
- Include **proper HTTP status codes**
- Add **input validation** with Zod
- Document **API endpoints** in `doc/api.md`

### Commit Messages

Follow conventional commit format:

```bash
# ✅ Good
feat: add dark mode toggle
fix: resolve video upload issue
docs: update API documentation
refactor: simplify video processing logic

# ❌ Avoid
fixed bug
updated code
changes
```

### Testing

- Write **unit tests** for utilities and hooks
- Write **integration tests** for API endpoints
- Write **component tests** for React components
- Aim for **80%+ code coverage**

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

test('renders user name', () => {
  const user = { name: 'Alice', email: 'alice@example.com' };
  render(<UserCard user={user} onEdit={() => {}} />);

  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

### Documentation

- Update **README.md** for new features
- Add **JSDoc comments** for public APIs
- Update **doc/** files as needed
- Include **code examples** where helpful

## 🔍 Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run check
   npm test
   ```

3. **Create Pull Request**
   - Use a clear, descriptive title
   - Fill out the PR template
   - Reference related issues
   - Add screenshots for UI changes

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Integration tests added/updated
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   Add screenshots of UI changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

### Review Process

- **Maintainers** will review your PR
- **Address feedback** by making requested changes
- **Re-request review** when changes are complete
- **PR will be merged** once approved

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, Node version)
- **Screenshots** or error messages
- **Code snippets** if applicable

### Feature Requests

For new features, please include:

- **Clear description** of the proposed feature
- **Use case** and why it's needed
- **Mockups or examples** if applicable
- **Implementation ideas** if you have them

## 🎯 Types of Contributions

### Code Contributions

- **Features**: New functionality
- **Bug fixes**: Resolving issues
- **Refactoring**: Code improvements
- **Performance**: Optimization work

### Non-Code Contributions

- **Documentation**: Writing or updating docs
- **Testing**: Writing or improving tests
- **Design**: UI/UX improvements
- **Translation**: Adding new languages
- **Tutorials**: Creating learning content

### First Time Contributors

Welcome! Here are some good starting points:

1. **Fix a typo** in documentation
2. **Improve error messages**
3. **Add unit tests** for existing code
4. **Update dependencies**
5. **Improve accessibility**

## 🏆 Recognition

Contributors are recognized through:

- **GitHub contributor stats**
- **Mention in release notes**
- **Contributor spotlight** in documentation
- **Swag/digital badges** (future)

## 📞 Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request comments**: Code review discussions

### Getting Help

- Check **existing issues** first
- Search **documentation** thoroughly
- Ask **specific questions** with code examples
- Be **patient** and respectful

### Mentorship

- **Experienced contributors** help newcomers
- **Pair programming** sessions (future)
- **Code review** feedback and guidance

## 📄 License

By contributing to SendLove, you agree that your contributions will be licensed under the same MIT License that covers the project.

## 🙏 Acknowledgments

Thank you to all contributors who help make SendLove better! Your time and effort are greatly appreciated.

---

<div align="center">

[← Deployment](deployment.md) • [Security →](security.md)

</div>
