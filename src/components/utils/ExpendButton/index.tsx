import * as React from "react";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import "./index.scss";

interface ExpendButtonProps {
  icon: any; //
  text: string;
  size: number;
  clickEvent: Function;
}
const ExpendButton = (props: ExpendButtonProps) => {
  const { icon, text, size, clickEvent } = props;

  return (
    <div className="expend-button-wrap">
      <button
        className="expend-button"
        onMouseEnter={(e) => {
          const expend = e.currentTarget
            .nextElementSibling as HTMLDivElement | null;
          const expendText = expend?.firstChild as
            | HTMLParagraphElement
            | undefined;

          if (expend && expendText) {
            expend.style.width = `${size}rem`;
            expendText.style.opacity = "1";
          }
        }}
        onMouseLeave={(e) => {
          const expend = e.currentTarget
            .nextElementSibling as HTMLDivElement | null;
          const expendText = expend?.firstChild as
            | HTMLParagraphElement
            | undefined;

          if (expend && expendText) {
            expend.style.width = "1.5rem";
            expendText.style.opacity = "0";
          }
        }}
        onClick={(e) => {
          e.preventDefault();
          clickEvent();
        }}
      >
        <Fa icon={icon} />
      </button>
      <div className="expend-area">
        <p className="expend-text">{text}</p>
      </div>
    </div>
  );
};

export default ExpendButton;
