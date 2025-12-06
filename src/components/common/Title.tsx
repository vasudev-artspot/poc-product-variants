import React from "react";
import ChevronLeftIcon from "../../assets/Icons/ChevronLeftIcon.png";
import { Typography } from "@mui/material";
interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
        <img src={ChevronLeftIcon} alt="title" />
        <h2 className="text-base">
          <b>{title}</b>
        </h2>
    </div>
  );
};

export default Title;