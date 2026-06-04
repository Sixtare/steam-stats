package com.application.stats.dtos;

import java.util.List;

public record ComparisonStats(Integer common_games, Double cosine_similarity,
                              Float player2_total_price,
                              Integer player2_total_hours,
                              List<CompareHours> compare_hours,
                              List<CompareTags> compare_tags) {

}
