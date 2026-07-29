# Vercel Dashboard: Step-by-Step Environment Variable Setup

**Target Project:** lost-revenue-calculator-sandy  
**URL:** https://lost-revenue-calculator-sandy.vercel.app/  
**Time Required:** 3-5 minutes

---

## 🎯 Quick Access Link

Navigate directly to environment variables:  
**https://vercel.com/dashboard/[your-team]/[project]/settings/environment-variables**

Or manually:
1. Go to https://vercel.com/dashboard
2. Select project: **lost-revenue-calculator-sandy**
3. Click **Settings** (top menu)
4. Select **Environment Variables** (left sidebar)

---

## 📋 Add Environment Variables (Step-by-Step)

### VARIABLE 1: BETTER_AUTH_SECRET

**Step 1:** Click **"Add New"** button

**Step 2:** Fill in the form:
```
Name (left field):    BETTER_AUTH_SECRET
Value (right field):  sgLaEzvwHdmmj+b/eJ8op9Aac/OhmLsDpNPWtqzXNxA=
```

**Step 3:** Scope selection (select boxes below):
```
☑ Production    (check this)
☐ Preview      (uncheck)
☐ Development  (uncheck)
```

**Step 4:** Click **"Save"** button

✅ **Status:** BETTER_AUTH_SECRET added

---

### VARIABLE 2: CRON_SECRET

**Step 1:** Click **"Add New"** button

**Step 2:** Fill in the form:
```
Name (left field):    CRON_SECRET
Value (right field):  sgLaEzvwHdmmj+b/eJ8op9Aac/OhmLsDpNPWtqzXNxA=
```

**Step 3:** Scope selection:
```
☑ Production    (check this)
☐ Preview      (uncheck)
☐ Development  (uncheck)
```

**Step 4:** Click **"Save"** button

✅ **Status:** CRON_SECRET added

---

### VARIABLE 3: MAKE_STRATEGY_CALL_WEBHOOK

**Step 1:** Click **"Add New"** button

**Step 2:** Fill in the form:
```
Name (left field):    MAKE_STRATEGY_CALL_WEBHOOK
Value (right field):  https://hook.make.com/placeholder-strategy-call-webhook
```

**Step 3:** Scope selection:
```
☑ Production    (check this)
☐ Preview      (uncheck)
☐ Development  (uncheck)
```

**Step 4:** Click **"Save"** button

**⚠️ IMPORTANT:** This is a placeholder URL.  
When you create the Make.com scenario:
1. Copy the actual webhook URL from Make.com
2. Come back to this page
3. Click the pencil icon next to MAKE_STRATEGY_CALL_WEBHOOK
4. Replace the placeholder with the real URL
5. Click Save

✅ **Status:** MAKE_STRATEGY_CALL_WEBHOOK added (placeholder)

---

### VARIABLE 4: MAKE_WEEKLY_OUTREACH_WEBHOOK

**Step 1:** Click **"Add New"** button

**Step 2:** Fill in the form:
```
Name (left field):    MAKE_WEEKLY_OUTREACH_WEBHOOK
Value (right field):  https://hook.make.com/placeholder-weekly-outreach-webhook
```

**Step 3:** Scope selection:
```
☑ Production    (check this)
☐ Preview      (uncheck)
☐ Development  (uncheck)
```

**Step 4:** Click **"Save"** button

**⚠️ IMPORTANT:** This is a placeholder URL.  
When you create the Make.com scenario:
1. Copy the actual webhook URL from Make.com
2. Come back to this page
3. Click the pencil icon next to MAKE_WEEKLY_OUTREACH_WEBHOOK
4. Replace the placeholder with the real URL
5. Click Save

✅ **Status:** MAKE_WEEKLY_OUTREACH_WEBHOOK added (placeholder)

---

## ✅ Verification Checklist

After adding all 4 variables, you should see:

```
✓ BETTER_AUTH_SECRET                  Production
✓ CRON_SECRET                         Production
✓ MAKE_STRATEGY_CALL_WEBHOOK          Production
✓ MAKE_WEEKLY_OUTREACH_WEBHOOK        Production
✓ DATABASE_URL                        Production (auto by Neon)
```

All variables should have a ✓ checkmark and show "Production" scope.

---

## 🔄 Redeploy After Adding Variables

**Automatic:** Vercel should automatically redeploy after you save the last variable.

**Manual redeploy (if needed):**
1. Click **Deployments** tab
2. Find the latest deployment
3. Click the **three dots** menu
4. Select **Redeploy**
5. Confirm redeployment

**Expected time:** 2-3 minutes

---

## 📊 After Variables Are Set

### Check Deployment Status
1. Go to **Deployments** tab
2. Look for the most recent deployment
3. Status should show **"✓ Ready"** (green checkmark)
4. Click on it to see build logs

### Verify Production is Live
1. Visit https://lost-revenue-calculator-sandy.vercel.app/
2. Open DevTools Console (F12 or Cmd+Option+I)
3. You should NOT see any environment variable errors
4. Calculator should load and function normally

### Test a Webhook
Open your browser console and run:
```javascript
fetch('https://lost-revenue-calculator-sandy.vercel.app/api/cron/weekly-outreach', {
  headers: {
    'Authorization': 'Bearer sgLaEzvwHdmmj+b/eJ8op9Aac/OhmLsDpNPWtqzXNxA='
  }
}).then(r => r.json()).then(console.log)
```

Expected response:
```json
{
  "success": true,
  "outreachSent": 0,
  "message": "Weekly outreach job executed"
}
```

---

## 🚨 Troubleshooting

### "Environment variables not found" error
- Wait 2 minutes after adding variables
- Manually redeploy from Deployments tab
- Clear browser cache and reload

### Cron job returns 403 error
- Verify `CRON_SECRET` is exactly: `sgLaEzvwHdmmj+b/eJ8op9Aac/OhmLsDpNPWtqzXNxA=`
- Check Authorization header format: `Bearer [SECRET]`
- Verify Production scope is selected

### Webhook returns 500 error
- Verify Make.com webhook URL is set (not placeholder)
- Check Make.com scenario is active and deployed
- Review Vercel Functions logs for errors

---

## 📝 Variable Summary Sheet

**Copy these values exactly as shown:**

```
BETTER_AUTH_SECRET
sgLaEzvwHdmmj+b/eJ8op9Aac/OhmLsDpNPWtqzXNxA=

CRON_SECRET
sgLaEzvwHdmmj+b/eJ8op9Aac/OhmLsDpNPWtqzXNxA=

MAKE_STRATEGY_CALL_WEBHOOK
https://hook.make.com/placeholder-strategy-call-webhook

MAKE_WEEKLY_OUTREACH_WEBHOOK
https://hook.make.com/placeholder-weekly-outreach-webhook
```

---

## ✅ Setup Complete!

Once all 4 variables are added and deployment is complete:

1. ✅ Vercel dashboard configured
2. ✅ Production environment ready
3. ✅ Cron schedule active (runs Monday 9 AM UTC)
4. ✅ Webhook infrastructure ready
5. ✅ App is live and fully functional

**Next steps:**
- Test landing page at https://lost-revenue-calculator-sandy.vercel.app/
- When Make.com scenarios are ready, update webhook URLs
- Monitor webhook logs and cron execution

---

**Setup Duration:** 3-5 minutes  
**Difficulty:** Easy  
**Risk:** Low (all variables are non-critical initially, only placeholders)

---

*For detailed deployment information, see `PRODUCTION_DEPLOYMENT.md`*
