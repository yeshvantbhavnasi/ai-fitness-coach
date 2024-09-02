from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel as NewBaseModel
from langchain_openai import ChatOpenAI
from langchain_core.pydantic_v1 import BaseModel, Field
import json  


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update to match your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Set your OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")

# Create a class for the user
class User(NewBaseModel):
    goal: str = ''
    name: str = ''
    age: int = 0
    gender: str = ''
    height: float = 0
    weight: float = 0.0
    goal_weight: float = 0.0
    activityLevel: str = ''
    dietaryPreferences: list = []
    medicalConditions: str = ''
    sideProfileImage: str = ''
    frontProfileImage: str = ''
class BodyComposition(BaseModel):
    essentialFat: str = Field(description="percentage of the fat categorized as essential fat", default="")
    benificialFat: str = Field(description="percentage of the fat categorized as benificial fat", default="")
    unBenificialFat: str = Field(description="percentage of the fat categorized as un benificial fat", default="")
    leanMass: str = Field(description="remaining percentage of lean mass", default="")
    description: str = Field(description="one lien description for the calculation")
class BMI(BaseModel):
    index: str = Field(description="BMI index of the user", default="0")
    fatPercentage: str = Field(description="approx fat % of the user", default="0")
    category: str = Field(description="BMI category (e.g., 'Underweight', 'Normal weight', 'Overweight', 'Obesity')", default="") 
    indicators: str = Field(description="List of additional health indicators related to BMI (e.g., ['Body fat percentage', 'Waist circumference'])", default="")
class Recommendation(BaseModel):
    dietary: list[str] = Field(description="List of dietary recommendations (e.g., ['Increase protein intake', 'Reduce sugar'])", default=[])
    exercises: list[str] = Field(description="List of recommended exercises (e.g., ['30 minutes of cardio', 'Strength training 3 times a week'])",  default=[])
    tips: list[str] = Field(description="General tips for achieving fitness goals (e.g., ['Stay hydrated', 'Get enough sleep'])",  default=[])
class Routine(BaseModel):
    dietary: list[str] = Field(description="Daily dietary routine (e.g., [Monday : 'Breakfast: Oatmeal', 'Lunch: Salad'])",  default=[])
    exercises: list[str] = Field(description="Daily exercise routine (e.g., ['Monday: Cardio', 'Tuesday: Strength training'])",  default=[])
class Goal(BaseModel):
    goal: str = Field(description="goal for fitness journey", defautt="")
    goalBMI: str = Field(description="goal bmi", default="")
    goalFat: str = Field(description="goal fat", default="")
    goalWeight: int = Field(description="goal weight", defautt="0")
class Progress(BaseModel):
    currentWeight: str = Field(description="current weight", default="")
    currentBodyMarkers: str= Field(description="based on progress and images uploaded", default="")
class HealthData(BaseModel):
    userGoalDesc: str = Field(description="Full introduction about user in motivating way. Why user should continue his journey", default=None)
    bmi: BMI = Field(description="BMI information of the user", default=None) # BMI information of the user
    bodyComposition: BodyComposition = Field(description="body composition calculation. Most accuracy is important", default=None)
    progress: Progress = Field(description="Progress of the user", default=None)
    recommendation: Recommendation = Field(description="Personalized recommendations for the user, Indexed by day", default=None)  # Personalized recommendations for the user
    routine: Routine = Field(description="Daily routine for diet and exercise. Indexed by day", default=None) # Daily routine for diet and exercise

prompt_template = """
You are an experienced and knowledgeable fitness coach. Your task is to provide personalized fitness recommendations and strategies based on the user's information and fitness goals. Consider the following aspects when generating your response:
1. Analyze the user's current fitness level, age, gender, height, weight, and any health conditions or limitations.
2. Understand the user's specific fitness goals (e.g., weight loss, muscle gain, improved endurance, etc.).
3. Create a tailored fitness strategy that includes:
   - Recommended types of exercises with detail about the exact exercies
   - Workout frequency and duration
   - Intensity levels detailing the exercise
   - Progression plan.
4. Provide nutritional advice that complements the fitness strategy.
5. Suggest ways to track progress and stay motivated.
6. Offer safety tips and precautions relevant to the user's situation.
7. Recommend any necessary equipment or training resources.

Based on the following user information and fitness goal, provide a detailed and personalized fitness recommendation and strategy:
{user_info}

Please provide a comprehensive and motivating response that will help the user achieve their fitness objectives safely and effectively.
Make sure any values provided are as accurate as possible.
AI: """

def generate_fitness_recommendation(user_info):
    prompt = prompt_template.format(user_info=user_info)
    #print(prompt)
    model = ChatOpenAI(
        model="gpt-4o-mini", temperature=0, api_key=api_key
    )
    llm = model.with_structured_output(HealthData)
    response=llm.invoke(prompt)
    #print(response)
    return {"data":response}

@app.post("/signup")
def signup(user: User):
    # read the files 
    side_file_base64 = user.sideProfileImage
    front_file_base64 = user.frontProfileImage
    # remove side and front property from user 
    user.sideProfileImage = ""
    user.frontProfileImage = ""
    # Use the User model to create an instance and print its JSON representation
    user_json = user.json()

    # Generate fitness recommendation using OpenAI
    llama_response = generate_fitness_recommendation(user_json)
    return llama_response  # Ensure llama_response is converted to dict
