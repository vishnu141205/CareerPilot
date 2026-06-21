import React from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu';
import SpinnerLoader from '../../components/Loader/SpinnerLoader.jsx';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx';
import RoleInfoHeader from './components/RoleInfoHeader.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import QuestionCard from '../../components/Cards/QuestionCard.jsx';
import { motion } from 'framer-motion';
import AIResponsePreview from './components/AIResponsePreview.jsx';
import Drawer from '../../components/Drawer.jsx';
import SkeletonLoader from '../../components/Loader/SkeletonLoader.jsx';

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  const fetchSessionDetailsById = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));

      if(response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      setErrorMsg("Failed to fetch session details.");
    }
  };

  const generateConceptExplanation = async (question) => {
    try{
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question,
      });

      if(response.data){
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate concept explanation.");
      console.error("Error generating explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try{
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));
      console.log(response);

      if(response.data && response.data.question) {
        fetchSessionDetailsById();
      }

    } catch (error) {
      console.error("Error toggling pin status:", error);
    }
  };

  const uploadMoreQuestions = async () => {
    try{
      setIsUpdateLoader(true);

      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 5,
      });

      // --- SAFELY EXTRACT THE ARRAY ---
      // Check if the data is nested under a 'questions' key, or fallback to the data itself
      let generatedQuestions = aiResponse.data;
      if (aiResponse.data && Array.isArray(aiResponse.data.questions)) {
          generatedQuestions = aiResponse.data.questions;
      } else if (aiResponse.data && Array.isArray(aiResponse.data.data)) {
          generatedQuestions = aiResponse.data.data;
      }

      // --- PRE-FLIGHT CHECK ---
      if (!Array.isArray(generatedQuestions)) {
          console.error("AI response did not contain an array:", aiResponse.data);
          setErrorMsg("Failed to parse AI response. Please try again.");
          return; // Stop the execution before hitting the backend error
      }

      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId: sessionId,
        questions: generatedQuestions, // Now we are 100% sure this is an array
      });

      if(response.data) {
        toast.success("More Questions Added");
        fetchSessionDetailsById();
      }
    } catch (error) {
      if(error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Failed to upload more questions. Please Try again.");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
    return () => {};
  }, []);
  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        experience={sessionData?.experience || "-"}
        topicsToFocus={sessionData?.topicsToFocus || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4">
        <h2 className="text-xl font-semibold mb-4">Questions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-1 pb-6 px-4 md:px-0">
          <div className={`col-span-12 ${openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}>
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3,
                      type: "spring",
                      stiffness: 100,
                      damping: 10,
                      delay: index * 0.1, // Stagger the animation based on index
                     }}
                     layout
                     layoutId={`question-${data._id || index}`}
                  >
                    <>
                     <QuestionCard
                      question={data?.question}
                      answer={data?.answer}
                      onLearnMore={() =>
                        generateConceptExplanation(data.question)
                      }
                      isPinned={data?.isPinned}
                      onTogglePin={() => 
                        toggleQuestionPinStatus(data._id)
                      }
                      />
                    

                    {!isLoading && sessionData?.questions?.length == index + 1 && (
                      <div className="flex items-center justify-center mt-5">
                        <button
                          onClick={uploadMoreQuestions}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-blue-500 font-medium mr-2 rounded text-nowrap cursor-pointer "
                          disabled={isUpdateLoader || isLoading}
                        >
                          {isUpdateLoader ? (
                            <SpinnerLoader />
                          ) : (
                            <LuListCollapse className="text-lg" />
                          )}{" "} Load More 
                        </button>
                      </div>
                    )}
                  </>  
                  </motion.div>
                );
                    
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div>
        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={() => setOpenLearnMoreDrawer(false)}
          title={!isLoading && explanation?.title}
        >
          {errorMsg && (
            <p className="flex gap-2 text-sm text-blue-500 font-medium">
              <LuCircleAlert className="mt-1" />
              {errorMsg}
            </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
            )}
        </Drawer>
      </div>
    </DashboardLayout>
  )
}

export default InterviewPrep