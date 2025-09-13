# Todo Task Manager

A modern, cross-platform desktop todo application built with Wails (Go + React + TypeScript). The app features dual storage options: local file-based storage for offline use and PostgreSQL integration for persistent cloud storage.

## Demo Video

*Coming soon - Demo video will be added here*

## Features

###  Task Management
- Create, edit, and delete tasks
- Set task priorities (Low, Medium, High)
- Track task status (Pending, In Progress, Completed)
- Set deadlines with date picker
- Filter and sort tasks by various criteria

###  User Experience
- Clean, intuitive React-based UI
- Multiple theme support (Light/Dark modes)
- Responsive design with custom CSS components
- Real-time task updates
- Confirmation modals for destructive actions

###  User Management
- User profile creation and management
- Customizable user information (Name, Email, Username)
- Persistent user settings

### ⚙ Flexible Storage Options
- **Local Storage**: File-based storage for offline usage
- **PostgreSQL**: Database storage for persistent, multi-device access
- Seamless switching between storage backends
- Configuration persistence across sessions

## Technology Stack

### Backend (Go)
- **Wails v2**: Modern Go framework for desktop applications
- **Database**: PostgreSQL support with connection pooling

### Frontend (React + TypeScript)
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tooling
- **React Router**: Client-side routing for navigation

## Storage Logic

### Local Storage Backend
The local storage system uses file-based persistence:


**Advantages:**
-  No network required
-  Complete privacy (data stays local)
-  Fast read/write operations

**Use Cases:**
- Personal task management
- Offline environments
- Privacy-sensitive scenarios

### PostgreSQL Storage Backend
Full-featured PostgreSQL integration with connection management:


**Advantages:**
- ✅ Multi-device synchronization
- ✅ Backup and recovery

**Use Cases:**
- Data backup requirements



## Project Structure

```
todo/
├── app/                    # Wails application logic
├── config/                 # Configuration management
│   ├── app/               # App-level configuration
│   ├── storage/           # Storage backend configs
│   └── user/              # User management
├── frontend/              # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Utility functions
│   └── dist/              # Build output
├── models/                # Data models
├── repository/            # Data access layer
├── service/               # Business logic layer
├── storage/               # Storage implementations
├── tests/                 # Test suites
└── utils/                 # Shared utilities
```

## Installation & Setup

### Prerequisites
- Go 1.19 or later
- Node.js 16 or later
- Wails v2 CLI tool
- PostgreSQL (optional, for database storage)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd todo_app
```

2. **Install Wails CLI:**
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```


3. **Setup PostgreSQL (Optional):**
```bash
# Install PostgreSQL
# Create a database named 'todo_db'
# Configure connection in the app settings
```

## Development

### Running in Development Mode
```bash
# Start development server with hot reload
wails dev
```


### Building for Production
```bash
# Build optimized binary
wails build

# The executable will be in build/bin/
```

## Configuration

### Application Configuration
Located in `config/app/config.go`:
- Theme settings (light/dark)
- Window size and position

### Storage Configuration
- **Local**: Automatic setup, no configuration required
- **PostgreSQL**: Configure via in-app settings or config files





For support and questions:
- Create an issue in the repository
- Check the [Wails documentation](https://wails.io/docs/)
- Review the project's test files for usage examples
