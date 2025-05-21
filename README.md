# Mana Plan - Money Manager Web Application

## Project Overview

Mana Plan is a modern Progressive Web Application (PWA) designed to help users
manage their personal finances effectively. The application allows tracking
expenses, calculating balances, and providing estimates on whether the user's
balance is sufficient until the next payday.

<img alt="Mana Plan Screenshot" src="https://via.placeholder.com/600x400?text=Mana+Plan+Screenshot">

## Key Features

- **Smart Balance Management**: Automatically calculates if your current balance
  will last until your next payday
- **Daily Expense Tracking**: Setup and monitor predictable daily expenses
- **Income & Expense Recording**: Simple interface for adding both income and
  expenses
- **Visual Indicators**: Color-coded interface based on financial status (green
  for sufficient balance, red for insufficient)
- **Notification System**: Alerts for balance changes and financial status
- **Data Export**: Download financial data in PDF format
- **Offline Support**: Full functionality even without internet connection
- **PWA Capabilities**: Installable on mobile devices and desktops

## Technologies Used

- **Frontend Framework**: React with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS with Flowbite components
- **Animation**: Framer Motion for smooth UI transitions
- **Local Storage**: IndexedDB for offline data persistence
- **Service Workers**: For PWA functionality and offline capabilities
- **Icons**: GitHub's Octicons
- **PDF Generation**: jsPDF for exporting financial data
- **Build Tool**: Vite

## Technical Highlights

### Responsive Design

The application features a mobile-first responsive design that works seamlessly
across devices of all sizes, built using Tailwind CSS. The UI is optimized for
mobile usage while still providing a great experience on desktop.

### Offline Functionality

Implemented comprehensive offline support using IndexedDB and service workers,
allowing users to:

- Access and view all their financial data
- Add new transactions
- Modify their balance
- Calculate projections

All without requiring an internet connection.

### Real-time Financial Calculations

The application performs complex calculations to determine:

- Working days remaining until next payday
- Daily budget based on remaining balance
- Projected balance shortfall or surplus
- Automatic color-coding of UI based on financial status

### Custom Components

Developed several custom React components including:

- Custom date picker with calendar interface
- Transaction filtering system
- Animated notification system
- Modal dialogs for data entry

### Progressive Web App Implementation

Configured with a service worker for offline capabilities, installable
interface, and automatic updates using the vite-plugin-pwa package.

### Performance Optimizations

- Used React.memo and useCallback for optimized rendering
- Implemented lazy loading for components
- Minimized re-renders through proper state management
- Optimized animations for smooth performance even on lower-end devices

## Development Process

The project was developed following modern best practices:

- TypeScript for type safety and improved developer experience
- ESLint for code quality enforcement
- Modular component architecture
- Context API for state management
- Mobile-first responsive design approach

## Installation and Usage

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Build for production with `npm run build`

## Live Demo

[Mana Plan Web Application](https://github.com/argf013/money-manager)

## Future Enhancements

- Budget categorization and analytics
- Expense patterns and insights
- Multi-currency support
- Cloud synchronization
- Financial goal setting and tracking

This project demonstrates my expertise in building complex, user-focused web
applications with React, TypeScript, and modern frontend technologies. It
showcases my ability to create performant PWAs with offline capabilities and
intuitive user interfaces.
