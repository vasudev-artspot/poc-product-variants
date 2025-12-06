import React, { useState, createContext, ReactNode, useEffect } from "react";

export interface ListingsProgressContextProps {
  activeStep: number;
  setNextStep: () => void;
  setPrevStep: () => void;
  setTotalStepCount: (totalStepsCount: number) => void;
  goToStep: (step: number) => void;
  listingItems: Array<{ name: string; active: boolean; step: number }>;
}

const ListingsProgressContext = createContext<
  ListingsProgressContextProps | undefined
>(undefined);

interface ListingsProgressProvider {
  children: ReactNode;
}

export const ListingsProgressProvider: React.FC<ListingsProgressProvider> = ({
  children,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const initialItems2 = [
    {
      name: "Product Details",
      active: true,
      step: 0,
    },
  ];
  const [listingItems, setItems] = useState(initialItems2);

  const setTotalStepCount = (totalStepsCount: number): void => {
    setTotalSteps(totalStepsCount);
  };

  const setNextStep = (): void => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep < totalSteps - 1 ? prevActiveStep + 1 : totalSteps - 1
    );
  };

  const setPrevStep = (): void => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : 0
    );
  };

  useEffect(() => {
    updateItems(activeStep);
    console.log("Current Step:", activeStep);
  }, [activeStep]);

  const goToStep = (step: number): void => {
    setActiveStep(step);
    updateItems(step);
    console.log("Go to Step:", step);
  };

  const updateItems = (step: number) => {
    const updatedItems = listingItems.map((item) => ({
      ...item,
      active: item.step === step,
    }));
    setItems(updatedItems);
  };

  const ListingscontextValue: ListingsProgressContextProps = {
    activeStep,
    setNextStep,
    setPrevStep,
    setTotalStepCount,
    goToStep,
    listingItems,
  };

  return (
    <ListingsProgressContext.Provider value={ListingscontextValue}>
      {children}
    </ListingsProgressContext.Provider>
  );
};

export default ListingsProgressContext;
