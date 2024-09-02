"use client"
import React from 'react';

const UserHealthProfile = ({ data }) => {
  return (
    <div className="health-profile">
      <h2>Your Health Profile</h2>
      
      <section className="goal">
        <h3>Your Goal</h3>
        <p>{data.userGoalDesc}</p>
      </section>

      <section className="bmi">
        <h3>BMI Information</h3>
        <ul>
          <li>Index: {data.bmi.index}</li>
          <li>Fat Percentage: {data.bmi.fatPercentage}%</li>
          <li>Category: {data.bmi.category}</li>
          <li>Indicators: {data.bmi.indicators}</li>
        </ul>
      </section>

      <section className="body-composition">
        <h3>Body Composition</h3>
        <ul>
          <li>Essential Fat: {data.bodyComposition.essentialFat}%</li>
          <li>Beneficial Fat: {data.bodyComposition.benificialFat}%</li>
          <li>Unbeneficial Fat: {data.bodyComposition.unBenificialFat}%</li>
          <li>Lean Mass: {data.bodyComposition.leanMass}%</li>
        </ul>
        <p>{data.bodyComposition.description}</p>
      </section>

      <section className="progress">
        <h3>Current Progress</h3>
        <p>Current Weight: {data.progress.currentWeight} kg</p>
        <p>{data.progress.currentBodyMarkers}</p>
      </section>

      <section className="recommendations">
        <h3>Recommendations</h3>
        <div>
          <h4>Dietary</h4>
          <ul>
            {data.recommendation.dietary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Exercises</h4>
          <ul>
            {data.recommendation.exercises.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Tips</h4>
          <ul>
            {data.recommendation.tips.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="routine">
        <h3>Your Routine</h3>
        <div>
          <h4>Dietary Plan</h4>
          <ul>
            {data.routine.dietary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Exercise Plan</h4>
          <ul>
            {data.routine.exercises.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default UserHealthProfile;