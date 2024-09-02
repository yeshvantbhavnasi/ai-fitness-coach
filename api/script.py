from langchain_core.pydantic_v1 import BaseModel, Field




#create a class for the user
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
    sideProfileImage: str= ''
    frontProfileImage: str= ''

class BMI(BaseModel):
    index: str = Field(description="BMI index of the user", required=False, default="0")
    category: str = Field(description="BMI category (e.g., 'Underweight', 'Normal weight', 'Overweight', 'Obesity')", required=False, default="") 
    indicators: str = Field(description="List of additional health indicators related to BMI (e.g., ['Body fat percentage', 'Waist circumference'])", required=False, default="")

# class Recommendation(BaseModel):
#     dietary: list[str] = Field(description="List of dietary recommendations (e.g., ['Increase protein intake', 'Reduce sugar'])",required=False, default=[])
#     exercises: list[str] = Field(description="List of recommended exercises (e.g., ['30 minutes of cardio', 'Strength training 3 times a week'])", required=False, default=[])
#     tips: list[str] = Field(description="General tips for achieving fitness goals (e.g., ['Stay hydrated', 'Get enough sleep'])", required=False, default=[])

# class Routine(BaseModel):
#     dietary: list[str] = Field(description="Daily dietary routine (e.g., [Monday : 'Breakfast: Oatmeal', 'Lunch: Salad'])", required=False, default=[])
#     exercises: list[str] = Field(description="Daily exercise routine (e.g., ['Monday: Cardio', 'Tuesday: Strength training'])", required=False, default=[])

# class HealthData(BaseModel):
#     bmi: BMI = Field(description="", required=False, default=None) # BMI information of the user
#     recommendation: Recommendation = Field(description="", required=False, default=None)  # Personalized recommendations for the user
#     routine: Routine = Field(description="", required=False, default=None) # Daily routine for diet and exercise


from langchain_experimental.llms.ollama_functions import OllamaFunctions
from langchain_core.prompts import PromptTemplate  # Fixed typo here


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

Please provide a comprehensive and motivating response that will help the user achieve their fitness objectives safely and effectively.
                                      
Human: {question}
AI: """
)

llm = OllamaFunctions(model="llama3.1", format="json", temprature=0)
structured_llm = llm.with_structured_output(BMI)

llama_chain = prompt | structured_llm
request = {"goal":"Lose weight","name":"yeshvant bhavnasi","age":"33","gender":"Male","height":"177","weight":"83",
"goal_weight":0,"activityLevel":"Lightly active","dietaryPreferences":["Vegetarian"],
"medicalConditions":"Fatty liver condition and Hep B",
"sideProfileImage":"",
"frontProfileImage":""}
import json
print(request.json())
# llama_response = llama_chain.invoke(request.json())

# print(llama_response)