# Chirp

Chirp is a full-stack social media platform built with Laravel and React. It provides a Twitter-style experience where users can create posts, interact with other users, manage their profiles, follow accounts, exchange messages, and discover trending content.

The application uses Laravel for the backend and business logic, React with Inertia.js for the frontend, and Tailwind CSS for the user interface.

## Features

### Authentication & Accounts

* User registration and login
* Logout functionality
* Email verification
* Password reset and recovery
* Username availability checking
* Authenticated user sessions

### Social Feed

* Create posts
* Reply to posts
* Delete your own posts
* Paginated timeline/feed
* View individual posts
* Display reply counts, likes, and retweets
* Viewer-specific interaction state

### Social Interactions

* Like and unlike posts
* Retweet and undo retweets
* Bookmark posts
* Follow and unfollow users
* View bookmarked posts
* User profiles
* Profile updates
* Notifications

### Messaging

* Direct messaging between users
* Conversation history
* Recent conversations
* Latest-message previews
* Start conversations with other users

### Explore & Discovery

* Search for users
* Search posts
* Trending content
* Trending hashtags
* Discover users
* Explore page with trending posts

### Timeline & Performance

Chirp uses a dedicated timeline service to handle feed retrieval and pagination. Timeline configuration can be controlled through environment variables, including the timeline cache limit and trending-content settings.

## Tech Stack

### Backend

* PHP 8.3+
* Laravel 13
* Laravel Eloquent ORM
* Laravel Inertia
* Filament
* SQLite by default for local development

### Frontend

* React 19
* TypeScript
* Inertia.js
* Vite
* Tailwind CSS 4

### Development & Quality

* Pest
* PHPUnit
* PHPStan / Larastan
* Laravel Pint
* ESLint
* Prettier
* TypeScript type checking

## Architecture

Chirp follows a Laravel application architecture with a React/Inertia frontend.

```text
┌──────────────────────────────┐
│          React UI            │
│      React + TypeScript      │
└──────────────┬───────────────┘
               │
               │ Inertia
               ▼
┌──────────────────────────────┐
│       Laravel Backend        │
│                              │
│ Controllers                  │
│ Services                     │
│ Validation                   │
│ Authentication               │
│ Authorization                │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Eloquent ORM           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Database            │
│     SQLite / configured DB    │
└──────────────────────────────┘
```

The frontend is bundled with Vite and communicates with the Laravel application through Inertia. The project also separates application responsibilities into controllers and services such as the timeline and Chirp services.

## Project Structure

```text
Chirp/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   ├── Models/
│   ├── Services/
│   └── ...
├── bootstrap/
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── public/
├── resources/
│   ├── css/
│   └── js/
├── routes/
│   └── web.php
├── storage/
├── tests/
├── composer.json
├── package.json
├── phpstan.neon
├── phpunit.xml
├── vite.config.ts
└── .env.example
```

## Requirements

Before running Chirp locally, make sure you have:

* PHP 8.3 or later
* Composer
* Node.js and npm
* A database supported by Laravel

The project is configured to use SQLite by default for local development.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/KiaronGovender/Chirp.git
cd Chirp
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Configure the environment

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

### 4. Configure the database

The default configuration uses SQLite:

```env
DB_CONNECTION=sqlite
```

Create the SQLite database if it does not already exist:

```bash
touch database/database.sqlite
```

On Windows:

```powershell
New-Item database/database.sqlite -ItemType File
```

Then run the migrations:

```bash
php artisan migrate
```

### 5. Install frontend dependencies

```bash
npm install
```

### 6. Start the application

Start the Laravel development server:

```bash
php artisan serve
```

In another terminal, start Vite:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:8000
```

## Development

The project includes a Composer development command that can run the Laravel server, queue worker, and Vite development server concurrently:

```bash
composer run dev
```

This starts:

* Laravel development server
* Laravel queue listener
* Vite development server

## Testing & Code Quality

Chirp includes automated tests and several code-quality tools.

### Run the test suite

```bash
php artisan test
```

### PHP formatting

Check formatting:

```bash
composer lint:check
```

Apply formatting:

```bash
composer lint
```

### Static analysis

```bash
composer types:check
```

This runs PHPStan/Larastan analysis.

### Frontend linting

```bash
npm run lint
```

### Type checking

```bash
npm run types:check
```

### Frontend formatting

Check formatting:

```bash
npm run format:check
```

Format the frontend:

```bash
npm run format
```

### Run the complete CI check

The project provides a combined check through Composer:

```bash
composer ci:check
```

This runs frontend linting, formatting checks, TypeScript checks, and the application test suite.

## Configuration

Chirp exposes several application-specific environment variables:

```env
CHIRP_BANNED_WORDS=
CHIRP_TRENDS_LIMIT=10
CHIRP_TRENDS_WINDOW_HOURS=24
CHIRP_TIMELINE_CACHE_LIMIT=100
```

These control moderation and feed/discovery behaviour.

## Key Engineering Concepts

The project was designed to provide hands-on experience with several areas of modern web development:

* MVC application architecture
* REST-style application routes
* Authentication and authorization
* Database relationships and Eloquent ORM
* Form/request validation
* Server-side pagination
* Cursor-based timeline pagination
* Service-layer application logic
* React component development
* TypeScript
* Inertia.js
* Automated testing
* Static analysis
* Code formatting and linting
* Frontend build tooling

## Future Improvements

Potential future improvements include:

* Real-time notifications and messaging
* More advanced feed ranking
* Improved search infrastructure
* Media uploads
* Additional moderation capabilities
* Expanded automated test coverage
* Production database deployment
* Containerized production deployment
* CI/CD deployment pipeline

## License

This project is licensed under the MIT License.
