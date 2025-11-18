import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import SmallMovieCard from "@/components/SmallMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(() =>
    fetchPopularMovies({
      query: searchQuery,
    })
  );

  const { data: topRated, error: topRatedError } = useFetch(() =>
    fetchTopRatedMovies({ page: 1 })
  );

  const { data: upcoming, error: upcomingError } = useFetch(() =>
    fetchUpcomingMovies({ page: 1 })
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.length > 0 && movies?.[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginVertical: 15,
        }}
        contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                onPress={() => {}}
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {/* Show Top Rated & Upcoming when user hasn't searched yet */}
            {!searchQuery.trim() && (
              <>
                {topRated && (
                  <View className="mt-6">
                    <Text className="text-lg text-white font-bold mb-3">
                      Top Rated
                    </Text>

                    <FlatList
                      data={topRated}
                      renderItem={({ item }) => (
                        <SmallMovieCard
                          id={item.id}
                          title={item.title}
                          poster_path={item.poster_path}
                        />
                      )}
                      keyExtractor={(item) => item.id.toString()}
                      horizontal
                      ItemSeparatorComponent={() => <View className="w-4" />}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 8 }}
                    />
                  </View>
                )}

                {upcoming && (
                  <View className="mt-6">
                    <Text className="text-lg text-white font-bold mb-3">
                      Upcoming
                    </Text>

                    <FlatList
                      data={upcoming}
                      renderItem={({ item }) => (
                        <SmallMovieCard
                          id={item.id}
                          title={item.title}
                          poster_path={item.poster_path}
                        />
                      )}
                      keyExtractor={(item) => item.id.toString()}
                      horizontal
                      ItemSeparatorComponent={() => <View className="w-4" />}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 8 }}
                    />
                  </View>
                )}
              </>
            )}

            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#AB8BFF"
                className="my-3"
              />
            )}

            {moviesError && (
              <Text className="text-red-500 text-center">
                Error: {moviesError.message}
              </Text>
            )}

            {!moviesLoading &&
              !moviesError &&
              searchQuery.trim() &&
              movies?.length > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
      />
    </View>
  );
};

export default Search;
