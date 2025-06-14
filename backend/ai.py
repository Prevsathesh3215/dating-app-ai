#print('hello world')

import openai
import os
import json 

OPEN_API_KEY = os.getenv('OPEN_API_KEY', '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')
openai.api_key = OPEN_API_KEY

def generate_chat_review():
    
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Act like a dating app chat reviewer. give some feedback on the conversation made by the user. the review need to sound so sarcastic and brutally honest. keep the feedback short."},
            {"role": "user", "content": ""}
        ],
        max_tokens=100
    )

    review = response.choices[0].message['content'].strip()
    return review
