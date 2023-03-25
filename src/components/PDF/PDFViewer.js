import "@react-pdf-viewer/selection-mode/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "./style.scss";

import { Box, useTheme } from "@mui/material";
import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";
import { rotatePlugin } from "@react-pdf-viewer/rotate";
import {
  SelectionMode,
  selectionModePlugin,
} from "@react-pdf-viewer/selection-mode";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { useEffect } from "react";

// import { getCurrentUserRole } from "../../custom_functions/sessionStorage/getCurrentUserRole";
// import { DraggableLine } from "../common/draggable/Draggable.jsx";

// Switch to the wrapped mode

export function PDFViewer({ path, filter, line }) {
  const theme = useTheme();
  const selectionModePluginInstance = selectionModePlugin({
    selectionMode: SelectionMode.Hand,
  });
  const toolbarPluginInstance = toolbarPlugin();
  const rotatePluginInstance = rotatePlugin();
  const { Toolbar } = toolbarPluginInstance;
  const { RotateBackwardButton, RotateForwardButton } = rotatePluginInstance;
  const additionalClass = () => {
    let role;
    return role === null || role === "recognizer"
      ? "recognizer-permissions"
      : null;
  };
  const LocalizeTextContent = (tooltip, text) => {
    if (tooltip !== null) tooltip.textContent = text;
    return true;
  };
  const LocalizeHoverListener = (e) => {
    let target = e.target;
    if (
      target.closest(
        'div[aria-describedby="rpv-core__tooltip-body-full-screen-enter"]'
      )
    ) {
      let tooltip = document.getElementById(
        "rpv-core__tooltip-body-full-screen-enter"
      );
      return LocalizeTextContent(tooltip, "Полный экран");
    } else if (
      target.closest('div[aria-describedby="rpv-core__tooltip-body-zoom-out"]')
    ) {
      let tooltip = document.getElementById("rpv-core__tooltip-body-zoom-out");
      return LocalizeTextContent(tooltip, "Уменьшить");
    } else if (
      target.closest('div[aria-describedby="rpv-core__tooltip-body-zoom-in"]')
    ) {
      let tooltip = document.getElementById("rpv-core__tooltip-body-zoom-in");
      return LocalizeTextContent(tooltip, "Увеличить");
    } else if (target.closest(".counter-clockwise")) {
      let tooltip = document.getElementById("rpv-core__tooltip-body-rotate");
      return LocalizeTextContent(tooltip, "Повернуть  влево");
    } else if (target.closest(".clockwise")) {
      let tooltip = document.getElementById("rpv-core__tooltip-body-rotate");
      return LocalizeTextContent(tooltip, "Повернуть  вправо");
    } else if (
      target.closest('div[aria-describedby="rpv-core__tooltip-body-get-file"]')
    ) {
      let tooltip = document.getElementById("rpv-core__tooltip-body-get-file");
      return LocalizeTextContent(tooltip, "Скачать");
    } else if (
      target.closest('div[aria-describedby="rpv-core__tooltip-body-print"]')
    ) {
      let tooltip = document.getElementById("rpv-core__tooltip-body-print");
      return LocalizeTextContent(tooltip, "Печать");
    } else return false;
  };
  const LocalizeMenuZoom = () => {
    setTimeout(function () {
      Object.values(document.querySelectorAll(".rpv-core__menu-item--ltr"))
        .slice(0, 3)
        .map((item, i) => {
          switch (i) {
            case 0:
              item.querySelector(".rpv-core__menu-item-label").textContent =
                "Оригинальный размер";
              break;
            case 1:
              item.querySelector(".rpv-core__menu-item-label").textContent =
                "Размер окна";
              break;
            case 2:
              item.querySelector(".rpv-core__menu-item-label").textContent =
                "Вся ширина окна";
              break;
          }
        });
    }, 100);
  };
  useEffect(() => {
    let viewer = document.querySelector(".rpv-core__viewer");
    viewer.addEventListener("mouseover", LocalizeHoverListener);

    let menuZoom = document.querySelector(
      '[aria-controls="rpv-core__popver-body-zoom"]'
    );
    menuZoom.addEventListener("click", LocalizeMenuZoom);
  });

  return (
    <div className={`rpv-core__viewer ${additionalClass()}`}>
      <Box
        className='rpv-core__tools'
        sx={{ background: theme.palette.background.neutral }}
      >
        <Toolbar />

        <RotateBackwardButton />

        <RotateForwardButton />
      </Box>

      <div
        style={{
          position: "relative",
          flex: 1,
          // filter,
          height: "750px",
        }}
      >
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'>
          {/* <DraggableLine visible={line} /> */}
          <Viewer
            defaultScale={SpecialZoomLevel.PageWidth}
            fileUrl={path}
            plugins={[
              toolbarPluginInstance,
              selectionModePluginInstance,
              toolbarPluginInstance,
              rotatePluginInstance,
            ]}
          />
        </Worker>
      </div>
    </div>
  );
}
