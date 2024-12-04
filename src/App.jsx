import React, { useState } from "react";
import styled, { ThemeProvider, keyframes } from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import GoalifyLogo from "./assets/GoalifyLogo.png"; // Verifique o caminho do logo
import HamburgerMenu from "./HamburgerMenu.jsx";

// Tema de cores para o Goalify
const theme = {
  background: "#0D0D0D",
  text: "#FFFFFF",
  secondaryText: "#B3B3B3",
  cardBackground: "#1A1A1A",
  lowPriority: "#4CAF50",
  mediumPriority: "#FFEB3B",
  highPriority: "#F44336",
  buttonGreen: "#1DB954", // Verde Spotify
};

// Animação de entrada
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editGoalIndex, setEditGoalIndex] = useState(null); // Índice da meta em edição
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    repetition: "",
    priority: theme.lowPriority,
  });
  const [goals, setGoals] = useState([
    { title: "Meta Hoje 1", date: new Date(), priority: theme.lowPriority, progress: 20 },
    { title: "Meta Hoje 2", date: new Date(), priority: theme.highPriority, progress: 50 },
    { title: "Meta Hoje 3", date: new Date(), priority: theme.mediumPriority, progress: 80 },
    { title: "Meta Futuro 1", date: new Date(2024, 10, 8), priority: theme.lowPriority, progress: 30 },
    { title: "Meta Futuro 2", date: new Date(2024, 10, 15), priority: theme.highPriority, progress: 0 },
    { title: "Meta Futuro 3", date: new Date(2024, 10, 20), priority: theme.mediumPriority, progress: 90 },
  ]);

  const today = new Date();

  const openForm = () => setShowForm(!showForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const addGoal = () => {
    const goal = {
      ...newGoal,
      date: new Date(newGoal.date),
      progress: 0,
    };
    setGoals([...goals, goal]);
    setShowForm(false);
    if (!newGoal.title || !newGoal.date) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }
  };

  const updateGoal = () => {
    if (editGoalIndex !== null) {
      const updatedGoals = [...goals];
      updatedGoals[editGoalIndex] = {
        ...updatedGoals[editGoalIndex],
        ...newGoal,
        date: new Date(newGoal.date),
      };
      setGoals(updatedGoals);
      setEditGoalIndex(null);
      setShowForm(false);
    }
  };

  const editGoal = (index) => {
    const goal = goals[index];
    setNewGoal({
      title: goal.title,
      description: goal.description || "",
      date: goal.date.toISOString().split("T")[0],
      time: goal.time || "",
      repetition: goal.repetition || "",
      priority: goal.priority,
    });
    setEditGoalIndex(index);
    setShowForm(true);
  };

  const deleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  const completeGoal = (index) => {
    const updatedGoals = [...goals];
    updatedGoals[index].progress = 100;
    setGoals(updatedGoals);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const isToday = date.toDateString() === today.toDateString();
      const goal = goals.find((goal) => goal.date.toDateString() === date.toDateString());
      if (isToday) return "today"; // Classe personalizada para o dia atual
      return goal ? goal.priority : null;
    }
  };

  const goalsToday = goals.filter((goal) => goal.date.toDateString() === today.toDateString());
  const allOtherGoals = goals.filter((goal) => goal.date.toDateString() !== today.toDateString());

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <LogoContainer>
          <Logo src={GoalifyLogo} alt="Goalify Logo" />
          <Title>Gerencie suas Metas</Title>
        </LogoContainer>
        <HamburgerMenu />
        <MainContent>
          <AddButton onClick={openForm}>+</AddButton>
          {showForm && (
            <FormContainer>
              <FormTitle>{editGoalIndex !== null ? "Editar Meta" : "Nova Meta"}</FormTitle>
              <Form>
                <FormLabel>Nome da Meta</FormLabel>
                <FormInput type="text" name="title" value={newGoal.title} onChange={handleInputChange} />
                <FormLabel>Descrição</FormLabel>
                <FormInput type="text" name="description" value={newGoal.description} onChange={handleInputChange} />
                <FormLabel>Data</FormLabel>
                <FormInput type="date" name="date" value={newGoal.date} onChange={handleInputChange} />
                <FormLabel>Horário</FormLabel>
                <FormInput type="time" name="time" value={newGoal.time} onChange={handleInputChange} />
                <FormLabel>Repetição</FormLabel>
                <FormSelect name="repetition" value={newGoal.repetition} onChange={handleInputChange}>
                  <option value="">Selecione...</option>
                  <option value="once">Somente neste dia</option>
                  <option value="weekly">Toda semana neste dia</option>
                  <option value="monthly">Todo mês neste dia</option>
                </FormSelect>
                <FormLabel>Prioridade</FormLabel>
                <FormSelect name="priority" value={newGoal.priority} onChange={handleInputChange}>
                  <option value={theme.lowPriority}>Baixa</option>
                  <option value={theme.mediumPriority}>Média</option>
                  <option value={theme.highPriority}>Alta</option>
                </FormSelect>
                <SubmitButton onClick={editGoalIndex !== null ? updateGoal : addGoal} color={theme.buttonGreen}>
                  {editGoalIndex !== null ? "Atualizar Meta" : "Adicionar Meta"}
                </SubmitButton>
              </Form>
            </FormContainer>
          )}
          <GoalsContainer>
            <SectionTitle>Metas do Dia</SectionTitle>
            <GoalSection>
              {goalsToday.map((goal, index) => (
                <GoalCard key={index}>
                  <GoalTitle>{goal.title}</GoalTitle>
                  <GoalDetails>
                    <Detail><strong>Data:</strong> {goal.date.toLocaleDateString("pt-BR")}</Detail>
                    <Detail><strong>Descrição:</strong> {goal.description}</Detail>
                    <Progress>
                      <ProgressBar width={goal.progress} />
                      <ProgressText>{goal.progress}%</ProgressText>
                    </Progress>
                    <ButtonContainer>
                      <EditButton onClick={() => editGoal(index)}>Editar</EditButton>
                      <CompleteButton onClick={() => completeGoal(index)}>Concluir</CompleteButton>
                      <DeleteButton onClick={() => deleteGoal(index)}>Excluir</DeleteButton>
                    </ButtonContainer>
                  </GoalDetails>
                </GoalCard>
              ))}
            </GoalSection>
            <SectionTitle>Todas as Metas</SectionTitle>
            <GoalSection>
              {allOtherGoals.map((goal, index) => (
                <GoalCard key={index}>
                  <GoalTitle>{goal.title}</GoalTitle>
                  <GoalDetails>
                    <Detail><strong>Data:</strong> {goal.date.toLocaleDateString("pt-BR")}</Detail>
                    <Detail><strong>Descrição:</strong> {goal.description}</Detail>
                    <Progress>
                      <ProgressBar width={goal.progress} />
                      <ProgressText>{goal.progress}%</ProgressText>
                    </Progress>
                    <ButtonContainer>
                      <EditButton onClick={() => editGoal(index)}>Editar</EditButton>
                      <CompleteButton onClick={() => completeGoal(index)}>Concluir</CompleteButton>
                      <DeleteButton onClick={() => deleteGoal(index)}>Excluir</DeleteButton>
                    </ButtonContainer>
                  </GoalDetails>
                </GoalCard>
              ))}
            </GoalSection>
          </GoalsContainer>
          <StyledCalendar tileClassName={tileClassName} />
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}


// Estilos com styled-components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  min-height: 100vh;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 800px;
`;

const AddButton = styled.button`
  font-size: 24px;
  color: #FFFFFF;
  background-color: ${(props) => props.theme.buttonGreen};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: ${(props) => props.theme.cardBackground};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  font-size: 14px;
  margin-top: 10px;
  color: ${(props) => props.theme.secondaryText};
`;

const FormInput = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: none;
  margin-top: 5px;
  background-color: #333;
  color: #fff;
`;

const FormSelect = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: none;
  margin-top: 5px;
  background-color: #333;
  color: #fff;
`;

const SubmitButton = styled.button`
  margin-top: 15px;
  padding: 10px;
  background-color: ${(props) => props.color || props.theme.buttonGreen};
  color: #FFFFFF;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const GoalsContainer = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.secondaryText};
  margin-top: 20px;
`;

const GoalSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const GoalCard = styled.div`
  background-color: ${(props) => props.theme.cardBackground};
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  /* Mantém 3 colunas em telas maiores */
  @media (max-width: 768px) {
    width: calc(33.33% - 10px); /* Três colunas também em tablets */
  }

  /* Ajusta para uma coluna em telas muito pequenas */
  @media (max-width: 480px) {
    width: 100%; /* Uma coluna */
  }
`;


const GoalTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const GoalDetails = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.secondaryText};
  margin-top: 5px;
`;

const Detail = styled.div`
  margin-bottom: 5px;
`;

const Progress = styled.div`
  width: 100%;
  background-color: #333;
  height: 10px;
  border-radius: 5px;
  margin: 10px 0;
  position: relative;
`;

const ProgressBar = styled.div`
  background-color: ${(props) => props.theme.buttonGreen};
  height: 100%;
  width: ${(props) => props.width || 0}%;
  border-radius: 5px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: #FFFFFF;
  position: absolute;
  right: 5px;
  top: -20px;
`;

const CompleteButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  color: #FFFFFF;
  background-color: ${(props) => props.theme.buttonGreen};
  border: none;
  cursor: pointer;
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  margin-top: 20px;
  background-color: ${(props) => props.theme.cardBackground};
  border: none;
  color: #4CAF50;

  .react-calendar__tile--active {
    background-color: ${(props) => props.theme.buttonGreen} !important;
  }

  .react-calendar__tile {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .today {
    background-color: #76c893; /* Verde claro */
    color: #000; /* Número do dia em preto */
    border-radius: 8px;
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  color: #ffffff;
  background-color: #ff9800;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  color: #ffffff;
  background-color: #f44336;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default App;
