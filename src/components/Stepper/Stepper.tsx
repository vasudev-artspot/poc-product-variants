import React, { useContext } from "react";
import ListingsProgressContext, {
  ListingsProgressContextProps,
} from "./ListingsProgressContext";
import "./Stepper.css";

interface ListingsTimelineItem {
  name: string;
  active: boolean;
}

interface ListingsTimelineProps {
  listingItems: ListingsTimelineItem[];
  contentScreens2: React.ReactNode[];
  listingSteps: string[];
}

const ProgressStepBarContent2: React.FC<{
  contentScreens2: React.ReactNode[];
  listingSteps: string[];
}> = (props) => {
  const { contentScreens2, listingSteps } = props;
  const { activeStep } = useContext(
    ListingsProgressContext
  ) as ListingsProgressContextProps;

  return (
    <div className="box-content-listings">
      {contentScreens2.map((screen, index) => (
        <div key={index}>{activeStep === index && screen}</div>
      ))}
    </div>
  );
};

const Stepper: React.FC<ListingsTimelineProps> = (props) => {
  const { setNextStep, activeStep } = useContext(
    ListingsProgressContext
  ) as ListingsProgressContextProps;
  const { listingItems, contentScreens2, listingSteps } = props;

  return (
    <div className="timeline-box">
      <div className="listings-timeline">
        <div
          className="listings-timeline-progress"
          style={{
            width: `${(activeStep / (listingItems.length - 1)) * 100}%`,
          }}
        ></div>
        <div className="listings-timeline-items">
          {listingItems.map((item, i) => (
            <div
              key={i}
              className={`listings-timeline-item${i <= activeStep ? " active" : ""}${i < activeStep ? " completed" : ""}`}
            >
              {i === activeStep && (
                <div className="listings-timeline-circle"></div>
              )}
              <div className="listings-timeline-content">{item.name}</div>
            </div>
          ))}
        </div>
        <div className="listings">
          <ProgressStepBarContent2
            contentScreens2={contentScreens2}
            listingSteps={listingSteps}
          />
        </div>
      </div>
    </div>
  );
};

export default Stepper;
