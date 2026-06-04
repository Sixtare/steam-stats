package com.application.stats.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Games(Long appid, String name, Integer playtime_forever, Integer playtime_2weeks) {
}
