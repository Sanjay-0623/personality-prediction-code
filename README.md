# Personality Prediction AI

An AI-powered personality analysis application that predicts Big Five personality traits through multiple analysis methods including questionnaires, Twitter analysis, image analysis, and video analysis.

## Features

- 🔐 User authentication and registration with secure password hashing
- 📝 Interactive personality questionnaire assessment
- 🐦 Twitter profile analysis (with demo mode fallback)
- 📸 Image-based personality analysis
- 🎥 Video-based personality analysis
- 📊 Big Five personality trait predictions
- 📄 Detailed personality reports with download and share functionality
- 👤 User dashboard and profile management
- 💾 PostgreSQL database integration for data persistence

## Tech Stack

### Frontend
- **Next.js 15.1.0** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI component library
- **Lucide React** - Icon library
- **Recharts** - Chart library for data visualization
- **Date-fns** - Date manipulation library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **@neondatabase/serverless** - Neon database client
- **bcryptjs** - Password hashing and encryption
- **Twitter API v2** - Social media data integration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Personality Analysis Algorithms

### 1. Questionnaire Analysis
The app uses a keyword-based scoring algorithm that analyzes text responses to 10 personality questions:

- **Openness**: Detects keywords like "creative", "curious", "explore", "art", "new ideas"
- **Conscientiousness**: Looks for "organized", "planning", "responsibility", "detail", "disciplined"
- **Extraversion**: Identifies "social", "outgoing", "energy", "people", "party"
- **Agreeableness**: Searches for "kind", "empathy", "help", "cooperation", "understanding"
- **Neuroticism**: Detects "stress", "worry", "anxious", "emotional", "nervous"

Each trait is scored from 0 to 1 based on keyword frequency and response length.

### 2. Twitter Analysis
Analyzes user tweets to predict personality based on:
- Tweet content and language patterns
- Posting frequency and timing
- Engagement metrics (likes, retweets)
- Emotional tone and sentiment
- Topic diversity

**Note**: Currently uses demo mode when API rate limits are exceeded.

### 3. Image Analysis
Examines facial features and expressions:
- Facial expression analysis
- Eye contact patterns
- Body language cues
- Color preferences in photos
- Background and environment

### 4. Video Analysis
Comprehensive analysis combining:
- Facial expressions over time
- Voice tone and speech patterns
- Body language and gestures
- Speech content analysis
- Interaction patterns

## Database Setup

### Prerequisites
1. A Neon account (free tier available at https://neon.tech)
2. Node.js 18+ and npm installed
3. VS Code or any code editor

### Setting Up Neon Database

#### Step 1: Create Neon Project
1. Go to https://neon.tech and sign up/login
2. Create a new project
3. Copy your connection string (starts with `postgresql://`)

#### Step 2: Add Environment Variables
Create a `.env.local` file in your project root:

\`\`\`env
DATABASE_URL=your_neon_connection_string_here
TWITTER_BEARER_TOKEN=your_twitter_token_here
\`\`\`

#### Step 3: Install Dependencies
\`\`\`bash
npm install
\`\`\`

#### Step 4: Create Database Tables
The database schema includes three main tables:

**users** - Stores user account information
- id (Primary Key)
- username (Unique)
- email (Unique)
- password_hash
- is_admin
- created_at

**personality_results** - Stores personality analysis results
- id (Primary Key)
- user_id (Foreign Key)
- openness, conscientiousness, extraversion, agreeableness, neuroticism
- created_at
- source_type (questionnaire, twitter, image, video)
- twitter_username
- is_demo

**questionnaire_responses** - Stores questionnaire answers
- id (Primary Key)
- user_id (Foreign Key)
- question_index
- response
- created_at

The tables will be automatically created when you connect the Neon integration in v0, or you can run the SQL script manually:

\`\`\`sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS personality_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  openness DECIMAL(3, 2),
  conscientiousness DECIMAL(3, 2),
  extraversion DECIMAL(3, 2),
  agreeableness DECIMAL(3, 2),
  neuroticism DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source_type VARCHAR(20) DEFAULT 'questionnaire',
  twitter_username VARCHAR(50),
  is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### VS Code Database Setup

1. **Install PostgreSQL Extension** (optional for viewing data)
   - Open VS Code Extensions (Ctrl+Shift+X)
   - Search for "PostgreSQL" by Chris Kolkman
   - Install the extension

2. **Connect to Neon Database**
   - Click the PostgreSQL icon in the sidebar
   - Click "+" to add a connection
   - Paste your Neon connection string
   - You can now browse tables and run queries

3. **Alternative: Use Neon Console**
   - Go to https://console.neon.tech
   - Select your project
   - Use the SQL Editor to run queries and view data

## Getting Started

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd personality-prediction-code

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add your DATABASE_URL and TWITTER_BEARER_TOKEN
\`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
personality-prediction-code/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── analyze-twitter/   # Twitter analysis endpoint
│   │   ├── analyze-image/     # Image analysis endpoint
│   │   ├── analyze-video/     # Video analysis endpoint
│   │   └── personality-results/ # Results storage endpoint
│   ├── dashboard/             # User dashboard page
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── profile/               # User profile page
│   ├── questionnaire/         # Questionnaire page
│   ├── twitter-analysis/      # Twitter analysis page
│   ├── image-analysis/        # Image analysis page
│   ├── video-analysis/        # Video analysis page
│   ├── results/               # Results display page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Homepage
│   └── globals.css            # Global styles
├── components/
│   └── ui/                    # Reusable UI components
├── lib/
│   └── db.ts                  # Database utility functions
├── scripts/
│   └── 01-create-tables.sql   # Database schema
├── public/                    # Static assets
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
\`\`\`

## Usage Guide

### 1. Create an Account
- Navigate to the register page
- Enter username, email, and password
- Click "Create Account"

### 2. Choose Analysis Method
After logging in, select from:
- **Questionnaire** - Answer 10 personality questions
- **Twitter Analysis** - Enter a Twitter username
- **Image Analysis** - Upload a photo
- **Video Analysis** - Upload a video

### 3. View Results
- See your Big Five personality scores
- Read detailed trait descriptions
- Get personalized recommendations
- Download or share your report

### 4. Manage Profile
- View analysis history
- Update profile information
- Track personality insights over time

## Twitter Integration

### Setup Twitter API (Optional)

To enable real Twitter analysis:

1. Create a Twitter Developer account at https://developer.twitter.com
2. Create a new app in the Developer Portal
3. Generate a Bearer Token
4. Add to `.env.local`:
   \`\`\`
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   \`\`\`

### Demo Mode

When Twitter API is unavailable (rate limits or no token), the app automatically falls back to demo mode, generating simulated personality results based on username patterns.

## Security Features

- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **SQL Injection Prevention**: Parameterized queries using Neon client
- **Authentication**: Session-based authentication using localStorage (client-side)
- **Input Validation**: Server-side validation for all user inputs
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Troubleshooting

### Common Issues

**"Failed to create user" error**
- Ensure database tables are created
- Check DATABASE_URL environment variable is set
- Verify Neon database is accessible

**"Too Many Requests" on Twitter analysis**
- Twitter API has rate limits
- App automatically switches to demo mode
- Wait 15 minutes or use other analysis methods

**Dependencies installation errors**
- Delete `node_modules` and `package-lock.json`
- Run `npm cache clean --force`
- Run `npm install --legacy-peer-deps`

**PowerShell script execution error (Windows)**
- Run PowerShell as Administrator
- Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Restart VS Code

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review Neon documentation at https://neon.tech/docs
- Review Next.js documentation at https://nextjs.org/docs

## Acknowledgments

- Big Five personality trait model
- shadcn/ui for beautiful components
- Neon for serverless PostgreSQL
- Twitter API for social media data
- Vercel for deployment platform
