import os
import re

files_to_fix = [
    ("src/components/chat/ChannelHeader.tsx", "Search"),
    ("src/components/chat/ChannelList.tsx", "Users"),
    ("src/components/chat/MessageBubble.tsx", "Smile"),
    ("src/components/chat/MessageBubble.tsx", "MessageSquare"),
    ("src/components/chat/MessageBubble.tsx", "CheckCheck"),
    ("src/components/chat/MessageBubble.tsx", "Check"),
    ("src/components/chat/MessageBubble.tsx", "showEmojiPicker"),
    ("src/components/chat/MessageBubble.tsx", "setShowEmojiPicker"),
    ("src/components/chat/MessageInput.tsx", "Sparkles"),
    ("src/components/landing/About.tsx", "ShieldAlert"),
    ("src/components/landing/Contact.tsx", "AlertCircle"),
    ("src/components/landing/Footer.tsx", "Heart"),
    ("src/components/landing/Header.tsx", "Sparkles"),
    ("src/components/layout/TopBar.tsx", "Menu"),
]

for filepath, var_name in files_to_fix:
    full_path = os.path.join(".", filepath)
    if not os.path.exists(full_path):
        continue
    with open(full_path, "r") as f:
        content = f.read()

    # Remove the variable from the code
    # This is a bit tricky for imports, let's just use regex to remove it from import lists
    content = re.sub(r'\b' + var_name + r'\s*,\s*', '', content)
    content = re.sub(r',\s*' + var_name + r'\b', '', content)
    content = re.sub(r'\s*' + var_name + r'\b', '', content)

    with open(full_path, "w") as f:
        f.write(content)

