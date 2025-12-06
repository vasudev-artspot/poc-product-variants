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
  shopData: any;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

const ShopViewCard: React.FC<ViewCardProps> = ({
  shopData,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Card className='view-card'>
      <Box className='view-card-media-container'>
        <CardMedia
          component='img'
          image={shopData.image}
          alt={shopData.title}
          className='view-card-media'
        />
        <Box className='view-card-overlay'>
          {/* <Typography variant='caption' className='view-card-topic'>
            #topic
          </Typography> */}
          <Typography variant='caption' className='view-card-topic'>
            {shopData.name || shopData.title || "Shop Name"}
          </Typography>
          <Box className='view-card-details'>
            <Typography variant='body2' className='view-card-title'>
              {shopData.title}
            </Typography>
            <Box className='view-card-icons'>
              <IconButton>
                <img src={AttachmentIcon} alt='Attachment Icon' />
              </IconButton>
              <IconButton onClick={() => onEditClick(shopData.id)}>
                <img src={PencilIcon} alt='Pencil Icon' />
              </IconButton>
              <IconButton
                onClick={() => shopData.id && onDeleteClick(shopData.id)}
              >
                <img src={TakeAwayIcon} alt='TakeAway Icon' />
              </IconButton>
            </Box>
          </Box>
          <Box className='view-card-avatar'>
            <Typography variant='caption' className='view-card-author'>
              {shopData.authorName}
            </Typography>
            <img src={AvatarIcon} alt='Avatar Icon' />
          </Box>
          <Box className='view-card-footer'>
            <Typography variant='caption' className='view-card-time'>
              {shopData.time}
            </Typography>
            <Box className='view-card-meta'>
              <Typography variant='caption'>{shopData.starCount}</Typography>
              <img src={StarIcon} alt='Star Icon' />
              <Typography variant='caption'>{shopData.commentCount}</Typography>
              <img src={CommentIcon} alt='Comment Icon' />
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ShopViewCard;
