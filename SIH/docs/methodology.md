# Methodology and Process for Implementation of EcoChampion

## Overview
EcoChampion is a gamified eco-learning platform built with Next.js, enabling students to participate in sustainability challenges and educators to manage them. This document outlines the methodology, implementation process, flow charts, and provides a working prototype demonstration.

## Methodology
We follow an Agile methodology with iterative development cycles:

### 1. Requirements Analysis
- Gather functional and non-functional requirements from stakeholders
- Define user stories and acceptance criteria
- Prioritize features using MoSCoW method

### 2. System Design
- High-level architecture design (Frontend: Next.js, Backend: API routes, Database: MongoDB/Firebase)
- UI/UX design following sustainability theme guidelines
- Database schema design for Users, Challenges, Submissions, Badges

### 3. Development Phases
- **Phase 1: Core Infrastructure** - Authentication, database setup, basic routing
- **Phase 2: User Management** - Registration, login, profiles for students and educators
- **Phase 3: Challenge System** - Create, assign, participate in challenges
- **Phase 4: Submission & Analysis** - Evidence upload, AI-powered analysis
- **Phase 5: Gamification** - Points, badges, leaderboards
- **Phase 6: Learning Resources** - Content integration
- **Phase 7: Reporting & Analytics** - Dashboards, progress tracking

### 4. Testing Strategy
- Unit testing with Jest
- Integration testing for API endpoints
- E2E testing with Playwright
- User acceptance testing

### 5. Deployment & Maintenance
- CI/CD with GitHub Actions
- Deployment to Firebase Hosting
- Monitoring and iterative improvements

## Implementation Process

### Technology Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API routes, MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **AI**: Google AI via Genkit for evidence analysis
- **Database**: MongoDB for data, Firebase for hosting/rules
- **Deployment**: Firebase App Hosting

### Key Processes

1. **User Registration Flow**
   - Student/Educator selects role
   - Fills registration form
   - Email verification (if implemented)
   - Profile creation

2. **Challenge Creation**
   - Educator logs in
   - Navigates to challenges page
   - Creates new challenge with details, points, deadline
   - Assigns to classes/groups

3. **Challenge Participation**
   - Student views available challenges
   - Accepts challenge
   - Completes task, uploads evidence
   - Submission analyzed by AI
   - Status: Pending → Approved/Rejected

4. **Gamification**
   - Points awarded on approval
   - Badges unlocked based on achievements
   - Leaderboard updates

## Flow Charts

### User Authentication Flow
```
Start
  |
  v
User visits login/register page
  |
  +---------------------+
  | Choose role:       |
  | - Student          |
  | - Educator         |
  +---------------------+
  |
  v
Enter credentials
  |
  v
Validate input
  |
  +---------------------+
  | Valid?             |
  +---------------------+
  |         |           |
  | No      | Yes       |
  |         v           |
  |     JWT token       |
  |     generated       |
  |         |           |
  |         v           |
  |     Redirect to     |
  |     dashboard       |
  +---------------------+
            |
            v
          End
```

### Challenge Submission Flow
```
Start
  |
  v
Student selects challenge
  |
  v
Accepts challenge
  |
  v
Completes task
  |
  v
Uploads evidence (photo/video/text)
  |
  v
AI analyzes submission
  |
  +---------------------+
  | Analysis result     |
  +---------------------+
  |         |           |
  | Flag for| Auto      |
  | review   | approve   |
  |         |           |
  |         v           |
  |     Educator        |
  |     reviews         |
  |         |           |
  |         v           |
  +---------------------+
  | Approved?           |
  +---------------------+
  |         |           |
  | No      | Yes       |
  |         v           |
  |     Points awarded  |
  |     Badge check     |
  |         |           |
  |         v           |
  |     Leaderboard     |
  |     update          |
  +---------------------+
            |
            v
          End
```

### System Architecture Diagram
```
+----------------+     +----------------+     +----------------+
|   Frontend     |     |   Backend      |     |   Database     |
|   (Next.js)    |     |   (API Routes) |     |   (MongoDB)    |
+----------------+     +----------------+     +----------------+
| - Pages        |     | - Auth         |     | - Users        |
| - Components   |     | - Challenges   |     | - Challenges   |
| - UI/UX        |     | - Submissions  |     | - Submissions  |
+----------------+     +----------------+     +----------------+
        |                       |                       |
        +-----------+-----------+-----------+-----------+
                    |                       |
                    v                       v
            +----------------+     +----------------+
            |   AI Service    |     |   Firebase      |
            |   (Genkit)      |     |   (Hosting)     |
            +----------------+     +----------------+
```

## Working Prototype

The application is built and can be run locally. To demonstrate:

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access at http://localhost:9002

### Key Features Demonstrated:
- User registration and login for students and educators
- Dashboard views with overview
- Challenge listing and participation
- Submission upload and status tracking
- Leaderboard display
- Profile management

### Sample User Flow:
1. Register as a student
2. Login and view dashboard
3. Browse available challenges
4. Participate in a challenge
5. Upload evidence
6. View submission status
7. Check leaderboard and badges

## Next Steps
- Implement AI evidence analysis fully
- Add learning resources module
- Enhance gamification features
- Conduct user testing
- Deploy to production
