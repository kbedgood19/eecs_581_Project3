# Media Catalog

A physical media organizer built with JavaScript, React Native, Expo, and Supabase for Android and iPhone.

## Requirements

Install the following before running the app:

- [Node.js LTS](https://nodejs.org/) — includes npm.
- [Git](https://git-scm.com/downloads).
- [VS Code](https://code.visualstudio.com/).
- Expo Go on your phone, available from the App Store or Google Play.
- A free [Expo account](https://expo.dev/signup).

After installing Node.js, close and reopen your terminal and VS Code.

Verify that Node.js and npm are installed:

### Windows PowerShell

```powershell
node --version
npm.cmd --version
```

### Mac Terminal

```bash
node --version
npm --version
```

Both commands should print version numbers.

Windows instructions use `npm.cmd` and `npx.cmd` to avoid PowerShell's script execution-policy errors. Mac users use `npm` and `npx`.

## First-Time Setup

### 1. Clone the Repository

Open a terminal and navigate to the folder where you keep your repositories:

```bash
cd "YOUR_FOLDER_PATH"
```

Then run:

```bash
git clone [https://github.com/kbedgood19/eecs_581_Project3.git](https://github.com/kbedgood19/eecs_581_Project3.git)
cd eecs_581_Project3
```

If prompted, authenticate with your GitHub account. Access to a private repository requires an accepted collaborator invitation.

If you already cloned the repository, use your existing copy instead.

Do not create another Expo project. The repository already contains the app.

### 2. Open the Project in VS Code

Select **File → Open Folder** and open the `eecs_581_Project3` folder.

Then select **Terminal → New Terminal**.

### 3. Install Dependencies

From the repository root, run:

#### Windows

```powershell
cd app
npm.cmd install
```

#### Mac

```bash
cd app
npm install
```

Wait for installation to finish.

This installs the project's dependencies, including React Native, Expo, and the Supabase client. You do not need to install them separately.

### 4. IMPORTANT UPDATE: Configure Supabase Environment Variables

The app uses a hosted Supabase backend for user authentication and cloud database storage, so an active internet connection and a local `.env` file are required.

Create a file USING VSCODE named `.env` inside the `app` folder (`eecs_581_Project3/app/.env`) and add the following lines:

```env
EXPO_PUBLIC_SUPABASE_URL=[https://hxmlawfyvrdescyulmda.supabase.co](https://hxmlawfyvrdescyulmda.supabase.co)
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_CYGBI65H74rVNsomHq1TLw_iAlBF1XM
```

Make sure `.env` is saved directly inside the `app` directory (next to `package.json`), not in the repository root.

### 5. Sign Into Expo

On your phone:

1. Install Expo Go.
2. Create an Expo account if you do not already have one.
3. Sign into Expo Go.

On your computer, run the following from the `app` folder:

#### Windows

```powershell
npx.cmd expo login
```

#### Mac

```bash
npx expo login
```

Complete the login process using the same Expo account as your phone.

Verify that the terminal is signed in:

#### Windows

```powershell
npx.cmd expo whoami
```

#### Mac

```bash
npx expo whoami
```

The command should print your Expo username.

Signing into Expo's website does not automatically sign you into the terminal. You do not need to create a project on Expo's website to run this app.

### 6. Start the App

Connect your phone and computer to the same Wi-Fi network.

From the `app` folder, run:

#### Windows

```powershell
npx.cmd expo start -c
```

#### Mac

```bash
npx expo start -c
```

Once the QR code appears:

- **iPhone:** Scan it using the Camera app and open the link in Expo Go.
- **Android:** Scan it through Expo Go.

Keep the terminal running while testing the app.

Saving changes in VS Code should automatically update the app through Fast Refresh.

Press **Ctrl+C** in the terminal to stop the development server.

## Running the App After Setup

Open the repository in VS Code and select **Terminal → New Terminal**.

From the repository root, run:

### Windows

```powershell
cd app
npx.cmd expo start
```

### Mac

```bash
cd app
npx expo start
```

Scan the QR code to open the app on your phone.

You do not need to reinstall packages or sign in every time. If teammates change dependencies, run `npm.cmd install` on Windows or `npm install` on Mac before starting.

## Troubleshooting

### Missing `supabaseUrl` or Supabase Connection Error

1. Confirm the `.env` file is inside `eecs_581_Project3/app/.env` (not the repository root).
2. Confirm both `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are copied accurately with no extra quotes or spaces.
3. Stop the server with **Ctrl+C** and restart with the `-c` flag to clear Metro's cache:
   - **Windows:** `npx.cmd expo start