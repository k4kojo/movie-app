import { icons } from "@/constants/icons";
import { fetchMovieDetails, TMDB_CONFIG } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

interface MovieInfoProps {
  label: string;
  value: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  return (
    <View className="bg-primary flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Image
              source={{
                uri: `${TMDB_CONFIG.IMAGE_BASE_URL}${movie?.poster_path}`,
              }}
              className="w-full h-[550px]"
              resizeMode="stretch"
            />
          </View>

          <View className="flex-col items-start justify-center mt-5 px-5">
            <Text className="text-white font-bold text-xl">{movie?.title}</Text>
            <View className="flex-row items-center gap-x-1 mt-2">
              <Text className="text-light-200 text-sm">
                {movie?.release_date?.split("-")[0]} •
              </Text>
              <Text className="text-light-200 text-sm">
                {movie?.runtime} mins
              </Text>
            </View>
            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-2 mt-2">
              <Image source={icons.star} className="size-4" />
              <Text className="text-white font-bold text-sm">
                {Math.round(movie?.vote_average ?? 0)}/10
              </Text>
              <Text className="text-light-200 text-sm">
                ({movie?.vote_count} votes)
              </Text>
            </View>

            <MovieInfo label="Overview" value={movie?.overview || "N/A"} />

            <View className="fle flex-row justify-between w-1/2">
              <MovieInfo
                label="Genres"
                value={
                  movie?.genres?.map((genre) => genre.name).join(", ") || "N/A"
                }
              />
              <MovieInfo
                label="Rating"
                value={movie?.adult ? "18+" : "All Ages"}
              />
            </View>

            <View className="flex flex-row justify-between w-1/2">
              <MovieInfo
                label="Budget"
                value={`$${Math.round(movie?.budget ?? 0) / 1_000_000}M`}
              />
              <MovieInfo
                label="Revenue"
                value={`$${Math.round(movie?.revenue ?? 0) / 1_000_000}M`}
              />
            </View>

            <MovieInfo
              label="Production Companies"
              value={
                movie?.production_companies.map((pc) => pc.name).join(" - ") ||
                "N/A"
              }
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default MovieDetails;
