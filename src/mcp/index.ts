#!/usr/bin/env node
import 'reflect-metadata';
import dotenv from 'dotenv';
import { startMCPServer } from './server';

// Load environment variables
dotenv.config();

// Start the MCP server
startMCPServer().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
