import React from "react";
import Buttons from "../buttons.jsx";

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
    const { onNext } = this.props.steps[this.state.currentStep];
    if (onNext) {
      onNext(this.step);
    } else {
      this.step();
    }
    // validate here!!!!!!
  }

  stepBackward(e) {
    e.preventDefault();
    this.step("previous");
  }

  render() {
    const self = this;

    const { currentStep } = this.state;

    const stepToRender = this.props.steps[currentStep];
    const stepName = stepToRender.name;
    const stepComponent = stepToRender.component;
    let nextButton = (
      <button
        className="btn btn-rounded btn-default"
        onClick={self.stepForward}
      >
        Next
      </button>
    );
    if (currentStep == this.props.steps.length - 1) {
      nextButton = (
        <button className="btn btn-rounded btn-success" type="submit">
          Submit
        </button>
      );
    }

    return (
      <div>
        <h4>{`${currentStep + 1} : ${stepName}`}</h4>
        <hr />
        {stepComponent}
        <div className="control-btns">
          {currentStep > 0 && (
            <button
              className="btn btn-rounded btn-default"
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
