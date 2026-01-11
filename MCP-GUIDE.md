# MCP Integration Guide

This guide explains how to use the Model Context Protocol (MCP) server integration in this project.

## What is MCP?

Model Context Protocol (MCP) is a standard protocol that allows AI assistants like Claude to interact with external systems through a defined set of tools. This project exposes all its API endpoints as MCP tools, enabling Claude to directly manage users and products in your database.

## Available MCP Tools

### User Management Tools

1. **create_user**
   - Creates a new user in the database
   - Parameters:
     - `email` (required): User's email address
     - `password` (required): User's password (min 6 characters)
     - `name` (required): User's full name
     - `pictureUrl` (optional): Profile picture URL

2. **get_all_users**
   - Retrieves all users from the database
   - No parameters required

3. **get_user_by_id**
   - Fetches a specific user by their ID
   - Parameters:
     - `id` (required): MongoDB ObjectId of the user

4. **update_user**
   - Updates an existing user's information
   - Parameters:
     - `id` (required): MongoDB ObjectId of the user
     - `email` (optional): New email address
     - `password` (optional): New password
     - `name` (optional): New name
     - `pictureUrl` (optional): New picture URL

5. **delete_user**
   - Deletes a user from the database
   - Parameters:
     - `id` (required): MongoDB ObjectId of the user

### Product Management Tools

1. **create_product**
   - Creates a new product in the database
   - Parameters:
     - `name` (required): Product name
     - `description` (required): Product description
     - `unitPrice` (required): Price per unit (minimum 0)
     - `quantity` (required): Available quantity (minimum 0)
     - `measureType` (required): Unit of measurement
     - `attributes` (required): Additional attributes as object
     - `pictureUrl` (optional): Product image URL

2. **get_all_products**
   - Retrieves all products from the database
   - No parameters required

3. **get_product_by_id**
   - Fetches a specific product by its ID
   - Parameters:
     - `id` (required): MongoDB ObjectId of the product

4. **update_product**
   - Updates an existing product's information
   - Parameters:
     - `id` (required): MongoDB ObjectId of the product
     - `name` (optional): New product name
     - `description` (optional): New description
     - `unitPrice` (optional): New price
     - `quantity` (optional): New quantity
     - `measureType` (optional): New measure type
     - `attributes` (optional): New attributes
     - `pictureUrl` (optional): New picture URL

5. **delete_product**
   - Deletes a product from the database
   - Parameters:
     - `id` (required): MongoDB ObjectId of the product

## Setup Instructions

### Prerequisites

1. **Node.js** installed (v16 or higher)
2. **MongoDB** running (locally or remote)
3. **Claude Desktop** application installed
4. Project dependencies installed (`npm install`)

### Step 1: Build the Project

Before running the MCP server, build the TypeScript project:

```bash
npm run build
```

This compiles TypeScript files to JavaScript in the `dist/` directory.

### Step 2: Configure Environment Variables

Make sure your `.env` file is properly configured:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mcpnodefil
```

### Step 3: Configure Claude Desktop

1. **Locate Claude Desktop config file:**
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add MCP server configuration:**

   Open the config file and add the `mcpServers` configuration:

   ```json
   {
     "mcpServers": {
       "mcpnodefil": {
         "command": "node",
         "args": [
           "C:/Users/USER/Desktop/aimcpproj/mcpnodefil/dist/mcp/index.js"
         ],
         "env": {
           "MONGODB_URI": "mongodb://localhost:27017/mcpnodefil",
           "PORT": "3000"
         }
       }
     }
   }
   ```

   **Important**: Replace the path in `args` with the absolute path to your compiled MCP server file.

3. **Restart Claude Desktop** for the changes to take effect.

### Step 4: Start MongoDB

Ensure MongoDB is running before using the MCP server:

```bash
# Local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Using the MCP Server

### With Claude Desktop

Once configured, Claude will automatically have access to the MCP tools. You can ask Claude to:

- "Create a new user with email john@example.com"
- "List all products in the database"
- "Update the product with ID 507f1f77bcf86cd799439011"
- "Delete the user with ID 507f1f77bcf86cd799439012"

### Example Interactions

**Creating a User:**
```
You: Create a new user named Alice Smith with email alice@example.com and password secure123

Claude will use the create_user tool with:
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "secure123"
}
```

**Creating a Product:**
```
You: Add a product named "Organic Apples" priced at $3.99 per kg with 100 units in stock

Claude will use the create_product tool with:
{
  "name": "Organic Apples",
  "description": "Fresh organic apples",
  "unitPrice": 3.99,
  "quantity": 100,
  "measureType": "kg",
  "attributes": {
    "organic": true,
    "category": "fruits"
  }
}
```

## Testing the MCP Server Manually

You can also test the MCP server directly:

```bash
# Development mode (with ts-node)
npm run mcp

# Production mode (from compiled JavaScript)
npm run mcp:build
```

The server communicates via stdio (standard input/output), so you'll need an MCP client to interact with it properly.

## Troubleshooting

### MCP Server Not Appearing in Claude

1. Verify the path in `claude_desktop_config.json` is correct and absolute
2. Make sure the project is built (`npm run build`)
3. Restart Claude Desktop completely
4. Check Claude Desktop logs for errors

### Database Connection Errors

1. Ensure MongoDB is running
2. Verify `MONGODB_URI` in the MCP config matches your MongoDB instance
3. Check MongoDB logs for connection issues

### Tool Execution Errors

1. Verify required parameters are provided
2. Check that ObjectIds are valid MongoDB ObjectIds (24 hex characters)
3. Ensure data validation rules are met (e.g., password min length)

## Architecture

The MCP server:
- Uses the same service and repository layers as the REST API
- Connects directly to MongoDB (doesn't use HTTP)
- Validates inputs using class-validator DTOs
- Returns formatted JSON responses
- Handles errors gracefully with detailed messages

## Security Considerations

- Passwords are hashed using bcrypt before storage
- Input validation prevents invalid data
- MongoDB ObjectId validation prevents injection attacks
- Environment variables keep sensitive data secure

## Development Tips

### Adding New Tools

To add new MCP tools:

1. Add the tool definition to `TOOLS` array in `src/mcp/server.ts`
2. Add the handler case in `handleToolCall` function
3. Rebuild the project: `npm run build`
4. Restart Claude Desktop

### Debugging

Enable debug logging by setting:
```env
NODE_ENV=development
```

This enables TypeORM query logging to see database operations.

## Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [TypeORM Documentation](https://typeorm.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Support

For issues or questions:
1. Check the main README.md
2. Review Claude Desktop logs
3. Check MongoDB connection
4. Verify environment configuration
