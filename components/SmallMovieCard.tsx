import { TMDB_CONFIG } from "@/services/api";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

type Props = {
  id: number;
  title: string;
  poster_path?: string | null;
};

const SmallMovieCard = ({ id, title, poster_path }: Props) => {
  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-32 relative pl-2">
        <Image
          source={{
            uri: poster_path
              ? `${TMDB_CONFIG.IMAGE_BASE_URL}${poster_path}`
              : "https://via.placeholder.com/600x400/1a1a1a/ffffff.png",
          }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />

        <Text
          className="text-light-200 text-sm font-bold mt-2"
          numberOfLines={1}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default SmallMovieCard;
