import React from "react";

export default function Header(props) {
  
  return (
    <header className="appointment__time">
      <h4 className="text--semi-bold">{props.children}</h4>
      <hr className="appointment__separator" />
    </header>
  );
}