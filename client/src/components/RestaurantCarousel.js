import React , {useEffect, useState} from 'react';
import Slider from 'react-slick';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import 'slick-carousel/slick/slick-theme.css';

export const RestaurantCarousel = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
      const fetchRestaurants = async () => {
        const response = await fetch('/get_favorite_restaurants'); 
        const data = await response.json();
        setRestaurants(data);
      };
  
      fetchRestaurants();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    
      return (
        <Slider {...settings}>
          {restaurants.map((restaurant, index) => (
            <Card key={index} style={{ margin: '10px' }}>
              <CardMedia
                component="img"
                height="140"
                image={restaurant.image_url}
                alt={restaurant.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Slider>
      );
    };


