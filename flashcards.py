import re
import json

flashcards = []
with open('widget.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

i = 0
while i < len(lines):
    line = lines[i].strip()
    # Match: term - question?
    match = re.match(r'^(.+?)\s*-\s*(.+\?)$', line)
    if match:
        term = match.group(1).strip()
        question = match.group(2).strip()
        options = []
        # Collect up to 4 options
        for j in range(1, 5):
            if i + j < len(lines):
                opt_line = lines[i + j].strip()
                opt_match = re.match(r'^[a-d]\)\s*(.+)$', opt_line, re.IGNORECASE)
                if opt_match:
                    options.append(opt_match.group(1).strip())
        # The correct answer is the option that matches the term (case-insensitive)
        answer = None
        for opt in options:
            if opt.lower() == term.lower():
                answer = opt
        flashcards.append({
            'term': term,
            'question': question,
            'options': options,
            'answer': answer if answer else options[-1]  # fallback to last option
        })
        i += len(options) + 1
    else:
        i += 1

with open('flashcards.json', 'w', encoding='utf-8') as f:
    json.dump(flashcards, f, ensure_ascii=False, indent=2)

print(f"Converted {len(flashcards)} flashcards to flashcards.json")