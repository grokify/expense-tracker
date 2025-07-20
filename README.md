# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Track your personal finances with an intuitive interface, detailed analytics, and comprehensive expense management features.

## 🚀 Features

### Core Functionality
- ✅ **Add Expenses**: Create new expenses with date, amount, category, and description
- ✅ **View & Manage**: Organized list view with edit and delete capabilities
- ✅ **Smart Filtering**: Filter by date range, category, and search terms
- ✅ **Data Persistence**: Automatic localStorage-based data storage
- ✅ **Form Validation**: Comprehensive client-side validation with error messages

### Analytics & Insights
- 📊 **Interactive Dashboard**: Overview cards showing total spending, monthly trends, and averages
- 📈 **Visual Charts**: Bar charts, pie charts, and line graphs for spending patterns
- 📅 **Monthly Trends**: Track spending patterns over the last 6 months
- 🏷️ **Category Breakdown**: Detailed analysis by expense categories
- 📋 **Recent Activity**: Quick view of your latest expenses

### Categories
- 🍕 Food
- 🚗 Transportation
- 🎬 Entertainment
- 🛍️ Shopping
- 💰 Bills
- 📋 Other

### Export & Reporting
- 📄 **CSV Export**: Download filtered expense data for external analysis
- 🔍 **Advanced Search**: Search across descriptions, categories, and amounts
- 📱 **Mobile Responsive**: Full functionality on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Recharts for interactive data visualizations
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for reliable date operations
- **State Management**: React hooks for local state management
- **Data Storage**: localStorage for client-side persistence

## 🏗️ Project Structure

```
expense-tracker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── add/page.tsx       # Add expense page
│   │   ├── expenses/page.tsx  # Expense list and management
│   │   ├── analytics/page.tsx # Charts and analytics
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard home
│   ├── components/            # Reusable components
│   │   ├── Analytics.tsx      # Charts and data visualization
│   │   ├── Dashboard.tsx      # Dashboard overview
│   │   ├── ExpenseForm.tsx    # Form for adding/editing expenses
│   │   ├── ExpenseList.tsx    # List view with filtering
│   │   └── Layout.tsx         # Navigation and layout
│   ├── types/                 # TypeScript type definitions
│   │   └── expense.ts         # Expense-related types
│   └── utils/                 # Utility functions
│       ├── expense.ts         # Expense calculations and validation
│       └── storage.ts         # localStorage operations
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd expense-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 📱 How to Use

### Adding Your First Expense

1. **Navigate to "Add Expense"** from the navigation menu or click the "+" button
2. **Fill in the form**:
   - Amount: Enter the expense amount (required)
   - Category: Select from predefined categories (required)
   - Date: Choose the expense date (defaults to today)
   - Description: Add details about the expense (required)
3. **Click "Save Expense"** to add it to your records

### Managing Expenses

1. **Go to the "Expenses" page** to view all your expenses
2. **Use filters** to find specific expenses:
   - Search by description, category, or amount
   - Filter by date range
   - Filter by category
3. **Edit expenses** by clicking the edit icon
4. **Delete expenses** by clicking the trash icon (with confirmation)
5. **Export data** by clicking the "Export" button (downloads CSV)

### Viewing Analytics

1. **Visit the "Analytics" page** for detailed insights:
   - Category breakdown charts
   - Monthly spending trends
   - Daily spending patterns
   - Summary statistics
2. **Interactive charts** allow you to hover for detailed information

### Dashboard Overview

The main dashboard provides a quick overview:
- Total expenses across all time
- Current month spending
- Average expense amount
- Number of categories used
- Category distribution chart
- Recent expenses list

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with consistent spacing and typography
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: Proper labeling, keyboard navigation, and color contrast
- **Visual Feedback**: Success messages, error handling, and confirmation dialogs

## 💾 Data Storage

The application uses **localStorage** for data persistence:
- All expenses are automatically saved to your browser's local storage
- Data persists between browser sessions
- No external database or server required
- Export functionality available for backup

**Note**: Data is stored locally in your browser. Clearing browser data will remove all expenses.

## 🔧 Customization

### Adding New Categories

To add new expense categories, edit `src/types/expense.ts`:

```typescript
export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other'
  | 'YourNewCategory'; // Add here

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
  'YourNewCategory' // And here
];
```

### Styling Customization

The application uses Tailwind CSS. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `src/app/globals.css`

## 🧪 Testing All Features

To verify everything works correctly:

1. **Add sample expenses** across different categories and dates
2. **Test filtering** with various search terms and date ranges
3. **Edit and delete** expenses to ensure data integrity
4. **Export data** to verify CSV functionality
5. **View analytics** to see charts and summaries
6. **Test on mobile** to verify responsive design

## 🚀 Production Deployment

To deploy the application:

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy to platforms like**:
   - Vercel (recommended for Next.js)
   - Netlify
   - GitHub Pages
   - Any static hosting service

## 📄 What's Included

This expense tracker includes everything requested:

✅ **Complete NextJS 14 application** with App Router  
✅ **TypeScript** for type safety throughout  
✅ **Tailwind CSS** for modern, responsive styling  
✅ **Add expenses** with validation  
✅ **View expenses** in organized lists  
✅ **Filter by date range and category**  
✅ **Dashboard with spending summaries**  
✅ **All 6 categories**: Food, Transportation, Entertainment, Shopping, Bills, Other  
✅ **localStorage data persistence**  
✅ **Form validation** for expense inputs  
✅ **Date picker** for expense dates  
✅ **Currency formatting** for amounts  
✅ **Clean, modern design** with professional color scheme  
✅ **Mobile-responsive** design  
✅ **Visual feedback** and loading states  
✅ **Search and filter** capabilities  
✅ **Summary cards** with analytics  
✅ **Charts and visual representations**  
✅ **CSV export functionality**  
✅ **Edit and delete** existing expenses  

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

---

**Enjoy tracking your expenses!** 💰📊