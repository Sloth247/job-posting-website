import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import errorHandler from './middleware/error.js';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route file
import jobRoutes from './routes/jobs.js';

// express app
const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
app.use('/api/jobs', jobRoutes);

app.use(errorHandler);

// listen for requests
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
