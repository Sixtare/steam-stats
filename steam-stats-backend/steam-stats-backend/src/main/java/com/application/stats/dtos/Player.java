package com.application.stats.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"steamid", "personaname", "player_level", "avatarfull", "timecreated"})
public class Player {
    @JsonProperty("steamid")
    private Long playerId;

    @JsonProperty("personaname")
    private String playerName;

    @JsonProperty("communityvisibilitystate")
    private Integer visibilityState;

    @JsonProperty("avatarfull")
    private String avatarUrl;

    @JsonProperty("timecreated")
    private Integer timeCreated;

    @JsonProperty("player_level")
    private Integer playerLevel;

    public Player(){
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Integer getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(Integer timeCreated) {
        this.timeCreated = timeCreated;
    }

    public Integer getPlayerLevel() {
        return playerLevel;
    }

    public void setPlayerLevel(Integer playerLevel) {
        this.playerLevel = playerLevel;
    }

    public Integer getVisibilityState() {
        return visibilityState;
    }

    public void setVisibilityState(Integer visibilityState) {
        this.visibilityState = visibilityState;
    }
}
