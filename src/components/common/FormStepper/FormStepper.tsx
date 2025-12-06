import React from "react";
import "./FormStepper.css";

interface FormStepperProps {
  steps: string[];
  activeStep: number;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  activeStep,
}) => {
  return (
    <div className="timeline-box">
      <div className="listings-timeline">
        <div
          className="listings-timeline-progress"
          style={{
            width: `${(activeStep / (steps.length - 1)) * 100}%`,
          }}
        ></div>
        <div className="listings-timeline-items">
          {steps.map((item, i) => (
            <div
              key={i}
              className={`listings-timeline-item${i <= activeStep ? " active" : ""}${i < activeStep ? " completed" : ""}`}
            >
              {i === activeStep && (
                <div className="listings-timeline-circle"></div>
              )}
              <div className="listings-timeline-content">{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
