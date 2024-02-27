import React, { useState } from "react";
import Journey from "../Screens/Journey/Journey";
//import CallMessageConversationMessage from "../Components/Call/CallMessageConversationMessage";

const ParentComponent = () => {
  const [isCallActive, setIsCallActive] = useState(false);

  return (
    <Journey isCallActive={isCallActive} 
    setIsCallActive={setIsCallActive} />
  );
};

export default ParentComponent;
