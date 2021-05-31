import React from 'react';

const Form = props => {
  return (
    <div className="container mt-5">
      <div id="login-row" className="row justify-constant-center align-item-center">
        <div id="login-column" className="col-md-6 py-3">
          <div id="login-box" className="col-md-12">
            <form
              id="login-form"
              className="form"
              onSubmit={props.onSubmit}
            > 
              {props.children}
            </form>  
          </div>
        </div>
      </div>
    </div>
  )
};

export default Form;