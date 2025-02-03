# BharatFD-Backend-Developer Test

# FAQ Management System

A full-stack application for managing Frequently Asked Questions (FAQs) with multi-language support, built using the MERN stack (MongoDB, Express.js, React, Node.js) and Redis for caching.

## Features

- Create, Read, Update, and Delete FAQs
- Automatic translation to multiple languages (Hindi, Bengali, French, Spanish)
- Redis caching for improved performance
- Real-time language switching
- Responsive Material-UI interface

## Prerequisites

Before installation, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SG002/BharatFD-Backend-Developer.git
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

npm start
```

The backend server will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will run on `http://localhost:3000`

# Redis Integration Guide

## Prerequisites
- Redis Server (v6.0 or higher)
- Node.js Redis Client

## Installation

### 1. Install Redis Server

#### Windows
```bash
# Using Windows Subsystem for Linux (WSL2) - Recommended
wsl --install
wsl
sudo apt-get update
sudo apt-get install redis-server

# Start Redis server
sudo service redis-server start

# Test Redis connection
redis-cli ping
# Should return "PONG"
```

#### macOS
```bash
# Using Homebrew
brew install redis

# Start Redis server
brew services start redis

# Test Redis connection
redis-cli ping
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install redis-server

# Start Redis server
sudo systemctl start redis

# Enable Redis to start on boot
sudo systemctl enable redis
```

### 2. Install Redis Client in Node.js Project

```bash
npm install redis
```


  

## Cache Management

### Cache Keys Structure
```javascript
// Examples of cache key patterns
faqs:${language}           // All FAQs in a specific language
faq:${id}:${language}     // Single FAQ in a specific language
```

## Environment Variables

Create a `.env` file in your backend directory:
```env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password  # If using authentication
```

## Monitoring Redis

### Redis CLI Commands
```bash
# Connect to Redis CLI
redis-cli

# Monitor all Redis commands in real-time
monitor

# Get all keys matching a pattern
keys *

# Get information about Redis server
info

# Get memory usage
info memory
```

### Best Practices

1. **Error Handling**
   - Always implement error handling for Redis operations
   - Have fallback mechanisms when Redis is unavailable

2. **Cache Duration**
   - Set appropriate TTL (Time To Live) for cached data
   - Consider data update frequency when setting cache duration

3. **Memory Management**
   - Monitor Redis memory usage
   - Implement cache eviction policies if needed
   - Use `maxmemory` and `maxmemory-policy` in Redis configuration

4. **Security**
   - Enable Redis authentication in production
   - Use environment variables for sensitive configuration
   - Restrict Redis access to specific IP addresses

## Troubleshooting

Common issues and solutions:

1. **Connection Refused**
   ```bash
   # Check if Redis is running
   sudo systemctl status redis
   
   # Restart Redis
   sudo systemctl restart redis
   ```

2. **Authentication Failed**
   - Verify Redis password in environment variables
   - Check Redis configuration file (`redis.conf`)

3. **Memory Issues**
   ```bash
   # Clear all keys
   redis-cli FLUSHALL
   
   # Monitor memory usage
   redis-cli INFO memory
   ```

## Additional Resources

- [Redis Official Documentation](https://redis.io/documentation)
- [Node Redis Client Documentation](https://github.com/redis/node-redis)
- [Redis Best Practices](https://redis.io/topics/best-practices)

# Jest Testing Framework Guide

## Installation

```bash
npm install --save-dev jest @types/jest @jest/globals
```

For ES Modules support, add to package.json:
```json
{
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },
  "type": "module"
}
```

## Key Concepts

1. **Test Suites**: 
```javascript
describe('FAQ Model Tests', () => {
  // tests go here
});
```

2. **Individual Tests**:
```javascript
test('should create FAQ successfully', () => {
  // test logic
});
```

3. **Lifecycle Hooks**: 

```27:30:backend/tests/models/faq.test.js
  beforeEach(async () => {
    await FAQ.deleteMany({});
  });

```


4. **Mocking**: 

```10:16:backend/tests/routes/api.test.js
jest.unstable_mockModule('../../helper/translate.js', () => ({
  translateFAQ: jest.fn().mockImplementation(async () => 
    new Map([['hi', { question: 'टेस्ट प्रश्न?', answer: 'टेस्ट उत्तर' }]])
  ),
  translateFAQContent: jest.fn(),
  supportedLanguages: ['hi', 'bn', 'fr', 'es']
}));
```


5. **Assertions**: 
```javascript
expect(value).toBe(expected);
expect(array).toContain(item);
expect(object).toHaveProperty('key');
expect(function).toThrow(error);
```

## Best Practices (from my codebase)

1. **Isolated Tests**:

```23:30:backend/tests/routes/api.test.js
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  
  
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
```


2. **Clean State**: 

```27:29:backend/tests/models/faq.test.js
  beforeEach(async () => {
    await FAQ.deleteMany({});
  });
```


3. **Mock External Services**:

```1:7:backend/tests/mocks/translationService.mock.js
export const translateText = async (text, targetLang) => {
  return `Translated: ${text} to ${targetLang}`;
};

export default {
  translateText
};
```


## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Get All FAQs
```http
GET /faqs?lang=en
```
Query Parameters:
- `lang` (optional): Language code (en, hi, bn, fr, es)

Response:
```json
{
  "language": "en",
  "supportedLanguages": ["en", "hi", "bn", "fr", "es"],
  "count": 1,
  "faqs": [
    {
      "_id": "123",
      "question": "Sample Question?",
      "answer": "Sample Answer",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single FAQ
```http
GET /faqs/:id?lang=en
```
Query Parameters:
- `lang` (optional): Language code (en, hi, bn, fr, es)

#### Create FAQ
```http
POST /faqs
```
Request Body:
```json
{
  "question": "New Question?",
  "answer": "New Answer"
}
```

#### Update FAQ
```http
PUT /faqs/:id
```
Request Body:
```json
{
  "question": "Updated Question?",
  "answer": "Updated Answer"
}
```

#### Delete FAQ
```http
DELETE /faqs/:id
```



## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Update documentation as needed
- Add comments for complex logic
- Test your changes thoroughly
- Create issues for major changes and enhancements

## Error Handling

The API uses standard HTTP response codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Caching

The application uses Redis for caching:
- FAQ lists are cached by language
- Individual FAQs are cached by ID and language
- Cache is automatically invalidated on updates


