package loldle.game;

import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class Constraints {

    private final Map<String, String> green = new HashMap<>();
    private final Map<String, List<String>> yellow = new HashMap<>();
    private final Map<String, List<String>> red = new HashMap<>();
    private Integer yearMin = null;
    private Integer yearMax = null;
}