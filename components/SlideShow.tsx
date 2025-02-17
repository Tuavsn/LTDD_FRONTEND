// components/Slideshow.js
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import Slide1 from '../assets/images/Slide-Show-1.jpg';
import Slide2 from '../assets/images/Slide-Show-2.jpg';
import Slide3 from '../assets/images/Slide-Show-3.webp';

const { width } = Dimensions.get('window');

const Slideshow = () => {
  // Sử dụng hình ảnh local đã import
  const images = [Slide1, Slide2, Slide3];
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sử dụng functional update để tránh phụ thuộc currentIndex trong dependency array
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % images.length;
        scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onScroll = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((imageSource, index) => (
          <Image key={index} source={imageSource} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { opacity: currentIndex === index ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Slideshow;

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 3,
  },
});
