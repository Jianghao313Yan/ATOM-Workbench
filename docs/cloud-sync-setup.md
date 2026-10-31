# ATOM cloud transfer setup (Supabase)

This adds account-based, manual cloud backup/restore for workbench cards.

## 1. Create a project
Create a Supabase project. Keep its database password private; it is not needed in ATOM.

## 2. Create the table and access rules
In the Supabase dashboard open **SQL Editor → New query**. Paste and run the full contents of [atom-workspaces.sql](../supabase/atom-workspaces.sql).

The table stores one JSON card array per authenticated user. Row Level Security is enabled. Select, insert and update policies require `auth.uid() = user_id`. No anonymous access is granted.

## 3. Copy only the public client settings
In **Project Settings → API**, copy:
- Project URL
- anon/public or publishable client key

Do not copy the secret/service_role key. Never post any credential in a public GitHub issue or commit.

## 4. Configure ATOM on each device
Open the deployed PWA. Expand **首次设置：填写 Supabase 项目连接信息**, enter the Project URL and public client key, and save. The values are stored in that device's browser local storage.

Register an account with email and a password of at least eight characters. If email confirmation is enabled, confirm the email before logging in. Sign in with the same account on the other device.

## 5. Transfer cards
- On the device containing the newest cards, choose **上传本机数据**. This replaces that account's cloud snapshot after a confirmation.
- On the receiving device, choose **从云端恢复**. This replaces the receiving device's local cards after a confirmation.
- To move changes back, upload again from the device that now has the newest data.

The app intentionally uses explicit upload/restore rather than silently merging or overwriting. Export a JSON backup before important transfers.

## What is and is not synchronized
Only the card array is uploaded. Chat history, voice recordings, browser settings, and credentials are not uploaded. The local assistant remains a rule-based prototype. There is no automatic/background sync or conflict resolution yet.

## Troubleshooting
- If sign-up asks for email confirmation, check the inbox and confirm first.
- If upload/download reports a missing table, run the SQL script.
- If access is denied, verify the RLS policies exist and sign in with the same account.
- If the SDK does not load, check the device internet connection and reload the PWA.
