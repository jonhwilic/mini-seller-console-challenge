# Mini Seller Console

A modern CRM system built with React, TypeScript, and Vite for managing leads and opportunities with a clean, responsive interface.

## 🚀 Features

### 📊 **Leads Management**

- **Create, Read, Update, Delete** leads with full CRUD operations
- **Advanced Filtering** by status (New, Contacted, Qualified, Converted, Lost)
- **Real-time Search** across name and company fields
- **Column Sorting** with visual indicators
- **Inline Editing** for email and status fields
- **Lead Conversion** to opportunities with automatic status update
- **Responsive Design** optimized for mobile and desktop

### 💼 **Opportunities Management**

- **Comprehensive View** of all opportunities and converted leads
- **Stage Management** (Prospecting, Qualification, Proposal, Negotiation, Closed Won, Closed Lost)
- **Lead Integration** - converted leads appear as "Converted Lead" opportunities
- **Advanced Filtering** by stage
- **Real-time Search** across name and account fields
- **Column Sorting** with visual indicators

### 🎨 **User Interface**

- **Modern Design** with Tailwind CSS and Shadcn UI components
- **Responsive Layout** that works on all screen sizes
- **Interactive Sidebars** for detailed lead/opportunity views
- **Toast Notifications** for user feedback
- **Loading States** with skeleton components
- **Pagination** with customizable items per page

### 🔧 **Technical Features**

- **TypeScript** for type safety and better development experience
- **React Query** for efficient data fetching and caching
- **Form Validation** with Zod schemas
- **Debounced Search** for optimal performance
- **JSON Server** for mock API backend
- **Hot Module Replacement** for fast development

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (version 9 or higher)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mini-seller-console
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the JSON Server** (in a separate terminal)

   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── data-table/      # Data table components
│   ├── alert-dialog-delete.tsx
│   ├── app-actions.tsx
│   ├── app-bar.tsx
│   ├── app-title.tsx
│   ├── header.tsx
│   ├── main.tsx
│   ├── nav-main.tsx
│   ├── nav-user.tsx
│   ├── pagination.tsx
│   ├── plataform-switcher.tsx
│   └── top-navigation.tsx
├── features/            # Feature-specific components
│   ├── leads/           # Leads management
│   │   ├── leads-data-table.tsx
│   │   ├── lead-details-sidebar.tsx
│   │   └── shared/      # Shared lead components
│   └── opportunities/   # Opportunities management
│       ├── opportunities-data-table.tsx
│       ├── opportunities-page.tsx
│       └── convert-lead-sidebar.tsx
├── hooks/               # Custom React hooks
│   ├── data-table.ts
│   ├── error-toast.ts
│   └── use-mobile.ts
├── lib/                 # Utility functions
│   └── utils.ts
├── services/            # API services
│   ├── leads/           # Lead-related API calls
│   └── opportunities/   # Opportunity-related API calls
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🎯 Usage Guide

### **Managing Leads**

1. **Viewing Leads**

   - Navigate to the "Leads" tab in the top navigation
   - Use the search bar to filter by name or company
   - Use the status filter to show specific lead statuses
   - Click on column headers to sort data

2. **Creating a Lead**

   - Click the "+" button in the leads table
   - Fill in the required information (name, company, email, source, score, status)
   - Click "Save" to create the lead

3. **Editing a Lead**

   - Click on any lead row to open the details sidebar
   - Click "Edit" to modify lead information
   - Make changes and click "Save" to update

4. **Inline Editing**

   - Click directly on email or status fields to edit inline
   - Press Enter to save or Escape to cancel

5. **Converting a Lead**

   - Click the arrow icon (→) next to any lead
   - Fill in the opportunity details (name, stage, amount, account name)
   - Click "Convert" to create the opportunity and update lead status to "Converted"

6. **Deleting a Lead**
   - Click the trash icon next to any lead
   - Confirm deletion in the dialog

### **Managing Opportunities**

1. **Viewing Opportunities**

   - Navigate to the "Opportunities" tab
   - View both created opportunities and converted leads
   - Use the search bar to filter by name or account
   - Use the stage filter to show specific stages

2. **Deleting an Opportunity**
   - Click the trash icon next to any opportunity
   - If it's a converted lead, the original lead status will be updated to "Lost"
   - If it's a regular opportunity, it will be deleted

### **Navigation and Layout**

- **Top Navigation**: Switch between Leads and Opportunities
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Sidebar Details**: Click on any row to view detailed information
- **Pagination**: Navigate through large datasets with customizable page sizes

## 🔧 Available Scripts

- **`npm run dev`** - Start the development server
- **`npm run build`** - Build the project for production
- **`npm run preview`** - Preview the production build
- **`npm run lint`** - Run ESLint to check for code issues

## 🗄️ Data Structure

### **Lead Object**

```typescript
interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
}
```

### **Opportunity Object**

```typescript
interface Opportunity {
  id: number;
  name: string;
  stage:
    | 'Prospecting'
    | 'Qualification'
    | 'Proposal'
    | 'Negotiation'
    | 'Closed Won'
    | 'Closed Lost'
    | 'Converted Lead';
  amount?: number;
  accountName: string;
  isConvertedLead?: boolean;
  originalLead?: Lead;
}
```

## 🌐 API Endpoints

The application uses JSON Server running on `http://localhost:3000` with the following endpoints:

### **Leads**

- `GET /leads` - Get all leads
- `POST /leads` - Create a new lead
- `PUT /leads/:id` - Update a lead
- `DELETE /leads/:id` - Delete a lead

### **Opportunities**

- `GET /opportunities` - Get all opportunities
- `POST /opportunities` - Create a new opportunity
- `DELETE /opportunities/:id` - Delete an opportunity

## 🎨 Styling and Components

- **Tailwind CSS** for utility-first styling
- **Shadcn UI** for consistent, accessible components
- **Lucide React** for icons
- **Responsive Design** with mobile-first approach

## 🔍 Search and Filtering

- **Debounced Search** (500ms delay) for optimal performance
- **Real-time Filtering** with instant results
- **Multi-field Search** across relevant data fields
- **Status/Stage Filtering** with dropdown selectors

## 📱 Responsive Features

- **Mobile Navigation** with collapsible menu
- **Responsive Tables** with horizontal scroll on small screens
- **Touch-friendly** buttons and interactions
- **Optimized Layout** for all screen sizes

## 🚀 Performance Optimizations

- **React Query** for efficient data caching and background updates
- **Debounced Search** to reduce API calls
- **Lazy Loading** of components
- **Optimized Re-renders** with proper dependency arrays

## 🛡️ Error Handling

- **Toast Notifications** for user feedback
- **Error Boundaries** for graceful error handling
- **Form Validation** with Zod schemas
- **API Error Handling** with user-friendly messages

## 📝 Development Notes

- **TypeScript** provides type safety and better IDE support
- **ESLint** ensures code quality and consistency
- **Hot Module Replacement** for fast development cycles
- **Component-based Architecture** for maintainability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### **Common Issues**

1. **Port 3000 already in use**

   - Change the JSON Server port: `npx json-server --watch db.json --port 3001`
   - Update API URLs in the services if needed

2. **Build errors**

   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version compatibility

3. **Data not loading**

   - Ensure JSON Server is running on the correct port
   - Check browser console for API errors

4. **Styling issues**
   - Clear browser cache
   - Restart the development server

### **Getting Help**

If you encounter any issues:

1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure JSON Server is running
4. Check the network tab for API call failures

---

**Happy coding! 🎉**
