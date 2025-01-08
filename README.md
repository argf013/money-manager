# Money Manager

Money Manager is a simple application designed to help you better manage your personal finances. This app enables users to calculate expenses, estimate balances, and present financial data in a concise and user-friendly way.

## Background
This application addresses the need for automatic financial management and provides estimates on whether your balance will last until the next payday. With its features, users can save time and reduce dependency on external assistance.

## Key Features
1. **Static Daily Expenses**:
   - Allows users to track predictable daily expenses, such as:
     - Breakfast: Rp20,000
     - Lunch: Rp20,000

2. **Additional Expense Calculation**:
   - The app can calculate dynamic or unexpected expenses.
   - Provides estimates on whether your remaining balance is sufficient until the next payday.

3. **Balance Alerts**:
   - Displays notifications if your balance is insufficient to last until the end of the month.
   - Example notifications:
     - "Your balance will not last until the end of the month (-Rp190,000)."
     - "Your balance is sufficient until the end of the month."

4. **Input and Edit Balance**:
   - Users can set their initial balance or edit the balance as needed.

5. **Download and Export Data**:
   - Users can download their financial data for further evaluation.

6. **Offline Mode with Local Storage**:
   - The application works offline by utilizing `localStorage` to store data locally.

7. **Progressive Web App (PWA) Ready**:
   - PWA capabilities for enhanced offline experience and installable features.

## Technology Stack
- **Frontend**: React.js
- **Icons**: Octicons by GitHub
- **UI Framework**: Tailwind CSS
- **Storage**: LocalStorage (Offline support)

## Access the Application
You can access the Money Manager application directly via the following link:
[Money Manager Web App](https://github.com/argf013/money-manager)

## User Interface
The user interface design is minimalistic and intuitive, built using Tailwind CSS. Below is an example of the UI layout:
- **Balance Overview**: Displays your current balance and provides alerts.
- **Expense and Income Tracking**: Easily add expenses or income with dedicated buttons.
- **Daily Expense Setup**: Set predictable daily expenses.
- **Export Feature**: Download your financial data.
- **History Section**: View a searchable and filterable list of past transactions.

For a detailed look, you can access the design in Figma:
[Figma Design](https://www.figma.com/design/8KRsTFtW8MoXcPQIO78Zlt/Money-Manager?node-id=0-1&t=LxMGlnxMwaRpQH27-1)
