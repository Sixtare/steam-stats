package com.application.stats.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "game_data")
@JsonIgnoreProperties(ignoreUnknown = true)
public class GameData {
    @Id
    private Long appid;

    @Column(columnDefinition = "TEXT")
    private String name;

    private Float price;

    @JsonProperty("header_image")
    private String headerImage;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "game_data_tags",
        joinColumns = @JoinColumn(name = "appid")
    )
    @Column(name = "game_data_tag_name")
    private List<String> tags = new ArrayList<>();

    public GameData() {
    }

    public Long getAppid() {
        return appid;
    }

    public void setAppid(Long appid) {
        this.appid = appid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getHeaderImage() {
        return headerImage;
    }

    public void setHeaderImage(String headerImage) {
        this.headerImage = headerImage;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    @JsonSetter("tags")
    public void setTagsFromJson(Object tagsObj) {
        this.tags = new ArrayList<>();
        if (tagsObj instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = (Map<String, Object>) tagsObj;
            this.tags.addAll(map.keySet());
        }
    }
}
