# Todo Task Manager

A modern, cross-platform desktop todo application built with Wails (Go + React + TypeScript). The app features dual storage options: local file-based storage for offline use and PostgreSQL integration for persistent cloud storage.

## Demo Video

*Coming soon - Demo video will be added here*

## Features

### 📝 Task Management
- Create, edit, and delete tasks
- Set task priorities (Low, Medium, High)
- Track task status (Pending, In Progress, Completed)
- Set deadlines with date picker
- Filter and sort tasks by various criteria

### 🎨 User Experience
- Clean, intuitive React-based UI
- Multiple theme support (Light/Dark modes)
- Responsive design with custom CSS components
- Real-time task updates
- Confirmation modals for destructive actions

### 👤 User Management
- User profile creation and management
- Customizable user information (Name, Email, Username)
- Persistent user settings

### ⚙️ Flexible Storage Options
- **Local Storage**: File-based storage for offline usage
- **PostgreSQL**: Database storage for persistent, multi-device access
- Seamless switching between storage backends
- Configuration persistence across sessions

## Technology Stack

### Backend (Go)
- **Wails v2**: Modern Go framework for desktop applications
- **Database**: PostgreSQL support with connection pooling
- **Architecture**: Clean architecture with separate layers:
  - Models: Data structures (`models/task.go`)
  - Repository: Data access layer (`repository/tasks.go`)
  - Service: Business logic (`service/tasks.go`)
  - Storage: Database connections (`storage/`)

### Frontend (React + TypeScript)
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tooling
- **React Router**: Client-side routing for navigation
- **Custom Components**: Reusable UI components in `src/components/`

### Build System
- **Wails Build**: Native binary compilation
- **Vite**: Frontend bundling and optimization
- **Cross-platform**: Supports Windows, macOS, and Linux

## Storage Logic

### Local Storage Backend
The local storage system uses file-based persistence:

```go
// Located in storage/local.go and config/storage/local.go
- Stores tasks in JSON format on the local filesystem
- Automatic file creation and management
- No external dependencies required
- Perfect for offline usage and privacy
```

**Advantages:**
- ✅ No network required
- ✅ Complete privacy (data stays local)
- ✅ Fast read/write operations
- ✅ No setup required

**Use Cases:**
- Personal task management
- Offline environments
- Privacy-sensitive scenarios

### PostgreSQL Storage Backend
Full-featured PostgreSQL integration with connection management:

```go
// Located in storage/postgre.go and config/storage/postgre.go
- Configurable connection parameters (host, port, credentials)
- SSL connection support
- Connection pooling and error handling
- Schema management and migrations
```

**Connection Configuration:**
```json
{
  "host": "localhost",
  "port": 5432,
  "username": "your_username",
  "password": "your_password",
  "dbName": "todo_db",
  "sslMode": "require"
}
```

**Advantages:**
- ✅ Multi-device synchronization
- ✅ Backup and recovery
- ✅ Advanced querying capabilities
- ✅ Concurrent user support
- ✅ Data integrity and ACID compliance

**Use Cases:**
- Team collaboration
- Multi-device access
- Data backup requirements
- Production environments

### Storage Switching
The application allows seamless switching between storage backends:

1. **Runtime Configuration**: Change storage type in the settings
2. **Data Migration**: Manual export/import between backends
3. **Fallback Mechanism**: Automatic fallback to local storage if database connection fails

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
cd todo
```

2. **Install Wails CLI:**
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

3. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

4. **Setup PostgreSQL (Optional):**
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

This starts:
- Go backend with live reload
- Vite frontend dev server
- Browser dev server at http://localhost:34115

### Building for Production
```bash
# Build optimized binary
wails build

# The executable will be in build/bin/
```

### Testing
```bash
# Run Go tests
go test ./tests/...

# Run frontend tests (if configured)
cd frontend
npm test
```

## Configuration

### Application Configuration
Located in `config/app/config.go`:
- Theme settings (light/dark)
- Window size and position
- User preferences

### Storage Configuration
- **Local**: Automatic setup, no configuration required
- **PostgreSQL**: Configure via in-app settings or config files

### Environment Variables
```bash
# Database connection (optional)
DB_HOST=localhost
DB_PORT=5432
DB_USER=todo_user
DB_PASSWORD=your_password
DB_NAME=todo_db
DB_SSLMODE=require
```

## API Reference

### Task Operations
```go
// Local Storage
SaveLocalTask(task LocalStoragePayload) (int, error)
GetLocalTasks() ([]LocalStoragePayload, error)
UpdateLocalTask(task LocalStoragePayload) error
DeleteLocalTask(id int) error

// PostgreSQL Storage
AddPostgresTask(task PostgresStoragePayload) (int, error)
GetPostgresTasks() ([]PostgresStoragePayload, error)
UpdatePostgresTask(task PostgresStoragePayload) error
DeletePostgresTask(id int) error
```

### Configuration Operations
```go
ChangeTheme(newTheme string) error
UpdateUserInfo(userInfo UserInfoPayload) error
ConnectToDatabase(dbPayload DatabaseConnectionPayload) error
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the [Wails documentation](https://wails.io/docs/)
- Review the project's test files for usage examples
