# 🧈 ButterLoss - Weight Loss Tracker

A beautiful and motivating weight loss tracking application that visualizes your calorie deficit progress and rewards you with butter packs for your achievements!

## ✨ Features

### 🎯 Core Functionality
- **User Setup**: Enter your name, age, height, current weight, and target weight
- **Daily Logging**: Track your daily calorie deficit and weight
- **Progress Visualization**: See your calorie deficit progress with beautiful charts
- **Butter Collection**: Collect butter packs (1000 calories = 1 butter pack = 100g fat)
- **Estimated Completion**: Calculate how long it will take to reach your goal

### 📊 Dashboard Features
- **Calorie Deficit Progress Bar**: Visual representation of your progress
- **Weight Chart**: Track your weight changes over time
- **Statistics**: Current deficit, remaining deficit, and progress percentage
- **Estimated Completion**: Set daily deficit goals and see projected completion dates

### 🧈 Butter Collection
- **Visual Butter Packs**: See your collected butter packs in a beautiful grid
- **Fat Loss Tracking**: Each butter pack represents 100g of fat lost
- **Motivational Rewards**: Gamify your weight loss journey

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd butterloss
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 How to Use

### 1. Initial Setup
- Enter your personal information (name, age, height, current weight, target weight)
- The app calculates your total calorie deficit needed to reach your goal

### 2. Daily Logging
- Log your daily calorie deficit (calories burned minus calories consumed)
- Record your current weight
- Watch your progress bar fill up!

### 3. Track Progress
- View your calorie deficit progress on the dashboard
- See your weight changes over time in the chart
- Check your estimated completion date based on your daily deficit goals

### 4. Collect Butter Packs
- Every 1000 calories deficit = 1 butter pack (100g fat)
- Visit the Butter Collection page to see your accumulated packs
- Stay motivated by watching your collection grow!

## 🧮 Calculations

### Calorie Deficit
- **Total Deficit Needed**: Target weight loss (kg) × 7700 calories
- **Butter Packs**: Total deficit ÷ 1000 calories
- **Fat Loss**: Butter packs × 100g

### Example
- Goal: Lose 5kg
- Total deficit needed: 5 × 7700 = 38,500 calories
- Butter packs to collect: 38,500 ÷ 1000 = 38.5 packs
- Total fat loss: 38.5 × 100g = 3.85kg fat

## 🎨 Design Features

- **Modern UI**: Clean, responsive design with beautiful gradients
- **Mobile Friendly**: Works perfectly on all device sizes
- **Smooth Animations**: Engaging interactions and transitions
- **Colorful Visuals**: Butter packs with golden gradients
- **Progress Indicators**: Clear visual feedback on your journey

## 💾 Data Storage

- All data is stored locally in your browser using localStorage
- No account required - your data stays private
- Reset button available to start fresh

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **CSS-in-JS** for styling
- **Local Storage** for data persistence

## 📊 Key Metrics

- **Calorie Deficit Progress**: Visual progress bar showing completion percentage
- **Weight Tracking**: Line chart showing weight changes over time
- **Butter Collection**: Grid display of collected butter packs
- **Estimated Completion**: Projected completion date based on daily goals
- **Average Daily Deficit**: Calculated from your logged entries

## 🎯 Tips for Success

1. **Set Realistic Goals**: Aim for 300-700 calories daily deficit
2. **Be Consistent**: Log your progress every day
3. **Combine Methods**: Use both diet and exercise for better results
4. **Stay Patient**: Healthy weight loss takes time
5. **Track Everything**: Log both deficit and weight for accurate progress

## 🔄 Reset Data

Use the reset button in the header to clear all your data and start fresh. This will remove your user profile and all logged entries.

## 📈 Future Enhancements

- Export data functionality
- Multiple user profiles
- Advanced analytics and insights
- Social sharing features
- Achievement badges and milestones
- Integration with fitness trackers

## 🤝 Contributing

Feel free to contribute to this project by submitting issues or pull requests!

## 📄 License

This project is open source and available under the MIT License.

---

**Start your weight loss journey today and collect those butter packs! 🧈✨** 