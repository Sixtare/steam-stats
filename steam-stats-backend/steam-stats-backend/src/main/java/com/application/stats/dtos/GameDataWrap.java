package com.application.stats.dtos;

import com.application.stats.entity.GameData;

import java.util.List;

public record GameDataWrap(Float total_price, List<GameData> gameData) {
        public GameDataWrap {
            if (gameData.isEmpty()){
                total_price = 0f;
            } else {
                total_price = gameData.stream()
                    .map(g -> g.getPrice() == null ? 0f : g.getPrice()).reduce(0f, Float::sum);
            }
        }
}
