package loldle.game;

import loldle.model.Champion;
import lombok.Getter;
import lombok.Setter;


import javax.swing.*;
import java.util.*;

@Getter
@Setter
public class GameState {

    private Champion currentChamp = null;

    private Map<String, String> selectedColors = new HashMap<>();

    private String yearDirection = null;

    private final Set<String> usedChampNames = new HashSet<>();

    private final Constraints constraints = new Constraints();


    public static final List<String> FIELDS = List.of(
            "gender", "position", "species", "resource", "rangeType", "region", "releaseYear");

    public static final List<String> FIELD_LABELS = List.of(
            "Gender", "Position", "Species", "Resource", "Range", "Region", "Year"
    );

    public void reset() {
        this.currentChamp = null;
        this.selectedColors.clear();
        this.yearDirection = null;
        FIELDS.forEach(field -> selectedColors.put(field, "none"));
    }
}