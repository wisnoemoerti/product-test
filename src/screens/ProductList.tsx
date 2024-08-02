import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [limit] = useState<number>(10); // Define the limit of items per page
  const navigation = useNavigation();

  const fetchProducts = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
      );
      setProducts(prevProducts => [...prevProducts, ...response.data.products]);
    } catch (error) {
      console.error(error);
    }
    setIsFetching(false);
    setLoading(false);
  }, [skip, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderItem = useCallback(
    ({item}: {item: Product}) => (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate('ProductDetail', {productId: item.id})
        }>
        <FastImage source={{uri: item.thumbnail}} style={styles.thumbnail} />
        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderFooter = useCallback(() => {
    if (!isFetching) return null;
    return <ActivityIndicator style={{color: '#000'}} />;
  }, [isFetching]);

  const renderSkeleton = () => (
    <SkeletonPlaceholder>
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonItem}>
          <View style={styles.skeletonThumbnail} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
        </View>
        <View style={styles.skeletonItem}>
          <View style={styles.skeletonThumbnail} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );

  const handleLoadMore = useCallback(() => {
    if (!isFetching) {
      setSkip(prevSkip => prevSkip + limit);
    }
  }, [isFetching, limit]);

  return (
    <View style={styles.container}>
      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  brand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  skeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  skeletonItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  skeletonThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e1e9ee',
  },
  skeletonText: {
    width: 60,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#e1e9ee',
    marginTop: 8,
  },
});

export default ProductList;
