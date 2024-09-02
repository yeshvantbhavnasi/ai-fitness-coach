"use client"
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
//import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image'; // Add this import
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

import DashBoard from './DashBoard';

interface FormData {
  goal: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal_weight: number;
  activityLevel: string;
  dietaryPreferences: string[];
  medicalConditions: string;
  sideProfileImage: File | null;
  frontProfileImage: File | null;
}
const Flow = ({setStatus}: {setStatus: (status: any) => void}) => {
  const router = useRouter(); // Initialize router
  //console.log(router.query);
  const kgToLbs = (kg: number) => {
    return (kg * 2.20462).toFixed(2); // Convert kg to lbs
  };
  const cmToFt = (cm) => {
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm % 30.48) / 2.54);
    return `${feet} ft ${inches} in`;
  };
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    goal: '',
    name: '',
    age: 21,
    gender: '',
    height: 170.0,
    weight: 80.0,
    goal_weight: 70.0,
    activityLevel: '',
    dietaryPreferences: [],
    medicalConditions: '',
    sideProfileImage: null,
    frontProfileImage: null,
  });

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

  const handleSubmit = async () => {
    console.log('Form submitted:', formData);
    // Convert files to Base64
const sideProfileImageBase64 = formData.sideProfileImage ? await toBase64(formData.sideProfileImage) : "";
const frontProfileImageBase64 = formData.frontProfileImage ? await toBase64(formData.frontProfileImage) : "";
    const formDataWithPaths = {
      ...formData,
      sideProfileImage: sideProfileImageBase64,
      frontProfileImage: frontProfileImageBase64,
  };

  setStatus({
    loading:true,
    data:{},
    showDashBoard:false
  })

    const {data} = await axios.post('http://localhost:8000/signup', formDataWithPaths)

    setStatus({
      loading:true,
      data:data.data,
      showDashBoard:true
    })
    
    // router.push('/dashboard');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setFormData((prevState) => ({
        ...prevState,
        sideProfileImage: files[0] || null,
        frontProfileImage: files[1] || null,
      }));
    }
  };

  const handleSelect = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: prevState[field].includes(value)
        ? prevState[field].filter(item => item !== value)
        : [...prevState[field], value]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">What goal do you have in mind?</h2>
            <div className="space-y-4">
              {['Lose weight', 'Maintain weight', 'Gain weight'].map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleSelect('goal', goal)}
                  className={`w-full p-4 text-left rounded-xl transition-colors ${
                    formData.goal === goal
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">Tell us about yourself</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full p-4 rounded-xl border border-gray-300"
              />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Your Age"
                className="w-full p-4 rounded-xl border border-gray-300"
              />
              <div className="space-x-4">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => handleSelect('gender', gender)}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      formData.gender === gender
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">Your body metrics</h2>
            <div className="space-y-4">
            <input
                type="range"
                name="height"
                min="100" // Minimum height in cm
                max="250" // Maximum height in cm
                value={formData.height}
                onChange={handleInputChange}
                className="w-full"
              />
              <p>Your height in feet: {formData.height ? cmToFt(formData.height) : 'N/A'}</p> {/* Display conversion */}
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Weight (kg)"
                className="w-full p-4 rounded-xl border border-gray-300"
              />
              <p>Your weight in Lbs: {formData.weight ? kgToLbs(formData.weight) : 'N/A'}</p> 
              <input
                type="number"
                name="weight"
                value={formData.goal_weight}
                onChange={handleInputChange}
                placeholder="Weight (kg)"
                className="w-full p-4 rounded-xl border border-gray-300"
              />
              <p>Your weight in Lbs: {formData.goal_weight ? kgToLbs(formData.goal_weight) : 'N/A'}</p>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">Your activity level</h2>
            <div className="space-y-4">
              {['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Extra active'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSelect('activityLevel', level)}
                  className={`w-full p-4 text-left rounded-xl transition-colors ${
                    formData.activityLevel === level
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">Dietary preferences</h2>
            <div className="space-y-4">
              {['Vegan', 'Vegetarian', 'Pescatarian', 'Keto', 'Paleo', 'No restrictions'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => handleMultiSelect('dietaryPreferences', diet)}
                  className={`w-full p-4 text-left rounded-xl transition-colors ${
                    formData.dietaryPreferences.includes(diet)
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </>
        );
      case 6:
        return (
          <>
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
              Upload your side and front profile images
            </h2>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 space-y-4">
            
              {formData.sideProfileImage && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Side Profile Image:
                  </h3>
                  <img
                    src={URL.createObjectURL(formData.sideProfileImage)}
                    alt="Side Profile Preview"
                    className="mt-2 h-40 w-auto rounded-md"
                  />
                </div>
              )}
              {formData.frontProfileImage && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Front Profile Image:
                  </h3>
                  <img
                    src={URL.createObjectURL(formData.frontProfileImage)}
                    alt="Front Profile Preview"
                    className="mt-2 h-40 w-auto rounded-md"
                  />
                </div>
              )}
            </div>
          </>
        );
      case 7: 
      return (
        <><h2 className="text-3xl font-bold mb-6">Any medical conditions?</h2>
        <div className="space-y-4">
          <textarea
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={handleInputChange}
            placeholder="Please list any medical conditions or leave blank if none"
            className="w-full p-4 rounded-xl border border-gray-300 h-32"
          />
        </div>
        </>
        
      )
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-7 bg-gray-50 rounded-xl shadow-lg">
      <div className="flex items-center mb-7">
        {step > 1 && (
          <button onClick={prevStep} className="mr-4">
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
          AI
        </div>
        <p className="mt-2 text-green-700 font-medium">Let's get to know you better!</p>
      </div>

      {renderStep()}

      <p className="mt-7 text-sm text-gray-500 text-center">
        We use this information to calculate and provide you with daily personalized recommendations.
      </p>

      <button
        onClick={step < 7 ? nextStep : handleSubmit} // Updated to use handleSubmit
        className="w-full mt-7 p-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
      >
        {step < 7 ? 'NEXT' : 'SUBMIT'}
      </button>
    </div>
  );
};


const DashboardWrapper = () =>{

  const [status, setStatus] = useState({
    loading:false,
    data:{},
    showDashBoard:false
  });

  if(status.showDashBoard){
    return <DashBoard data={status.data}/>
  }

  if(status.loading){
    return <>Loading...</>
  }

  return <Flow setStatus={setStatus} />

}

export default DashboardWrapper;


