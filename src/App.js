import "./App.scss";
// import { PDFViewer } from "./components/PDF/PDFViewer";
import MainScreen from "./views/main-screen/main-screen"

function App() {
  // const path = "https://portal.liloo.by/api/services/get_pdf_template/individual/individual.pdf";
  return (
    <div className="App">
      {/* <PDFViewer path={path} /> */}
      <MainScreen />
    </div>
  );
}

export default App;
