from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_experimental.llms.ollama_functions import OllamaFunctions
from langchain_core.prompts import PromptTemplate
import json


# Create a class for the user
class User(BaseModel):
    goal: str = ''
    name: str = ''
    age: int = 0
    gender: str = ''
    height: float = 0.0
    weight: float = 0.0
    goal_weight: float = 0.0
    activityLevel: str = ''
    dietaryPreferences: list = []
    medicalConditions: str = ''
    sideProfileImage: str = ''
    frontProfileImage: str = ''

class BMI(BaseModel):
    index: str = Field(description="BMI index of the user", default="0")
    category: str = Field(description="BMI category (e.g., 'Underweight', 'Normal weight', 'Overweight', 'Obesity')", default="") 
    indicators: str = Field(description="List of additional health indicators related to BMI (e.g., ['Body fat percentage', 'Waist circumference'])", default="")

prompt = PromptTemplate.from_template("""
You are an experienced and knowledgeable fitness coach. Your task is to provide personalized fitness recommendations and strategies based on the user's information and fitness goals. Consider the following aspects when generating your response:
1. Analyze the user's current fitness level, age, gender, height, weight, and any health conditions or limitations.
2. Understand the user's specific fitness goals (e.g., weight loss, muscle gain, improved endurance, etc.).
3. Create a tailored fitness strategy that includes:
   - Recommended types of exercises
   - Workout frequency and duration
   - Intensity levels
   - Progression plan
4. Provide nutritional advice that complements the fitness strategy.
5. Suggest ways to track progress and stay motivated.
6. Offer safety tips and precautions relevant to the user's situation.
7. Recommend any necessary equipment or resources.

Based on the following user information and fitness goal, provide a detailed and personalized fitness recommendation and strategy:
{user_info}  # Placeholder for user JSON input

Please provide a comprehensive and motivating response that will help the user achieve their fitness objectives safely and effectively.
      
AI: """
)

llm = OllamaFunctions(model="llama3.1", format="json", temperature=0, tool_calls=True)
structured_llm = llm.with_structured_output(BMI)

llama_chain = prompt | structured_llm

request = {
    "goal": "Lose weight",
    "name": "yeshvant bhavnasi",
    "age": 33,
    "gender": "Male",
    "height": 177,
    "weight": 83,
    "goal_weight": 70,
    "activityLevel": "Lightly active",
    "dietaryPreferences": ["Vegetarian"],
    "medicalConditions": "Fatty liver condition and Hep B",
    "sideProfileImage": "",
    "frontProfileImage": ""
}

# Use the User model to create an instance and print its JSON representation
user_instance = User(**request)
user_json = user_instance.json()

# Assuming llama_chain.invoke takes a dictionary and returns a result
llama_response = llama_chain.invoke({"user_info": user_json})
print(llama_response)
