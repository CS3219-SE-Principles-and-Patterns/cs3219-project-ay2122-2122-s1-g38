import { Box, Button, Modal, Paper, Typography } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { difficulties, languages, sessionText } from '../match/constants';
import LoadingButton from '../match/LoadingButton';
import SelectionMenu from '../match/SelectionMenu';
import { getMatch } from '../services/match';
import '../styles/match.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 25,
  boxShadow: 24,
  p: 4,
};

const MatchPage = () => {
  const { user } = useContext(UserContext);
  const history = useHistory();

  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [finished, setFinished] = useState(false);
  const [open, openModal] = useState(false);

  const handleMatch = (counter) => {
    console.log(`Counter: ${counter}`);
    if (counter === 0) {
      toast.warn('Failed to find matching user');
      openModal(false);
      return;
    }

    console.log(
      `Id: ${user.id}, Language: ${language}, Difficulty: ${difficulty}`
    );

    getMatch(user.id, difficulty, language)
      .then((response) => {
        console.log(response);
        if (response.status) {
          setFinished(true);
          const sessionId =
            response.partnerId > response.id
              ? `${response.id}+${response.partnerId}`
              : `${response.partnerId}+${response.id}`;
          sessionStorage.setItem(
            sessionId,
            JSON.stringify({ difficulty, language })
          );
          setTimeout(() => {
            history.push(`/interview/${sessionId}`);
          }, 150);
        } else {
          setTimeout(() => {
            handleMatch(counter - 1);
          }, 5000);
        }
      })
      .catch((err) => console.log(err));
  };

  const DifficultyMenu = () => {
    return (
      <SelectionMenu
        header="Difficulty"
        list={difficulties}
        value={difficulty}
        setValue={setDifficulty}
      />
    );
  };

  const LanguageMenu = () => {
    return (
      <SelectionMenu
        header="Language"
        list={languages}
        value={language}
        setValue={setLanguage}
      />
    );
  };

  const MatchButton = () => {
    return (
      <Button
        style={{
          marginTop: 60,
        }}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        onClick={() => {
          openModal(true);
          handleMatch(6);
        }}
      >
        Start coding!
      </Button>
    );
  };

  return (
    <Box>
      <Paper
        style={{
          minHeight: 300,
          maxWidth: 500,
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Typography color="primary">{sessionText}</Typography>
        <DifficultyMenu />
        <LanguageMenu />
        <MatchButton />
      </Paper>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={modalStyle}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <LoadingButton loading={true} done={finished} />
          <Typography color="primary">Matching is in progress...</Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              openModal(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default MatchPage;
