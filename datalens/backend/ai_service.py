import os
from google import genai
from google.genai import types
import json
from dotenv import load_dotenv

load_dotenv()

async def generate_insights(dataset_summary: dict) -> list[str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return ["AI Insights are disabled because the API key is not configured."]

    prompt = f"""
You are an expert data analyst. Review the following summary of a dataset and provide exactly 5 simple, bullet-point insights. 
Do not invent any information. Only use the provided statistics.
Keep the language simple and beginner-friendly.

Dataset summary:
Rows: {dataset_summary.get('rows')}
Columns: {dataset_summary.get('columns')}
Missing Values: {dataset_summary.get('missing_values')}
Duplicate Rows: {dataset_summary.get('duplicate_rows')}

Column Info:
{json.dumps(dataset_summary.get('columns_info', []), indent=2)}

Statistics:
{json.dumps(dataset_summary.get('statistics', []), indent=2)}
"""

    try:
        # Initialize the new Google GenAI client
        client = genai.Client(api_key=api_key)
        
        # Call the model (using the async API)
        response = await client.aio.models.generate_content(
            model='gemini-3.8-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=250,
                temperature=0.3,
            )
        )
        content = response.text
        
        # Parse into a list of strings
        insights = [line.strip().lstrip('-').lstrip('*').strip() for line in content.split('\n') if line.strip()]
        return [i for i in insights if i]
    except Exception as e:
        return [f"Could not generate insights at this time. Error: {str(e)}"]
