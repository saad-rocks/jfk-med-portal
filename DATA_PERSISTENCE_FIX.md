# 🔧 Data Persistence Fix - JFK Medical Portal

## 🚨 Problem Identified

Your Firebase emulators were not properly configured for data persistence between server restarts. When you restart your development server, all user accounts and data created during the previous session are lost.

## ✅ Solution Applied

I've fixed the following issues:

1. **Added Firebase Emulator Configuration** - Complete emulator setup in `firebase.json`
2. **Created Project Configuration** - Added `.firebaserc` file with project ID
3. **Added Data Persistence Scripts** - NPM scripts for starting emulators with persistence
4. **Fixed Auth Configuration** - Now uses Auth emulator instead of production Auth
5. **Added Persistence Scripts** - Ready-to-run scripts for Windows/macOS/Linux

## 🚀 How to Fix Your Current Issue

### Step 1: Export Current Data (If Any)
```bash
# If emulators are running, export current data
npm run emulators:export
```

### Step 2: Stop Current Server
Stop your current development server (Ctrl+C in terminal).

### Step 3: Start Emulators with Persistence
Run one of these commands based on your OS:

**Windows:**
```cmd
fix-data-persistence.bat
```

**macOS/Linux:**
```bash
chmod +x fix-data-persistence.sh
./fix-data-persistence.sh
```

**Or using npm:**
```bash
npm run emulators:start
```

### Step 4: Start Your Development Server
In a new terminal window:
```bash
npm run dev
```

## 🔄 Data Persistence Explained

- **Before Fix**: Data was lost when emulators restarted
- **After Fix**: Data is automatically saved to `./firebase-data/` and restored on startup
- **Manual Export/Import**: Use `npm run emulators:export` and `npm run emulators:import`

## 🧪 Testing the Fix

1. **Create a new student account** using the signup form
2. **Stop the emulators** (Ctrl+C)
3. **Restart the emulators** using the persistence script
4. **Login with the same credentials** - your account should still exist!

## 📋 Available NPM Scripts

```bash
# Start emulators with data persistence (imports existing data)
npm run emulators:start

# Start emulators fresh (no existing data)
npm run emulators:start:fresh

# Export current emulator data
npm run emulators:export

# Start emulators with imported data
npm run emulators:import
```

## 🔍 What Was Changed

### 1. `firebase.json` - Added Emulator Configuration
```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "functions": { "port": 5001 },
    "storage": { "port": 9199 },
    "ui": { "enabled": true, "port": 4000 },
    "singleProjectMode": true
  }
}
```

### 2. `.firebaserc` - Project Configuration
```json
{
  "projects": {
    "default": "jfk-med-portal"
  }
}
```

### 3. `src/firebase.ts` - Auth Emulator Connection
Now properly connects to Auth emulator in development mode.

### 4. `package.json` - Added Persistence Scripts
Scripts for managing emulator data persistence.

## 🚨 Important Notes

1. **Always use the persistence scripts** when starting emulators
2. **Data is stored locally** in `./firebase-data/` directory
3. **Don't delete `./firebase-data/`** unless you want to start fresh
4. **Cloud functions now work properly** with emulators
5. **Profile setup should work** without server errors

## 🐛 Troubleshooting

### If you still get "Server Error" on profile setup:
1. Make sure all emulators are running
2. Check browser console for connection errors
3. Verify cloud functions built successfully

### If accounts are still lost:
1. Stop all emulators and servers
2. Run the persistence script again
3. Check that `./firebase-data/` directory exists

### To start completely fresh:
1. Stop all emulators
2. Delete `./firebase-data/` directory
3. Run `npm run emulators:start:fresh`

## 📞 Need Help?

If you encounter any issues:

1. Check the Firebase Emulator UI at http://localhost:4000
2. Look at browser console for connection errors
3. Check terminal output for emulator startup errors
4. Verify all ports (9099, 8080, 5001, 9199) are available

---

**🎉 Your data persistence issue should now be resolved!**

Try creating a new account and restarting the emulators to verify the fix works.
