# Personality Prediction AI

An AI-powered personality analysis application that predicts Big Five personality traits through questionnaires and Twitter analysis.

## Features

- User authentication and registration
- Personality questionnaire assessment
- Twitter profile analysis
- Big Five personality trait predictions
- Detailed personality reports
- User dashboard and profile management

## Twitter Integration

The app includes Twitter personality analysis that analyzes public tweets to predict personality traits.

### Setup Twitter API (Optional)

To enable real Twitter analysis:

1. Create a Twitter Developer account at https://developer.twitter.com
2. Create a new app and get your Bearer Token
3. Add the token to your environment variables:
   \`\`\`
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   \`\`\`

### Current Implementation

The Twitter analysis feature currently uses simulated data for demonstration. To integrate real Twitter API:

1. Install the Twitter API client: `npm install twitter-api-v2`
2. Update `app/api/analyze-twitter/route.ts` with actual Twitter API calls
3. Process tweets through your ML model for real predictions

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- Next.js 14
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
