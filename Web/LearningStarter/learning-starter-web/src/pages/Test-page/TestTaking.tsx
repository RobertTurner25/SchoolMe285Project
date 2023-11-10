import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ApiResponse,
  TestsGetDto,
  QuestionGetDto,
} from "../../constants/types";
import api from "../../config/axios";
import {
  Button,
  Container,
  Input,
  Table,
  createStyles,
  Space,
} from "@mantine/core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { routes } from "../../routes";
import { showNotification } from "@mantine/notifications";

export const TestQuestionsDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [test, setTest] = useState<TestsGetDto | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});

  async function fetchTests() {
    try {
      const response = await api.get<ApiResponse<TestsGetDto>>(`/api/Tests/${id}`);
      if (response.data.hasErrors) {
        // Handle errors here
      } else {
        setTest(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      showNotification({
        title: "Error",
        message: "Failed to fetch test details",
      });
    }
  }

  const handleQuestionDelete = async (questionId: number) => {
    try {
      await api.delete(`/api/TestQuestions/${questionId}`);
      showNotification({ message: "Question has entered the trash" });
      fetchTests();
    } catch (error) {
      console.error("Error deleting question:", error);
      showNotification({
        title: "Error",
        message: "Failed to delete the question",
      });
    }
  };

  const handleInputChange = (questionId: number, answer: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const isAnswerCorrect = (questionId: number): boolean => {
    const userAnswer = userAnswers[questionId] || "";
    const correctAnswer = test?.questions.find((q) => q.id === questionId)?.answer || "";

    // Convert both answers to lowercase for case-insensitive comparison
    const userAnswerLower = userAnswer.trim().toLowerCase();
    const correctAnswerLower = correctAnswer.trim().toLowerCase();

    // Handle numeric comparison separately
    if (!isNaN(Number(userAnswerLower)) && !isNaN(Number(correctAnswerLower))) {
      return Number(userAnswerLower) === Number(correctAnswerLower);
    }

    // For non-numeric answers, use regular string comparison
    return userAnswerLower === correctAnswerLower;
  };

  useEffect(() => {
    fetchTests();
  }, [id]);

  return (
    <Container>
      <Button
        onClick={() => {
          navigate(routes.TestingPage.replace(":id", `${test?.id}`));
        }}
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="xl" />
      </Button>

      {test && (
        <Table withBorder fontSize={15}>
          <thead>
            <tr>
              <th>Questions</th>
              <th>Your Answer</th>
              <th>Check</th>
            </tr>
          </thead>
          <tbody>
            {test.questions.map((question) => (
              <tr key={question.id}>
                <td>{question.question}</td>
                <td>
                  <Input
                    placeholder="Answer"
                    onChange={(event) => handleInputChange(question.id, event.currentTarget.value)}
                  />
                </td>
                <td>{isAnswerCorrect(question.id) ? "✅" : ""}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    iconButton: {
      cursor: "pointer",
    },
  };
});
