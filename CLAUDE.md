# React Native MLX Development Guide

## Build Commands
- `bun --cwd package build` - Build the package
- `bun specs` - Generate specs and run build
- `bun typescript` - TypeScript type checking
- `bun --cwd ./package specs:pod` - Generate specs and install pods
- `sh ./scripts/build-framework.sh` - Build native framework

## Example App Commands
- `cd example && bun start` - Start the example app
- `cd example && bun ios` - Run on iOS simulator
- `cd example && bun android` - Run on Android emulator

## Code Style Guidelines
- Use Biome.js for linting/formatting: `biome check .` or `biome format .`
- TypeScript with strict typing and proper interfaces
- Indentation: 2 spaces
- Quotes: single quotes for strings, double for JSX
- Line width: 90 characters maximum
- Semicolons: optional (as needed)
- Use ES6+ syntax including async/await
- Proper error handling with specific error messages
- Use enums for event types and clear type definitions
- Follow React Native Nitro Modules conventions for native bridge
- Use proper typing with interfaces and type exports