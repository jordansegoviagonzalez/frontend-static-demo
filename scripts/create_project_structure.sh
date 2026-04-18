#!/bin/bash

# A reusable script to generate an enterprise-grade Vanilla JS project structure
# Usage: ./create_project_structure.sh [project-name]

PROJECT_NAME=${1:-my-js-project}

echo "🚀 Creating project structure for: $PROJECT_NAME..."

# Create base project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME" || exit

# Create the folder structure
mkdir -p assets/css
mkdir -p assets/img
mkdir -p assets/js/core
mkdir -p assets/js/infra
mkdir -p assets/js/ui/components
mkdir -p assets/js/ui/screens
mkdir -p assets/js/utils
mkdir -p tests

# Create placeholder files
touch assets/css/base.css
touch assets/css/layout.css
touch assets/css/components.css

touch assets/js/core/models.js
touch assets/js/core/validators.js
touch assets/js/core/businessService.js

touch assets/js/infra/config.js
touch assets/js/infra/apiClient.js
touch assets/js/infra/storage.js

touch assets/js/ui/app.js
touch assets/js/ui/router.js
touch assets/js/ui/components/button.js
touch assets/js/ui/screens/homeScreen.js

touch assets/js/utils/formatters.js
touch assets/js/utils/helpers.js

touch index.html
touch .gitignore
touch README.md

# Add basic content to key files
cat <<EOT > index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$PROJECT_NAME</title>
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/components.css">
</head>
<body>
  <div id="app-root"></div>
  <script type="module" src="assets/js/ui/app.js"></script>
</body>
</html>
EOT

cat <<EOT > assets/js/ui/app.js
// Main entry point for the application
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app-root');
  initRouter(root);
  console.log('🚀 $PROJECT_NAME initialized successfully!');
});
EOT

cat <<EOT > .gitignore
# Dependency directories
node_modules/

# OS metadata
.DS_Store
Thumbs.db

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
EOT

cat <<EOT > README.md
# $PROJECT_NAME

An enterprise-grade Vanilla JavaScript project following Domain-Driven Design (DDD) and Separation of Concerns.

## Project Structure
- \`assets/js/core\`: Business logic and data models (UI independent).
- \`assets/js/infra\`: External infrastructure (API clients, storage).
- \`assets/js/ui\`: User Interface and Presentation layer.
- \`assets/js/utils\`: Pure helper functions.
EOT

echo "✅ Project structure created successfully!"
echo "📂 Navigate to your new project: cd $PROJECT_NAME"
