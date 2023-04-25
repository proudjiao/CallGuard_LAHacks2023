import zipfile
import urllib.request
from django.http import JsonResponse
import cohere
from cohere.responses.classify import Example
import openai
from dotenv import load_dotenv  # load .env
import os  # for os to read .env file
import json
import csv

from django.http import JsonResponse

# example api use


def my_api(request):
    data = {
        'message': 'Hello, world!'
    }
    return JsonResponse(data)


# load API KEY in .env
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
openai.api_key = OPENAI_API_KEY
co = cohere.Client(COHERE_API_KEY)


# whisper API
# audio_file = open("./proud_test.m4a", "rb")
# transcript = openai.Audio.transcribe("whisper-1", audio_file)
# print(transcript)

# Cohere training models
examples = [
    Example("Dermatologists don't like her!", "Spam"),
    Example("'Hello, open to this?'", "Spam"),
    Example("I need help please wire me $1000 right now", "Spam"),
    Example("Nice to know you ;)", "Spam"),
    Example("Please help me?", "Spam"),
    Example("Your parcel will be delivered today", "Not spam"),
    Example("Review changes to our Terms and Conditions", "Not spam"),
    Example("Weekly sync notes", "Not spam"),
    Example("'Re: Follow up from today's meeting'", "Not spam"),
    Example("Pre-read for tomorrow", "Not spam"),
    Example("我是ups国际快递，你有一封包裹被扣在", "Spam"),
    Example("Huge discounts on our products!", "Spam"),
    Example("Limited time offer - act now!", "Spam"),
    Example("You won a free vacation!", "Spam"),
    Example("Get rich quick!", "Spam"),
    Example("Hello, can we connect?", "Spam"),
    Example("Your appointment is tomorrow", "Not spam"),
    Example("Thank you for your order", "Not spam"),
    Example("Reminder: Meeting at 2pm today", "Not spam"),
    Example("Important update on project status", "Not spam"),
    Example("Don't forget to complete the survey", "Not spam")
]

DATA_URL = "http://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip"
LOCAL_FILENAME = "smsspamcollection.zip"

# Download the file
urllib.request.urlretrieve(DATA_URL, LOCAL_FILENAME)


# Extract the CSV file from the downloaded ZIP file
with zipfile.ZipFile(LOCAL_FILENAME, 'r') as zip_ref:
    zip_ref.extractall()

# Open the CSV file and read its contents
csv_filename = "SMSSpamCollection"
with open(csv_filename, newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile, delimiter='\t')
    for row in reader:
        if row[0] == 'ham':
            label = 'Not spam'
        else:
            label = "Spam"
        text = row[1]
        if len(examples) < 750:
            if label == 'Not spam':
                examples.append(Example(text, label))
        else:
            if label == 'Spam':
                examples.append(Example(text, label))
        if len(examples) == 30:
            print(examples)
        if len(examples) == 1500:
            break


# inputs = [
#     "Confirm your email address",
#     "hey i need u to send some $",
#     "您好，请问你要查询什么",
#     "你好呀",
# ]
# response = co.classify(
#     inputs=inputs,
#     examples=examples,
# )
# for res in response:
#     print(res)


def cohere_api(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        input_list = data['text'] if isinstance(
            data['text'], list) else [data['text']]
        response = co.classify(
            inputs=input_list,
            examples=examples,
        )
        print(response)
        spam_confidence_score = response[0].labels['Spam'].confidence
        print(spam_confidence_score)
        return JsonResponse({
            'status': 'success',
            "spam_confidence_score": spam_confidence_score
        })
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


# print(type(response))

# for res in response:
#     print(res.labels["Spam"])

def generate_prompt(received_line):
    return """I'm answering a call and here is what the other said. How likely is he a scammer? Simply reply "not likely" if you think it's not a scammer. If you think he is a scammer, provide brief explanation. Here's what he said: """.format(received_line)


def generate_chat_prompt(messages_user, messages_assistant):
    messages = [
        {"role": "system", "content": "You are a scam detector. assume user input what CALLER said and you will analyze whether CALLER is scam likely. Limit your response within 20 words"},
        {"role": "user", "content": "Here's what A said:"}
    ]
    for i in range(len(messages_user)):
        messages.append({"role": "user", "content": messages_user[i]})
        if i < len(messages_assistant):
            messages.append(
                {"role": "assistant", "content": messages_assistant[i]})
    print(messages)
    return messages


def openai_api(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        print(data['text'])
        print(data)
        messages_scammer, messages_grandma = data['text']
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=generate_chat_prompt(messages_scammer, [])
        )

        # Alternate model
        # response = openai.Completion.create(
        #     model="text-davinci-003",
        #     prompt=generate_prompt(data),
        #     temperature=0.5
        # )

        return JsonResponse({
            'status': 'success',
            "response": response
        })
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
