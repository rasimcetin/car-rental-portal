# Car Rental Portal

A modern car rental management system built with Next.js 13+, TypeScript, Prisma, and Tailwind CSS. This application provides a comprehensive solution for managing car rentals, user bookings, and fleet management.

## Features

- 🚗 **Car Management**: Browse, search, and manage the car fleet
- 📅 **Booking System**: Easy-to-use booking interface for customers
- 👥 **User Management**: User authentication and profile management
- 📊 **Dashboard**: Administrative dashboard for managing bookings and reports
- 💳 **Pricing**: Automated pricing calculation based on rental duration
- 📱 **Responsive Design**: Modern UI that works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript
- **Styling**: Tailwind CSS, HeadlessUI
- **Database**: Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Tables**: TanStack Table

## Prerequisites

- Node.js 16.8 or later
- npm or yarn package manager
- Database (compatible with Prisma)

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd car-rental-portal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your database and authentication configuration.

4. Set up the database:
```bash
npm run db:migrate
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push database changes
- `npm run db:seed` - Seed the database
- `npm run prisma:generate` - Generate Prisma client

## Project Structure

```
car-rental-portal/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
├── interfaces/            # TypeScript interfaces
├── lib/                   # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static files
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
