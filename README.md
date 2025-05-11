# Building Energy Analysis System

A web application for analyzing building energy consumption, heat gain, and cooling loads. The system helps architects and engineers make informed decisions about building design and energy efficiency.

## Features

- Building facade analysis with heat gain calculations
- Energy consumption and cost analysis
- Comparative analysis of different building designs
- City-wise performance rankings
- Interactive charts and visualizations

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/
│   │   ├── api/       # API integration
│   │   ├── components/# React components
│   │   └── types/     # TypeScript type definitions
│   └── package.json
└── server/            # Backend Node.js application
    ├── src/
    │   ├── controllers/# Route controllers
    │   ├── routes/    # API routes
    │   └── models/    # Database models
    └── package.json
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/IntriguedSayan/SDAsg.git
   cd <repository-name>
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   REDIS_URL=your_redis_connection_string
   MONGODB_URI=your_mongodb_connection_string
   ```

5. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

6. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Create a new building by filling out the building form with:
   - Building name and location
   - Facade details (height, width, window-to-wall ratio)
   - SHGC (Solar Heat Gain Coefficient)
   - Orientation for each facade

2. View the analysis dashboard to see:
   - Heat gain calculations per facade
   - Energy consumption metrics
   - Cost analysis
   - Comparative performance data

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Recharts for data visualization
  - React Query for API integration

- Backend:
  - Node.js
  - Express
  - MongoDB
  - TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
