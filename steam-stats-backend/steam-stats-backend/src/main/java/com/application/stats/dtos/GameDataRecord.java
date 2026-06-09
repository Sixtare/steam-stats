package com.application.stats.dtos;

import com.application.stats.entity.GameData;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

public record GameDataRecord(Long appid, String name, Float price, @JsonProperty("header_image") String headerImage) {

    public GameDataRecord(GameData game) {
        this(game.getAppid(), game.getName(), game.getPrice(), game.getHeaderImage());
    }
}
