package com.application.stats.service;

import com.application.stats.dtos.GameDataRecord;
import com.application.stats.dtos.GameDataWrap;
import com.application.stats.entity.GameData;
import com.application.stats.repository.GameDataRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameDataService {
    private final GameDataRepository gameDataRepository;

    public GameDataService(GameDataRepository gameDataRepository) {
        this.gameDataRepository = gameDataRepository;
    }

    public GameDataWrap getOwnedGamesData(String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(Long::parseLong)
            .toList();

        return getOwnedGamesData(idList);
    }

    @Transactional(readOnly = true)
    public GameDataWrap getOwnedGamesData(List<Long> ids){
        List<GameData> gameDataList = gameDataRepository.findAllByIdWithTags(ids);

        Set<Long> existingIds = gameDataList.stream()
            .map(GameData::getAppid)
            .collect(Collectors.toSet());

        Set<Long> missingIds = new HashSet<>(ids);
        missingIds.removeAll(existingIds);

        if (!missingIds.isEmpty()){
            List<GameData> missingGameData = getMissingGameData(missingIds.stream().toList());
            gameDataList.addAll(missingGameData);
        }

        Map<String, Integer> aggregatedTags = aggregateTags(gameDataList);
        removeCommonTags(aggregatedTags);

        List<GameDataRecord> gameDataRecords = gameDataList.stream()
            .map(GameDataRecord::new)
            .toList();

        return new GameDataWrap(aggregatedTags, null, gameDataRecords);
    }

    public List<GameData> getMissingGameData(List<Long> missingIds) {
        RestClient restClient = RestClient.create();
        List<GameData> missingDataList = new ArrayList<>();
        for (Long id : missingIds) {
            GameData newGame = restClient.get()
                .uri("https://steamspy.com/api.php?request=appdetails&appid={id}", id)
                .retrieve()
                .body(GameData.class);

            if (newGame == null || newGame.getName() == null || newGame.getName().isEmpty()) continue;

            JsonNode storeResponse = restClient.get()
                .uri("https://store.steampowered.com/api/appdetails?appids={id}&filters=basic,price_overview&cc=us&l=english", id)
                .retrieve()
                .body(JsonNode.class);

            if (storeResponse != null && storeResponse.has(id.toString())) {
                JsonNode gameData = storeResponse.get(id.toString());

                if (gameData.has("success") && gameData.get("success").asBoolean()) {
                    JsonNode dataNode = gameData.get("data");

                    if (dataNode != null) {
                        if (dataNode.has("header_image")) {
                            newGame.setHeaderImage(dataNode.get("header_image").asString());
                        }

                        if (dataNode.has("price_overview")) {
                            JsonNode priceOverview = dataNode.get("price_overview");
                            if (priceOverview.has("initial")) {
                                newGame.setPrice(priceOverview.get("initial").asFloat() / 100);
                            }
                        }
                    }
                }
            }
            missingDataList.add(newGame);
        }
        gameDataRepository.saveAll(missingDataList);
        return missingDataList;
    }

    public void removeCommonTags(Map<String, Integer> tags) {
        Set<String> common = Set.of(
            "Singleplayer", "Multiplayer", "Co-op", "Online Co-Op", "Local Co-Op",
            "Free to Play", "Soundtrack", "Great Soundtrack", "Atmospheric"
        );

        tags.keySet().removeAll(common);
    }

    public Map<String, Integer> aggregateTags(List<GameData> games) {
        Map<String, Integer> map = new HashMap<>();
        if (games == null) return map;
        for (GameData g : games) {
            List<String> tags = g.getTags();
            if (tags == null) continue;
            for (String t : tags) {
                map.merge(t, 1, Integer::sum);
            }
        }
        return map;
    }

    public void populateDatabase() {
        try (InputStream inputStream = new ClassPathResource("games.json").getInputStream()) {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, GameData> gamesMap = objectMapper.readValue(
                inputStream,
                new TypeReference<Map<String, GameData>>() {}
            );

            List<GameData> entities = gamesMap.entrySet().stream()
                .map(entry -> {
                    GameData entity = entry.getValue();
                    entity.setAppid(Long.parseLong(entry.getKey()));
                    return entity;
                })
                .toList();

            gameDataRepository.saveAll(entities);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao importar games.json", e);
        }
    }
}
