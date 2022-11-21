import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { FiUploadCloud, FiX } from "react-icons/fi";
import {
  createNewReportAsync,
  selectReportsStatus,
  cleanStatus,
} from "../../redux/slices/reportsSlice";
import ScreenTitle from "../../components/ScreenTitle";
import LoadingIndicator from "../../components/LoadingIndicator";

const NewReport = () => {
  const dispatch = useDispatch();
  const reportsStatus = useSelector(selectReportsStatus);
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [imageOrUrl, setImageOrUrl] = useState("image");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (selectedImage !== null) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onChangeImage = (file) => {
    if (!file) {
      setSelectedImage(null);
    } else if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Invalid image format");
    } else if (file.size > 10 * 1024 * 1024) {
      alert("Images cannot exceed 10Mb");
    } else {
      setSelectedImage(file);
    }
  };

  const isFormValid = () => {
    return (
      userId !== "" &&
      callbackUrl !== "" &&
      ((imageOrUrl === "image" && selectedImage !== null) ||
        (imageOrUrl === "url" && imageUrl !== ""))
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", userId);
    imageOrUrl === "image"
      ? formData.append("image", selectedImage)
      : formData.append("image_url", imageUrl);
    formData.append("callback_url", callbackUrl);

    dispatch(createNewReportAsync(formData));
  };

  const resetState = () => {
    setUserId("");
    setImageUrl("");
    setCallbackUrl("");
    setImageOrUrl("image");
    setSelectedImage(null);
    setImagePreview(null);
    dispatch(cleanStatus());
  };

  const renderForm = () => {
    return (
      <form
        onSubmit={(e) => onSubmit(e)}
        className={
          "flex flex-col px-4 py-4 bg-white rounded-lg shadow-lg w-[340px] lg:w-[460px]"
        }
      >
        <div className={"flex flex-col bg-orange-100 p-2 rounded-lg shadow-md"}>
          <label
            htmlFor={"userId"}
            className={"font-semibold text-orange-600"}
            data-tip={"* Mandatory."}
          >
            User ID *
          </label>
          <input
            type={"text"}
            id={"userId"}
            className={"focus-visible:outline-orange-700 mt-1 p-2 rounded-md"}
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
          />
        </div>
        <div className={"mt-10 flex bg-orange-100"}>
          <div
            className={`p-3 font-semibold mt-[-8px] ${
              imageOrUrl === "image"
                ? "text-orange-600 bg-orange-100 rounded-t-lg"
                : "text-orange-400 bg-white rounded-br-lg cursor-pointer"
            }`}
            data-tip={
              "* Mandatory upload image or enter an image's url. Must be .jpg or .png."
            }
            onClick={() => {
              setImageOrUrl("image");
            }}
          >
            <label className={imageOrUrl === "url" ? "cursor-pointer" : ""}>
              Upload Image {imageOrUrl === "image" && "*"}
            </label>
          </div>
          <div
            className={`p-3 font-semibold mt-[-8px] ${
              imageOrUrl === "url"
                ? "text-orange-600 bg-orange-100 rounded-t-lg"
                : "text-orange-400 bg-white rounded-bl-lg cursor-pointer"
            }`}
            data-tip={
              "* Mandatory upload image or enter an image's url. Must be .jpg or .png."
            }
            onClick={() => {
              setImageOrUrl("url");
            }}
          >
            <label
              htmlFor={"imageUrl"}
              className={imageOrUrl === "image" ? "cursor-pointer" : ""}
            >
              URL {imageOrUrl === "url" && "*"}
            </label>
          </div>
          <div
            className={`flex-1 bg-white mt-[-8px] ${
              imageOrUrl === "url" ? "rounded-bl-lg" : ""
            }`}
          ></div>
        </div>
        <div
          className={`flex flex-col bg-orange-100 p-2 rounded-lg shadow-md ${
            imageOrUrl === "image" ? "rounded-tl-none" : ""
          }`}
        >
          {imageOrUrl === "image" ? (
            selectedImage === null ? (
              <>
                <input
                  ref={imageInputRef}
                  type={"file"}
                  id={"image"}
                  accept={"image/png, image/jpg, image/jpeg"}
                  hidden
                  className={"focus-visible:outline-orange-700 mt-1 p-2"}
                  onChange={(event) =>
                    onChangeImage(event.target.files[0] || null)
                  }
                />
                <div
                  className={
                    "flex flex-col items-center justify-center p-4 bg-white rounded-md cursor-pointer h-72 lg:h-96"
                  }
                  accept={"image/png, image/jpg, image/jpeg"}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(event) => {
                    handleDrag(event);
                    onChangeImage(event.dataTransfer.files[0] || null);
                  }}
                  onClick={() => imageInputRef.current.click()}
                >
                  <div
                    className={
                      "p-4 mb-4 bg-orange-600 text-white text-3xl rounded-lg"
                    }
                  >
                    <FiUploadCloud />
                  </div>
                  <div className={"text-center"}>
                    Drag your .jpg or .png file
                    <br /> or <br /> click to open the selector
                  </div>
                </div>
              </>
            ) : (
              <div
                className={
                  "relative flex items-center justify-center self-center w-72 h-72 lg:w-96 lg:h-96"
                }
              >
                <img
                  alt={"Preview"}
                  src={imagePreview}
                  className={"max-h-full w-full object-contain"}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className={
                    "absolute top-1 left-1 flex items-center py-2 px-2 rounded-full font-bold text-xl text-orange-600 bg-white shadow-lg"
                  }
                >
                  <FiX />
                </button>
              </div>
            )
          ) : (
            <input
              type={"text"}
              id={"imageUrl"}
              className={"focus-visible:outline-orange-700 mt-1 p-2 rounded-md"}
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
              }}
            />
          )}
        </div>
        <div
          className={
            "mt-8 flex flex-col bg-orange-100 p-2 rounded-lg shadow-md"
          }
        >
          <label
            htmlFor={"callbackUrl"}
            data-tip={
              "* Mandatory. Callback URL will be notified when the image is approved or rejected"
            }
            className={"font-semibold text-orange-600"}
          >
            Callback URL *
          </label>
          <input
            type={"text"}
            id={"callbackUrl"}
            className={"focus-visible:outline-orange-700 mt-1 p-2 rounded-md"}
            value={callbackUrl}
            onChange={(e) => {
              setCallbackUrl(e.target.value);
            }}
          />
        </div>
        <button
          type={"submit"}
          className={`bg-orange-600 hover:bg-orange-700 disabled:bg-orange-200 disabled:text-gray-100 
      cursor-pointer disabled:cursor-auto text-white font-bold text-xl text-center px-4 py-3 mt-6 rounded-full shadow-md`}
          disabled={!isFormValid() || reportsStatus === "creatingNewReport"}
        >
          {reportsStatus !== "creatingNewReport" ? (
            "Submit"
          ) : (
            <div className="flex justify-center">
              <LoadingIndicator />
            </div>
          )}
        </button>
      </form>
    );
  };

  return (
    <div className={"p-6 flex flex-col flex-1 items-center"}>
      <ScreenTitle title={"New Report"} />
      {reportsStatus !== "succededCreatingNewReport" ? (
        renderForm()
      ) : (
        <div className={"flex flex-col flex-1 justify-center items-center"}>
          <button
            onClick={() => {
              resetState();
            }}
            className={
              "mt-6 bg-white hover:bg-orange-50 text-orange-800 font-bold text-xl text-center px-4 py-3 rounded-full shadow-md"
            }
          >
            Add New Report
          </button>
          <button
            onClick={() => {
              navigate("/reports/");
            }}
            className={
              "mt-4 bg-white hover:bg-orange-50 text-orange-800 font-bold text-xl text-center px-4 py-3 rounded-full shadow-md"
            }
          >
            See Reports
          </button>
        </div>
      )}

      <ReactTooltip />
    </div>
  );
};

export default NewReport;
