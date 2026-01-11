# MCP Node.js TypeScript API

A Node.js REST API built with TypeScript, TypeORM, MongoDB, and OpenAPI following a layered architecture with feature-based organization.

## 🏗️ Architecture

This project follows a **layered architecture** organized by features:

```
src/
├── config/              # Configuration files
│   ├── database.ts      # Database configuration
│   └── swagger.ts       # OpenAPI/Swagger configuration
├── features/            # Feature modules
│   ├── user/
│   │   ├── entities/    # TypeORM entities
│   │   ├── dtos/        # Data Transfer Objects
│   │   ├── repositories/# Data access layer
│   │   ├── services/    # Business logic layer
│   │   ├── controllers/ # HTTP request handlers
│   │   └── routes/      # Route definitions
│   └── product/
│       ├── entities/
│       ├── dtos/
│       ├── repositories/
│       ├── services/
│       ├── controllers/
│       └── routes/
├── middleware/          # Express middlewares
├── app.ts              # Express app setup
└── index.ts            # Application entry point
```

## ✨ Features

### User Feature
- **Attributes**: email, password (hashed), pictureUrl, name
- **Endpoints**:
  - POST `/api/users` - Create a new user
  - GET `/api/users` - Get all users
  - GET `/api/users/:id` - Get user by ID
  - PUT `/api/users/:id` - Update user
  - DELETE `/api/users/:id` - Delete user

### Product Feature
- **Attributes**: name, description, pictureUrl, unitPrice, quantity, measureType, attributes (map)
- **Endpoints**:
  - POST `/api/products` - Create a new product
  - GET `/api/products` - Get all products
  - GET `/api/products/:id` - Get product by ID
  - PUT `/api/products/:id` - Update product
  - DELETE `/api/products/:id` - Delete product

## 🤖 MCP (Model Context Protocol) Integration

This project includes an MCP server that exposes all API endpoints as MCP tools, allowing AI assistants like Claude to interact with your API directly.

### MCP Tools Available

**User Management Tools:**
- `create_user` - Create a new user
- `get_all_users` - Retrieve all users
- `get_user_by_id` - Get a specific user by ID
- `update_user` - Update an existing user
- `delete_user` - Delete a user

**Product Management Tools:**
- `create_product` - Create a new product
- `get_all_products` - Retrieve all products
- `get_product_by_id` - Get a specific product by ID
- `update_product` - Update an existing product
- `delete_product` - Delete a product

### Running the MCP Server

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Run the MCP server:**
   ```bash
   npm run mcp
   ```

   Or for development:
   ```bash
   npm run mcp
   ```

### Configuring Claude Desktop

To use this MCP server with Claude Desktop, add the configuration to your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

Add this configuration (adjust the path to match your installation):

```json
{
  "mcpServers": {
    "mcpnodefil": {
      "command": "node",
      "args": [
        "c:/Users/USER/Desktop/aimcpproj/mcpnodefil/dist/mcp/index.js"
      ],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/mcpnodefil",
        "PORT": "3000"
      }
    }
  }
}
```

**Important**: Make sure MongoDB is running before starting the MCP server, as it connects to the database on startup.

### MCP Server Features

- **Direct Database Access**: The MCP server connects directly to MongoDB, bypassing the REST API
- **Type Safety**: All tools use TypeScript for type safety
- **Validation**: Input validation using class-validator DTOs
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Automatic Shutdown**: Graceful shutdown on SIGINT/SIGTERM signals

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcpnodefil
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mcpnodefil
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**

   **Development mode** (with auto-reload):
   ```bash
   npm run dev
   ```

   **Build for production**:
   ```bash
   npm run build
   ```

   **Run production build**:
   ```bash
   npm start
   ```

## 📚 API Documentation

Once the server is running, you can access:

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

## 🧪 Testing the API

### Using cURL

**Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "pictureUrl": "https://example.com/photo.jpg"
  }'
```

**Create a product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "description": "Product Description",
    "pictureUrl": "https://example.com/product.jpg",
    "unitPrice": 29.99,
    "quantity": 100,
    "measureType": "unit",
    "attributes": {
      "color": "blue",
      "size": "medium"
    }
  }'
```

**Get all users:**
```bash
curl http://localhost:3000/api/users
```

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **ORM**: TypeORM
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Security**: bcrypt (password hashing)

## 📁 Project Structure Details

### Layers

1. **Entities Layer**: TypeORM entities that map to MongoDB collections
2. **DTOs Layer**: Data Transfer Objects for request/response validation
3. **Repository Layer**: Data access and database operations
4. **Service Layer**: Business logic and orchestration
5. **Controller Layer**: HTTP request handling and response formatting
6. **Routes Layer**: API endpoint definitions

### Key Design Patterns

- **Dependency Injection**: Manual DI through constructors
- **Repository Pattern**: Abstraction of data access logic
- **Service Pattern**: Business logic separation
- **DTO Pattern**: Request/response validation and transformation

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- Input validation using class-validator
- CORS enabled for cross-origin requests
- Environment variable configuration

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript in production mode
- `npm run mcp` - Run MCP server (development mode)
- `npm run mcp:build` - Build and run MCP server (production mode)
- `npm run typeorm` - Run TypeORM CLI commands

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
