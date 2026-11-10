# Media Catalog

A physical media organizer built with JavaScript, React Native, Expo, and SQLite for Android and iPhone.

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
git clone https://github.com/kbedgood19/eecs_581_Project3.git
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

This installs the project's dependencies, including React Native and Expo. You do not need to install them separately.

The app initializes its SQLite database on startup. No separate database server is required.

### 4. Sign Into Expo

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

### 5. Start the App

Connect your phone and computer to the same Wi-Fi network.

From the `app` folder, run:

#### Windows

```powershell
npx.cmd expo start
```

#### Mac

```bash
npx expo start
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

### Browser Login Fails

If Expo crashes while opening the browser, sign in through the terminal instead.

#### Windows

```powershell
npx.cmd expo login --no-browser
```

#### Mac

```bash
npx expo login --no-browser
```

Enter your Expo username and password when prompted.

If you registered through GitHub and never created an Expo password:

1. Open [Expo's password reset page](https://expo.dev/reset-password).
2. Enter your Expo username.
3. Follow the emailed instructions to set a password.
4. Retry terminal login using your Expo username and new Expo password.

### Expo Go Says the Terminal Is Not Signed In

1. Stop the development server with **Ctrl+C**.
2. Run the appropriate `expo whoami` command above.
3. Log in if needed.
4. Confirm the terminal and Expo Go use the same account.
5. Restart the server and scan the QR code again.

### Phone Cannot Connect

Confirm that:

- Your phone and computer are on the same Wi-Fi network.
- The development server is still running.
- Expo Go is signed into the correct account.

Some public or campus networks block connections between devices. If necessary, stop the server and try a tunnel connection:

#### Windows

```powershell
npx.cmd expo start --tunnel
```

#### Mac

```bash
npx expo start --tunnel
```

Scan the new QR code.

### Missing Package or package.json Error

Make sure your terminal is inside:

```text
eecs_581_Project3/app
```

This folder contains `package.json`.

Run `npm.cmd install` on Windows or `npm install` on Mac, then restart Expo.

### npm Reports Vulnerabilities

Do not automatically run `npm audit fix --force`, because it can introduce breaking dependency changes.

Review the report with the team before updating packages.

## Documentation

- [Expo Development Guide](https://docs.expo.dev/get-started/start-developing/)
- [Expo CLI Reference](https://docs.expo.dev/more/expo-cli/)