package com.application.stats.service;

import com.application.stats.dtos.CompareHours;
import com.application.stats.dtos.CompareTags;
import com.application.stats.dtos.Games;
import com.application.stats.dtos.ComparisonStats;
import com.application.stats.entity.GameData;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CompareService {
    private final PlayerService playerService;
    private final GameDataService gameDataService;

    public CompareService(PlayerService playerService, GameDataService gameDataService) {
        this.playerService = playerService;
        this.gameDataService = gameDataService;
    }


    private Integer getTotalPlaytime(List<Games> games) {
        return games.stream().mapToInt(Games::playtime_forever).sum()/60;
    }


    private Float getTotalPrice(List<Games> games) {
        double priceDouble = gameDataService.getOwnedGamesData(games.stream().map(Games::appid).toList())
            .stream()
            .map(GameData::getPrice)
            .filter(Objects::nonNull)
            .mapToDouble(Float::doubleValue)
            .sum();

        return (float) priceDouble;
    }

    public ComparisonStats comparePlayers(Long id1, Long id2) {
        List<Games> games1 = List.of(playerService.getPlayerGames(id1).games());
        List<Games> games2 = List.of(playerService.getPlayerGames(id2).games());

        Set<Long> ids1 = games1.stream().map(Games::appid).collect(Collectors.toSet());
        Set<Long> ids2 = games2.stream().map(Games::appid).collect(Collectors.toSet());

        List<GameData> gd1 = gameDataService.getOwnedGamesData(new ArrayList<>(ids1));
        List<GameData> gd2 = gameDataService.getOwnedGamesData(new ArrayList<>(ids2));

        //cosine e top tags
        Map<String, Integer> t1 = aggregateTags(gd1);
        Map<String, Integer> t2 = aggregateTags(gd2);
        gameDataService.removeCommonTags(t1, t2);

        //intersection
        Set<Long> intersection = new HashSet<>(ids1);
        intersection.retainAll(ids2);

        int commonGames = intersection.size();
        double cosine = calculateCosineSimilarity(gd1, gd2);

        List <CompareTags> topTagsOverlap = getTopTags(games1.size(), games2.size(), t1, t2);

        //player2 info
        //todo remove player2totalhours and totalprice later since theyll be added in the body from gameswrap and gamedatawrap
        Integer player2TotalHours = getTotalPlaytime(games2);
        Float totalPrice = getTotalPrice(games2);

        List<CompareHours> compareHours = getTopCommonGames(games1, games2, ids2);

        return new ComparisonStats(commonGames,
            cosine,
            totalPrice,
            player2TotalHours,
            compareHours,
            topTagsOverlap);
    }

    private List<CompareHours> getTopCommonGames(List<Games> games1, List<Games> games2, Set<Long> ids2) {
        List<Games> topCommonGames = games1.stream()
            .filter(g -> ids2.contains(g.appid()))
            .sorted(Comparator.comparingLong(Games::playtime_forever).reversed())
            .limit(5)
            .toList();

        List<CompareHours> compareHours = new ArrayList<>();
        topCommonGames.forEach(game ->{
                Long currentAppId = game.appid();
                String name = game.name();
                int player1Hours = games1.stream().filter(g -> g.appid().equals(currentAppId)).findFirst().map(Games::playtime_forever).orElse(0);
                player1Hours = player1Hours / 60;
                int player2Hours = games2.stream().filter(g -> g.appid().equals(currentAppId)).findFirst().map(Games::playtime_forever).orElse(0);
                player2Hours = player2Hours / 60;
                compareHours.add(new CompareHours(currentAppId, name, player1Hours, player2Hours));
            }
        );

        return compareHours;
    }

    private double calculateCosineSimilarity(List<GameData> p1, List<GameData> p2) {
        Map<String, Integer> t1 = aggregateTags(p1);
        Map<String, Integer> t2 = aggregateTags(p2);
        gameDataService.removeCommonTags(t1, t2);

        if (t1.isEmpty() || t2.isEmpty()) return 0.0;

        Set<String> all = new HashSet<>();
        all.addAll(t1.keySet());
        all.addAll(t2.keySet());

        double dot = 0.0, mag1 = 0.0, mag2 = 0.0;
        for (String tag : all) {
            int w1 = t1.getOrDefault(tag, 0);
            int w2 = t2.getOrDefault(tag, 0);
            dot += (double) w1 * w2;
            mag1 += Math.pow(w1, 2);
            mag2 += Math.pow(w2, 2);
        }
        if (mag1 == 0.0 || mag2 == 0.0) return 0.0;
        return (dot / (Math.sqrt(mag1) * Math.sqrt(mag2))) * 100.0;
    }

    private List<CompareTags> getTopTags(int gamesOwnedp1, int gamesOwnedp2, Map<String, Integer> t1, Map<String, Integer> t2) {
        Set<String> tagIntersection = new HashSet<>(t1.keySet());
        tagIntersection.retainAll(t2.keySet());

        List<String> topCommonTags = tagIntersection.stream()
            .sorted((a, b) -> Integer.compare(
                t1.getOrDefault(b, 0) + t2.getOrDefault(b, 0),
                t1.getOrDefault(a, 0) + t2.getOrDefault(a, 0)
            ))
            .limit(10)
            .toList();

        List<CompareTags> playerPercentPerTag = new ArrayList<>();

        for (String tag : topCommonTags) {
            float tagCount = t1.getOrDefault(tag, 0) + t2.getOrDefault(tag, 0);

            float player1Count = t1.getOrDefault(tag, 0);
            float player2Count = t2.getOrDefault(tag, 0);

            float player1Percent = tagCount == 0 ? 0 : (player1Count * 100f / gamesOwnedp1);
            float player2Percent = tagCount == 0 ? 0 : (player2Count * 100f / gamesOwnedp2);

            playerPercentPerTag.add(new CompareTags(tag, round2(player1Percent), round2(player2Percent)));
        }
        return playerPercentPerTag;
    }

    private BigDecimal round2(float value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

    private Map<String, Integer> aggregateTags(List<GameData> games) {
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
}

