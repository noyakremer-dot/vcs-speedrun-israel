# Speedrun × Israel — Backend Setup Guide

## What This Does
When founders register and request intros on their own computers, the data is sent to a Google Sheet that you control. Your admin panel pulls from this same sheet, so you can see **every registration and intro request from any device**.

---

## Setup Steps (10 minutes)

### Step 1: Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Name it something like **"Speedrun VC Dashboard Data"**
3. Rename the first tab (bottom of screen) from "Sheet1" to **Registrations**
4. In row 1 of the Registrations sheet, add these headers (one per cell):

   `Timestamp` | `Company` | `Founder` | `Email` | `LinkedIn` | `Blurb` | `Materials`

5. Click the **+** button at the bottom to add a second sheet tab, name it **IntroRequests**
6. In row 1 of IntroRequests, add these headers:

   `ID` | `Date` | `Company` | `Founder` | `LinkedIn` | `OneLiner` | `Materials` | `TargetVC` | `TargetVCName` | `WhyThisFund` | `IntroNotes` | `Status`

### Step 2: Add the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any code in the editor
3. Open the file `apps-script-code.js` (included with this guide) and copy ALL of its contents
4. Paste into the Apps Script editor
5. Click the **Save** icon (💾) or press Ctrl+S

### Step 3: Deploy as Web App

1. In Apps Script, click **Deploy → New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set these options:
   - **Description:** "Speedrun VC Backend"
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. You'll be asked to authorize — click through and allow access
6. **Copy the Web app URL** that appears (it looks like `https://script.google.com/macros/s/AKfyc.../exec`)

### Step 4: Connect the Dashboard

1. Open your `speedrun-vc-dashboard.html` file
2. Go to the **Admin Panel** and log in with the password
3. You'll see a "Connect to Google Sheets Backend" box at the top
4. **Paste the URL** you copied from Step 3
5. Click **Connect**
6. You should see a green dot with "Connected" — you're all set!

The URL is saved in your browser, so you only need to do this once per device where you use the admin panel.

---

## How It Works

- **Founders register** → data is saved locally AND sent to Google Sheet
- **Founders request intros** → request is saved locally AND sent to Google Sheet
- **Admin opens panel** → pulls all registrations & requests from Google Sheet
- **Admin updates request status** → status change is synced back to Google Sheet
- **Google Sheet** → you can also view/edit data directly in Sheets as a backup

---

## Troubleshooting

**"Sync error" in admin panel:**
- Make sure the Apps Script URL is correct (ends with `/exec`)
- Check that the deployment is set to "Anyone" for access
- If you updated the script, you need to create a **New deployment** (not just save)

**Data not showing:**
- Click the **Refresh** button in the admin panel
- Check the Google Sheet directly — if data is there, the issue is with the URL

**Need to update the script?**
- After editing in Apps Script, go to Deploy → Manage deployments → Edit → Version: New version → Deploy
- The URL stays the same

---

## Notes

- The Google Sheet is your **source of truth** for admin data
- Founders still keep a local copy for their own pipeline management
- Free tier of Google Apps Script handles thousands of requests per day — more than enough
- Your data stays in YOUR Google account — no third-party services
