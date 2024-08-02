import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  images: string[];
}

const ProductDetail: React.FC<{route: any}> = ({route}) => {
  const {productId} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/${productId}`,
        );
        setProduct(response.data);
        setSelectedImage(response.data.images[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="column" alignItems="center">
          <SkeletonPlaceholder.Item
            width={Dimensions.get('window').width - 32}
            height={300}
            borderRadius={8}
            marginBottom={16}
          />
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item
              width={80}
              height={80}
              borderRadius={8}
              marginRight={8}
            />
            <SkeletonPlaceholder.Item
              width={80}
              height={80}
              borderRadius={8}
              marginRight={8}
            />
            <SkeletonPlaceholder.Item
              width={80}
              height={80}
              borderRadius={8}
              marginRight={8}
            />
            <SkeletonPlaceholder.Item
              width={80}
              height={80}
              borderRadius={8}
              marginRight={8}
            />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={200}
            height={24}
            borderRadius={4}
            marginTop={16}
          />
          <SkeletonPlaceholder.Item
            width={150}
            height={20}
            borderRadius={4}
            marginTop={8}
          />
          <SkeletonPlaceholder.Item
            width={100}
            height={22}
            borderRadius={4}
            marginTop={8}
          />
          <SkeletonPlaceholder.Item
            width={Dimensions.get('window').width - 32}
            height={100}
            borderRadius={4}
            marginTop={16}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <FastImage source={{uri: selectedImage}} style={styles.image} />
      </View>
      <FlatList
        data={product?.images}
        horizontal
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => setSelectedImage(item)}>
            <FastImage
              source={{uri: item}}
              style={[
                styles.thumbnail,
                item === selectedImage && styles.selectedThumbnail,
              ]}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.thumbnailContainer}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product?.title}</Text>
        <Text style={styles.brand}>{product?.brand}</Text>
        <Text style={styles.price}>${product?.price}</Text>
        <Text style={styles.description}>{product?.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  thumbnailContainer: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#000',
  },
  infoContainer: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginVertical: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
});

export default ProductDetail;
