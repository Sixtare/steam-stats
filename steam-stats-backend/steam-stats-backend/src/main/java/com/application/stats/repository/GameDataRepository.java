package com.application.stats.repository;

import com.application.stats.entity.GameData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameDataRepository extends JpaRepository<GameData, Long> {
    @Query("SELECT DISTINCT g FROM GameData g LEFT JOIN FETCH g.tags WHERE g.appid IN :ids")
    List<GameData> findAllByIdWithTags(@Param("ids") List<Long> ids);
}
