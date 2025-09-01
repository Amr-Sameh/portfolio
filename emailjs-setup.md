# EmailJS Setup Guide

Your contact form is ready! Just follow these simple steps to make it send emails to `amrsameh.develop@gmail.com`:

## 🚀 Quick Setup (5 minutes):

### 1. Create EmailJS Account
- Go to [emailjs.com](https://www.emailjs.com)
- Sign up for free account
- Verify your email

### 2. Add Email Service
- In EmailJS dashboard, click "Add New Service"
- Choose "Gmail" (recommended)
- Connect your Gmail account
- Note the **Service ID** (e.g., "service_abc123")

### 3. Create Email Template
- Go to "Email Templates" 
- Click "Create New Template"
- Use this template content:

```
Subject: New Portfolio Contact - {{from_name}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Sent from your portfolio contact form
```

- Note the **Template ID** (e.g., "template_xyz789")

### 4. Get Public Key
- Go to "Account" → "General"
- Copy your **Public Key** (e.g., "user_def456")

### 5. Update Your Code
In `script.js`, replace these placeholders:
- `YOUR_PUBLIC_KEY` → your actual public key
- `YOUR_SERVICE_ID` → your Gmail service ID  
- `YOUR_TEMPLATE_ID` → your template ID

## ✅ That's it! 
Your contact form will now send emails directly to `amrsameh.develop@gmail.com` without any backend server!

## 🎯 Features Added:
- ✅ Form validation with visual feedback
- ✅ Loading states and animations
- ✅ Success/error notifications
- ✅ Professional email formatting
- ✅ Automatic form reset after sending 