#!/bin/bash

# Bulk GitHub Repository Team Invitation Script
# Repository: SanjayDivakar123/RoleColorAI

echo "🚀 Starting bulk team invitation process..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it first:"
    echo "   Visit: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub CLI first:"
    echo "   Run: gh auth login"
    exit 1
fi

REPO="SanjayDivakar123/RoleColorAI"

echo "📋 Inviting team members to repository: $REPO"
echo ""

# Admin access users
echo "👑 Inviting ADMIN users..."
ADMIN_USERS=(
    "steve_austin_@outlook.com"
    "amit@suthar.co.in" 
    "ivanzheng456@gmail.com"
)

for user in "${ADMIN_USERS[@]}"; do
    echo "   Adding $user with ADMIN access..."
    if gh api "repos/$REPO/invitations" -X POST -f invitee_id="$user" -f permissions="admin" 2>/dev/null; then
        echo "   ✅ Successfully invited $user (admin)"
    else
        echo "   ⚠️  Failed to invite $user - they may need to be invited by email"
    fi
done

echo ""

# Write access users  
echo "✏️  Inviting WRITE users..."
WRITE_USERS=(
    "siddhanth887@gmail.com"
    "chahetijha@gmail.com"
    "nihafahima9@gmail.com"
    "farahelsaid13@outlook.com"
    "austinthemichaud@gmail.com"
    "Marq.henry8701@gmail.com"
    "patrickxiao2006@gmail.com"
    "ibrahim.khaliq@richmond.edu"
    "thetanishasikder@gmail.com"
    "linuslinus020@gmail.com"
    "rajipappadam190808@gmail.com"
    "ali.mansha1351@gmail.com"
    "xaviicon01@gmail.com"
    "anuragworkprof@gmail.com"
    "Priyapriyankabiswas9@gmail.com"
    "jbr272@cornell.edu"
    "Mr.piercebrooks@gmail.com"
)

for user in "${WRITE_USERS[@]}"; do
    echo "   Adding $user with WRITE access..."
    if gh api "repos/$REPO/invitations" -X POST -f invitee_id="$user" -f permissions="push" 2>/dev/null; then
        echo "   ✅ Successfully invited $user (write)"
    else
        echo "   ⚠️  Failed to invite $user - they may need to be invited by email"
    fi
done

echo ""
echo "🎉 Bulk invitation process completed!"
echo ""
echo "📧 Note: Users with email addresses (not GitHub usernames) will need to:"
echo "   1. Create a GitHub account if they don't have one"
echo "   2. Check their email for the invitation"
echo "   3. Accept the invitation to gain access"
echo ""
echo "🔍 To check invitation status, visit:"
echo "   https://github.com/$REPO/settings/access"
