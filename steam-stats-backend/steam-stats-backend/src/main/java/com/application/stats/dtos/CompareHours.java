package com.application.stats.dtos;

import java.util.Objects;

public record CompareHours(Long appid, String name, Integer player1_hours, Integer player2_hours) {
    @Override
    public boolean equals(Object object) {
        if (object == null || getClass() != object.getClass()) return false;
        CompareHours that = (CompareHours) object;
        return Objects.equals(appid, that.appid);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(appid);
    }
}
