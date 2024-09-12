import React, { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import CARD_IMAGE from "./assets/thiep-moi_4.jpg";
import { FaDownload } from "react-icons/fa";
import classNames from "classnames";
import { generateFileName, titleCase } from "./utils";

function App() {
  const [text, setText] = useState("");
  const [guestList, setGuestList] = useState([]);
  const imageRef = useRef(null);

  useEffect(() => {
    loadCanvas();
  }, [guestList]);

  const loadCanvas = async () => {
    for (let i = 0; i < guestList.length; i++) {
      const text = guestList[i];
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = CARD_IMAGE;
      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          // Add the text to the image
          ctx.font = `${70}px Dancing`;
          ctx.fillStyle = "#213aad"; // Set text color
          // ctx.textAlign = "center"; // Center align the text horizontally
          // ctx.textBaseline = "middle"; // Center align the text vertically

          // Position text in the center of the image
          const x = 850;
          const y = 1200;
          ctx.fillText(text, x, y);
          resolve();
        };
      });
    }
  };

  const handleZipAndDownload = async () => {
    if (guestList && !guestList.length) return;

    // const textArray = texts.split("\n").filter((text) => text.trim() !== "");
    const zip = new JSZip();

    for (let i = 0; i < guestList.length; i++) {
      const text = guestList[i];
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = CARD_IMAGE;
      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          // Add the text to the image
          ctx.font = `${70}px Dancing`;
          ctx.fillStyle = "#213aad"; // Set text color
          // ctx.textAlign = "center"; // Center align the text horizontally
          // ctx.textBaseline = "middle"; // Center align the text vertically

          // Position text in the center of the image
          const x = 850;
          const y = 1200;
          ctx.fillText(text, x, y);

          canvas.toBlob(
            (blob) => {
              zip.file(
                `${generateFileName(
                  text
                )}-${new Date().getMilliseconds()}.jpeg`,
                blob
              );
              resolve();
            },
            "image/jpeg",
            0.8
          );
        };
      });
    }

    // Generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "thiep_cuoi_hung_le.zip");
    });
  };

  const addNewGuest = () => {
    if (!!text) {
      const name = titleCase(text.trim());
      setGuestList((old) => old.concat(name));
      setText("");
      // handleAddText(name);
    }
  };

  const deleteGuest = (index) => {
    setGuestList((old) => [...old.slice(0, index), ...old.slice(index + 1)]);
  };

  return (
    <div className="container">
      <div className="row" style={{ marginTop: 50 }}>
        <div className="col">
          <img ref={imageRef} src={CARD_IMAGE} alt="Image" width={400} />
        </div>
        <div className="col">
          <h3 className="border-bottom" id="test-text">
            Danh sách khách
          </h3>
          {guestList.map((item, index) => (
            <div
              className="d-flex justify-content-between"
              key={`${item}-${index}`}
              style={{ width: 300 }}
            >
              <h6>{item}</h6>
              <span
                className="text-danger"
                onClick={() => deleteGuest(index)}
                style={{ cursor: "pointer" }}
              >
                Xoá
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex flex-row mt-2 gap-3">
        <div className="col-8">
          <input
            type="text"
            value={text}
            className="form-control"
            placeholder="Nhập tên khách"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewGuest();
              }
            }}
          />
        </div>
        <div className="col-4">
          <button onClick={addNewGuest} className="btn btn-primary">
            Thêm khách
          </button>
        </div>
      </div>
      <div className="d-flex gap-1 mt-4">
        <button
          onClick={handleZipAndDownload}
          className={classNames(
            "btn  d-flex flex-row gap-2 align-items-center",
            {
              "btn-success": guestList.length > 0,
              "btn-secondary": guestList.length === 0,
            }
          )}
          disabled={guestList.length === 0}
        >
          Tải về
          <FaDownload />
        </button>
      </div>
    </div>
  );
}

export default App;
