package com.application.stats.service;

import com.application.stats.dtos.Games;
import com.application.stats.dtos.GamesWrap;
import com.application.stats.dtos.Player;
import com.application.stats.dtos.SteamResponse;
import com.application.stats.exception.NotFound;
import com.application.stats.exception.PrivateProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PlayerService {
    @Value("${steam.api.key}")
    private String apiKey;

    public PlayerService() {
    }

    public Map<String, String> getPlayerId(String profileUrl) {
        String regex = "\\b765611\\d{11}\\b";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(profileUrl);

        if (matcher.find()) {
            return Map.of("steamid", matcher.group());
        } else {
            String steamId = getSteamIdFromVanityUrl(profileUrl);
            return Map.of("steamid", steamId);
        }
    }

    private String getSteamIdFromVanityUrl(String profileUrl){
        String[] parts = profileUrl.split("/");

        if (parts.length == 0) throw new NotFound("Invalid profile URL: " + profileUrl);
        String lastSegment = parts.length > 1 ? parts[parts.length - 1] : parts[0];

        return getPlayerSteamId(lastSegment);
    }

    private String getPlayerSteamId(String username){
        RestClient restClient = RestClient.create();
        JsonNode response = Objects.requireNonNull(restClient.get()
            .uri("https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key={apiKey}&vanityurl={username}", apiKey, username)
            .retrieve()
            .body(JsonNode.class))
            .get("response");

        if (response.get("success").asInt() != 1) throw new NotFound("Invalid vanity URL: " + username);

        return response.get("steamid").asString();
    }

   public Player getPlayerInfo(Long id) {
        RestClient restClient = RestClient.create();

        SteamResponse steamResponse = restClient.get()
            .uri("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="+ apiKey +"&steamids=" + id)
            .retrieve()
            .body(SteamResponse.class);

        if (steamResponse == null || steamResponse.response() == null || steamResponse.response().data() == null || steamResponse.response().data().isEmpty())
            throw new NotFound("Stats not found.");

        ObjectMapper mapper = new ObjectMapper();
        Object rawObject = steamResponse.response().data().getFirst();
        Player player = mapper.convertValue(rawObject, Player.class);

        if (player.getVisibilityState() != 3)
            throw new PrivateProfile("Player profile is not public.");

        int playerLevel = restClient.get()
            .uri("https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key={key}&steamid={id}", apiKey, id)
            .retrieve()
            .body(JsonNode.class)
            .path("response")
            .get("player_level")
            .asInt();

        player.setPlayerLevel(playerLevel);
        return player;
    }

    public GamesWrap getPlayerGames(Long id) {
    RestClient restClient = RestClient.create();
    SteamResponse steamResponse = (restClient.get()
        .uri("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+ apiKey +"&steamid="+ id +"&format=json&include_appinfo=true&include_played_free_games=true")
        .retrieve()
        .body(SteamResponse.class));

        if (steamResponse == null || steamResponse.response() == null || steamResponse.response().data() == null)
            return null;

        ObjectMapper mapper = new ObjectMapper();
        Object rawObject = steamResponse.response().data();
        return new GamesWrap(null, null, mapper.convertValue(rawObject, Games[].class));
    }

    public Games[] getLastPlayedGames(Long id) {
        RestClient restClient = RestClient.create();
        SteamResponse steamResponse = (restClient.get()
            .uri("https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key="+ apiKey +"&steamid="+ id +"&format=json&include_appinfo=true")
            .retrieve()
            .body(SteamResponse.class));

        if (steamResponse == null || steamResponse.response() == null || steamResponse.response().data() == null)
            return null;

        ObjectMapper mapper = new ObjectMapper();
        Object rawObject = steamResponse.response().data();
        return mapper.convertValue(rawObject, Games[].class);
    }
}
