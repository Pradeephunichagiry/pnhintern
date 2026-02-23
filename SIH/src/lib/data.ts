import type { User, Badge, Challenge, Submission, LearningResource, LeaderboardEntry } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';
const getHint = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageHint || '';


const defaultUsers: User[] = [
  { id: 'user-1', name: 'Alex Green', email: 'alex@example.com', avatarUrl: getImage('avatar-1'), role: 'student', points: 1250, level: 5, streak: 12, educatorId: 'user-5' },
  { id: 'user-2', name: 'Bella Watt', email: 'bella@example.com', avatarUrl: getImage('avatar-2'), role: 'student', points: 980, level: 4, streak: 5, educatorId: 'user-5' },
  { id: 'user-3', name: 'Charlie Bloom', email: 'charlie@example.com', avatarUrl: getImage('avatar-3'), role: 'student', points: 1500, level: 6, streak: 20, educatorId: 'user-5' },
  { id: 'user-4', name: 'Diana Leaf', email: 'diana@example.com', avatarUrl: getImage('avatar-4'), role: 'student', points: 750, level: 3, streak: 2, educatorId: 'user-5' },
  { id: 'user-5', name: 'Mr. David River', email: 'david.r@example.com', avatarUrl: getImage('avatar-5'), role: 'educator', points: 0, level: 0, streak: 0 },
];

export const users: User[] = (() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('users');
    if (stored) {
      return JSON.parse(stored) as User[];
    }
  }
  return [] as User[];
})();

export const badges: Badge[] = [
  { id: 'badge-1', title: 'Recycle Rookie', description: 'Completed your first recycling challenge.', iconUrl: getImage('badge-recycler'), iconHint: getHint('badge-recycler') },
  { id: 'badge-2', title: 'Tree Whisperer', description: 'Successfully planted a tree.', iconUrl: getImage('badge-tree-planter'), iconHint: getHint('badge-tree-planter')},
  { id: 'badge-3', title: 'Energy Saver', description: 'Reduced energy consumption for a week.', iconUrl: getImage('badge-energy-saver'), iconHint: getHint('badge-energy-saver') },
  { id: 'badge-4', title: 'Water Guardian', description: 'Conserved water for 3 consecutive days.', iconUrl: getImage('badge-water-guardian'), iconHint: getHint('badge-water-guardian') },
  { id: 'badge-5', title: 'Eco Warrior', description: 'Earned over 1000 points.', iconUrl: getImage('badge-eco-warrior'), iconHint: getHint('badge-eco-warrior') },
  { id: 'badge-6', title: 'Solar Sage', description: 'Learned about solar power.', iconUrl: 'https://picsum.photos/seed/badgeSolar/100/100', iconHint: 'sun power' },
  { id: 'badge-7', title: 'Sort Master', description: 'Mastered waste segregation.', iconUrl: 'https://picsum.photos/seed/badgeSort/100/100', iconHint: 'bins separated' },
  { id: 'badge-8', title: 'Green Commuter', description: 'Used a green commute method.', iconUrl: 'https://picsum.photos/seed/badgeCommute/100/100', iconHint: 'bicycle path' },
];

export const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Plant & Care for a Sapling 🌱',
    description: 'Plant a sapling in your community and document its growth for a week.',
    whyItMatters: 'Trees produce oxygen, absorb CO2, and provide habitat for wildlife.',
    points: 250,
    deadline: '2024-12-31',
    badgeId: 'badge-2',
    imageUrl: 'https://picsum.photos/seed/challengeSapling/600/400',
    imageHint: 'sapling hands',
    createdBy: 'user-5',
  },
  {
    id: 'challenge-2',
    title: 'Water Saver for a Day 💧',
    description: 'Consciously save water for a full day. Track your usage and report the changes you made.',
    whyItMatters: 'Conserving water helps protect our ecosystems and saves energy.',
    points: 100,
    deadline: '2024-11-30',
    badgeId: 'badge-4',
    imageUrl: 'https://picsum.photos/seed/challengeWater/600/400',
    imageHint: 'water tap',
    createdBy: 'user-5',
  },
  {
    id: 'challenge-3',
    title: 'Plastic-Free Day ♻️',
    description: 'Go a full day without using any single-use plastics. Share your alternatives.',
    whyItMatters: 'Reducing plastic waste helps protect marine life and reduces pollution.',
    points: 150,
    deadline: '2024-10-15',
    badgeId: 'badge-1',
    imageUrl: 'https://picsum.photos/seed/challengePlastic/600/400',
    imageHint: 'plastic waste',
    createdBy: 'user-5',
  },
  {
    id: 'challenge-4',
    title: 'Solar Power Awareness 🌞',
    description: 'Research and write a short summary about the benefits of solar power.',
    whyItMatters: 'Solar power is a clean, renewable energy source that reduces carbon emissions.',
    points: 80,
    deadline: '2024-12-31',
    badgeId: 'badge-6',
    imageUrl: 'https://picsum.photos/seed/challengeSolar/600/400',
    imageHint: 'solar panels',
    createdBy: 'user-5',
  },
  {
    id: 'challenge-5',
    title: 'Waste Segregation 🚮',
    description: 'Properly segregate your household waste for a week into recyclable, organic, and landfill categories.',
    whyItMatters: 'Proper waste segregation makes recycling more effective and reduces landfill.',
    points: 120,
    deadline: '2024-11-30',
    badgeId: 'badge-7',
    imageUrl: 'https://picsum.photos/seed/challengeWaste/600/400',
    imageHint: 'recycling bins',
    createdBy: 'user-5',
  },
  {
    id: 'challenge-6',
    title: 'Green Commute Day 🚴',
    description: 'Use a green method of transportation (walk, bike, public transport) for your daily commute.',
    whyItMatters: 'Green commuting reduces air pollution and traffic congestion.',
    points: 70,
    deadline: '2024-10-15',
    badgeId: 'badge-8',
    imageUrl: 'https://picsum.photos/seed/challengeCommute/600/400',
    imageHint: 'bicycle road',
    createdBy: 'user-5',
  },
];


export const submissions: Submission[] = [
  {
    id: 'sub-1',
    challengeId: 'challenge-3',
    studentId: 'user-1',
    submissionText: 'I used my reusable water bottle and coffee cup all day! It was challenging but I feel great about it.',
    evidenceUrl: getImage('submission-1'),
    status: 'Approved',
    submittedAt: '2024-09-10',
    reviewedAt: '2024-09-11',
    feedback: 'Great job, Alex! Love the commitment.'
  },
  {
    id: 'sub-2',
    challengeId: 'challenge-5',
    studentId: 'user-2',
    submissionText: 'I tried to segregate the waste but I am not sure about some items.',
    evidenceUrl: '',
    status: 'Pending',
    submittedAt: '2024-09-12',
    aiAnalysis: {
      isComplete: false,
      confidence: 0.7,
      flaggedIssues: ['Submission text indicates uncertainty.'],
      feedback: 'Good start! It can be tricky. Could you take a picture of the items you are unsure about?',
    }
  },
  {
    id: 'sub-3',
    challengeId: 'challenge-1',
    studentId: 'user-3',
    submissionText: 'Planted an oak tree in my backyard!',
    evidenceUrl: getImage('submission-1'),
    status: 'Rejected',
    submittedAt: '2024-09-05',
    reviewedAt: '2024-09-06',
    feedback: 'Fantastic initiative, Charlie! However, the photo is a bit blurry. Could you upload a clearer picture of the planted tree?'
  },
];

export const learningResources: LearningResource[] = [
  {
    id: 'res-1',
    title: 'The Problem with Plastic',
    content: 'Single-use plastics are a major source of pollution. They take hundreds of years to break down and often end up in our oceans, harming marine life. Simple swaps like using a reusable bag or water bottle can make a huge difference.'
  },
  {
    id: 'res-2',
    title: 'Why Native Plants Matter',
    content: 'Native plants are adapted to the local climate and soil conditions, so they require less water and fertilizer. They also provide essential food and habitat for local birds, insects, and other wildlife, supporting a healthy ecosystem.'
  },
  {
    id: 'res-3',
    title: 'Benefits of Green Commuting',
    content: 'Choosing to walk, bike, or use public transport instead of driving helps reduce greenhouse gas emissions, improves air quality, and can even lead to better physical and mental health. Every green trip makes a difference!'
  }
];

export const leaderboard: LeaderboardEntry[] = (users
  .filter(u => u.role === 'student') as User[])
  .sort((a, b) => b.points - a.points)
  .map((user, index) => ({
    rank: index + 1,
    student: user,
    points: user.points,
  }));

    