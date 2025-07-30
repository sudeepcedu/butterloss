# 🧈 ButterLoss - Weight Loss Tracking App

A modern, intuitive web application for tracking your weight loss journey through calorie deficit monitoring. Built with React, TypeScript, and beautiful UI components.

## ✨ Features

### 📊 **Dashboard**
- **Calorie Deficit Progress**: Visual progress bar with animated green gradient
- **Current Streak**: Track consecutive days with positive deficit
- **Butter & Ghee Collection**: Collect butter packs (770 cal) and ghee packs (7700 cal)
- **Estimated Completion**: Smart calculation based on daily deficit goals
- **Average Daily Deficit**: Accurate tracking of your daily calorie burn

### 📅 **Calendar View**
- **Monthly Calendar**: Log deficits for any date
- **Visual Indicators**: Color-coded entries (green for positive, red for negative)
- **Hover Actions**: Remove entries with ease
- **Auto-focus**: Seamless input experience

### 🧈 **Butter Collection**
- **Butter Packs**: Earn 1 pack per 770 calories deficit
- **Ghee Packs**: Earn 1 pack per 7700 calories deficit (premium reward)
- **Visual Display**: Beautiful icons with progress tracking

### ⚖️ **Weight Loss Tracking**
- **Progress Chart**: Interactive line chart showing weight trends
- **Log Table**: Detailed weight entries with dates
- **Progress to Goal**: Percentage-based progress tracking

### 🏆 **Rewards System**
- **Four Milestones**: The Beginning (25%), The Climb (50%), Breakthrough (75%), Transformation (100%)
- **Customizable Rewards**: Edit your own reward goals
- **Confetti Animation**: Celebrate achievements with style
- **Progress Bars**: Visual slice-specific progress tracking

### 🔄 **Iterations Feature**
- **Multiple Cycles**: Track multiple weight loss journeys
- **Iteration History**: View completed cycles with detailed summaries
- **Weight Input**: Accurate weight tracking for goal completion
- **Reset Functionality**: Start fresh with new goals

## 🧮 **Calculations**

### **Core Metrics**
- **Calories per kg fat**: 7,716.17 calories
- **Butter pack threshold**: 770 calories (100g fat)
- **Ghee pack threshold**: 7,700 calories (1kg fat)
- **Daily deficit goal**: 1-7,700 calories (customizable)

### **Example**
- **Goal**: Lose 5kg
- **Total deficit needed**: 5 × 7,716.17 = 38,580 calories
- **Butter packs to collect**: 38,580 ÷ 770 = 50 packs
- **Ghee packs to collect**: 38,580 ÷ 7,700 = 5 packs

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/butterloss.git
cd butterloss

# Install dependencies
npm install

# Start development server
npm start
```

### **Build for Production**
```bash
npm run build
```

## 🎨 **Design Features**

- **Modern UI**: Clean, responsive design with beautiful gradients
- **Mobile Friendly**: Works perfectly on all device sizes
- **Smooth Animations**: Engaging interactions and transitions
- **Colorful Visuals**: Butter packs with golden gradients
- **Progress Indicators**: Clear visual feedback on your journey

## 💾 **Data Storage**

- **Local Storage**: All data stored locally in your browser
- **No Account Required**: Your data stays private
- **Reset Options**: Clear data and start fresh anytime

## 🛠️ **Technology Stack**

- **React 18** with TypeScript
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **CSS Modules** for styling
- **Local Storage** for data persistence

## 📱 **Key Metrics**

- **Calorie Deficit Progress**: Visual progress bar showing completion percentage
- **Weight Tracking**: Line chart showing weight changes over time
- **Butter Collection**: Grid display of collected butter packs
- **Estimated Completion**: Projected completion date based on daily goals
- **Average Daily Deficit**: Calculated from your logged entries

## 🎯 **Tips for Success**

1. **Set Realistic Goals**: Aim for 300-700 calories daily deficit
2. **Be Consistent**: Log your progress every day
3. **Track Trends**: Focus on long-term progress, not daily fluctuations
4. **Celebrate Wins**: Use the rewards system to stay motivated
5. **Stay Patient**: Weight loss is a journey, not a sprint

## 🔧 **Development**

### **Project Structure**
```
src/
├── components/          # React components
├── utils/              # Utility functions
├── types.ts            # TypeScript interfaces
└── App.tsx            # Main application
```

### **Key Components**
- `UserSetup`: Initial user configuration
- `DailyLogForm`: Daily deficit logging
- `Calendar`: Monthly calendar view
- `WeightLoss`: Weight tracking and charts
- `Rewards`: Milestone tracking system
- `IterationHistory`: Multiple cycle management

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 **Support**

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for your weight loss journey** # Netlify deployment trigger
