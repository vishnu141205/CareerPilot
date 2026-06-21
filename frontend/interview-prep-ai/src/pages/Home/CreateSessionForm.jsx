import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import SpinnerLoader from '../../components/Loader/SpinnerLoader.jsx';


const CreateSessionForm = () => {
    const [formData, setFormData] = useState({
        role: "",
        experience: "",
        topicsToFocus: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }

    const handleCreateSession = async (e) => {
        e.preventDefault();

        const { role, topicsToFocus, experience } = formData;

        if (!role || !topicsToFocus || !experience) {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        setIsLoading(true);
        try {
            const apiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, 
                {
                    role,
                    experience,
                    topicsToFocus,
                    numberOfQuestions: 10,
                }
            );

            const generatedQuestions = apiResponse.data;
            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
                ...formData,
                questions: generatedQuestions,
            });

            if(response.data?.session?._id) {
                navigate(`/interview-prep/${response.data?.session?._id}`);
            }
        } catch (error) {
            if(error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred while creating the session. Please try again.");
            }

        } finally {
            setIsLoading(false);
        }

    }
  return (
    <div className="w-[60vw] md:w-[25vw] p-5 flex flex-col justify-center">
        <h3 className="text-lg font-semibold">Create New Session</h3>

        <p className="text-sm text-gray-600 mt-[5px] mb-4">
            Fill in the details below to create a new interview preparation session.
        </p>

        <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
            <Input
                value={formData.role}
                onChange={({ target }) => handleChange("role", target.value)}
                label="Role"
                placeholder="Enter the role you are preparing for"
                type="text"
            />
            <Input
                value={formData.experience}
                onChange={({ target }) => handleChange("experience", target.value)}
                label="Experience (in years)"
                placeholder="Enter your experience in years"
                type="number"
            />
            <Input
                value={formData.topicsToFocus}
                onChange={({ target }) => handleChange("topicsToFocus", target.value)}
                label="Topics to Focus"
                placeholder="Enter the topics you want to focus on"
                type="text"
            />
            <Input
                value={formData.description}
                onChange={({ target }) => handleChange("description", target.value)}
                label="Description"
                placeholder="Enter a brief description of the session"
                type="text"
            />

            {error && <p className="text-red-500 text-sm pb-2.5">{error}</p>}

            <button
                type="submit"
                className="w-full btn-primary mt-2 transition"
                disabled={isLoading}
            >
                {isLoading && <SpinnerLoader />}Create Session
            </button>
        </form>
    </div>
  )
}


export default CreateSessionForm