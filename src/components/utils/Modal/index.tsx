import * as React from "react";
import { useEffect } from "react";
import "./index.scss";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Modal = (props: {
  children: React.ReactNode;
  title: string;
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

      <div className="modal-content">
        <div className="modal-content-header">
          <h1 className="title">{props.title}</h1>
          <button
            onClick={() => {
              setModalVisibility(false);
            }}
          >
            <Fa icon={faTimes} />
          </button>
        </div>
        <div className="modal-children">{props.children}</div>
      </div>
    </div>
  );
};

export default Modal;
