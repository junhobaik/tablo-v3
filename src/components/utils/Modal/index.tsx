import * as React from "react";
import { useEffect } from "react";
import "./index.scss";

const Modal = (props: {
  children: React.ReactNode;
  toggleVisibility: Function;
}) => {
  const setModalVisibility = (isOpen: boolean = true) => {
    const modal = document.querySelector(".modal-component") as HTMLDivElement;
    modal.style.opacity = isOpen ? "1" : "0";

    if (!isOpen) {
      setTimeout(() => {
        props.toggleVisibility(false);
      }, 310);
    }
  };

  useEffect(() => {
    setModalVisibility(true);
    return () => {};
  }, []);

  return (
    <div className="modal-component">
      <div
        className="modal-background"
        onClick={() => {
          setModalVisibility(false);
        }}
      ></div>
      <div className="modal-content">{props.children}</div>
    </div>
  );
};

export default Modal;
