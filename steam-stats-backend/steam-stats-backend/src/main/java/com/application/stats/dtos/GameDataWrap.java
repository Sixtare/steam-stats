package com.application.stats.dtos;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.util.List;
import java.util.Map;

@JsonPropertyOrder({"total_price", "aggregated_tags","gameData"})
public record GameDataWrap(Map<String, Integer> aggregated_tags, Float total_price, List<GameDataRecord> gameData) {
        public GameDataWrap {
            if (gameData.isEmpty()){
                total_price = 0f;
            } else {
                total_price = gameData.stream()
                    .map(g -> g.price() == null ? 0f : g.price()).reduce(0f, Float::sum);
            }
        }
}
