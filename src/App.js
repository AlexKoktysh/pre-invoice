import "./App.scss";
import { PDFViewer } from "./components/PDF/PDFViewer";
import MainScreen from "./views/main-screen/main-screen"
import { useState } from "react";
import { sendTemplate } from "../src/api/api";
import { CircularProgress } from "@mui/material";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

function App() {
  const [sample_id, setSample_id] = useState(0);
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [position, setPosition] = useState(false);
  const getTemplate = async (obj) => {
    setLoading(true);
    const response = await sendTemplate(obj);
    if (!response.type) {
      response && setSample_id(response["ajax-response-with-data"]);
      response && setPath(response["file_path"]);
      if (response["ajax-response"] === "Шаблон акта успешно получен") {
        setShowAddButton(true);
      }
    }
    setLoading(false);
    return response;
  };
  const change = () => {
    const card = document.getElementById("card");
    const pdf = document.getElementsByClassName("rpv-core__viewer");
    if (!position) {
      card.classList.add("right");
      card.classList.remove("left");
      pdf[0].classList.add("left");
      pdf[0].classList.remove("right");
    }
    if (position) {
      card.classList.add("left");
      card.classList.remove("right");
      pdf[0].classList.add("right");
      pdf[0].classList.remove("left");
    }
    setPosition(!position);
  };
  return (
    <div className="App">
      {!loading && sample_id !== 0 && path && <PDFViewer path={path} />}
      {loading &&
        <Box sx={{ justifyContent: 'center', width: '50%' }}>
          <CircularProgress />
        </Box>
      }
      {sample_id !== 0 && path &&
        <IconButton className="button" onClick={change}>
          <FormatListBulletedIcon />
        </IconButton>
      }
      <MainScreen sendTemplate={getTemplate} sample_id={sample_id} showAddButton={showAddButton} />
    </div>
  );
}

export default App;
