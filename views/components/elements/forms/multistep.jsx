import React from "react";

class Multistep extends React.Component {
  constructor(props) {
    super(props);
    this.stepForward = this.stepForward.bind(this);
    this.stepBackward = this.stepBackward.bind(this);
    this.step = this.step.bind(this);

    this.state = {
      currentStep: props.initialStep || 0,
    };
  }
  step(nextStep = "next") {
    let step = this.state.currentStep;
    if (nextStep == "next") {
      step++;
    }
    if (nextStep == "previous") {
      step--;
    }
    if (Number.isInteger(nextStep)) {
      step = nextStep;
    }
    this.setState({ currentStep: step });
  }
  stepForward(e) {
    e.preventDefault();
    let onNext = this.props.steps[this.state.currentStep].onNext;
    if (onNext) {
      onNext(this.step);
    } else {
      this.step();
    }
    //validate here!!!!!!
  }

  stepBackward(e) {
    e.preventDefault();
    this.step("previous");
  }

  render() {
    var self = this;

    let currentStep = this.state.currentStep;

    let stepToRender = this.props.steps[currentStep];
    let stepName = stepToRender.name;
    let stepComponent = stepToRender.component;
    let nextButton = (
      <button className="buttons _primary" onClick={self.stepForward}>
        Next
      </button>
    );
    if (currentStep == this.props.steps.length - 1) {
      nextButton = (
        <button className="buttons _primary _green" type="submit">
          Submit
        </button>
      );
    }

    return (
      <div>
        <h4>{currentStep + 1 + " : " + stepName}</h4>
        <hr />
        {stepComponent}
        <div className="control-btns">
          {currentStep > 0 && (
            <button
              className="buttons _primary _text"
              onClick={this.stepBackward}
            >
              Previous
            </button>
          )}
          {nextButton}
        </div>
      </div>
    );
  }
}

export default Multistep;
