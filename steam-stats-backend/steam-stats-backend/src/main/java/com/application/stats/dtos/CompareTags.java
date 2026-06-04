package com.application.stats.dtos;

import java.math.BigDecimal;

public record CompareTags(String tag, BigDecimal player1_percentage, BigDecimal player2_percentage) {
}
