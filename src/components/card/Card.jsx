import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Button, CardActionArea, CardActions} from "@mui/material";
import {Link} from "react-router-dom";

export default function PreviewCard({heading, subHeading, value, linkTo}) {
  return (
    <Card sx={{maxWidth: 345, marginBottom: "20px"}} elevation={3}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {heading}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{marginBottom: "20px"}}
          >
            {subHeading}
          </Typography>
          <Typography variant="h5" color="text.primary">
            {value}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          <Link to={linkTo}>read more</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
