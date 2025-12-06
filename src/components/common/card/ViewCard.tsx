import React from "react";
import { Card, CardMedia, Typography, IconButton, Box } from "@mui/material";
import AttachmentIcon from "./../../../assets/Icons/AttachmentIcon.png";
import PencilIcon from "./../../../assets/Icons/PencilIcon.png";
import TakeAwayIcon from "./../../../assets/Icons/TakeAwayIcon.png";
import CommentIcon from "./../../../assets/Icons/CommentIcon.png";
import StarIcon from "./../../../assets/Icons/StarIcon.png";
import AvatarIcon from "./../../../assets/Icons/AvatarIcon.png";
import "./ViewCard.css";

interface ViewCards {
  id: string;
  image: string;
  title: string;
  author: string;
  time: string;
  starCount: number;
  commentCount: number;
}

interface ViewCardProps {
  cardData: any;
  onEditClick: (article: any) => void;
  onDeleteClick: (id: string) => void;
}

const ViewCard: React.FC<ViewCardProps> = ({
  cardData,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Card className='view-card'>
      <Box className='view-card-media-container'>
        <CardMedia
          component='img'
          image={cardData.image}
          alt={cardData.title}
          className='view-card-media'
        />
        <Box className='view-card-overlay'>
          <Typography variant='caption' className='view-card-topic'>
            #topic
          </Typography>
          <Box className='view-card-details'>
            <Typography variant='body2' className='view-card-title'>
              {cardData.title}
            </Typography>
            <Box className='view-card-icons'>
              <IconButton>
                <img src={AttachmentIcon} alt='Attachment Icon' />
              </IconButton>
              <IconButton onClick={() => onEditClick(cardData)}>
                <img src={PencilIcon} alt='Pencil Icon' />
              </IconButton>
              <IconButton
                onClick={() => cardData.id && onDeleteClick(cardData.id)}
              >
                <img src={TakeAwayIcon} alt='TakeAway Icon' />
              </IconButton>
            </Box>
          </Box>
          <Box className='view-card-avatar'>
            <Typography variant='caption' className='view-card-author'>
              {cardData.authorName}
            </Typography>
            <img src={AvatarIcon} alt='Avatar Icon' />
          </Box>
          <Box className='view-card-footer'>
            <Typography variant='caption' className='view-card-time'>
              {cardData.time}
            </Typography>
            <Box className='view-card-meta'>
              <Typography variant='caption'>{cardData.starCount}</Typography>
              <img src={StarIcon} alt='Star Icon' />
              <Typography variant='caption'>{cardData.commentCount}</Typography>
              <img src={CommentIcon} alt='Comment Icon' />
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ViewCard;
