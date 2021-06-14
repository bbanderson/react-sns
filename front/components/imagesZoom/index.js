import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import Slick from 'react-slick';
import { CloseOutlined } from '@ant-design/icons';
import {
  CloseBtn,
  Global,
  Header,
  ImgWrapper,
  Indicator,
  Overlay,
  SlickWrapper,
} from './styles';

const ImagesZoom = ({ images, onClose }) => {
  console.log(images);
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            beforeChange={(slide, newSlide) => setCurrentSlide(newSlide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img src={`http://localhost:3065/${v.src}`} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({ src: PropTypes.string }))
    .isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
