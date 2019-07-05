import React from "react";


const SecureString = (props) => {
    return (
      <div className="sb-form-group __addon-secure-text-widget">
        <input className="_input- _input-addon-secure-text-widget" {...props.input} type="password" placeholder={props.label} />
      </div>
    );
};



const widget =     {widget : SecureString, type : "secure-string", label : "Secure String"};

export default widget