import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { UserService } from '../features/user/services/user.service';
import { ProductService } from '../features/product/services/product.service';
import { AppDataSource } from '../config/database';

// Initialize services
let userService: UserService;
let productService: ProductService;

// Define MCP tools based on API endpoints
const TOOLS: Tool[] = [
  // User Tools
  {
    name: 'create_user',
    description: 'Create a new user with email, password, name, and optional picture URL',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address',
        },
        password: {
          type: 'string',
          minLength: 6,
          description: 'User password (minimum 6 characters)',
        },
        name: {
          type: 'string',
          description: 'User full name',
        },
        pictureUrl: {
          type: 'string',
          description: 'Optional profile picture URL',
        },
      },
      required: ['email', 'password', 'name'],
    },
  },
  {
    name: 'get_all_users',
    description: 'Retrieve all users from the database',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_user_by_id',
    description: 'Get a specific user by their ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'User ID (MongoDB ObjectId)',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'update_user',
    description: 'Update an existing user by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'User ID (MongoDB ObjectId)',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Updated email address',
        },
        password: {
          type: 'string',
          minLength: 6,
          description: 'Updated password',
        },
        name: {
          type: 'string',
          description: 'Updated name',
        },
        pictureUrl: {
          type: 'string',
          description: 'Updated picture URL',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_user',
    description: 'Delete a user by their ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'User ID (MongoDB ObjectId)',
        },
      },
      required: ['id'],
    },
  },
  // Product Tools
  {
    name: 'create_product',
    description: 'Create a new product with name, description, price, quantity, measure type, and attributes',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Product name',
        },
        description: {
          type: 'string',
          description: 'Product description',
        },
        pictureUrl: {
          type: 'string',
          description: 'Optional product image URL',
        },
        unitPrice: {
          type: 'number',
          minimum: 0,
          description: 'Unit price of the product',
        },
        quantity: {
          type: 'number',
          minimum: 0,
          description: 'Available quantity',
        },
        measureType: {
          type: 'string',
          description: 'Unit of measurement (e.g., kg, liters, units)',
        },
        attributes: {
          type: 'object',
          description: 'Additional product attributes as key-value pairs',
        },
      },
      required: ['name', 'description', 'unitPrice', 'quantity', 'measureType', 'attributes'],
    },
  },
  {
    name: 'get_all_products',
    description: 'Retrieve all products from the database',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_product_by_id',
    description: 'Get a specific product by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Product ID (MongoDB ObjectId)',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'update_product',
    description: 'Update an existing product by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Product ID (MongoDB ObjectId)',
        },
        name: {
          type: 'string',
          description: 'Updated product name',
        },
        description: {
          type: 'string',
          description: 'Updated description',
        },
        pictureUrl: {
          type: 'string',
          description: 'Updated picture URL',
        },
        unitPrice: {
          type: 'number',
          minimum: 0,
          description: 'Updated unit price',
        },
        quantity: {
          type: 'number',
          minimum: 0,
          description: 'Updated quantity',
        },
        measureType: {
          type: 'string',
          description: 'Updated measure type',
        },
        attributes: {
          type: 'object',
          description: 'Updated attributes',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_product',
    description: 'Delete a product by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Product ID (MongoDB ObjectId)',
        },
      },
      required: ['id'],
    },
  },
];

// Tool execution handlers
async function handleToolCall(name: string, args: any): Promise<any> {
  try {
    switch (name) {
      // User operations
      case 'create_user':
        return await userService.createUser(args);
      case 'get_all_users':
        return await userService.getAllUsers();
      case 'get_user_by_id':
        return await userService.getUserById(args.id);
      case 'update_user': {
        const { id, ...updateData } = args;
        return await userService.updateUser(id, updateData);
      }
      case 'delete_user':
        return await userService.deleteUser(args.id);

      // Product operations
      case 'create_product':
        return await productService.createProduct(args);
      case 'get_all_products':
        return await productService.getAllProducts();
      case 'get_product_by_id':
        return await productService.getProductById(args.id);
      case 'update_product': {
        const { id, ...updateData } = args;
        return await productService.updateProduct(id, updateData);
      }
      case 'delete_product':
        return await productService.deleteProduct(args.id);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    throw new Error(`Tool execution failed: ${error.message}`);
  }
}

// Initialize and start MCP server
export async function startMCPServer() {
  // Initialize database connection
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Initialize services
  userService = new UserService();
  productService = new ProductService();

  // Create MCP server
  const server = new Server(
    {
      name: 'mcpnodefil-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleToolCall(name, args || {});
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Connect server to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('MCP Server started successfully');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(0);
});
