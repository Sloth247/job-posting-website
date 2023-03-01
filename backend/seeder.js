import dotenv from 'dotenv';
import connectDB from './config/db.js';
import jobs from './_data/data.js';
import Job from './models/Job.js';

// Load env vars
dotenv.config();

connectDB();

// // Connect to db
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Read JSON files
// const jobs = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/data.json`, 'utf-8')
// );

// Import into DB
const importData = async () => {
  try {
    await Job.deleteMany();

    const sampleJobs = jobs.map((job) => {
      return { ...job };
    });

    await Job.insertMany(sampleJobs);

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await Job.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
