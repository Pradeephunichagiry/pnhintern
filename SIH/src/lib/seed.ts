import dbConnect from './mongodb';
import User from './models/User';
import Challenge from './models/Challenge';
import Submission from './models/Submission';
import Badge from './models/Badge';
import { users, challenges, submissions, badges } from './data';

async function seedDatabase() {
  await dbConnect();

  // Clear existing data
  await User.deleteMany({});
  await Challenge.deleteMany({});
  await Submission.deleteMany({});
  await Badge.deleteMany({});

  // Insert data
  await User.insertMany(users);
  // Activate all challenges by setting an active flag or similar if applicable
  const activeChallenges = challenges.map(challenge => ({
    ...challenge,
    active: true, // Assuming 'active' field controls activation
  }));
  await Challenge.insertMany(activeChallenges);
  await Submission.insertMany(submissions);
  await Badge.insertMany(badges);

  console.log('Database seeded successfully');
}

export default seedDatabase;
