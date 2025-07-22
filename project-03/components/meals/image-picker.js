"use client";

import Image from "next/image";
import classes from "./image-picker.module.css";
import { useRef, useState } from "react";

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState(); // stores image preview data (base64)
  const imageInput = useRef(); // gives access to hidden input element

  function handlePickClick() {
    imageInput.current.click(); // triggers the <input type="file" /> click
  }

  function handleImageChange(event) {
    const file = event.target.files[0]; // get selected file

    if (!file) {
      setPickedImage(null); // reset if no file selected
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result); // save base64 image string
    };
    fileReader.readAsDataURL(file); // read file as base64 (usable in <img>)
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image is selected by the user."
              fill
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpg, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        <button
          type="button"
          className={classes.button}
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
